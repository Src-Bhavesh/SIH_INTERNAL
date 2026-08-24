'use client';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore, useStudentProgressStore } from '@/lib/store';
import { getClassesByTeacher, users } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

function ClassesContent() {
  const { user } = useAuthStore();
  const { studentProgress, registeredStudents, getStudentPrep, initData } = useStudentProgressStore();

  React.useEffect(() => {
    initData();
  }, [initData]);

  if (!user) return null;
  const teacherClasses = getClassesByTeacher(user.id);

  // Combine Supabase registered students with baseline demo accounts
  const allStudents = [...registeredStudents];
  users
    .filter((u) => u.role === 'student')
    .forEach((baseStudent) => {
      if (!allStudents.some((s) => s.id === baseStudent.id || s.name.toLowerCase() === baseStudent.name.toLowerCase())) {
        allStudents.push(baseStudent);
      }
    });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">My Classes</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Detailed view of your assigned classes and student progress</p>
      </div>
      {teacherClasses.map(cls => {
        const classStudents = allStudents.filter(u => u.classId === cls.id);
        return (
          <Card key={cls.id} className="border-slate-200/80 bg-white/90 shadow-2xs rounded-2xl">
            <CardHeader className="border-b border-slate-100 p-5">
              <CardTitle className="text-base font-bold text-slate-800">{cls.name} — Class {cls.grade}-{cls.section}</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100">
                    <TableHead className="text-xs font-bold text-slate-600">Student</TableHead>
                    <TableHead className="text-xs font-bold text-slate-600">Score</TableHead>
                    <TableHead className="text-xs font-bold text-slate-600">Knowledge</TableHead>
                    <TableHead className="text-xs font-bold text-slate-600">Decision Making</TableHead>
                    <TableHead className="text-xs font-bold text-slate-600">Modules Completed</TableHead>
                    <TableHead className="text-xs font-bold text-slate-600">Weak Areas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-slate-400 text-xs">
                        No students registered in this section yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    classStudents.map(student => {
                      const prep = studentProgress[student.id] || getStudentPrep(student.id);
                      if (!prep) return null;
                      return (
                        <TableRow key={student.id} className="border-slate-100">
                          <TableCell className="font-semibold text-xs text-slate-800">{student.name}</TableCell>
                          <TableCell><Badge className={prep.overall >= 80 ? 'bg-emerald-100 text-emerald-800 border-emerald-200 text-xs' : 'bg-slate-100 text-slate-700 border-slate-200 text-xs'}>{prep.overall}%</Badge></TableCell>
                          <TableCell className="text-xs text-slate-600 font-medium">{prep.knowledge}%</TableCell>
                          <TableCell className="text-xs text-slate-600 font-medium">{prep.decisionMaking}%</TableCell>
                          <TableCell className="text-xs text-slate-600 font-medium">{prep.completedModules.length}/3</TableCell>
                          <TableCell>
                            {prep.weakAreas.length > 0 ? (
                              <span className="text-xs text-amber-600 capitalize font-medium">{prep.weakAreas[0].replace(/_/g, ' ')}</span>
                            ) : <span className="text-xs text-emerald-600 font-medium">None</span>}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function TeacherClassesPage() {
  return (
    <DashboardLayout requiredRole="teacher">
      <ClassesContent />
    </DashboardLayout>
  );
}
