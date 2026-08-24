'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudentProgressStore } from '@/lib/store';
import { classes } from '@/lib/data/schools';
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, CartesianGrid
} from 'recharts';

export default function AdminCharts() {
  const [mounted, setMounted] = useState(false);
  const { studentProgress, registeredStudents, getDomainProficiencies, initData } = useStudentProgressStore();

  useEffect(() => {
    setMounted(true);
    initData();
  }, [initData]);

  // Live disaster performance from store in Sage / Baby Pink / Warm tone
  const disasterPerformance = useMemo(() => {
    const activeStudentIds = registeredStudents.map(s => s.id);
    const domains = getDomainProficiencies(activeStudentIds);
    return [
      { name: 'Earthquake', score: domains.earthquake, color: '#587B64' },
      { name: 'Fire', score: domains.fire, color: '#769E83' },
      { name: 'Flood', score: domains.flood, color: '#E26D85' },
    ];
  }, [registeredStudents, getDomainProficiencies, studentProgress]);

  // Live class comparison
  const classComparison = useMemo(() => {
    return classes.map(c => {
      const classStudents = registeredStudents.filter(s => s.classId === c.id);
      if (classStudents.length === 0) return { name: c.name, score: 0 };
      const totalScore = classStudents.reduce((sum, s) => {
        const p = studentProgress[s.id];
        return sum + (p ? p.overall : 0);
      }, 0);
      return {
        name: c.name,
        score: Math.round(totalScore / classStudents.length),
      };
    });
  }, [registeredStudents, studentProgress]);

  if (!mounted) return <div className="h-64 bg-[#F4EFE6] rounded-2xl animate-pulse" />;

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {/* Disaster-wise Performance */}
      <Card className="rounded-2xl border-[#E8E2D5] bg-[#FFFDF9] shadow-2xs">
        <CardHeader className="pb-2 border-b border-[#E8E2D5]">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#1C221E]">Performance by Disaster Type</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={disasterPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFEBE2" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#5E6660' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#5E6660' }} />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Cohort Score']}
                  contentStyle={{ backgroundColor: '#FFFDF9', borderColor: '#E8E2D5', borderRadius: '0.75rem', color: '#1C221E' }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {disasterPerformance.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Class Comparison */}
      <Card className="rounded-2xl border-[#E8E2D5] bg-[#FFFDF9] shadow-2xs">
        <CardHeader className="pb-2 border-b border-[#E8E2D5]">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#1C221E]">Class Readiness Comparison</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFEBE2" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5E6660' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#5E6660' }} />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Average IDRI']}
                  contentStyle={{ backgroundColor: '#FFFDF9', borderColor: '#E8E2D5', borderRadius: '0.75rem', color: '#1C221E' }}
                />
                <Bar dataKey="score" fill="#587B64" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
