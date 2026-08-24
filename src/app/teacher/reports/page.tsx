'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ScoreRing from '@/components/shared/ScoreRing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore, useStudentProgressStore } from '@/lib/store';
import { getClassesByTeacher } from '@/lib/data';
import { Printer, TrendingUp, Users, Award, AlertTriangle, CheckCircle2 } from 'lucide-react';

function ReportsContent() {
  const { user } = useAuthStore();
  const {
    studentProgress,
    registeredStudents,
    getDomainProficiencies,
    quizAttempts,
    simulationAttempts,
    initData,
  } = useStudentProgressStore();

  React.useEffect(() => {
    initData();
  }, [initData]);

  if (!user) return null;

  const teacherClasses = getClassesByTeacher(user.id);
  const classIds = teacherClasses.map(c => c.id);

  // Filter students assigned to this teacher
  const cohortStudents = registeredStudents.filter(s => s.classId && classIds.includes(s.classId));
  const cohortStudentIds = cohortStudents.map(s => s.id);

  const trainedStudents = cohortStudents.filter(s => {
    const p = studentProgress[s.id];
    return p && (p.completedModules.length > 0 || p.completedSimulations.length > 0 || p.overall > 0);
  });

  let totalScore = 0;
  trainedStudents.forEach(s => {
    totalScore += (studentProgress[s.id]?.overall || 0);
  });

  const avgIDRI = trainedStudents.length > 0
    ? Math.round(totalScore / trainedStudents.length)
    : 0;

  const domains = getDomainProficiencies(cohortStudentIds);

  const cohortQuizAttempts = quizAttempts.filter(q => cohortStudentIds.includes(q.userId));
  const cohortSimAttempts = simulationAttempts.filter(s => cohortStudentIds.includes(s.userId));
  const totalCohortAssessments = cohortQuizAttempts.length + cohortSimAttempts.length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Class Cohort Report</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Real-time disaster readiness and diagnostic assessment report for your assigned sections</p>
        </div>
        <Button
          variant="outline"
          className="gap-2 text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
          onClick={() => window.print()}
        >
          <Printer size={14} /> Print Report
        </Button>
      </div>

      <Card className="border-slate-200/80 bg-white/95 shadow-sm rounded-2xl overflow-hidden print:shadow-none print:border-none">
        <CardContent className="p-8 sm:p-10 space-y-8">
          {/* Header */}
          <div className="text-center border-b border-slate-100 pb-6">
            <Badge variant="outline" className="mb-2 text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 border-emerald-200">
              Teacher Roster Diagnostics
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Class Cohort Readiness Summary</h2>
            <p className="text-base font-semibold text-slate-700 mt-1">{user.name} — {teacherClasses.map(c => c.name).join(', ')}</p>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">
              Generated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} • Live Cohort Data
            </p>
          </div>

          {/* IDRI & Hazard Scores */}
          <div className="grid md:grid-cols-2 gap-8 items-center bg-slate-50/60 p-6 rounded-2xl border border-slate-100">
            <div className="text-center flex flex-col items-center justify-center">
              <ScoreRing score={avgIDRI} size={150} />
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-3">
                Cohort Disaster Readiness Index
              </p>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full mt-1.5 ${
                avgIDRI >= 80
                  ? 'bg-emerald-100 text-emerald-800'
                  : avgIDRI >= 60
                  ? 'bg-amber-100 text-amber-800'
                  : avgIDRI > 0
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {avgIDRI >= 80 ? 'EXCELLENT' : avgIDRI >= 60 ? 'GOOD' : avgIDRI > 0 ? 'NEEDS IMPROVEMENT' : 'NO DATA YET'}
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Cohort Domain Proficiencies
              </h3>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-white border border-slate-200/70">
                  <span className="font-medium text-slate-700 flex items-center gap-2">🔥 Fire Safety</span>
                  <span className="font-bold text-slate-900">{domains.fire}%</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-white border border-slate-200/70">
                  <span className="font-medium text-slate-700 flex items-center gap-2">🫨 Earthquake Protocol</span>
                  <span className="font-bold text-slate-900">{domains.earthquake}%</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-white border border-slate-200/70">
                  <span className="font-medium text-slate-700 flex items-center gap-2">🌊 Flood Safety</span>
                  <span className="font-bold text-slate-900">{domains.flood}%</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-white border border-slate-200/70">
                  <span className="font-medium text-slate-700 flex items-center gap-2">🏃 Evacuation Decisions</span>
                  <span className="font-bold text-slate-900">{domains.evacuation}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
              <p className="text-3xl font-extrabold text-slate-900">
                {trainedStudents.length}/{cohortStudents.length}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">Students Trained</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
              <p className="text-3xl font-extrabold text-slate-900">{totalCohortAssessments}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Assessments Completed</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
              <p className="text-3xl font-extrabold text-slate-900">{teacherClasses.length}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Assigned Class Sections</p>
            </div>
          </div>

          {/* Student Breakdown Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Individual Student Readiness Records
            </h3>
            {cohortStudents.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                No students enrolled in this cohort yet.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                    <tr>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Class</th>
                      <th className="p-3">IDRI Score</th>
                      <th className="p-3">Modules Completed</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cohortStudents.map(s => {
                      const p = studentProgress[s.id];
                      const score = p?.overall || 0;
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-semibold text-slate-800">{s.name}</td>
                          <td className="p-3 text-slate-600">{s.classId ? s.classId.replace('class-', '').toUpperCase() : 'N/A'}</td>
                          <td className="p-3 font-bold text-slate-800">{score}%</td>
                          <td className="p-3 text-slate-600">{p?.completedModules.length || 0}/3</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {score >= 80 ? 'Certified Safe' : 'Needs Practice'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TeacherReportsPage() {
  return (
    <DashboardLayout requiredRole="teacher">
      <ReportsContent />
    </DashboardLayout>
  );
}
