'use client';

import React, { use, useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ScoreRing from '@/components/shared/ScoreRing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getScenarioById } from '@/lib/data';
import { useAuthStore, useScenarioStore, useStudentProgressStore } from '@/lib/store';
import { getDisasterIcon, formatDuration } from '@/lib/utils';
import { calculateSimulationScore } from '@/lib/engines/scoring-engine';
import { SimulationDecision, SimulationScore, ScenarioStep, ScenarioChoice, SimulationAttempt, MistakeRecord } from '@/lib/types';
import { ArrowRight, Clock, CheckCircle2, XCircle, AlertTriangle, RotateCcw, Home, Timer } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface SimulationState {
  phase: 'intro' | 'playing' | 'feedback' | 'results';
  currentStepIndex: number;
  decisions: SimulationDecision[];
  stepStartTime: number;
  selectedChoice: ScenarioChoice | null;
  score: SimulationScore | null;
  timeRemaining: number | null;
}

function SimulationEngine({ scenarioId }: { scenarioId: string }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { scenarios } = useScenarioStore();
  const { recordSimulationAttempt } = useStudentProgressStore();
  const scenario = scenarios.find(s => s.id === scenarioId) || getScenarioById(scenarioId);

  const [state, setState] = React.useState<SimulationState>({
    phase: 'intro',
    currentStepIndex: 0,
    decisions: [],
    stepStartTime: Date.now(),
    selectedChoice: null,
    score: null,
    timeRemaining: null,
  });

  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Timer for current step
  React.useEffect(() => {
    if (state.phase === 'playing' && scenario) {
      const step = scenario.steps[state.currentStepIndex];
      if (step?.timeLimit) {
        setState(prev => ({ ...prev, timeRemaining: step.timeLimit! }));
        timerRef.current = setInterval(() => {
          setState(prev => {
            if (prev.timeRemaining !== null && prev.timeRemaining > 0) {
              return { ...prev, timeRemaining: prev.timeRemaining - 1 };
            }
            return prev;
          });
        }, 1000);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.phase, state.currentStepIndex, scenario]);

  if (!scenario) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle size={48} className="text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Scenario Not Found</h2>
        <Link href="/student/simulations"><Button variant="outline">Back to Simulations</Button></Link>
      </div>
    );
  }

  const currentStep = scenario.steps[state.currentStepIndex];
  const progress = ((state.currentStepIndex + 1) / scenario.steps.length) * 100;

  const handleStart = () => {
    setState({
      phase: 'playing',
      currentStepIndex: 0,
      decisions: [],
      stepStartTime: Date.now(),
      selectedChoice: null,
      score: null,
      timeRemaining: null,
    });
  };

  const handleChoice = (choice: ScenarioChoice) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const responseTimeMs = Date.now() - state.stepStartTime;

    const decision: SimulationDecision = {
      stepId: currentStep.id,
      choiceId: choice.id,
      responseTimeMs,
      isCorrect: choice.isCorrect,
      isSafe: choice.isSafe,
      timestamp: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      phase: 'feedback',
      selectedChoice: choice,
      decisions: [...prev.decisions, decision],
    }));
  };

  const finishSimulation = async () => {
    const score = calculateSimulationScore(state.decisions);
    setState(prev => ({ ...prev, phase: 'results', score }));

    if (user) {
      // Extract any mistakes made
      const mistakes: MistakeRecord[] = [];
      state.decisions.forEach(d => {
        if (!d.isSafe || !d.isCorrect) {
          const step = scenario.steps.find(s => s.id === d.stepId);
          const chosenChoice = step?.choices.find(c => c.id === d.choiceId);
          mistakes.push({
            id: `sim-mistake-${Date.now()}-${d.stepId}`,
            type: 'simulation',
            title: scenario.title,
            questionOrStep: step?.situation || 'Simulation Decision Checkpoint',
            mistakeText: chosenChoice?.text || 'Unsafe decision selected',
            explanation: chosenChoice?.consequence || 'Decision compromised safety during evacuation.',
            hazardType: `${scenario.disasterType}_response`,
            timestamp: new Date().toISOString(),
          });
        }
      });

      const attempt: SimulationAttempt = {
        id: `attempt-${scenario.id}-${Date.now()}`,
        scenarioId: scenario.id,
        userId: user.id,
        startedAt: new Date(state.stepStartTime).toISOString(),
        completedAt: new Date().toISOString(),
        decisions: state.decisions,
        score,
        status: 'completed',
      };

      await recordSimulationAttempt(attempt, mistakes);
    }
  };

  const handleNext = () => {
    const choice = state.selectedChoice;
    if (!choice) return;

    // Find next step
    const nextStepId = choice.nextStepId;
    if (!nextStepId) {
      finishSimulation();
      return;
    }

    const nextIndex = scenario.steps.findIndex(s => s.id === nextStepId);
    if (nextIndex === -1 || nextIndex >= scenario.steps.length) {
      finishSimulation();
      return;
    }

    setState(prev => ({
      ...prev,
      phase: 'playing',
      currentStepIndex: nextIndex,
      selectedChoice: null,
      stepStartTime: Date.now(),
      timeRemaining: null,
    }));
  };

  const handleRestart = () => {
    setState({
      phase: 'intro',
      currentStepIndex: 0,
      decisions: [],
      stepStartTime: Date.now(),
      selectedChoice: null,
      score: null,
      timeRemaining: null,
    });
  };

  // ── EXTERNAL ENGINE ──
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'SIMULATION_COMPLETE' && scenario && user) {
        const scoreVal = event.data.score || 100;
        const attempt: SimulationAttempt = {
          id: `attempt-${scenario.id}-${Date.now()}`,
          scenarioId: scenario.id,
          userId: user.id,
          startedAt: new Date(state.stepStartTime).toISOString(),
          completedAt: new Date().toISOString(),
          decisions: [],
          score: {
            overall: scoreVal,
            decisionAccuracy: scoreVal,
            responseTime: 100,
            safetyCompliance: scoreVal,
            evacuationDecisions: scoreVal,
            breakdown: []
          },
          status: 'completed',
        };
        await recordSimulationAttempt(attempt, []);
        router.push('/student/simulations');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user, scenario, state.stepStartTime, recordSimulationAttempt, router]);

  if (scenario.engineType === 'external' && scenario.url) {
    return (
      <div className="flex flex-col h-[85vh] w-full border border-border rounded-xl overflow-hidden shadow-sm bg-card relative">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getDisasterIcon(scenario.disasterType)}</span>
            <h2 className="font-semibold text-sm">{scenario.title}</h2>
          </div>
          <Link href="/student/simulations">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Home size={13} /> Exit Game
            </Button>
          </Link>
        </div>
        <iframe 
          src={scenario.url} 
          className="w-full flex-1 border-none bg-background" 
          title={scenario.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // ── INTRO SCREEN ──
  if (state.phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/student/simulations" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          ← Back to Simulations
        </Link>

        <Card className="overflow-hidden">
          <div className="h-2" style={{ backgroundColor: getDisasterIcon(scenario.disasterType) === '🔥' ? '#EF4444' : scenario.disasterType === 'earthquake' ? '#8B5E3C' : '#3B82F6' }} />
          <CardContent className="p-8 text-center">
            <span className="text-5xl mb-4 block">{getDisasterIcon(scenario.disasterType)}</span>
            <h1 className="text-2xl font-bold mb-2">{scenario.title}</h1>
            <p className="text-muted-foreground mb-6">{scenario.description}</p>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1.5"><Clock size={14} /> ~{scenario.estimatedMinutes} minutes</span>
              <span className="flex items-center gap-1.5"><AlertTriangle size={14} /> {scenario.steps.length} decisions</span>
              <Badge className="capitalize">{scenario.difficulty}</Badge>
            </div>

            <div className="bg-accent/50 rounded-lg p-4 text-sm text-left mb-6">
              <p className="font-medium mb-2">📍 Location: {scenario.location}</p>
              <p className="text-muted-foreground">
                You will face a series of decision points during a simulated disaster. Each choice has consequences. 
                Your response time, decision accuracy, and safety compliance will be scored.
              </p>
            </div>

            <Button size="lg" onClick={handleStart} className="gap-2 px-8">
              Begin Simulation <ArrowRight size={18} />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── PLAYING SCREEN ──
  if (state.phase === 'playing' && currentStep) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Progress */}
        <div className="flex items-center gap-3">
          <Progress value={progress} className="flex-1 h-2" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {state.currentStepIndex + 1} / {scenario.steps.length}
          </span>
        </div>

        {/* Timer */}
        {state.timeRemaining !== null && (
          <div className={`flex items-center justify-center gap-2 text-sm font-mono ${state.timeRemaining <= 5 ? 'text-red-500' : 'text-muted-foreground'}`}>
            <Timer size={14} />
            <span>{state.timeRemaining}s</span>
          </div>
        )}

        {/* Situation */}
        <Card>
          <CardContent className="p-6">
            {currentStep.metadata && (
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-[10px]">{currentStep.metadata.phase?.replace(/_/g, ' ')}</Badge>
                {currentStep.location && (
                  <span className="text-xs text-muted-foreground">📍 {currentStep.location}</span>
                )}
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm leading-relaxed font-medium text-amber-900">
                {currentStep.situation}
              </p>
            </div>

            <h3 className="font-semibold text-sm mb-3">What do you do?</h3>

            <div className="space-y-2">
              {currentStep.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  className="w-full text-left p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-sm"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── FEEDBACK SCREEN ──
  if (state.phase === 'feedback' && state.selectedChoice) {
    const choice = state.selectedChoice;
    const lastDecision = state.decisions[state.decisions.length - 1];

    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Progress value={progress} className="h-2" />

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {choice.isCorrect ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 size={20} className="text-emerald-600" />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <XCircle size={20} className="text-red-600" />
                </div>
              )}
              <div>
                <h3 className="font-semibold">
                  {choice.isCorrect ? 'Correct Decision!' : 'Not the Best Choice'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Response time: {formatDuration(lastDecision.responseTimeMs)}
                </p>
              </div>
            </div>

            <div className={`rounded-lg p-4 text-sm mb-4 ${choice.isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="font-medium mb-1">Your choice: {choice.text}</p>
            </div>

            <div className="bg-accent/50 rounded-lg p-4 text-sm">
              <p className="font-medium mb-1">💡 Feedback</p>
              <p className="text-muted-foreground">{choice.consequence}</p>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <div className="flex-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span>Safety Score: </span>
                <Badge variant={choice.safetyScore >= 80 ? 'default' : 'destructive'} className="text-xs">
                  {choice.safetyScore}/100
                </Badge>
              </div>
              <Button onClick={handleNext} className="gap-2">
                {choice.nextStepId ? 'Continue' : 'See Results'} <ArrowRight size={14} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── RESULTS SCREEN ──
  if (state.phase === 'results' && state.score) {
    const score = state.score;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-1">Simulation Complete!</h2>
            <p className="text-sm text-muted-foreground mb-6">{scenario.title}</p>

            <ScoreRing score={score.overall} size={160} />

            <div className="grid grid-cols-2 gap-4 mt-8">
              {score.breakdown.map(item => (
                <div key={item.label} className="text-left p-4 rounded-lg bg-accent/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">{item.label}</span>
                    <span className="text-sm font-bold">{item.score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${item.score >= 80 ? 'bg-emerald-500' : item.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{item.feedback}</p>
                </div>
              ))}
            </div>

            {/* Decision review */}
            <div className="mt-8 text-left">
              <h3 className="font-semibold text-sm mb-3">Decision Review</h3>
              <div className="space-y-2">
                {state.decisions.map((d, i) => {
                  const step = scenario.steps.find(s => s.id === d.stepId);
                  return (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-accent/30 text-xs">
                      {d.isCorrect ? (
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle size={14} className="text-red-500 shrink-0" />
                      )}
                      <span className="flex-1 truncate">{step?.metadata?.phase?.replace(/_/g, ' ')}</span>
                      <span className="text-muted-foreground">{formatDuration(d.responseTimeMs)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <Button variant="outline" onClick={handleRestart} className="flex-1 gap-2">
                <RotateCcw size={14} /> Retry
              </Button>
              <Link href="/student/simulations" className="flex-1">
                <Button className="w-full gap-2">
                  <Home size={14} /> All Simulations
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

export default function SimulationDetailPage() {
  const params = useParams();
  const scenarioId = typeof params?.id === 'string' ? params.id : 'scenario-earthquake-01';

  return (
    <DashboardLayout requiredRole="student">
      <SimulationEngine scenarioId={scenarioId} />
    </DashboardLayout>
  );
}
