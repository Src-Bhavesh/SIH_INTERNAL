'use client';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { school, buildings, emergencyContacts } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Building2, Users } from 'lucide-react';

function SchoolContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">School Digital Profile</h1>
        <p className="text-muted-foreground">Manage school information and emergency infrastructure</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader><CardTitle className="text-sm">Institution Details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{school.name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="font-medium">{school.address}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">District</span><span className="font-medium">{school.district}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">State</span><span className="font-medium">{school.state}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Students</span><span className="font-medium">{school.totalStudents}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Teachers</span><span className="font-medium">{school.totalTeachers}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Classes</span><span className="font-medium">{school.totalClasses}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Building2 size={16} /> Buildings</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {buildings.map(b => (
              <div key={b.id} className="p-3 rounded-lg bg-accent/50">
                <p className="font-medium text-sm">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.floors.length} floors, {b.floors.reduce((sum, f) => sum + f.rooms.length, 0)} rooms</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Phone size={16} /> Emergency Contacts</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            {emergencyContacts.map(c => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                <Phone size={14} className="text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.role}</p>
                  <p className="text-xs font-mono">{c.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminSchoolPage() {
  return (<DashboardLayout requiredRole="admin"><SchoolContent /></DashboardLayout>);
}
