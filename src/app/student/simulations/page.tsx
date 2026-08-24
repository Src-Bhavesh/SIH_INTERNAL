'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getDisasterIcon } from '@/lib/utils';
import { useAuthStore, useScenarioStore } from '@/lib/store';
import { getSimulationAttemptsByUser } from '@/lib/data';
import { ArrowRight, Clock, Target, Zap } from 'lucide-react';
import Link from 'next/link';

function SimulationsContent() {
  const { user } = useAuthStore();
  const { scenarios } = useScenarioStore();
  const attempts = user ? getSimulationAttemptsByUser(user.id) : [];

  const difficultyColor: Record<string, string> = {
    beginner: 'bg-emerald-500/10 text-emerald-600',
    intermediate: 'bg-amber-500/10 text-amber-600',
    advanced: 'bg-red-500/10 text-red-600',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Disaster Simulations</h1>
        <p className="text-muted-foreground">Practice decision-making in realistic disaster scenarios</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {scenarios.map(scenario => {
          const pastAttempt = attempts.find(a => a.scenarioId === scenario.id);

          return (
            <Card key={scenario.id} className="card-hover flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{getDisasterIcon(scenario.disasterType)}</span>
                  <Badge className={`text-[10px] ${difficultyColor[scenario.difficulty]}`}>
                    {scenario.difficulty}
                  </Badge>
                </div>

                <h3 className="font-semibold mb-1">{scenario.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{scenario.description}</p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> ~{scenario.estimatedMinutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Target size={12} /> {scenario.steps.length} decisions
                  </span>
                </div>

                {pastAttempt && (
                  <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-accent/50 text-xs">
                    <Zap size={12} className="text-primary" />
                    <span>Last score: <strong>{pastAttempt.score.overall}%</strong></span>
                  </div>
                )}

                <Link href={`/student/simulations/${scenario.id}`}>
                  <Button size="sm" className="w-full gap-2" variant={pastAttempt ? 'outline' : 'default'}>
                    {pastAttempt ? 'Retry Simulation' : 'Start Simulation'} <ArrowRight size={14} />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function SimulationsPage() {
  return (
    <DashboardLayout requiredRole="student">
      <SimulationsContent />
    </DashboardLayout>
  );
}
