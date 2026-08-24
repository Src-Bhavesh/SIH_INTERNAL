'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ScoreRing from '@/components/shared/ScoreRing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore, useStudentProgressStore, useScenarioStore } from '@/lib/store';
import { formatDate, getDisasterIcon } from '@/lib/utils';
import { BarChart3, TrendingUp, Award, Clock, BookOpen, Gamepad2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function ResultsContent() {
  const { user } = useAuthStore();
  const { getStudentAttempts, getStudentQuizAttempts, getStudentPrep } = useStudentProgressStore();
  const { scenarios } = useScenarioStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'quiz' | 'simulation'>('all');

  const simAttempts = user ? getStudentAttempts(user.id) : [];
  const quizAttempts = user ? getStudentQuizAttempts(user.id) : [];
  const prep = user ? getStudentPrep(user.id) : undefined;

  // Combined assessment items
  type ResultItem = {
    id: string;
    type: 'quiz' | 'simulation';
    title: string;
    disasterType: string;
    date: string;
    score: number;
    quizData?: typeof quizAttempts[0];
    simData?: typeof simAttempts[0];
  };

  const allResults: ResultItem[] = [
    ...quizAttempts.map(q => ({
      id: q.id,
      type: 'quiz' as const,
      title: q.moduleTitle,
      disasterType: q.disasterType,
      date: q.completedAt,
      score: q.score,
      quizData: q,
    })),
    ...simAttempts.map(s => {
      const scenario = scenarios.find(sc => sc.id === s.scenarioId);
      return {
        id: s.id,
        type: 'simulation' as const,
        title: scenario?.title || 'Disaster Scenario Simulation',
        disasterType: scenario?.disasterType || 'fire',
        date: s.completedAt || s.startedAt,
        score: s.score.overall,
        simData: s,
      };
    }),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredResults = allResults.filter(item => {
    if (activeFilter === 'quiz') return item.type === 'quiz';
    if (activeFilter === 'simulation') return item.type === 'simulation';
    return true;
  });

  const avgScore = allResults.length > 0
    ? Math.round(allResults.reduce((sum, item) => sum + item.score, 0) / allResults.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Results &amp; Assessment History</h1>
          <p className="text-slate-500 text-sm">Real-time breakdown of your learning quizzes and simulation drill scores</p>
        </div>

        {allResults.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs px-3 py-1 font-bold">
              {allResults.length} Assessments Completed
            </Badge>
          </div>
        )}
      </div>

      {/* ── Summary Stats ── */}
      {allResults.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="rounded-2xl border-slate-200/80 bg-white/80 shadow-2xs">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <BarChart3 size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Average Performance</p>
                <p className="text-lg font-bold text-slate-800">{avgScore}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200/80 bg-white/80 shadow-2xs">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Quizzes Completed</p>
                <p className="text-lg font-bold text-slate-800">{quizAttempts.length} Assessments</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200/80 bg-white/80 shadow-2xs">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Gamepad2 size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Simulations Run</p>
                <p className="text-lg font-bold text-slate-800">{simAttempts.length} Drills</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl w-fit text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
            activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          All Results ({allResults.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('quiz')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
            activeFilter === 'quiz' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen size={13} className="text-emerald-600" />
          Module Quizzes ({quizAttempts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('simulation')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
            activeFilter === 'simulation' ? 'bg-white text-purple-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Gamepad2 size={13} className="text-purple-600" />
          Simulations ({simAttempts.length})
        </button>
      </div>

      {/* ── Results List ── */}
      {filteredResults.length === 0 ? (
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="p-12 text-center">
            <BarChart3 size={44} className="text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-base mb-1">No Results Recorded Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
              Complete a learning module quiz or run an interactive disaster simulation to see your verified results and score history here.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/student/learn">
                <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-2 text-xs">
                  <BookOpen size={14} /> Go to Learning Modules
                </Button>
              </Link>
              <Link href="/student/simulations">
                <Button size="sm" variant="outline" className="border-slate-300 font-bold gap-2 text-xs">
                  <Gamepad2 size={14} /> Start a Simulation
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3.5">
          {filteredResults.map(item => (
            <Card key={item.id} className="card-hover rounded-2xl border-slate-200/80 bg-white/90 shadow-2xs overflow-hidden">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: Icon & Details */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <span className="text-3xl shrink-0 p-2 rounded-2xl bg-slate-50 border border-slate-100">
                      {getDisasterIcon(item.disasterType as any)}
                    </span>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold uppercase tracking-wide ${
                            item.type === 'quiz'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-purple-50 text-purple-800 border-purple-200'
                          }`}
                        >
                          {item.type === 'quiz' ? '📝 Module Quiz' : '🎮 Disaster Simulation'}
                        </Badge>
                        <h3 className="font-bold text-sm text-slate-800">{item.title}</h3>
                      </div>

                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Clock size={12} />
                        Completed on {formatDate(item.date)}
                      </p>

                      {/* Quiz specific metrics */}
                      {item.type === 'quiz' && item.quizData && (
                        <div className="grid grid-cols-3 gap-2 pt-2 max-w-sm">
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                            <p className="text-xs font-bold text-slate-800">{item.quizData.correctCount} / {item.quizData.totalQuestions}</p>
                            <p className="text-[10px] text-slate-500">Correct Answers</p>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                            <p className="text-xs font-bold text-slate-800">{item.quizData.score}%</p>
                            <p className="text-[10px] text-slate-500">Accuracy</p>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                            <p className="text-xs font-bold text-emerald-700 uppercase">{item.quizData.status}</p>
                            <p className="text-[10px] text-slate-500">Status</p>
                          </div>
                        </div>
                      )}

                      {/* Simulation specific metrics */}
                      {item.type === 'simulation' && item.simData && (
                        <div className="grid grid-cols-4 gap-2 pt-2 max-w-md">
                          {item.simData.score.breakdown.map(b => (
                            <div key={b.label} className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                              <p className="text-xs font-bold text-slate-800">{b.score}%</p>
                              <p className="text-[10px] text-slate-500 truncate">{b.label}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Score Ring */}
                  <div className="flex flex-col items-center justify-center shrink-0 sm:border-l sm:border-slate-100 sm:pl-5">
                    <ScoreRing score={item.score} size={70} strokeWidth={6} showLabel={false} />
                    <p className="text-xs font-bold text-slate-700 mt-1">Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <DashboardLayout requiredRole="student">
      <ResultsContent />
    </DashboardLayout>
  );
}
