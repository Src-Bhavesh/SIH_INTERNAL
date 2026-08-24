'use client';

import React, { useState, useMemo, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useScenarioStore } from '@/lib/store';
import { getDisasterIcon } from '@/lib/utils';
import { DisasterType, Scenario, ScenarioStep, ScenarioChoice, SimulationDecision } from '@/lib/types';
import {
  Plus, Search, Play, Trash2, Eye, X, CheckCircle2,
  AlertTriangle, Clock, Target, Sparkles, BookOpen, Layers,
  ChevronRight, RefreshCw, Flame, Zap, Waves, Wind, ShieldAlert,
  RotateCcw, Award, Check, XCircle, Timer, ExternalLink
} from 'lucide-react';
import Link from 'next/link';

// ── Preset Templates ──────────────────────────────────────────────
const PRESET_TEMPLATES: {
  title: string;
  disasterType: DisasterType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  description: string;
  location: string;
  steps: ScenarioStep[];
}[] = [
  {
    title: 'Hazardous Chemical Spill in Chemistry Lab',
    disasterType: 'chemical',
    difficulty: 'intermediate',
    estimatedMinutes: 6,
    location: 'Chemistry Lab 102, Science Wing',
    description: 'A concentrated acid bottle fractures on the laboratory workbench releasing pungent toxic fumes. Decide how to isolate the area, ventilate safely, and evacuate students.',
    steps: [
      {
        id: 'chem-1',
        situation: 'During an 11th-grade practical class, a 500ml container of concentrated nitric acid falls and shatters. Brown noxious fumes begin spreading across the laboratory.',
        location: 'Chemistry Lab 102',
        timeLimit: 15,
        choices: [
          {
            id: 'c1-a',
            text: 'Immediately open all windows, turn on exhaust fans, and evacuate students upwind',
            consequence: 'Excellent! Prompt ventilation and evacuating students away from fumes prevents acute respiratory toxicity.',
            isCorrect: true,
            isSafe: true,
            safetyScore: 100,
          },
          {
            id: 'c1-b',
            text: 'Grab a mop and paper towels to clean up the liquid quickly before the teacher notices',
            consequence: 'Extremely dangerous! Concentrated acid burns through organic materials and releases toxic gases upon contact with skin.',
            isCorrect: false,
            isSafe: false,
            safetyScore: 10,
          },
          {
            id: 'c1-c',
            text: 'Pour water over the acid puddle to dilute it',
            consequence: 'Pouring water on concentrated acid causes violent exothermic boiling and splattering. Neutralizing agents like sodium bicarbonate should be used.',
            isCorrect: false,
            isSafe: false,
            safetyScore: 25,
          },
        ],
      },
      {
        id: 'chem-2',
        situation: 'Outside the lab, one student has acid splash droplets on their forearm and is complaining of severe burning sensation.',
        location: 'Corridor outside Lab 102',
        timeLimit: 20,
        choices: [
          {
            id: 'c2-a',
            text: 'Flush the affected skin under the emergency eyewash / shower station with copious water for 15 minutes',
            consequence: 'Correct! Continuous emergency water flushing is the standard protocol for chemical burns before medical escort.',
            isCorrect: true,
            isSafe: true,
            safetyScore: 100,
          },
          {
            id: 'c2-b',
            text: 'Apply butter or oil over the burn to soothe the skin',
            consequence: 'Never apply grease or butter to chemical burns. It traps chemical residues and increases tissue damage.',
            isCorrect: false,
            isSafe: false,
            safetyScore: 15,
          },
        ],
      },
    ],
  },
  {
    title: 'Severe Cyclone & Structural Roof Hazard',
    disasterType: 'cyclone',
    difficulty: 'advanced',
    estimatedMinutes: 8,
    location: 'Main Auditorium & Courtyard',
    description: 'A Category 3 Cyclone makes sudden inland landfall during school hours. High-speed winds exceed 120 km/h with heavy sheet metal detachment risk.',
    steps: [
      {
        id: 'cyc-1',
        situation: 'Winds are howling violently and tin roofing sheets from the nearby bicycle shed have started flying across the main courtyard.',
        location: 'Ground Floor Corridor',
        timeLimit: 15,
        choices: [
          {
            id: 'cy1-a',
            text: 'Move all students away from glass windows into internal structural rooms or lower corridors',
            consequence: 'Optimal decision! Flying debris and shattering glass cause 80% of storm injuries. Interior rooms provide superior safety.',
            isCorrect: true,
            isSafe: true,
            safetyScore: 100,
          },
          {
            id: 'cy1-b',
            text: 'Instruct students to run outside across the field to the school buses',
            consequence: 'Severe hazard! High-speed winds and airborne debris in open grounds pose fatal impact risks.',
            isCorrect: false,
            isSafe: false,
            safetyScore: 5,
          },
        ],
      },
      {
        id: 'cyc-2',
        situation: 'Power lines outside have snapped and water has begun pooling near the ground floor electrical junction box.',
        location: 'Main Electrical Panel Room',
        timeLimit: 20,
        choices: [
          {
            id: 'cy2-a',
            text: 'Alert the campus engineer to cut the master mains breaker from the dry sub-station and avoid water pool',
            consequence: 'Correct! Isolating electrical mains prevents electrocution risks in flooded structural areas.',
            isCorrect: true,
            isSafe: true,
            safetyScore: 100,
          },
          {
            id: 'cy2-b',
            text: 'Walk through the water to unplug individual appliances manually',
            consequence: 'Extreme electrocution risk! Never step into water in proximity to damaged electrical equipment.',
            isCorrect: false,
            isSafe: false,
            safetyScore: 0,
          },
        ],
      },
    ],
  },
  {
    title: 'Assembly Hall Stampede Mitigation',
    disasterType: 'stampede',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    location: 'Main School Auditorium',
    description: 'A false fire alarm triggers panic during the annual morning assembly with 800 students packed inside. Manage crowd flow and exit bottlenecks.',
    steps: [
      {
        id: 'st-1',
        situation: 'A loud noise triggers screams and hundreds of students rush simultaneously toward the double-door exit, creating a dangerous crush bottleneck.',
        location: 'Auditorium Main Exit',
        timeLimit: 15,
        choices: [
          {
            id: 'st1-a',
            text: 'Direct teachers to open all 4 side emergency exit doors and announce calmly over mic for students to halt and walk in row queues',
            consequence: 'Outstanding leadership! Opening multiple exits relieves pressure density while calm clear voice commands stop crowd surge.',
            isCorrect: true,
            isSafe: true,
            safetyScore: 100,
          },
          {
            id: 'st1-b',
            text: 'Shout "RUN FASTER!" so everyone gets out quicker',
            consequence: 'Aggravates panic and increases trampling pressure at doorways, leading to asphyxiation injuries.',
            isCorrect: false,
            isSafe: false,
            safetyScore: 5,
          },
        ],
      },
    ],
  },
];

