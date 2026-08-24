'use client';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildings } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function BuildingsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Buildings & Map</h1>
        <p className="text-muted-foreground">View building layouts and emergency infrastructure</p>
      </div>

      <Tabs defaultValue={buildings[0]?.id}>
        <TabsList>
          {buildings.map(b => <TabsTrigger key={b.id} value={b.id}>{b.name}</TabsTrigger>)}
        </TabsList>

        {buildings.map(b => (
          <TabsContent key={b.id} value={b.id}>
            <div className="space-y-4">
              {b.floors.map(floor => (
                <Card key={floor.id}>
                  <CardHeader><CardTitle className="text-sm">{floor.name}</CardTitle></CardHeader>
                  <CardContent>
                    {/* Simple SVG floor map */}
                    <div className="bg-slate-50 rounded-lg p-4 overflow-auto">
                      <svg viewBox="0 0 350 260" className="w-full max-w-lg mx-auto">
                        {floor.rooms.map(room => {
                          const fillColor = room.type === 'exit' ? '#10B981' :
                            room.type === 'staircase' ? '#F59E0B' :
                            room.type === 'assembly_point' ? '#3B82F6' :
                            room.type === 'corridor' ? '#94A3B8' :
                            '#E2E8F0';
                          return (
                            <g key={room.id}>
                              <rect x={room.x} y={room.y} width={room.width} height={room.height}
                                fill={fillColor} stroke="#64748B" strokeWidth="1" rx="4" />
                              <text x={room.x + room.width / 2} y={room.y + room.height / 2}
                                textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#1E293B" fontWeight="500">
                                {room.name}
                              </text>
                              {room.capacity && (
                                <text x={room.x + room.width / 2} y={room.y + room.height / 2 + 12}
                                  textAnchor="middle" dominantBaseline="middle" fontSize="6" fill="#64748B">
                                  Cap: {room.capacity}
                                </text>
                              )}
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3 text-xs">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-200 inline-block" /> Classroom</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Exit</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500 inline-block" /> Staircase</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-400 inline-block" /> Corridor</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default function AdminBuildingsPage() {
  return (<DashboardLayout requiredRole="admin"><BuildingsContent /></DashboardLayout>);
}
