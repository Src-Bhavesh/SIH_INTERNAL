'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore, useStudentProgressStore } from '@/lib/store';
import { recommendations } from '@/lib/data';
import { generateStudentRecommendations } from '@/lib/engines/recommendation-engine';
import { ArrowRight, Lightbulb, Target, BookOpen, Gamepad2, AlertTriangle, CheckCircle2, XCircle, ShieldAlert, Sparkles } from 'lucide-react';
import Link from 'next/link';

function RecommendationsContent() {
  const { user } = useAuthStore();
  const { getStudentPrep } = useStudentProgressStore();
  const prep = user ? getStudentPrep(user.id) : undefined;

  const userRecs = user
    ? recommendations.filter(r => r.targetId === user.id)
    : [];
  
  // Also generate dynamic recommendations
  const dynamicRecs = prep ? generateStudentRecommendations(prep) : [];
  const allRecs = [...userRecs, ...dynamicRecs.filter(dr => !userRecs.find(ur => ur.actionId === dr.actionId))];

  const priorityConfig: Record<string, { color: string; label: string }> = {
    high: { color: 'bg-rose-500/10 text-rose-700 border-rose-200', label: 'High Priority' },
    medium: { color: 'bg-amber-500/10 text-amber-700 border-amber-200', label: 'Medium' },
    low: { color: 'bg-blue-500/10 text-blue-700 border-blue-200', label: 'Recommended' },
  };

  const actionIcon: Record<string, React.ReactNode> = {
    module: <BookOpen size={16} />,
    simulation: <Gamepad2 size={16} />,
    drill: <Target size={16} />,
    training: <Lightbulb size={16} />,
  };

  const mistakes = prep?.mistakes || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Personalized Recommendations</h1>
        <p className="text-sm text-slate-500">AI-powered diagnostic error analysis and targeted recovery exercises</p>
      </div>

      {/* ── Section 1: Identified Errors from Quizzes & Simulations ── */}
      {mistakes.length > 0 && (
        <Card className="border-rose-200 bg-rose-50/40 shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-rose-100/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <ShieldAlert size={18} />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-rose-950">
                  Identified Mistakes &amp; Critical Safety Errors ({mistakes.length})
                </CardTitle>
                <CardDescription className="text-xs text-rose-700">
                  Review the unsafe choices detected during your recent quizzes or simulation runs.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {mistakes.map((m, idx) => (
              <div
                key={m.id || idx}
                className="p-3.5 rounded-xl bg-white border border-rose-200/80 shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold border-rose-300 text-rose-700 bg-rose-50">
                      {m.type === 'quiz' ? '📝 Quiz Mistake' : '🎮 Simulation Error'}
                    </Badge>
                    <span className="text-xs font-bold text-slate-800">{m.title}</span>
                  </div>
                  {m.hazardType && (
                    <Badge variant="outline" className="text-[10px] capitalize text-slate-600 border-slate-200">
                      {m.hazardType.replace(/_/g, ' ')}
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-slate-700 font-medium">
                  <strong>Checkpoint / Question:</strong> {m.questionOrStep}
                </p>

                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-rose-50/80 border border-rose-100 text-rose-900">
                    <div className="flex items-center gap-1.5 font-bold mb-0.5 text-rose-700">
                      <XCircle size={13} /> Your Chosen Action:
                    </div>
                    <p className="text-[11px] leading-relaxed">{m.mistakeText}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-100 text-emerald-900">
                    <div className="flex items-center gap-1.5 font-bold mb-0.5 text-emerald-700">
                      <CheckCircle2 size={13} /> Correct Safety Protocol:
                    </div>
                    <p className="text-[11px] leading-relaxed">{m.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ── Section 2: Weak Areas Summary ── */}
      {prep && prep.weakAreas.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50 rounded-2xl">
          <CardContent className="p-4 flex items-start gap-3">
            <Target size={18} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-900">Weak Areas Requiring Focus</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Identified hazard vulnerabilities: <strong className="capitalize">{prep.weakAreas.map(a => a.replace(/_/g, ' ')).join(', ')}</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Section 3: AI Recommendations List ── */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          Recommended Action Items
        </h2>

        {allRecs.length === 0 ? (
          <Card className="rounded-2xl border-slate-200">
            <CardContent className="p-10 text-center">
              <Lightbulb size={40} className="text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-sm text-slate-700 mb-1">Begin Your Safety Training</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Start with interactive learning modules or simulated disaster drills to evaluate your readiness.
              </p>
              <Link href="/student/learn">
                <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-2 text-xs">
                  <BookOpen size={14} /> Start Learning Modules
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {allRecs.map(rec => (
              <Card key={rec.id} className="card-hover border-slate-200 rounded-2xl">
                <CardContent className="p-4 sm:p-5 flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                    {actionIcon[rec.actionType] || <Lightbulb size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-800">{rec.title}</h3>
                      <Badge className={`text-[10px] font-semibold ${priorityConfig[rec.priority]?.color}`}>
                        {priorityConfig[rec.priority]?.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">{rec.description}</p>
                    {rec.reason && (
                      <p className="text-[11px] text-slate-400 mt-1 italic">Reason: {rec.reason}</p>
                    )}
                  </div>
                  <Link href={rec.actionType === 'simulation' ? `/student/simulations/${rec.actionId}` : '/student/learn'}>
                    <Button size="sm" variant="outline" className="gap-1.5 shrink-0 text-xs font-bold border-slate-300 hover:border-emerald-600 hover:text-emerald-700">
                      Start <ArrowRight size={12} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <DashboardLayout requiredRole="student">
      <RecommendationsContent />
    </DashboardLayout>
  );
}