// ── Interactive In-Page Simulation Tester ────────────────────────
function SimulationTestModal({
  scenario,
  onClose,
}: {
  scenario: Scenario;
  onClose: () => void;
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<ScenarioChoice | null>(null);
  const [decisions, setDecisions] = useState<{ stepId: string; choice: ScenarioChoice }[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [stepStartTime, setStepStartTime] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const currentStep = scenario.steps[currentStepIndex];

  // Reset timer on step change
  useEffect(() => {
    setSelectedChoice(null);
    setStepStartTime(Date.now());
    if (currentStep?.timeLimit) {
      setTimeRemaining(currentStep.timeLimit);
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev !== null && prev > 1) return prev - 1;
          return 0;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStepIndex, currentStep]);

  const handleSelectChoice = (choice: ScenarioChoice) => {
    if (selectedChoice) return; // Prevent changing after selected
    setSelectedChoice(choice);
  };

  const handleNextStep = () => {
    if (!selectedChoice) return;
    const newDecisions = [...decisions, { stepId: currentStep.id, choice: selectedChoice }];
    setDecisions(newDecisions);

    if (currentStepIndex < scenario.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setSelectedChoice(null);
    setDecisions([]);
    setIsFinished(false);
  };

  // Calculate final score
  const totalScore = useMemo(() => {
    if (decisions.length === 0) return 0;
    const sum = decisions.reduce((acc, d) => acc + d.choice.safetyScore, 0);
    return Math.round(sum / decisions.length);
  }, [decisions]);

  const safeCount = useMemo(() => {
    return decisions.filter(d => d.choice.isSafe).length;
  }, [decisions]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <Card className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 px-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-lg">
              {getDisasterIcon(scenario.disasterType)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white truncate">{scenario.title}</h3>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                  Simulation Test Run
                </Badge>
              </div>
              <p className="text-[11px] text-slate-300">
                {scenario.location} • Step {isFinished ? scenario.steps.length : currentStepIndex + 1} of {scenario.steps.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1 shrink-0">
          <div
            className="bg-emerald-600 h-1 transition-all duration-300"
            style={{
              width: `${
                isFinished
                  ? 100
                  : ((currentStepIndex + (selectedChoice ? 1 : 0.5)) / scenario.steps.length) * 100
              }%`,
            }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {!isFinished ? (
            <>
              {/* Situation Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wide">
                    Step {currentStepIndex + 1}: What is happening?
                  </span>
                  {timeRemaining !== null && (
                    <span
                      className={`font-mono font-bold flex items-center gap-1 ${
                        timeRemaining <= 5 ? 'text-rose-600 animate-pulse' : 'text-slate-500'
                      }`}
                    >
                      <Timer size={13} /> {timeRemaining}s limit
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {currentStep.situation}
                </p>
              </div>

              {/* Choices */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Select your tactical response:
                </p>

                {currentStep.choices.map((choice, cIdx) => {
                  const isSelected = selectedChoice?.id === choice.id;
                  const showResult = selectedChoice !== null;

                  return (
                    <div
                      key={choice.id}
                      onClick={() => handleSelectChoice(choice)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        !showResult
                          ? 'border-slate-200 bg-white hover:border-emerald-600 hover:bg-emerald-50/30'
                          : isSelected
                          ? choice.isSafe
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                            : 'border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-400/20'
                          : 'border-slate-200/60 bg-slate-50/50 opacity-60 text-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                            !showResult
                              ? 'bg-slate-100 text-slate-700'
                              : isSelected
                              ? choice.isSafe
                                ? 'bg-emerald-600 text-white'
                                : 'bg-rose-600 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {String.fromCharCode(65 + cIdx)}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold">{choice.text}</p>
                            {showResult && isSelected && (
                              <Badge
                                className={`text-[10px] shrink-0 ${
                                  choice.isSafe
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-rose-600 text-white'
                                }`}
                              >
                                {choice.isSafe ? '✓ Safe Response' : '✕ Unsafe Action'}
                              </Badge>
                            )}
                          </div>

                          {showResult && isSelected && (
                            <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs space-y-1">
                              <p className="font-medium">{choice.consequence}</p>
                              <p className="text-[11px] font-mono text-slate-500">
                                Safety Assessment: {choice.safetyScore}%
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Bar */}
              {selectedChoice && (
                <div className="pt-2 flex items-center justify-end gap-3 animate-in fade-in">
                  <Button
                    onClick={handleNextStep}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-5 shadow-xs gap-1.5"
                  >
                    {currentStepIndex < scenario.steps.length - 1 ? (
                      <>
                        Next Decision Step <ChevronRight size={14} />
                      </>
                    ) : (
                      <>
                        Complete &amp; View Results <Award size={14} />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            /* Simulation Complete Screen */
            <div className="text-center py-4 space-y-5 animate-in zoom-in-95">
              <div
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                  totalScore >= 80
                    ? 'bg-emerald-100 text-emerald-600'
                    : totalScore >= 50
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-rose-100 text-rose-600'
                }`}
              >
                <Award size={32} />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800">Simulation Complete!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Test assessment for &quot;{scenario.title}&quot;
                </p>
              </div>

              {/* Score Display */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <p className="text-slate-500 font-medium">Overall Score</p>
                  <p className="text-xl font-bold text-slate-800">{totalScore}%</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <p className="text-slate-500 font-medium">Safe Choices</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {safeCount} / {decisions.length}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <p className="text-slate-500 font-medium">Readiness Level</p>
                  <p className="text-sm font-bold text-blue-600 mt-1">
                    {totalScore >= 80 ? 'Mastery' : totalScore >= 60 ? 'Proficient' : 'Needs Practice'}
                  </p>
                </div>
              </div>

              {/* Step Decisions Summary */}
              <div className="space-y-2 text-left pt-2 border-t border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Decision Breakdown:
                </p>
                {decisions.map((d, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      {d.choice.isSafe ? (
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle size={15} className="text-rose-600 shrink-0" />
                      )}
                      <span className="font-medium text-slate-700 truncate">
                        Step #{i + 1}: {d.choice.text}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-600 shrink-0">
                      {d.choice.safetyScore}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3 pt-3">
                <Button variant="outline" size="sm" onClick={handleRestart} className="text-xs gap-1.5">
                  <RotateCcw size={13} /> Retest Scenario
                </Button>
                <Button
                  size="sm"
                  onClick={onClose}
                  className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4"
                >
                  Done Testing
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function AdminScenariosPage() {
  const { scenarios, addScenario, deleteScenario, resetScenarios, initScenarios } = useScenarioStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initScenarios().then(() => setMounted(true));
  }, [initScenarios]);


  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [disasterFilter, setDisasterFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [inspectScenario, setInspectScenario] = useState<Scenario | null>(null);
  const [testScenario, setTestScenario] = useState<Scenario | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    disasterType: DisasterType;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedMinutes: number;
    location: string;
    description: string;
    steps: ScenarioStep[];
  }>({
    title: '',
    disasterType: 'fire',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    location: '',
    description: '',
    steps: [
      {
        id: 'step-1',
        situation: '',
        location: '',
        timeLimit: 15,
        choices: [
          { id: 'c-1', text: '', consequence: '', isCorrect: true, isSafe: true, safetyScore: 100 },
          { id: 'c-2', text: '', consequence: '', isCorrect: false, isSafe: false, safetyScore: 20 },
        ],
      },
    ],
  });

  // Filtered Scenarios List
  const filteredScenarios = useMemo(() => {
    return scenarios.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDisaster = disasterFilter === 'all' || s.disasterType === disasterFilter;
      const matchesDifficulty = difficultyFilter === 'all' || s.difficulty === difficultyFilter;
      return matchesSearch && matchesDisaster && matchesDifficulty;
    });
  }, [scenarios, searchQuery, disasterFilter, difficultyFilter]);

  const handleApplyTemplate = (template: typeof PRESET_TEMPLATES[0]) => {
    setFormData({
      title: template.title,
      disasterType: template.disasterType,
      difficulty: template.difficulty,
      estimatedMinutes: template.estimatedMinutes,
      location: template.location,
      description: template.description,
      steps: JSON.parse(JSON.stringify(template.steps)),
    });
  };

  const handleAddStep = () => {
    const nextIndex = formData.steps.length + 1;
    setFormData(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          id: `step-${nextIndex}-${Date.now()}`,
          situation: '',
          location: prev.location,
          timeLimit: 15,
          choices: [
            { id: `c-${nextIndex}-1`, text: '', consequence: '', isCorrect: true, isSafe: true, safetyScore: 100 },
            { id: `c-${nextIndex}-2`, text: '', consequence: '', isCorrect: false, isSafe: false, safetyScore: 20 },
          ],
        },
      ],
    }));
  };

  const handleRemoveStep = (stepIndex: number) => {
    if (formData.steps.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== stepIndex),
    }));
  };

  const handleAddChoice = (stepIndex: number) => {
    setFormData(prev => {
      const updatedSteps = [...prev.steps];
      const targetStep = updatedSteps[stepIndex];
      if (targetStep.choices.length >= 4) return prev;
      targetStep.choices.push({
        id: `c-${stepIndex}-${Date.now()}`,
        text: '',
        consequence: '',
        isCorrect: false,
        isSafe: false,
        safetyScore: 30,
      });
      return { ...prev, steps: updatedSteps };
    });
  };

  const handleRemoveChoice = (stepIndex: number, choiceIndex: number) => {
    setFormData(prev => {
      const updatedSteps = [...prev.steps];
      const targetStep = updatedSteps[stepIndex];
      if (targetStep.choices.length <= 2) return prev;
      targetStep.choices = targetStep.choices.filter((_, ci) => ci !== choiceIndex);
      return { ...prev, steps: updatedSteps };
    });
  };

  const handleSaveScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    const newScenario: Scenario = {
      id: `scenario-custom-${Date.now()}`,
      title: formData.title.trim(),
      disasterType: formData.disasterType,
      difficulty: formData.difficulty,
      estimatedMinutes: Number(formData.estimatedMinutes) || 5,
      location: formData.location.trim() || 'Main Campus',
      description: formData.description.trim(),
      steps: formData.steps.map((st, i) => ({
        id: st.id || `step-${i + 1}`,
        situation: st.situation.trim() || `Decision Step ${i + 1}`,
        location: st.location?.trim() || formData.location,
        timeLimit: Number(st.timeLimit) || 15,
        choices: st.choices.map((ch, ci) => ({
          id: ch.id || `choice-${i + 1}-${ci + 1}`,
          text: ch.text.trim() || `Option ${ci + 1}`,
          consequence: ch.consequence.trim() || 'Evaluated standard response.',
          isCorrect: Boolean(ch.isCorrect),
          isSafe: Boolean(ch.isSafe),
          safetyScore: Number(ch.safetyScore) || 50,
        })),
      })),
    };

    addScenario(newScenario);
    setCreateModalOpen(false);
    setSuccessToast(`Scenario "${newScenario.title}" created successfully!`);
    setTimeout(() => setSuccessToast(null), 4000);

    // Reset Form
    setFormData({
      title: '',
      disasterType: 'fire',
      difficulty: 'beginner',
      estimatedMinutes: 5,
      location: '',
      description: '',
      steps: [
        {
          id: 'step-1',
          situation: '',
          location: '',
          timeLimit: 15,
          choices: [
            { id: 'c-1', text: '', consequence: '', isCorrect: true, isSafe: true, safetyScore: 100 },
            { id: 'c-2', text: '', consequence: '', isCorrect: false, isSafe: false, safetyScore: 20 },
          ],
        },
      ],
    });
  };

  const difficultyColor: Record<string, string> = {
    beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
    advanced: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  if (!mounted) return null;

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">Simulation Scenarios</h1>
              <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
                {scenarios.length} Scenarios Available
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Create and manage branch decision disaster simulations for students &amp; teachers.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs"
            >
              <Plus size={15} /> Create Scenario
            </Button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-emerald-600 hover:text-emerald-800">
              ✕
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <Card className="border-slate-200/80 bg-white/90 shadow-2xs rounded-2xl">
          <CardContent className="p-3.5 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search scenarios by title, room or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-8 pr-3 py-1.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
              />
            </div>

            <select
              value={disasterFilter}
              onChange={(e) => setDisasterFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs outline-none focus:bg-white text-slate-700 font-medium"
            >
              <option value="all">🌐 All Disaster Types</option>
              <option value="fire">🔥 Fire</option>
              <option value="earthquake">🫨 Earthquake</option>
              <option value="flood">🌊 Flood</option>
              <option value="cyclone">🌀 Cyclone</option>
              <option value="chemical">🧪 Chemical</option>
              <option value="stampede">🏃 Stampede</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs outline-none focus:bg-white text-slate-700 font-medium"
            >
              <option value="all">🎯 All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            {(searchQuery || disasterFilter !== 'all' || difficultyFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setDisasterFilter('all');
                  setDifficultyFilter('all');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </CardContent>
        </Card>

        {/* Scenarios Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScenarios.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              No simulation scenarios matching your search criteria.
            </div>
          ) : (
            filteredScenarios.map(scenario => {
              const isCustom = scenario.id.startsWith('scenario-custom');

              return (
                <Card
                  key={scenario.id}
                  className="border-slate-200/80 bg-white/90 shadow-2xs rounded-2xl flex flex-col hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shrink-0">
                          {getDisasterIcon(scenario.disasterType)}
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          {isCustom && (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-semibold">
                              ✨ Custom
                            </Badge>
                          )}
                          <Badge variant="outline" className={`text-[10px] capitalize font-medium ${difficultyColor[scenario.difficulty]}`}>
                            {scenario.difficulty}
                          </Badge>
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-1">{scenario.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {scenario.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" /> ~{scenario.estimatedMinutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Target size={12} className="text-slate-400" /> {scenario.steps.length} Decision Step{scenario.steps.length > 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setInspectScenario(scenario)}
                          className="text-xs h-7 px-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 gap-1"
                        >
                          <Eye size={13} /> Inspect
                        </Button>

                        <div className="flex items-center gap-1.5">
                          {isCustom && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteScenario(scenario.id)}
                              className="text-xs h-7 px-2 text-rose-600 hover:bg-rose-50"
                              title="Delete Scenario"
                            >
                              <Trash2 size={13} />
                            </Button>
                          )}

                          <Button
                            size="sm"
                            onClick={() => setTestScenario(scenario)}
                            className="text-xs h-7 px-3 bg-emerald-700 hover:bg-emerald-800 text-white gap-1 shadow-2xs cursor-pointer"
                          >
                            <Play size={11} fill="currentColor" /> Test Simulation
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* ── CREATE SCENARIO MODAL ── */}
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in">
            <Card className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
              <CardHeader className="bg-gradient-to-r from-emerald-50/80 via-white to-slate-50 border-b border-slate-100 p-5 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-slate-800">Create Disaster Simulation Scenario</CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Design realistic decision scenarios with immediate educational feedback.
                      </CardDescription>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Quick Templates Bar */}
                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                    Quick Templates:
                  </span>
                  {PRESET_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 text-xs font-semibold shrink-0 transition-colors"
                    >
                      {tmpl.title.split(' ')[0]} {tmpl.title.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </CardHeader>

              {/* Modal Body / Form */}
              <form onSubmit={handleSaveScenario} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Basic Details Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Scenario Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Electrical Transformer Fire near Auditorium"
                      value={formData.title}
                      onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Disaster Category *</label>
                    <select
                      value={formData.disasterType}
                      onChange={(e) => setFormData(p => ({ ...p, disasterType: e.target.value as DisasterType }))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:bg-white text-slate-700 font-medium"
                    >
                      <option value="fire">🔥 Fire Emergency</option>
                      <option value="earthquake">🫨 Earthquake</option>
                      <option value="flood">🌊 Flood / Water Leak</option>
                      <option value="cyclone">🌀 Cyclone / High Wind</option>
                      <option value="chemical">🧪 Hazardous Chemical</option>
                      <option value="stampede">🏃 Stampede Hazard</option>
                      <option value="general">🦺 General Evacuation</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Difficulty</label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData(p => ({ ...p, difficulty: e.target.value as any }))}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Est. Min</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={formData.estimatedMinutes}
                        onChange={(e) => setFormData(p => ({ ...p, estimatedMinutes: Number(e.target.value) }))}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Campus Location / Room</label>
                    <input
                      type="text"
                      placeholder="e.g. Science Wing, First Floor Lab 102"
                      value={formData.location}
                      onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Overview Description *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Describe what triggers the emergency scenario..."
                      value={formData.description}
                      onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
                    />
                  </div>
                </div>

                {/* Step Decisions Builder */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Layers size={14} className="text-emerald-700" />
                      Simulation Decision Steps ({formData.steps.length})
                    </h3>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleAddStep}
                      className="text-xs h-7 gap-1 border-dashed"
                    >
                      <Plus size={12} /> Add Decision Step
                    </Button>
                  </div>

                  {formData.steps.map((step, sIdx) => (
                    <div key={step.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          Step #{sIdx + 1}: Situation Prompt
                        </span>
                        {formData.steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(sIdx)}
                            className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                          >
                            Remove Step
                          </button>
                        )}
                      </div>

                      <textarea
                        required
                        rows={2}
                        placeholder={`Describe what happens in Step ${sIdx + 1}...`}
                        value={step.situation}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData(p => {
                            const steps = [...p.steps];
                            steps[sIdx].situation = val;
                            return { ...p, steps };
                          });
                        }}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none"
                      />

                      {/* Choices for this step */}
                      <div className="space-y-2 pt-2 border-t border-slate-200/60">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                            Student Response Choices (2–4):
                          </p>
                          {step.choices.length < 4 && (
                            <button
                              type="button"
                              onClick={() => handleAddChoice(sIdx)}
                              className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold"
                            >
                              + Add Option
                            </button>
                          )}
                        </div>

                        {step.choices.map((choice, cIdx) => (
                          <div key={choice.id} className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {String.fromCharCode(65 + cIdx)}
                              </span>
                              <input
                                type="text"
                                required
                                placeholder={`Choice text (e.g. Drop under desks...)`}
                                value={choice.text}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFormData(p => {
                                    const steps = [...p.steps];
                                    steps[sIdx].choices[cIdx].text = val;
                                    return { ...p, steps };
                                  });
                                }}
                                className="flex-1 rounded-md border border-slate-200 px-2 py-1 text-xs outline-none"
                              />

                              <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer shrink-0">
                                <input
                                  type="checkbox"
                                  checked={choice.isCorrect}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setFormData(p => {
                                      const steps = [...p.steps];
                                      steps[sIdx].choices[cIdx].isCorrect = checked;
                                      steps[sIdx].choices[cIdx].isSafe = checked;
                                      steps[sIdx].choices[cIdx].safetyScore = checked ? 100 : 20;
                                      return { ...p, steps };
                                    });
                                  }}
                                  className="rounded text-emerald-600"
                                />
                                Safe / Correct?
                              </label>

                              {step.choices.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveChoice(sIdx, cIdx)}
                                  className="text-slate-400 hover:text-rose-600"
                                >
                                  ✕
                                </button>
                              )}
                            </div>

                            <input
                              type="text"
                              required
                              placeholder="Consequence & educational explanation (why this choice is safe or unsafe)..."
                              value={choice.consequence}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormData(p => {
                                  const steps = [...p.steps];
                                  steps[sIdx].choices[cIdx].consequence = val;
                                  return { ...p, steps };
                                });
                              }}
                              className="w-full rounded-md border border-slate-100 bg-slate-50/50 px-2 py-1 text-[11px] text-slate-600 outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCreateModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 shadow-sm"
                  >
                    Save &amp; Publish Scenario
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* ── INSPECT SCENARIO MODAL ── */}
        {inspectScenario && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in">
            <Card className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl border border-slate-200 max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-5 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-2xl flex items-center justify-center">
                      {getDisasterIcon(inspectScenario.disasterType)}
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-slate-800">{inspectScenario.title}</CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        {inspectScenario.location} • ~{inspectScenario.estimatedMinutes} min • {inspectScenario.steps.length} Steps
                      </CardDescription>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInspectScenario(null)}
                    className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="p-5 flex-1 overflow-y-auto space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {inspectScenario.description}
                </p>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Decision Progression Tree</h4>
                  {inspectScenario.steps.map((st, sIdx) => (
                    <div key={st.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          Step #{sIdx + 1}
                        </span>
                        {st.timeLimit && (
                          <span className="text-[10px] text-slate-400 font-mono">⏱ {st.timeLimit}s limit</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">{st.situation}</p>

                      <div className="space-y-1.5 pt-1">
                        {st.choices.map((ch, cIdx) => (
                          <div
                            key={ch.id}
                            className={`p-2 rounded-lg text-xs border ${
                              ch.isCorrect
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between font-semibold">
                              <span>{String.fromCharCode(65 + cIdx)}. {ch.text}</span>
                              <span className="text-[10px] font-mono">Score: {ch.safetyScore}%</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 italic">{ch.consequence}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setInspectScenario(null)}
                    className="text-xs"
                  >
                    Close
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => {
                      const sc = inspectScenario;
                      setInspectScenario(null);
                      setTestScenario(sc);
                    }}
                    className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white gap-1"
                  >
                    <Play size={12} fill="currentColor" /> Test Simulation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── INTERACTIVE TEST SIMULATION MODAL ── */}
        {testScenario && (
          <SimulationTestModal
            scenario={testScenario}
            onClose={() => setTestScenario(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
