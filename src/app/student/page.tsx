'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ScoreRing from '@/components/shared/ScoreRing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore, useStudentProgressStore } from '@/lib/store';
import { scenarios } from '@/lib/data';
import { formatDate, getDisasterIcon } from '@/lib/utils';
import { BookOpen, Gamepad2, ArrowRight, Star, TrendingUp, AlertCircle, CheckCircle2, Award, Shield } from 'lucide-react';
import Link from 'next/link';

function StudentDashboardContent() {
  const { user } = useAuthStore();
  const { getStudentPrep, getStudentAttempts, fetchStudentData } = useStudentProgressStore();

  React.useEffect(() => {
    if (user?.id) {
      fetchStudentData(user.id);
    }
  }, [user?.id, fetchStudentData]);

  if (!user) return null;

  const prep = getStudentPrep(user.id);
  const attempts = getStudentAttempts(user.id);

  if (!prep) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-200">
          <Shield size={32} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-800 mb-2">Welcome to SurakshaOS!</h2>
        <p className="text-slate-500 mb-6 max-w-md text-xs sm:text-sm">
          Start your disaster preparedness journey. Begin with a learning module to build your knowledge.
        </p>
        <Link href="/student/learn">
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20">
            <BookOpen size={16} /> Start Learning
          </Button>
        </Link>
      </div>
    );
  }

  const breakdownItems = [
    { label: 'Knowledge & Theory', value: prep.knowledge, color: 'bg-blue-500' },
    { label: 'Decision Making', value: prep.decisionMaking, color: 'bg-purple-500' },
    { label: 'Response Time', value: prep.responseTime, color: 'bg-amber-500' },
    { label: 'Drill Performance', value: prep.drillPerformance, color: 'bg-emerald-500' },
    { label: 'Training Modules Done', value: prep.trainingCompletion, color: 'bg-teal-500' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Welcome back, {user.name.split(' ')[0]}!
            </h1>
            <Badge variant="outline" className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 border-emerald-200">
              Enrolled
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Here is your live disaster preparedness performance and achievements.</p>
        </div>
        <Link href="/student/learn">
          <Button size="sm" className="gap-1.5 text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-700/20 cursor-pointer">
            <BookOpen size={14} /> Resume Learning
          </Button>
        </Link>
      </div>

      {/* Top Row: Score + Breakdown + Recommendation */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Preparedness Score */}
        <Card className="rounded-2xl border-slate-200/80 bg-white/95 shadow-2xs hover:shadow-sm transition-all overflow-hidden">
          <CardHeader className="pb-0 border-b border-slate-100 p-4">
            <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Disaster Preparedness Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center p-5">
            <ScoreRing score={prep.overall} size={150} />
            <p className="text-xs font-bold text-slate-700 mt-3 text-center">
              {prep.overall >= 80 ? '🌟 Certified Safe & Prepared' : prep.overall >= 50 ? '⚡ Good Progress — Keep Practicing' : '⚠️ Initial Stage — Complete Modules'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Based on your module scores &amp; drills</p>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card className="rounded-2xl border-slate-200/80 bg-white/95 shadow-2xs hover:shadow-sm transition-all">
          <CardHeader className="pb-0 border-b border-slate-100 p-4">
            <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Performance Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3.5">
            {breakdownItems.map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className="font-bold text-slate-900">{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-700`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended Next Step */}
        <Card className="rounded-2xl border-emerald-200/80 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white shadow-2xs">
          <CardHeader className="pb-0 border-b border-emerald-100/80 p-4">
            <CardTitle className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
              <TrendingUp size={14} className="text-emerald-700" />
              Recommended Next Step
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {prep.recommendedActivity ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">{prep.recommendedActivity.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {prep.recommendedActivity.description}
                  </p>
                </div>
                <Link href={
                  prep.recommendedActivity.type === 'simulation'
                    ? `/student/simulations/${prep.recommendedActivity.id}`
                    : `/student/learn`
                }>
                  <Button size="sm" className="w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md cursor-pointer">
                    Start Now <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-xs text-slate-600">You are doing fantastic! Keep up the great work.</p>
            )}

            {/* Weak Areas */}
            {prep.weakAreas.length > 0 && (
              <div className="mt-4 pt-3 border-t border-emerald-200/60">
                <p className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider mb-2">Identified Focus Areas</p>
                <div className="flex flex-wrap gap-1.5">
                  {prep.weakAreas.map(area => (
                    <Badge key={area} variant="outline" className="text-[10px] font-bold capitalize bg-white text-emerald-900 border-emerald-300 shadow-2xs">
                      {area.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Quick Actions + Recent Simulations + Badges */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <Card className="rounded-2xl border-slate-200/80 bg-white/95 shadow-2xs hover:shadow-sm transition-all">
          <CardHeader className="pb-0 border-b border-slate-100 p-4">
            <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Quick Portals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-1.5">
            <Link href="/student/learn" className="block">
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
                  <BookOpen size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900">Curriculum Modules</p>
                  <p className="text-[11px] text-slate-500">{prep.completedModules.length}/3 modules completed</p>
                </div>
                <ArrowRight size={13} className="text-slate-400" />
              </div>
            </Link>
            <Link href="/student/simulations" className="block">
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200 shrink-0">
                  <Gamepad2 size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900">Drill Simulations</p>
                  <p className="text-[11px] text-slate-500">{scenarios.length} scenarios available</p>
                </div>
                <ArrowRight size={13} className="text-slate-400" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Simulations */}
        <Card className="rounded-2xl border-slate-200/80 bg-white/95 shadow-2xs hover:shadow-sm transition-all">
          <CardHeader className="pb-0 border-b border-slate-100 p-4">
            <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Recent Drills &amp; Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {attempts.length > 0 ? (
              <div className="space-y-2.5">
                {attempts.slice(0, 3).map(attempt => {
                  const scenario = scenarios.find(s => s.id === attempt.scenarioId);
                  return (
                    <div key={attempt.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span>{scenario ? getDisasterIcon(scenario.disasterType) : '🛡️'}</span>
                        <span className="font-bold text-slate-800 truncate">{scenario?.title || 'Simulation'}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border-emerald-200">
                        {typeof attempt.score === 'object' ? attempt.score.overall : attempt.score}%
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No simulation attempts recorded yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Badges Earned */}
        <Card className="rounded-2xl border-slate-200/80 bg-white/95 shadow-2xs hover:shadow-sm transition-all">
          <CardHeader className="pb-0 border-b border-slate-100 p-4">
            <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
              <span>Earned Badges</span>
              <span className="text-[10px] text-emerald-700 font-bold">{prep.badges.length} Unlocked</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {prep.badges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {prep.badges.map(b => (
                  <div key={b.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-2xs">
                    <Award size={13} className="text-amber-600" />
                    <span>{b.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">Complete modules to earn readiness badges.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <DashboardLayout requiredRole="student">
      <StudentDashboardContent />
    </DashboardLayout>
  );
}
