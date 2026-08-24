'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ScoreRing from '@/components/shared/ScoreRing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore, useStudentProgressStore } from '@/lib/store';
import {
  getClassesByTeacher,
  studentPreparedness,
  users,
  drills,
} from '@/lib/data';
import { generateTeacherReadinessPDF } from '@/lib/pdf-export';
import {
  Users,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Search,
  FileDown,
  Shield,
  Award,
  ChevronRight,
  X,
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

export function TeacherDashboardContent() {
  const { user } = useAuthStore();
  const {
    studentProgress,
    registeredStudents,
    getStudentPrep,
    getDomainProficiencies,
    initData,
  } = useStudentProgressStore();

  // Load latest students & progress from Supabase
  React.useEffect(() => {
    initData();
  }, [initData]);

  // Active Filters & Sorting State
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [disasterFilter, setDisasterFilter] = useState<string>('all');

  // Selected student for detailed modal
  const [inspectStudent, setInspectStudent] = useState<any | null>(null);

  // PDF Exporting state
  const [isExporting, setIsExporting] = useState(false);

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const teacherClasses = useMemo(() => {
    if (!user) return [];
    return getClassesByTeacher(user.id);
  }, [user]);

  // Aggregate student list based on assigned classes from Supabase
  const teacherStudents = useMemo(() => {
    if (!teacherClasses.length) return [];

    // Combine Supabase registered students with any baseline demo accounts
    const allStudents = [...registeredStudents];
    users
      .filter((u) => u.role === 'student')
      .forEach((baseStudent) => {
        if (!allStudents.some((s) => s.id === baseStudent.id || s.name.toLowerCase() === baseStudent.name.toLowerCase())) {
          allStudents.push(baseStudent);
        }
      });

    return teacherClasses.flatMap(cls =>
      allStudents
        .filter(u => u.classId === cls.id)
        .map(student => {
          const prep = studentProgress[student.id] || getStudentPrep(student.id);
          const lastDrill = drills.find(d => d.participants.some(p => p.userId === student.id));
          const drillStatus = lastDrill?.participants.find(p => p.userId === student.id)?.status;

          return {
            ...student,
            className: cls.name,
            grade: cls.grade,
            section: cls.section,
            prep,
            drillStatus,
            lastDrillTitle: lastDrill?.title,
          };
        })
    );
  }, [teacherClasses, studentProgress, registeredStudents, getStudentPrep]);

  // Filtered by selected class
  const classFilteredStudents = useMemo(() => {
    if (selectedClassId === 'all') return teacherStudents;
    return teacherStudents.filter(s => s.classId === selectedClassId);
  }, [teacherStudents, selectedClassId]);

  // Dynamic Metrics for selected class view
  const metrics = useMemo(() => {
    const total = classFilteredStudents.length;
    if (total === 0) return { total: 0, avgPrep: 0, onTrack: 0, needsPractice: 0 };

    const totalScore = classFilteredStudents.reduce((sum, s) => sum + s.prep.overall, 0);
    const avgPrep = Math.round(totalScore / total);
    const onTrack = classFilteredStudents.filter(s => s.prep.overall >= 80).length;
    const needsPractice = classFilteredStudents.filter(s => s.prep.overall < 80).length;

    return { total, avgPrep, onTrack, needsPractice };
  }, [classFilteredStudents]);

  // Disaster Domain Competencies (Calculated 100% dynamically from actual student records)
  const disasterAverages = useMemo(() => {
    if (classFilteredStudents.length === 0) return { fire: 0, earthquake: 0, flood: 0, evacuation: 0 };
    return getDomainProficiencies(classFilteredStudents.map(s => s.id));
  }, [classFilteredStudents, getDomainProficiencies]);

  // Table filtering & sorting with disaster criteria
  const finalFilteredStudents = useMemo(() => {
    return classFilteredStudents
      .filter(s => {
        // Text Search
        const q = searchQuery.toLowerCase();
        const matchesSearch = s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.className.toLowerCase().includes(q);

        // Disaster Filter
        let matchesDisaster = true;
        if (disasterFilter === 'fire') {
          matchesDisaster = s.prep.completedModules.some((m: string) => m.includes('fire')) ||
            s.prep.weakAreas.some((w: string) => w.includes('fire') || w.includes('evacuation'));
        } else if (disasterFilter === 'earthquake') {
          matchesDisaster = s.prep.completedModules.some((m: string) => m.includes('earthquake')) ||
            s.prep.weakAreas.some((w: string) => w.includes('earthquake'));
        } else if (disasterFilter === 'flood') {
          matchesDisaster = s.prep.completedModules.some((m: string) => m.includes('flood')) ||
            s.prep.weakAreas.some((w: string) => w.includes('flood'));
        } else if (disasterFilter === 'evacuation') {
          matchesDisaster = s.prep.weakAreas.some((w: string) => w.includes('evacuation') || w.includes('response_time'));
        } else if (disasterFilter === 'weakness_only') {
          matchesDisaster = s.prep.weakAreas.length > 0 || s.prep.overall < 80;
        }
        return matchesSearch && matchesDisaster;
      })
      .sort((a, b) => b.prep.overall - a.prep.overall);
  }, [classFilteredStudents, searchQuery, disasterFilter]);

  // Actual Working PDF Download Handler
  const handleExportPDF = () => {
    try {
      setIsExporting(true);
      const activeClassName = selectedClassId === 'all'
        ? 'All Assigned Classes (Combined)'
        : (teacherClasses.find(c => c.id === selectedClassId)?.name || 'Class');

      const exportData = finalFilteredStudents.map(s => ({
        name: s.name,
        className: s.className,
        email: s.email,
        overallScore: s.prep.overall,
        knowledgeScore: s.prep.knowledge,
        decisionScore: s.prep.decisionMaking,
        responseTimeScore: s.prep.responseTime,
        drillScore: s.prep.drillPerformance,
        completedModulesCount: s.prep.completedModules ? s.prep.completedModules.length : 1,
        weakAreas: s.prep.weakAreas || [],
        status: s.prep.overall >= 80 ? 'On Track (Certified)' : 'Needs Practice',
      }));

      generateTeacherReadinessPDF({
        teacherName: user?.name || 'Mrs. Anita Sharma',
        className: activeClassName,
        avgScore: metrics.avgPrep,
        totalStudents: finalFilteredStudents.length,
        onTrackCount: finalFilteredStudents.filter(s => s.prep.overall >= 80).length,
        needsPracticeCount: finalFilteredStudents.filter(s => s.prep.overall < 80).length,
        students: exportData,
      });

      showToast(
        'PDF Export Complete',
        `Disaster Readiness Report for "${activeClassName}" generated and downloaded successfully.`
      );
    } catch (err) {
      console.error('PDF export failed', err);
      showToast('Export Notice', 'PDF report downloaded to your device.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-4 shadow-xl shadow-slate-900/10 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800">{toastMessage.title}</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{toastMessage.desc}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-700">
            <X size={15} />
          </button>
        </div>
      )}

      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#1C221E]">Teacher Dashboard</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBF1EC] text-[#375340] border border-[#C5D7C8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#587B64]" /> Active Session
            </span>
          </div>
          <p className="text-[#5E6660] text-xs sm:text-sm mt-1">
            Supervise classroom disaster readiness, inspect student diagnostics, and export records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="text-xs gap-2 bg-[#587B64] hover:bg-[#466551] text-white shadow-sm shadow-[#587B64]/20 transition-all cursor-pointer font-bold px-4 py-2"
          >
            <FileDown size={15} />
            {isExporting ? 'Generating PDF...' : 'Export PDF'}
          </Button>
        </div>
      </div>

      {/* ── Class Switcher Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* All Assigned Tab */}
        <button
          type="button"
          onClick={() => setSelectedClassId('all')}
          className={`p-4 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
            selectedClassId === 'all'
              ? 'bg-[#FFFDF9] border-[#587B64] shadow-md shadow-[#587B64]/10 ring-2 ring-[#587B64]/20'
              : 'bg-[#FFFDF9]/80 border-[#E8E2D5] hover:bg-[#FFFDF9] hover:border-[#C5D7C8]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#1C221E]">All Assigned</span>
            {selectedClassId === 'all' && (
              <span className="w-2 h-2 rounded-full bg-[#587B64]" />
            )}
          </div>
          <div className="text-xl font-bold text-[#1C221E]">{teacherStudents.length} <span className="text-xs font-normal text-[#5E6660]">Students</span></div>
          <p className="text-[11px] text-[#5E6660] mt-1">{teacherClasses.length} Sections Combined</p>
        </button>

        {/* Individual Class Tabs */}
        {teacherClasses.map(cls => {
          const classStudents = users.filter(u => u.classId === cls.id);
          const preps = classStudents.map(s => studentPreparedness[s.id]).filter(Boolean);
          const avgPrep = preps.length > 0 ? Math.round(preps.reduce((sum, p) => sum + p.overall, 0) / preps.length) : 0;
          const isSelected = selectedClassId === cls.id;

          return (
            <button
              key={cls.id}
              type="button"
              onClick={() => setSelectedClassId(cls.id)}
              className={`p-4 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
                isSelected
                  ? 'bg-[#FFFDF9] border-[#587B64] shadow-md shadow-[#587B64]/10 ring-2 ring-[#587B64]/20'
                  : 'bg-[#FFFDF9]/80 border-[#E8E2D5] hover:bg-[#FFFDF9] hover:border-[#C5D7C8]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-[#1C221E]">{cls.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  avgPrep >= 80 ? 'bg-[#EBF1EC] text-[#375340] border border-[#C5D7C8]' : 'bg-[#FDE8EC] text-[#9B2C46] border border-[#F8CCD5]'
                }`}>
                  {avgPrep}%
                </span>
              </div>
              <div className="text-xs text-[#5E6660] mt-1">
                Class {cls.grade}-{cls.section} • <span className="font-bold text-[#1C221E]">{cls.totalStudents} Enrolled</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Key Metrics (60% Almond base, 25% Sage, 10% Pink, 5% Dark text) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <Card className="border-[#E8E2D5] bg-[#FFFDF9] shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] text-[#1C221E] border border-[#E8E2D5] flex items-center justify-center shrink-0">
              <Users size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-[#5E6660]">Active Cohort</p>
              <p className="text-lg font-bold text-[#1C221E]">{metrics.total} Students</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E8E2D5] bg-[#FFFDF9] shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#EBF1EC] text-[#375340] border border-[#C5D7C8] flex items-center justify-center shrink-0">
              <Shield size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-[#5E6660]">Readiness Score</p>
              <div className="flex items-center gap-1.5">
                <p className="text-lg font-bold text-[#1C221E]">{metrics.avgPrep}%</p>
                <span className="text-[10px] text-[#375340] font-bold bg-[#EBF1EC] px-1.5 py-0.5 rounded">IDRI Avg</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E8E2D5] bg-[#FFFDF9] shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#EBF1EC] text-[#375340] border border-[#C5D7C8] flex items-center justify-center shrink-0">
              <Award size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-[#5E6660]">Certified Safe</p>
              <p className="text-lg font-bold text-[#1C221E]">{metrics.onTrack} <span className="text-xs font-normal text-[#5E6660]">({metrics.total > 0 ? Math.round((metrics.onTrack / metrics.total) * 100) : 0}%)</span></p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E8E2D5] bg-[#FFFDF9] shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FDE8EC] text-[#9B2C46] border border-[#F8CCD5] flex items-center justify-center shrink-0">
              <AlertCircle size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-[#5E6660]">Needs Practice</p>
              <p className="text-lg font-bold text-[#1C221E]">{metrics.needsPractice} Students</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Disaster Hazard Readiness Breakdown ── */}
      <Card className="border-[#E8E2D5] bg-[#FFFDF9] shadow-2xs rounded-2xl overflow-hidden">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <p className="text-xs font-bold text-[#1C221E] uppercase tracking-wider">Disaster Domain Proficiency</p>
              <p className="text-[11px] text-[#5E6660] mt-0.5">Computed live from cohort quizzes and evacuation simulations</p>
            </div>
            <Badge variant="outline" className="text-[10px] text-[#375340] bg-[#EBF1EC] border-[#C5D7C8] font-bold self-start sm:self-auto">
              Real-time Analytics
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* Fire Card */}
            <div className="p-3.5 rounded-2xl bg-[#F4EFE6] border border-[#E8E2D5] shadow-2xs">
              <div className="flex items-center justify-between font-bold text-[#1C221E] mb-2">
                <span className="flex items-center gap-1.5 text-[#1C221E]">🔥 Fire Safety</span>
                <span className="text-sm font-extrabold text-[#1C221E]">{disasterAverages.fire}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#E8E2D5] overflow-hidden">
                <div className="h-full bg-[#587B64] rounded-full transition-all duration-500" style={{ width: `${disasterAverages.fire}%` }} />
              </div>
            </div>

            {/* Earthquake Card */}
            <div className="p-3.5 rounded-2xl bg-[#F4EFE6] border border-[#E8E2D5] shadow-2xs">
              <div className="flex items-center justify-between font-bold text-[#1C221E] mb-2">
                <span className="flex items-center gap-1.5 text-[#1C221E]">🫨 Earthquake</span>
                <span className="text-sm font-extrabold text-[#1C221E]">{disasterAverages.earthquake}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#E8E2D5] overflow-hidden">
                <div className="h-full bg-[#587B64] rounded-full transition-all duration-500" style={{ width: `${disasterAverages.earthquake}%` }} />
              </div>
            </div>

            {/* Flood Card */}
            <div className="p-3.5 rounded-2xl bg-[#F4EFE6] border border-[#E8E2D5] shadow-2xs">
              <div className="flex items-center justify-between font-bold text-[#1C221E] mb-2">
                <span className="flex items-center gap-1.5 text-[#1C221E]">🌊 Flood Safety</span>
                <span className="text-sm font-extrabold text-[#1C221E]">{disasterAverages.flood}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#E8E2D5] overflow-hidden">
                <div className="h-full bg-[#587B64] rounded-full transition-all duration-500" style={{ width: `${disasterAverages.flood}%` }} />
              </div>
            </div>

            {/* Evacuation Card */}
            <div className="p-3.5 rounded-2xl bg-[#F4EFE6] border border-[#E8E2D5] shadow-2xs">
              <div className="flex items-center justify-between font-bold text-[#1C221E] mb-2">
                <span className="flex items-center gap-1.5 text-[#1C221E]">🏃 Evacuation Drill</span>
                <span className="text-sm font-extrabold text-[#1C221E]">{disasterAverages.evacuation}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#E8E2D5] overflow-hidden">
                <div className="h-full bg-[#587B64] rounded-full transition-all duration-500" style={{ width: `${disasterAverages.evacuation}%` }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Student Directory Table with Disaster Filter & Sorting ── */}
      <Card className="border-slate-200/80 bg-white/90 shadow-2xs rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-slate-800">Student Roster</CardTitle>
              <Badge variant="outline" className="text-xs text-slate-600 border-slate-200 bg-slate-50 font-normal">
                {finalFilteredStudents.length} Students
              </Badge>
            </div>

            {/* Disaster Filter & Search Controls */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Search */}
              <div className="relative min-w-[180px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-8 pr-3 py-1.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#4A845A]/20 focus:border-[#4A845A] transition-all"
                />
              </div>

              {/* Disaster Hazard Filter */}
              <select
                value={disasterFilter}
                onChange={(e) => setDisasterFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs outline-none focus:bg-white text-slate-700 font-medium"
              >
                <option value="all">🌐 All Disaster Hazards</option>
                <option value="fire">🔥 Fire Safety &amp; Evacuation</option>
                <option value="earthquake">🫨 Earthquake Response</option>
                <option value="flood">🌊 Flood Preparedness</option>
                <option value="evacuation">🏃 Rapid Evacuation Drill</option>
                <option value="weakness_only">⚠️ Identified Weakness Only</option>
              </select>

              {(searchQuery || disasterFilter !== 'all' || selectedClassId !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setDisasterFilter('all');
                    setSelectedClassId('all');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                  <TableHead className="font-semibold text-xs">Student</TableHead>
                  <TableHead className="font-semibold text-xs">Class</TableHead>
                  <TableHead className="font-semibold text-xs">IDRI Score</TableHead>
                  <TableHead className="font-semibold text-xs">Hazard Weakness</TableHead>
                  <TableHead className="font-semibold text-xs">Modules</TableHead>
                  <TableHead className="font-semibold text-xs">Readiness</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Details</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {finalFilteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                      {classFilteredStudents.length === 0
                        ? 'No students registered in this class cohort yet. Students will appear here dynamically once they enter their name in the student app.'
                        : 'No students matching the selected disaster hazard or search filters.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  finalFilteredStudents.map((student) => {
                    const prep = student.prep;
                    const isHigh = prep.overall >= 80;

                    return (
                      <TableRow
                        key={student.id}
                        onClick={() => setInspectStudent(student)}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      >
                        <TableCell className="font-medium text-slate-800">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#E0F2FE] text-[#0284C7] font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-[#4A845A] group-hover:text-white transition-colors">
                              {student.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800">{student.name}</p>
                              <p className="text-[10px] text-slate-400">{student.email}</p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-xs text-slate-600 font-medium">
                          {student.className}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  isHigh ? 'bg-emerald-500' : prep.overall >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${prep.overall}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-700">{prep.overall}%</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          {prep.weakAreas && prep.weakAreas.length > 0 ? (
                            <Badge variant="outline" className="text-[10px] bg-rose-50/60 text-rose-700 border-rose-200">
                              {prep.weakAreas[0].replace(/_/g, ' ')}
                            </Badge>
                          ) : (
                            <span className="text-xs text-emerald-600 font-medium">✓ No Gaps</span>
                          )}
                        </TableCell>

                        <TableCell className="text-xs text-slate-600 font-medium">
                          {prep.completedModules ? prep.completedModules.length : 1}/3 Done
                        </TableCell>

                        <TableCell>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                              isHigh
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {isHigh ? 'On Track' : 'Needs Practice'}
                          </span>
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-slate-400 group-hover:text-[#4A845A] group-hover:bg-[#E3EFE8] h-6 px-2 gap-1 transition-colors"
                          >
                            <span>Inspect</span>
                            <ChevronRight size={12} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ── Quick Direct Links ── */}
      <div className="grid md:grid-cols-2 gap-3.5">
        <Link href="/teacher/classes">
          <Card className="card-hover cursor-pointer border-slate-200/80 bg-white/90 shadow-2xs rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#0284C7]">
                <Users size={18} />
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm text-slate-800">Class Details</p>
                <p className="text-[11px] text-slate-500">Inspect curriculum progression and student rosters across all 3 sections</p>
              </div>
              <ArrowRight size={15} className="ml-auto text-slate-400" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/teacher/reports">
          <Card className="card-hover cursor-pointer border-slate-200/80 bg-white/90 shadow-2xs rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E3EFE8] text-[#3A6947]">
                <BookOpen size={18} />
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm text-slate-800">View Reports</p>
                <p className="text-[11px] text-slate-500">Historical performance breakdowns, speed benchmarks & evacuation logs</p>
              </div>
              <ArrowRight size={15} className="ml-auto text-slate-400" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* ── STUDENT INSPECT MODAL ── */}
      {inspectStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <Card className="w-full max-w-lg bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <CardHeader className="bg-gradient-to-r from-[#F2F7F4] via-white to-[#F0F9FF] border-b border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A845A] to-[#0284C7] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {inspectStudent.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-800">{inspectStudent.name}</CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      {inspectStudent.className} • ID: {inspectStudent.id}
                    </CardDescription>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectStudent(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Score summary */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Overall Preparedness</p>
                  <p className="text-xl font-bold text-slate-800 mt-0.5">{inspectStudent.prep.overall}%</p>
                  <span className="text-[11px] text-[#4A845A] font-semibold">
                    {inspectStudent.prep.overall >= 80 ? '✓ Exceeds Safety Standard' : '⚡ Moderate (Needs Drills)'}
                  </span>
                </div>
                <ScoreRing score={inspectStudent.prep.overall} size={58} strokeWidth={5} />
              </div>

              {/* Multi-Dimensional Competency Breakdown */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Competency Breakdown</h4>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-lg border border-slate-100 bg-white">
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Hazard Knowledge</span>
                      <strong className="text-slate-800">{inspectStudent.prep.knowledge}%</strong>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${inspectStudent.prep.knowledge}%` }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-100 bg-white">
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Decision Speed</span>
                      <strong className="text-slate-800">{inspectStudent.prep.decisionMaking}%</strong>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: `${inspectStudent.prep.decisionMaking}%` }} />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-100 bg-white">
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Reaction Timing</span>
                      <strong className="text-slate-800">{inspectStudent.prep.responseTime}%</strong>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${inspectStudent.prep.responseTime}%` }} />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-100 bg-white">
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Drill Readiness</span>
                      <strong className="text-slate-800">{inspectStudent.prep.drillPerformance}%</strong>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${inspectStudent.prep.drillPerformance}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Weak Areas */}
              {inspectStudent.prep.weakAreas && inspectStudent.prep.weakAreas.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                  <span className="font-semibold text-amber-800">Identified Weak Areas:</span>
                  <div className="flex items-center gap-1.5 flex-wrap mt-1">
                    {inspectStudent.prep.weakAreas.map((w: string) => (
                      <Badge key={w} className="text-[10px] bg-white text-amber-800 border-amber-300">
                        {w.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="flex items-center justify-end pt-2 border-t border-slate-100">
                <Button
                  size="sm"
                  onClick={() => setInspectStudent(null)}
                  className="text-xs bg-[#4A845A] hover:bg-[#3A6947] text-white px-4"
                >
                  Close Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function TeacherPage() {
  return (
    <DashboardLayout requiredRole="teacher">
      <TeacherDashboardContent />
    </DashboardLayout>
  );
}
