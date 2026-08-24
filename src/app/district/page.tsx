'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ScoreRing from '@/components/shared/ScoreRing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDistrictStore, useStudentProgressStore } from '@/lib/store';
import { DistrictSchoolSummary } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  School,
  Users,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Building,
  GraduationCap,
  Sparkles,
  Calendar,
  X,
  RotateCcw
} from 'lucide-react';
import dynamic from 'next/dynamic';

const DistrictCharts = dynamic(() => import('@/components/dashboard/DistrictCharts'), { ssr: false });

function DistrictContent() {
  const { schools, addSchool, deleteSchool, resetSchools } = useDistrictStore();
  const { getSchoolMetrics } = useStudentProgressStore();

  const schoolMetrics = React.useMemo(() => getSchoolMetrics(), [getSchoolMetrics]);

  // Merge live school metrics for primary school
  const liveSchools = React.useMemo(() => {
    return schools.map(s => {
      if (s.schoolId === 'school-001') {
        return {
          ...s,
          preparednessScore: schoolMetrics.avgIDRI,
          studentsTotal: schoolMetrics.totalStudents,
          studentsTrained: schoolMetrics.studentsTrained,
          riskLevel: schoolMetrics.avgIDRI >= 80 ? 'low' : schoolMetrics.avgIDRI >= 60 ? 'medium' : 'high',
        } as DistrictSchoolSummary;
      }
      return s;
    });
  }, [schools, schoolMetrics]);

  // State for Add School form / modal
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields
  const [schoolName, setSchoolName] = useState('');
  const [district, setDistrict] = useState('Ludhiana');
  const [studentsTotal, setStudentsTotal] = useState<number | ''>(650);
  const [studentsTrained, setStudentsTrained] = useState<number | ''>(420);
  const [teachersTrained, setTeachersTrained] = useState<number | ''>(28);
  const [drillsCompleted, setDrillsCompleted] = useState<number | ''>(3);
  const [preparednessScore, setPreparednessScore] = useState<number>(75);
  const [lastDrillDate, setLastDrillDate] = useState('2026-08-15');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [autoRisk, setAutoRisk] = useState(true);

  // Auto calculate risk level when preparedness score changes
  const handleScoreChange = (score: number) => {
    setPreparednessScore(score);
    if (autoRisk) {
      if (score >= 80) setRiskLevel('low');
      else if (score >= 60) setRiskLevel('medium');
      else setRiskLevel('high');
    }
  };

  const handleQuickPrefill = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setSchoolName(`St. Xavier's Model School #${randomSuffix}`);
    setDistrict('Ludhiana');
    setStudentsTotal(880);
    setStudentsTrained(690);
    setTeachersTrained(34);
    setDrillsCompleted(5);
    setPreparednessScore(86);
    setLastDrillDate('2026-08-21');
    setRiskLevel('low');
  };

  const handleResetForm = () => {
    setSchoolName('');
    setStudentsTotal(650);
    setStudentsTrained(420);
    setTeachersTrained(28);
    setDrillsCompleted(3);
    setPreparednessScore(75);
    setLastDrillDate('2026-08-15');
    setRiskLevel('medium');
    setAutoRisk(true);
  };

  const handleAddSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) return;

    const totalStud = Number(studentsTotal) || 0;
    const trainedStud = Math.min(Number(studentsTrained) || 0, totalStud);
    const teachers = Number(teachersTrained) || 0;
    const drills = Number(drillsCompleted) || 0;

    const newSchool: DistrictSchoolSummary = {
      schoolId: `school-${Date.now()}`,
      schoolName: schoolName.trim(),
      district: district.trim() || 'Ludhiana',
      preparednessScore: Number(preparednessScore),
      studentsTotal: totalStud,
      studentsTrained: trainedStud,
      teachersTrained: teachers,
      drillsCompleted: drills,
      lastDrillDate: lastDrillDate || new Date().toISOString().split('T')[0],
      riskLevel: riskLevel,
    };

    addSchool(newSchool);
    setSuccessMessage(`School "${newSchool.schoolName}" successfully added!`);
    handleResetForm();
    setShowAddForm(false);
  };

  // Filtered schools
  const filteredSchools = liveSchools.filter((s) => {
    const matchesSearch = s.schoolName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || s.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  // Dynamic calculated metrics
  const totalStudents = liveSchools.reduce((sum, s) => sum + s.studentsTotal, 0);
  const totalTrained = liveSchools.reduce((sum, s) => sum + s.studentsTrained, 0);
  const avgPrep = liveSchools.length > 0 ? Math.round(liveSchools.reduce((sum, s) => sum + s.preparednessScore, 0) / liveSchools.length) : 0;
  const highRisk = liveSchools.filter((s) => s.riskLevel === 'high').length;

  const metrics = [
    { label: 'Schools Monitored', value: schools.length, icon: <School size={18} />, color: 'text-[#3A6947] bg-[#E3EFE8]' },
    { label: 'Total Students', value: totalStudents.toLocaleString(), icon: <Users size={18} />, color: 'text-[#0284C7] bg-[#E0F2FE]' },
    { label: 'Students Trained', value: `${totalTrained.toLocaleString()} (${totalStudents > 0 ? Math.round((totalTrained / totalStudents) * 100) : 0}%)`, icon: <CheckCircle2 size={18} />, color: 'text-[#4A845A] bg-[#F2F7F4]' },
    { label: 'High-Risk Schools', value: highRisk, icon: <AlertTriangle size={18} />, color: 'text-[#DB2777] bg-[#FCE7F3]' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">District Authority Dashboard</h1>
          <p className="text-slate-500 text-sm">Ludhiana District — School Preparedness & Institution Registry</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="gap-2 bg-[#4A845A] hover:bg-[#3A6947] text-white shadow-sm shadow-[#4A845A]/20"
          >
            {showAddForm ? <X size={16} /> : <Plus size={16} />}
            {showAddForm ? 'Close Add Panel' : 'Add School'}
          </Button>
        </div>
      </div>

      {/* ── Success Toast Banner ── */}
      {successMessage && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50/90 text-emerald-800 px-4 py-3 text-sm flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-900">
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── Add School Section / Form ── */}
      {showAddForm && (
        <Card className="border border-[#A8CEAC] bg-gradient-to-br from-[#F2F7F4]/90 via-white to-[#E0F2FE]/30 shadow-md rounded-2xl overflow-hidden animate-in fade-in zoom-in-98 duration-200">
          <CardHeader className="bg-[#E3EFE8]/50 border-b border-[#C7DFC9]/60 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#4A845A] text-white flex items-center justify-center shadow-xs">
                  <Building size={18} />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-800">Register New School into District</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Add an educational institution to monitor disaster readiness and IDRI benchmarks
                  </CardDescription>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleQuickPrefill}
                className="text-xs gap-1.5 border-[#A8CEAC] text-[#3A6947] hover:bg-[#E3EFE8] bg-white"
              >
                <Sparkles size={13} className="text-[#0284C7]" /> Pre-fill Sample
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleAddSchoolSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* School Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    School / Institution Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Guru Nanak Public Senior Secondary School"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4A845A]/20 focus:border-[#4A845A] transition-all"
                  />
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">District / Region</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Ludhiana"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4A845A]/20 focus:border-[#4A845A] transition-all"
                  />
                </div>

                {/* Total Students */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Total Enrolled Students <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={studentsTotal}
                    onChange={(e) => setStudentsTotal(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4A845A]/20 focus:border-[#4A845A] transition-all"
                  />
                </div>

                {/* Students Trained */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Students Trained</label>
                  <input
                    type="number"
                    min={0}
                    max={Number(studentsTotal) || undefined}
                    value={studentsTrained}
                    onChange={(e) => setStudentsTrained(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4A845A]/20 focus:border-[#4A845A] transition-all"
                  />
                </div>

                {/* Teachers Trained */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Staff / Teachers Trained</label>
                  <input
                    type="number"
                    min={0}
                    value={teachersTrained}
                    onChange={(e) => setTeachersTrained(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4A845A]/20 focus:border-[#4A845A] transition-all"
                  />
                </div>

                {/* Drills Completed */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Disaster Drills Conducted</label>
                  <input
                    type="number"
                    min={0}
                    value={drillsCompleted}
                    onChange={(e) => setDrillsCompleted(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4A845A]/20 focus:border-[#4A845A] transition-all"
                  />
                </div>

                {/* Last Drill Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Last Drill Conducted</label>
                  <input
                    type="date"
                    value={lastDrillDate}
                    onChange={(e) => setLastDrillDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4A845A]/20 focus:border-[#4A845A] transition-all"
                  />
                </div>

                {/* Risk Level */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Risk Assessment</label>
                    <button
                      type="button"
                      onClick={() => setAutoRisk(!autoRisk)}
                      className="text-[10px] text-[#0284C7] hover:underline"
                    >
                      {autoRisk ? 'Auto (Based on Score)' : 'Manual'}
                    </button>
                  </div>
                  <select
                    value={riskLevel}
                    onChange={(e) => {
                      setAutoRisk(false);
                      setRiskLevel(e.target.value as 'low' | 'medium' | 'high');
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4A845A]/20 focus:border-[#4A845A] transition-all"
                  >
                    <option value="low">🟢 Low Risk (Score ≥ 80%)</option>
                    <option value="medium">🟡 Medium Risk (Score 60-79%)</option>
                    <option value="high">🔴 High Risk (Score &lt; 60%)</option>
                  </select>
                </div>
              </div>

              {/* Preparedness Score Slider */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold text-slate-700">Initial Preparedness Score:</span>{' '}
                    <span className="text-sm font-bold text-[#4A845A]">{preparednessScore}%</span>
                  </div>
                  <Badge
                    className={`text-xs ${
                      preparednessScore >= 80
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : preparednessScore >= 60
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    {preparednessScore >= 80 ? 'Ready / High' : preparednessScore >= 60 ? 'Moderate' : 'Action Required'}
                  </Badge>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={preparednessScore}
                  onChange={(e) => handleScoreChange(Number(e.target.value))}
                  className="w-full accent-[#4A845A] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0% (Critical)</span>
                  <span>50% (Standard)</span>
                  <span>100% (Fully Prepared)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetForm}
                  className="text-slate-600 gap-1.5"
                >
                  <RotateCcw size={14} /> Reset
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#4A845A] hover:bg-[#3A6947] text-white gap-1.5 shadow-sm shadow-[#4A845A]/20 px-5"
                >
                  <Plus size={15} /> Save &amp; Register School
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ── Metrics Cards ── */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="card-hover border-border/60 bg-white/90 backdrop-blur-xs">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${m.color}`}>
                {m.icon}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">{m.label}</p>
                <p className="text-xl font-bold text-slate-800">{m.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── District Average & Charts ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="card-hover border-border/60 bg-white/90 backdrop-blur-xs">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">District Average</p>
            <ScoreRing score={avgPrep} />
            <p className="text-xs text-slate-400 mt-4 text-center">
              Aggregated from {schools.length} active educational institutions
            </p>
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <DistrictCharts schools={schools} />
        </div>
      </div>

      {/* ── Schools Table ── */}
      <Card className="border-border/60 bg-white/90 backdrop-blur-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>All Schools Monitored</span>
                <Badge variant="outline" className="text-xs text-[#3A6947] border-[#C7DFC9] bg-[#F2F7F4]">
                  {filteredSchools.length} of {schools.length}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Detailed preparedness scores, training metrics, and drill status
              </CardDescription>
            </div>

            {/* Filter and Search */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="relative min-w-[200px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search schools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-8 pr-3 py-1.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#4A845A]/20 focus:border-[#4A845A] transition-all"
                />
              </div>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as any)}
                className="rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs outline-none focus:bg-white text-slate-700"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>

              {!showAddForm && (
                <Button
                  size="sm"
                  onClick={() => setShowAddForm(true)}
                  className="text-xs gap-1 bg-[#4A845A] hover:bg-[#3A6947] text-white shadow-2xs"
                >
                  <Plus size={13} /> Add School
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                  <TableHead className="font-semibold text-xs">School Name</TableHead>
                  <TableHead className="font-semibold text-xs">District</TableHead>
                  <TableHead className="font-semibold text-xs">Preparedness Score</TableHead>
                  <TableHead className="font-semibold text-xs">Students Trained</TableHead>
                  <TableHead className="font-semibold text-xs">Drills</TableHead>
                  <TableHead className="font-semibold text-xs">Last Drill</TableHead>
                  <TableHead className="font-semibold text-xs">Risk Level</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-400 text-sm">
                      No schools match your search or filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchools.map((school) => (
                    <TableRow key={school.schoolId} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium text-slate-800">
                        <div className="flex items-center gap-2">
                          <School size={15} className="text-[#4A845A] shrink-0" />
                          <span>{school.schoolName}</span>
                          {school.schoolId.startsWith('school-') && Number(school.schoolId.split('-')[1]) > 1000 && (
                            <Badge className="text-[9px] px-1.5 py-0 bg-emerald-100 text-emerald-800 border-0">
                              NEW
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{school.district}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="h-2 w-20 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                school.preparednessScore >= 80
                                  ? 'bg-[#10B981]'
                                  : school.preparednessScore >= 60
                                  ? 'bg-[#F59E0B]'
                                  : 'bg-[#EF4444]'
                              }`}
                              style={{ width: `${school.preparednessScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{school.preparednessScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {school.studentsTrained.toLocaleString()} / {school.studentsTotal.toLocaleString()}
                        <span className="text-[10px] text-slate-400 ml-1">
                          ({Math.round((school.studentsTrained / (school.studentsTotal || 1)) * 100)}%)
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-700">{school.drillsCompleted}</TableCell>
                      <TableCell className="text-xs text-slate-500 flex items-center gap-1.5 pt-3.5">
                        <Calendar size={12} className="text-slate-400" />
                        <span>{school.lastDrillDate}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-[10px] capitalize font-medium ${
                            school.riskLevel === 'high'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : school.riskLevel === 'medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {school.riskLevel} Risk
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => deleteSchool(school.schoolId)}
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove school"
                        >
                          <Trash2 size={13} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DistrictPage() {
  return (
    <DashboardLayout requiredRole="district">
      <DistrictContent />
    </DashboardLayout>
  );
}
