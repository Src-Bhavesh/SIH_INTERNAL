'use client';

import React, { useState, useMemo, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ScoreRing from '@/components/shared/ScoreRing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { school, drills } from '@/lib/data';
import { useStudentProgressStore } from '@/lib/store';
import { formatDate, getDisasterIcon } from '@/lib/utils';
import {
  Users, GraduationCap, CalendarClock, Clock, Shield, AlertTriangle,
  ArrowRight, Siren, X, CheckCircle2, CloudRain, Flame, Zap, Wind,
  Bell, Radio, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const RechartsCharts = dynamic(() => import('@/components/dashboard/AdminCharts'), { ssr: false });

// ── Simulated Alert Templates ────────────────────────────────────
type AlertType = 'weather' | 'drill' | 'emergency';
type AlertSeverity = 'info' | 'moderate' | 'high' | 'critical';
type AlertColor = 'sky' | 'amber' | 'red';

interface AlertTemplate {
  id: string;
  type: AlertType;
  icon: React.ReactNode;
  color: AlertColor;
  label: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  target: string;
}

const ALERT_TEMPLATES: AlertTemplate[] = [
  {
    id: 'weather-1', type: 'weather', icon: <CloudRain size={20} />, color: 'sky',
    label: 'Weather Alert', title: 'Severe Rainfall Advisory',
    message: 'Severe rainfall expected in your area. Avoid low-lying zones and keep emergency kits ready.',
    severity: 'moderate', target: 'All Buildings',
  },
  {
    id: 'weather-2', type: 'weather', icon: <Wind size={20} />, color: 'sky',
    label: 'Weather Alert', title: 'Strong Wind Warning',
    message: 'Wind speeds up to 80 km/h expected this afternoon. Secure loose objects and restrict outdoor activities.',
    severity: 'high', target: 'Outdoor Areas',
  },
  {
    id: 'drill-1', type: 'drill', icon: <Bell size={20} />, color: 'amber',
    label: 'Drill Alert', title: 'Fire Drill — 11:00 AM',
    message: 'Fire drill scheduled at 11:00 AM today. All students and staff must evacuate to Assembly Point A.',
    severity: 'info', target: 'All Sections',
  },
  {
    id: 'drill-2', type: 'drill', icon: <Zap size={20} />, color: 'amber',
    label: 'Drill Alert', title: 'Earthquake Drill — Drop Cover Hold',
    message: 'Earthquake preparedness drill begins in 5 minutes. Practice Drop → Cover → Hold On procedure.',
    severity: 'info', target: 'XII-A, XII-B, XI-A',
  },
  {
    id: 'emergency-1', type: 'emergency', icon: <Flame size={20} />, color: 'red',
    label: 'Emergency Alert', title: 'Emergency Mode — Block B',
    message: 'Emergency Mode activated for Building B. Fire detected near electrical panel. Evacuate immediately via Staircase B.',
    severity: 'critical', target: 'Block B — All Floors',
  },
  {
    id: 'emergency-2', type: 'emergency', icon: <Siren size={20} />, color: 'red',
    label: 'Emergency Alert', title: 'Immediate Evacuation Order',
    message: 'All students and staff must evacuate the main building immediately. Proceed calmly to Assembly Point A. Teachers take roll call.',
    severity: 'critical', target: 'Entire Campus',
  },
];

type SentAlert = {
  id: string;
  title: string;
  type: AlertType;
  label: string;
  target: string;
  sentAt: string;
};

const colorMap: Record<AlertColor, Record<string, string>> = {
  sky: {
    bg: 'bg-sky-50', border: 'border-sky-200',
    icon: 'bg-sky-100 text-sky-600', badge: 'bg-sky-100 text-sky-700',
    btn: 'bg-sky-600 hover:bg-sky-700 text-white',
  },
  amber: {
    bg: 'bg-amber-50', border: 'border-amber-200',
    icon: 'bg-amber-100 text-amber-600', badge: 'bg-amber-100 text-amber-700',
    btn: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  red: {
    bg: 'bg-red-50', border: 'border-red-200',
    icon: 'bg-red-100 text-red-600', badge: 'bg-red-100 text-red-700',
    btn: 'bg-red-600 hover:bg-red-700 text-white',
  },
};

function AlertSystemModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<AlertType>('drill');
  const [sentAlerts, setSentAlerts] = useState<SentAlert[]>([]);
  const [broadcasting, setBroadcasting] = useState<string | null>(null);
  const [justSent, setJustSent] = useState<string | null>(null);

  const tabs = [
    { id: 'weather' as AlertType, label: 'Weather', icon: <CloudRain size={13} /> },
    { id: 'drill' as AlertType, label: 'Drill', icon: <Bell size={13} /> },
    { id: 'emergency' as AlertType, label: 'Emergency', icon: <Siren size={13} /> },
  ];

  const filtered = ALERT_TEMPLATES.filter(t => t.type === activeTab);

  const handleBroadcast = (alert: AlertTemplate) => {
    if (broadcasting) return;
    setBroadcasting(alert.id);
    setTimeout(() => {
      setBroadcasting(null);
      setJustSent(alert.id);
      setSentAlerts(prev => [
        {
          id: alert.id + '-' + Date.now(),
          title: alert.title,
          type: alert.type,
          label: alert.label,
          target: alert.target,
          sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
      ]);
      setTimeout(() => setJustSent(null), 2500);
    }, 1800);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Radio size={16} />
            </div>
            <div>
              <h2 className="font-bold text-sm">Alert Broadcast System</h2>
              <p className="text-[11px] text-slate-300">⚠️ DEMO — Simulated notifications only</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[78vh] overflow-y-auto">
          {/* Tab Switcher */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? tab.id === 'emergency'
                      ? 'bg-red-600 text-white shadow-sm'
                      : tab.id === 'weather'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Alert Cards */}
          <div className="space-y-3">
            {filtered.map(alert => {
              const c = colorMap[alert.color];
              const isLoading = broadcasting === alert.id;
              const isDone = justSent === alert.id;
              return (
                <div key={alert.id} className={`rounded-xl border p-4 ${c.bg} ${c.border}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
                      {alert.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${c.badge}`}>
                          {alert.label}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">Target: {alert.target}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800">{alert.title}</p>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{alert.message}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Audience: All Campus Units</span>
                        <Button
                          size="sm"
                          disabled={isLoading || !!isDone}
                          onClick={() => handleBroadcast(alert)}
                          className={`text-xs h-7 px-3 rounded-lg font-bold gap-1.5 ${c.btn} cursor-pointer`}
                        >
                          {isLoading ? (
                            <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : isDone ? (
                            <>
                              <CheckCircle2 size={12} /> Broadcast Sent
                            </>
                          ) : (
                            <>
                              <Radio size={12} /> Dispatch Alert
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Broadcast Log */}
          {sentAlerts.length > 0 && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Session Dispatch Log</p>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {sentAlerts.map(sa => (
                  <div key={sa.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-700">{sa.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{sa.sentAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminDashboardContent() {
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const { getSchoolMetrics } = useStudentProgressStore();

  const schoolMetrics = useMemo(() => getSchoolMetrics(), [getSchoolMetrics]);

  const metrics = [
    { label: 'Students Trained', value: `${schoolMetrics.studentsTrained} / ${schoolMetrics.totalStudents}`, icon: <GraduationCap size={20} />, color: 'text-[#375340] bg-[#EBF1EC] border border-[#C5D7C8]' },
    { label: 'Faculty Active', value: `${schoolMetrics.studentsTrained > 0 ? 4 : 0} / 4`, icon: <Users size={20} />, color: 'text-[#375340] bg-[#EBF1EC] border border-[#C5D7C8]' },
    { label: 'Last Campus Drill', value: formatDate(school.lastDrillDate), icon: <CalendarClock size={20} />, color: 'text-[#9B2C46] bg-[#FDE8EC] border border-[#F8CCD5]' },
    { label: 'Evacuation Readiness', value: `${schoolMetrics.evacuation}%`, icon: <Clock size={20} />, color: 'text-[#375340] bg-[#EBF1EC] border border-[#C5D7C8]' },
    { label: 'Emergency Readiness', value: `${schoolMetrics.avgIDRI}%`, icon: <Shield size={20} />, color: 'text-[#375340] bg-[#EBF1EC] border border-[#C5D7C8]' },
    { label: 'Weakest Domain Area', value: schoolMetrics.weakestArea, icon: <AlertTriangle size={20} />, color: 'text-[#9B2C46] bg-[#FDE8EC] border border-[#F8CCD5]' },
  ];

  const components = [
    { name: 'Earthquake Preparedness', score: schoolMetrics.earthquake, weight: 30, icon: '🫨' },
    { name: 'Fire Safety & Prevention', score: schoolMetrics.fire, weight: 25, icon: '🔥' },
    { name: 'Flood Hazard Management', score: schoolMetrics.flood, weight: 20, icon: '🌊' },
    { name: 'Evacuation Decision Speed', score: schoolMetrics.evacuation, weight: 15, icon: '🏃' },
    { name: 'Student Training Rate', score: schoolMetrics.totalStudents > 0 ? Math.round((schoolMetrics.studentsTrained / schoolMetrics.totalStudents) * 100) : 0, weight: 10, icon: '📋' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#1C221E]">Admin Command Center</h1>
            <Badge variant="outline" className="text-[10px] uppercase font-bold text-[#375340] bg-[#EBF1EC] border-[#C5D7C8]">
              Live Feed
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#5E6660] mt-0.5">{school.name} • {school.district}, {school.state}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs font-bold border-[#F8CCD5] bg-[#FDE8EC] hover:bg-[#FCE3E8] text-[#9B2C46] shadow-2xs cursor-pointer"
            onClick={() => setAlertModalOpen(true)}
          >
            <Radio size={14} className="text-[#E26D85] animate-pulse" /> Simulated Alerts
          </Button>
        </div>
      </div>

      {/* IDRI Score + Metrics */}
      <div className="grid lg:grid-cols-4 gap-4">
        <Card className="lg:row-span-2 rounded-2xl border-[#E8E2D5] bg-[#FFFDF9] shadow-2xs overflow-hidden">
          <CardHeader className="pb-0 border-b border-[#E8E2D5] p-5">
            <CardTitle className="text-xs font-bold text-[#1C221E] uppercase tracking-wide flex items-center justify-between">
              <span>Readiness Index (IDRI)</span>
              <span className="w-2 h-2 rounded-full bg-[#587B64] animate-pulse" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center p-6">
            <ScoreRing score={schoolMetrics.avgIDRI} size={150} />
            <p className="text-xs text-[#5E6660] mt-3 text-center font-medium">
              Real-time composite score aggregated from live student completions
            </p>
            <div className="w-full mt-5 space-y-2 border-t border-[#E8E2D5] pt-4">
              {components.map(comp => (
                <div key={comp.name} className="flex items-center gap-2 text-xs p-1.5 rounded-lg hover:bg-[#F4EFE6] transition-colors">
                  <span>{comp.icon}</span>
                  <span className="flex-1 truncate text-[#1C221E] font-medium">{comp.name}</span>
                  <span className="font-bold text-[#1C221E]">{comp.score}%</span>
                  <span className="text-[10px] text-[#5E6660]">({comp.weight}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {metrics.map(metric => (
          <Card key={metric.label} className="rounded-2xl border-[#E8E2D5] bg-[#FFFDF9] shadow-2xs hover:shadow-sm hover:border-[#C5D7C8] transition-all">
            <CardContent className="p-4 flex items-center gap-3.5">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${metric.color} shadow-2xs`}>
                {metric.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[#5E6660] font-medium truncate">{metric.label}</p>
                <p className="text-lg font-bold text-[#1C221E] truncate">{metric.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <RechartsCharts />

      <AlertSystemModal open={alertModalOpen} onClose={() => setAlertModalOpen(false)} />
    </div>
  );
}

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DashboardLayout requiredRole="admin">
      <AdminDashboardContent />
    </DashboardLayout>
  );
}
