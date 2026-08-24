'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { districtSchools } from '@/lib/data';
import { useDistrictStore } from '@/lib/store';
import { DistrictSchoolSummary } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export default function DistrictCharts({ schools: propSchools }: { schools?: DistrictSchoolSummary[] }) {
  const [mounted, setMounted] = useState(false);
  const storeSchools = useDistrictStore((state) => state.schools);
  const schools = propSchools || storeSchools || districtSchools;

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-64 bg-muted/30 rounded-lg animate-pulse" />;

  const chartData = schools.map(s => ({
    name: s.schoolName.length > 18 ? s.schoolName.slice(0, 16) + '…' : s.schoolName,
    score: s.preparednessScore,
    fullName: s.schoolName,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">School Preparedness Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} name="Score">
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.score >= 80 ? '#10B981' : entry.score >= 60 ? '#F59E0B' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
