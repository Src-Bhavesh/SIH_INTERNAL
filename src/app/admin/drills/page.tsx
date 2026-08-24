'use client';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { drills } from '@/lib/data';
import { formatDate, getDisasterIcon } from '@/lib/utils';
import { Plus } from 'lucide-react';

function AdminDrillsContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Drill History</h1>
          <p className="text-muted-foreground">View all drill records and reports</p>
        </div>
        <Button className="gap-2"><Plus size={16} /> Schedule New Drill</Button>
      </div>
      {drills.map(drill => (
        <Card key={drill.id} className="card-hover">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <span className="text-3xl">{getDisasterIcon(drill.disasterType)}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{drill.title}</h3>
                  <Badge className={`text-[10px] ${drill.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>{drill.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(drill.scheduledAt)}</p>
                {drill.report && (
                  <div className="grid grid-cols-5 gap-3 mt-3">
                    <div className="text-center p-2 rounded bg-accent/50"><p className="font-bold">{drill.report.totalParticipants}</p><p className="text-[10px] text-muted-foreground">Participants</p></div>
                    <div className="text-center p-2 rounded bg-accent/50"><p className="font-bold">{drill.report.completed}</p><p className="text-[10px] text-muted-foreground">Completed</p></div>
                    <div className="text-center p-2 rounded bg-accent/50"><p className="font-bold">{Math.round(drill.report.averageResponseTimeMs/1000)}s</p><p className="text-[10px] text-muted-foreground">Avg Response</p></div>
                    <div className="text-center p-2 rounded bg-accent/50"><p className="font-bold">{drill.report.correctDecisions}%</p><p className="text-[10px] text-muted-foreground">Correct</p></div>
                    <div className="text-center p-2 rounded bg-accent/50"><p className="font-bold">{drill.report.attendanceVerified}%</p><p className="text-[10px] text-muted-foreground">Attendance</p></div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminDrillsPage() {
  return (<DashboardLayout requiredRole="admin"><AdminDrillsContent /></DashboardLayout>);
}
