'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ScoreRing from '@/components/shared/ScoreRing';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { school, users } from '@/lib/data';
import { useStudentProgressStore } from '@/lib/store';
import { Printer, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle, BookOpen, Activity } from 'lucide-react';

function ReportsContent() {
  const {
    getSchoolMetrics,
    registeredStudents,
    quizAttempts,
    simulationAttempts,
    studentProgress,
    initData,
  } = useStudentProgressStore();

  React.useEffect(() => {
    initData();
  }, [initData]);

  const metrics = getSchoolMetrics();
  const totalAssessments = quizAttempts.length + simulationAttempts.length;

  // Active faculty whose assigned classes have registered students
  const activeTeachersCount = users.filter(u => {
    if (u.role !== 'teacher' || !u.assignedClasses) return false;
    return registeredStudents.some(s => s.classId && u.assignedClasses!.includes(s.classId));
  }).length;

  const totalTeachers = users.filter(u => u.role === 'teacher').length;

  // Dynamic Score Components based on live assessments
  const scoreComponents = [
    {
      icon: '🎓',
      name: 'Student Preparedness Index',
      score: metrics.avgIDRI,
      weight: 30,
    },
    {
      icon: '🔥',
      name: 'Fire Safety & Response',
      score: metrics.fire,
      weight: 20,
    },
    {
      icon: '🫨',
      name: 'Earthquake Hazard Preparedness',
      score: metrics.earthquake,
      weight: 20,
    },
    {
      icon: '🌊',
      name: 'Flood Hazard Management',
      score: metrics.flood,
      weight: 15,
    },
    {
      icon: '🏃',
      name: 'Evacuation & Drill Speed',
      score: metrics.evacuation,
      weight: 15,
    },
  ];

  // Dynamic Weaknesses identified from actual mistake logs and low domain scores
  const dynamicWeaknesses: { area: string; description: string; impact: string }[] = [];

  const allMistakes = Object.values(studentProgress).flatMap(p => p.mistakes || []);
  if (allMistakes.length > 0) {
    const mistakeMap = new Map<string, number>();
    allMistakes.forEach(m => {
      const type = m.hazardType?.replace(/_/g, ' ') || 'Response Protocol';
      mistakeMap.set(type, (mistakeMap.get(type) || 0) + 1);
    });

    mistakeMap.forEach((count, type) => {
      dynamicWeaknesses.push({
        area: type.toUpperCase(),
        description: `${count} decision error(s) logged across simulation/quiz assessments.`,
        impact: `-${Math.min(15, count * 3)}`,
      });
    });
  }

  // Check domains with 0% or low scores
  if (metrics.totalStudents > 0) {
    if (metrics.fire === 0) {
      dynamicWeaknesses.push({
        area: 'FIRE SAFETY NOT ASSESSED',
        description: 'No students in the registered cohort have completed Fire Safety assessments yet.',
        impact: '-10',
      });
    }
    if (metrics.earthquake === 0) {
      dynamicWeaknesses.push({
        area: 'EARTHQUAKE PROTOCOL NOT ASSESSED',
        description: 'No students in the registered cohort have completed Earthquake drills yet.',
        impact: '-10',
      });
    }
    if (metrics.flood === 0) {
      dynamicWeaknesses.push({
        area: 'FLOOD HAZARD NOT ASSESSED',
        description: 'No students in the registered cohort have completed Flood Safety modules yet.',
        impact: '-10',
      });
    }
  }

  // Dynamic Recommendations based on live metrics
  const dynamicRecommendations: string[] = [];
  if (metrics.totalStudents === 0) {
    dynamicRecommendations.push('Onboard students across class cohorts and assign baseline safety diagnostic quizzes.');
  } else {
    if (metrics.fire < 70) {
      dynamicRecommendations.push('Schedule Fire Safety & Evacuation Simulation drill for all active classrooms.');
    }
    if (metrics.earthquake < 70) {
      dynamicRecommendations.push('Conduct Drop-Cover-Hold On practical drills to reinforce earthquake shaking response.');
    }
    if (metrics.flood < 70) {
      dynamicRecommendations.push('Assign Flood Hazard Awareness curriculum and water-level safety scenarios.');
    }
    if (metrics.evacuation < 70) {
      dynamicRecommendations.push('Review campus evacuation routes and verify designated assembly area protocols.');
    }
    if (dynamicRecommendations.length === 0) {
      dynamicRecommendations.push('Maintain high preparedness with monthly unannounced disaster simulation exercises.');
      dynamicRecommendations.push('Export readiness certificates for compliant class cohorts.');
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Preparedness Report</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Real-time Institutional Disaster Readiness Report</p>
        </div>
        <Button
          variant="outline"
          className="gap-2 text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
          onClick={() => window.print()}
        >
          <Printer size={14} /> Print Report
        </Button>
      </div>

      {/* Report Container */}
      <Card className="border-slate-200/80 bg-white/95 shadow-sm rounded-2xl overflow-hidden print:shadow-none print:border-none">
        <CardContent className="p-8 sm:p-10 space-y-8">
          {/* Header */}
          <div className="text-center border-b border-slate-100 pb-6">
            <Badge variant="outline" className="mb-2 text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 border-emerald-200">
              Live Operational Diagnostic
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">School Disaster Preparedness Report</h2>
            <p className="text-base font-semibold text-slate-700 mt-1">{school.name}</p>
            <p className="text-xs text-slate-500">{school.address}, {school.district}, {school.state}</p>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">
              Generated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} • Real-Time Dynamic Aggregate
            </p>
          </div>

          {/* IDRI & Score Components */}
          <div className="grid md:grid-cols-2 gap-8 items-center bg-slate-50/60 p-6 rounded-2xl border border-slate-100">
            <div className="text-center flex flex-col items-center justify-center">
              <ScoreRing score={metrics.avgIDRI} size={150} />
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-3">
                Institutional Disaster Readiness Index (IDRI)
              </p>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full mt-1.5 ${
                metrics.avgIDRI >= 80
                  ? 'bg-emerald-100 text-emerald-800'
                  : metrics.avgIDRI >= 60
                  ? 'bg-amber-100 text-amber-800'
                  : metrics.avgIDRI > 0
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {metrics.avgIDRI >= 80 ? 'EXCELLENT' : metrics.avgIDRI >= 60 ? 'GOOD' : metrics.avgIDRI > 0 ? 'NEEDS IMPROVEMENT' : 'NO DATA YET'}
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Activity size={14} className="text-slate-500" /> Score Components (Live Calculation)
              </h3>
              <div className="space-y-2.5">
                {scoreComponents.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white border border-slate-200/70 shadow-2xs">
                    <span className="font-medium text-slate-700 flex items-center gap-2">
                      <span>{c.icon}</span> {c.name}
                    </span>
                    <span className="font-bold text-slate-900">
                      {c.score}% <span className="text-[10px] text-slate-400 font-normal">({c.weight}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-slate-500" /> Live Cohort Metrics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                <p className="text-3xl font-extrabold text-slate-900">
                  {metrics.studentsTrained}/{metrics.totalStudents}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">Students Trained</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                <p className="text-3xl font-extrabold text-slate-900">
                  {activeTeachersCount}/{totalTeachers}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">Faculty Active</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                <p className="text-3xl font-extrabold text-slate-900">{totalAssessments}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Assessments Logged</p>
              </div>
            </div>
          </div>

          {/* Weaknesses Identified */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-500" /> Vulnerabilities & Weaknesses
            </h3>
            {dynamicWeaknesses.length === 0 ? (
              <div className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>No vulnerability gaps or decision mistakes recorded in completed student assessments.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {dynamicWeaknesses.map((w, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs">
                    <span className="text-rose-600 font-bold px-2 py-0.5 bg-rose-100 rounded-md shrink-0">
                      {w.impact}
                    </span>
                    <div>
                      <p className="font-bold text-rose-900">{w.area}</p>
                      <p className="text-[11px] text-rose-700 mt-0.5">{w.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Actions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <BookOpen size={14} className="text-slate-500" /> Recommended Interventions
            </h3>
            <div className="space-y-2">
              {dynamicRecommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {i + 1}
                  </span>
                  <span className="font-medium pt-0.5">{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hazard Breakdown Footer */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Hazard Proficiency Spectrum
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase">🔥 Fire Safety</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">{metrics.fire}%</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase">🫨 Earthquake</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">{metrics.earthquake}%</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase">🌊 Flood Hazard</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">{metrics.flood}%</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase">🏃 Evacuation</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">{metrics.evacuation}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminReportsPage() {
  return (
    <DashboardLayout requiredRole="admin">
      <ReportsContent />
    </DashboardLayout>
  );
}
