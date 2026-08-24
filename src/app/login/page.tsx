'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useStudentProgressStore } from '@/lib/store';
import { validateCredentials, getDashboardRoute, demoAccounts } from '@/lib/auth';
import { classes, users } from '@/lib/data';
import { User, UserRole } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  GraduationCap,
  School,
  ArrowRight,
  Eye,
  EyeOff,
  User as UserIcon,
  Lock,
  Mail,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { loginOrRegisterStudent } = useStudentProgressStore();

  const [activeTab, setActiveTab] = useState<'student' | 'staff'>('student');

  // Staff Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Student Access State
  const [studentName, setStudentName] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('class-7b');
  const [studentError, setStudentError] = useState('');

  // Handle Staff Standard Form Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 200));

    const result = validateCredentials(email, password);
    if (result.success && result.user) {
      login(result.user);
      router.push(getDashboardRoute(result.user.role));
    } else {
      setError(result.error || 'Authentication failed. Please verify credentials.');
    }
    setIsLoading(false);
  };

  // Handle 1-Click Fast Login
  const handleQuickLogin = async (demoEmail: string) => {
    setError('');
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 200));

    const result = validateCredentials(demoEmail, 'demo123');
    if (result.success && result.user) {
      login(result.user);
      router.push(getDashboardRoute(result.user.role));
    }
    setIsLoading(false);
  };

  // Handle Student Dynamic Access / Login (Loads existing profile from Supabase or registers if new)
  const handleStudentAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setStudentError('Please enter your full name to proceed.');
      return;
    }

    setStudentError('');
    setIsLoading(true);

    try {
      const studentUser = await loginOrRegisterStudent(studentName.trim(), selectedClassId);
      login(studentUser);
      router.push('/student');
    } catch (err: any) {
      console.error('Failed to access student profile in Supabase:', err);
      setStudentError(err?.message || 'Failed to connect to Supabase. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EBDD] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-[#9AAF8B] selection:text-[#FFFDF8]">
      {/* Soft Ambient Warm Lighting Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] max-w-[600px] max-h-[600px] bg-[#D99378]/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[55vw] h-[55vw] max-w-[600px] max-h-[600px] bg-[#9AAF8B]/25 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[450px] max-h-[450px] bg-[#FFFDF8]/40 rounded-full blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5DDD060_1px,transparent_1px),linear-gradient(to_bottom,#E5DDD060_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 w-full max-w-[460px]">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-[#61745A] shadow-lg shadow-[#61745A]/25 mb-3.5 border border-[#D99378]/40">
            <Shield size={28} className="text-[#FFFDF8] drop-shadow-xs" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#2C312A] drop-shadow-xs">
            Suraksha<span className="text-[#61745A]">OS</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#7C8178] mt-1 font-medium tracking-wide">
            Institutional Disaster Readiness &amp; Response Platform
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#EAE0D0] p-1.5 rounded-2xl mb-4 border border-[#E5DDD0] shadow-inner backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'student'
                ? 'bg-[#61745A] text-[#FFFDF8] shadow-md shadow-[#61745A]/25'
                : 'text-[#7C8178] hover:text-[#2C312A] hover:bg-[#F3EBDD]/70'
            }`}
          >
            <GraduationCap size={16} />
            Student Access
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('staff');
              setStudentError('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-[#61745A] text-[#FFFDF8] shadow-md shadow-[#61745A]/25'
                : 'text-[#7C8178] hover:text-[#2C312A] hover:bg-[#F3EBDD]/70'
            }`}
          >
            <School size={16} />
            Faculty &amp; Admin
          </button>
        </div>

        {/* ── TAB 1: STUDENT ACCESS ── */}
        {activeTab === 'student' && (
          <Card className="shadow-xl border border-[#E5DDD0] bg-[#FFFDF8] rounded-3xl overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95">
            <CardContent className="p-6 sm:p-7 space-y-5">
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-[#E5DDD0] pb-4">
                <div>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider text-[#2C312A] bg-[#FAF2EB] border-[#D99378]">
                    Student Portal
                  </Badge>
                  <h2 className="text-xl font-extrabold text-[#2C312A] mt-1.5 tracking-tight">
                    Welcome back
                  </h2>
                  <p className="text-xs text-[#7C8178] mt-0.5">
                    Select your class cohort and enter your name.
                  </p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-[#FAF2EB] border border-[#D99378] flex items-center justify-center text-[#61745A] shadow-2xs shrink-0">
                  <GraduationCap size={22} />
                </div>
              </div>

              {/* Student Access Form */}
              <form onSubmit={handleStudentAccess} className="space-y-4">
                <div>
                  <label htmlFor="studentName" className="block text-xs font-bold text-[#2C312A] mb-1.5 flex items-center gap-1.5">
                    <UserIcon size={13} className="text-[#7C8178]" /> Your Full Name
                  </label>
                  <input
                    id="studentName"
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Gautam Patel or Aarav Mehta"
                    autoFocus
                    required
                    className="w-full rounded-xl border border-[#E5DDD0] bg-[#FAF7F0] px-3.5 py-2.5 text-xs text-[#2C312A] font-semibold placeholder:text-[#7C8178] placeholder:font-normal outline-none focus:bg-[#FFFDF8] focus:ring-2 focus:ring-[#9AAF8B]/30 focus:border-[#9AAF8B] transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label htmlFor="classSelect" className="block text-xs font-bold text-[#2C312A] mb-1.5 flex items-center gap-1.5">
                    <School size={13} className="text-[#7C8178]" /> Your Class &amp; Class Teacher
                  </label>
                  <div className="relative">
                    <select
                      id="classSelect"
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="w-full rounded-xl border border-[#E5DDD0] bg-[#FAF7F0] px-3.5 py-2.5 text-xs text-[#2C312A] font-semibold outline-none focus:bg-[#FFFDF8] focus:ring-2 focus:ring-[#9AAF8B]/30 focus:border-[#9AAF8B] transition-all appearance-none cursor-pointer shadow-2xs pr-8"
                    >
                      {classes.map((cls) => {
                        const classTeacher = users.find((t) =>
                          t.role === 'teacher' && t.assignedClasses?.includes(cls.id)
                        );
                        return (
                          <option key={cls.id} value={cls.id}>
                            {cls.name} • {classTeacher ? classTeacher.name : 'Faculty Staff'}
                          </option>
                        );
                      })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#7C8178]">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {studentError && (
                  <div className="rounded-xl bg-[#FAF2EB] text-[#D99378] text-xs px-3.5 py-2.5 border border-[#D99378]/50 font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D99378] shrink-0" />
                    {studentError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#9AAF8B] hover:bg-[#8B9F7C] text-[#FFFDF8] text-xs font-bold py-3.5 rounded-xl shadow-md shadow-[#9AAF8B]/25 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Enter Student App</span>
                  <ArrowRight size={14} />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ── TAB 2: FACULTY & ADMIN ACCESS ── */}
        {activeTab === 'staff' && (
          <Card className="shadow-xl border border-[#E5DDD0] bg-[#FFFDF8] rounded-3xl overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95">
            <CardContent className="p-6 sm:p-7 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[#E5DDD0] pb-4">
                <div>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider text-[#2C312A] bg-[#FAF2EB] border-[#D99378]">
                    Faculty &amp; Administration
                  </Badge>
                  <h2 className="text-xl font-extrabold text-[#2C312A] mt-1.5 tracking-tight">
                    Authorized Sign In
                  </h2>
                  <p className="text-xs text-[#7C8178] mt-0.5">
                    Sign in with email or 1-click on your faculty profile.
                  </p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-[#FAF2EB] border border-[#D99378] flex items-center justify-center text-[#61745A] shadow-2xs shrink-0">
                  <Lock size={20} />
                </div>
              </div>

              {/* Standard Form */}
              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-[#2C312A] mb-1 flex items-center gap-1.5">
                    <Mail size={13} className="text-[#7C8178]" /> Faculty Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. meera@demo.com or admin@demo.com"
                    required
                    className="w-full rounded-xl border border-[#E5DDD0] bg-[#FAF7F0] px-3.5 py-2.5 text-xs text-[#2C312A] font-semibold outline-none focus:bg-[#FFFDF8] focus:ring-2 focus:ring-[#9AAF8B]/30 focus:border-[#9AAF8B] transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-bold text-[#2C312A] mb-1 flex items-center gap-1.5">
                    <Lock size={13} className="text-[#7C8178]" /> Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="demo123"
                      required
                      className="w-full rounded-xl border border-[#E5DDD0] bg-[#FAF7F0] px-3.5 py-2.5 text-xs text-[#2C312A] font-semibold outline-none focus:bg-[#FFFDF8] focus:ring-2 focus:ring-[#9AAF8B]/30 focus:border-[#9AAF8B] transition-all pr-10 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C8178] hover:text-[#2C312A] cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl bg-[#FAF2EB] text-[#D99378] text-xs px-3.5 py-2.5 border border-[#D99378]/50 font-semibold">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#61745A] hover:bg-[#52634C] text-[#FFFDF8] text-xs font-bold py-3 rounded-xl shadow-md cursor-pointer transition-all"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Sign In with Password'
                  )}
                </Button>
              </form>

              {/* 1-Click Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5DDD0]" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                  <span className="bg-[#FFFDF8] px-2.5 text-[#7C8178]">1-Click Fast Profile Switch</span>
                </div>
              </div>

              {/* 1-Click Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => handleQuickLogin(account.email)}
                    disabled={isLoading}
                    className="flex items-center gap-2.5 rounded-xl border border-[#E5DDD0] bg-[#FFFDF8] p-2.5 text-left hover:border-[#9AAF8B] hover:shadow-2xs hover:scale-[1.01] transition-all group disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 border ${
                        account.color || 'bg-[#FAF2EB] text-[#2C312A] border-[#D99378]'
                      }`}
                    >
                      {account.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#2C312A] truncate group-hover:text-[#61745A] transition-colors">
                        {account.name}
                      </p>
                      <p className="text-[10px] text-[#7C8178] truncate capitalize">{account.label}</p>
                    </div>
                    <ArrowRight
                      size={12}
                      className="text-[#E5DDD0] group-hover:text-[#61745A] group-hover:translate-x-0.5 transition-all shrink-0"
                    />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <Badge variant="outline" className="text-[10px] text-[#2C312A] border-[#E5DDD0] bg-[#EAE0D0] font-semibold px-3 py-0.5">
            SIH 2025 • Disaster Management System
          </Badge>
          <p className="text-[10px] text-[#7C8178] mt-2 font-medium">
            Government of Punjab • Disaster Response Authority
          </p>
        </div>
      </div>
    </div>
  );
}
