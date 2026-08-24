'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, BookOpen, Gamepad2, BarChart3, AlertTriangle, ArrowRight, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: <BookOpen size={24} />,
    title: 'Interactive Learning',
    description: 'Structured disaster safety modules with visual guides, step-by-step procedures, and knowledge checks.',
    color: 'bg-[#E3EFE8] text-[#3A6947]',
    border: 'border-[#A8CEAC]/40',
  },
  {
    icon: <Gamepad2 size={24} />,
    title: 'Disaster Simulation',
    description: 'Realistic scenario-based simulations with branching decisions, consequences, and performance scoring.',
    color: 'bg-[#E0F2FE] text-[#0284C7]',
    border: 'border-[#BAE6FD]/60',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Preparedness Intelligence',
    description: 'Institutional Disaster Readiness Index (IDRI) — continuously measures whether your school is actually ready.',
    color: 'bg-[#F2F7F4] text-[#4A845A]',
    border: 'border-[#C7DFC9]/60',
  },
  {
    icon: <AlertTriangle size={24} />,
    title: 'Emergency Response',
    description: 'Instant emergency mode with dynamic evacuation routes, attendance tracking, and coordinated instructions.',
    color: 'bg-[#FCE7F3] text-[#DB2777]',
    border: 'border-[#FBCFE8]/60',
  },
];

const steps = [
  {
    label: 'LEARN',
    description: 'Disaster-specific safety procedures',
    icon: '📚',
    accentBg: 'bg-[#E3EFE8]/70 text-[#3A6947]',
    accentBorder: 'border-[#C7DFC9]/80',
    titleColor: 'text-[#3A6947]',
  },
  {
    label: 'PRACTICE',
    description: 'Interactive simulations & drills',
    icon: '🎮',
    accentBg: 'bg-[#E0F2FE]/70 text-[#0284C7]',
    accentBorder: 'border-[#BAE6FD]/80',
    titleColor: 'text-[#0284C7]',
  },
  {
    label: 'MEASURE',
    description: 'Preparedness scoring & analytics',
    icon: '📊',
    accentBg: 'bg-[#F2F7F4]/80 text-[#4A845A]',
    accentBorder: 'border-[#C7DFC9]/80',
    titleColor: 'text-[#4A845A]',
  },
  {
    label: 'RESPOND',
    description: 'Emergency mode & coordination',
    icon: '🚨',
    accentBg: 'bg-[#FCE7F3]/70 text-[#DB2777]',
    accentBorder: 'border-[#FBCFE8]/80',
    titleColor: 'text-[#DB2777]',
  },
];

const stats = [
  { value: '900+', label: 'Students Trained' },
  { value: '45', label: 'Teachers Certified' },
  { value: '83%', label: 'Readiness Score' },
  { value: '12', label: 'Drills Completed' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2F7F4]/60 via-[#F0F9FF]/30 to-[#FDF2F8]/40">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-white/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4A845A] to-[#0284C7] text-white shadow-sm">
              <Shield size={18} />
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-800">SurakshaOS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="gap-1.5 bg-[#4A845A] hover:bg-[#3A6947] text-white shadow-xs">
                Explore Platform <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background color glow blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#38BDF8]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-[#88BD8E]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#F472B6]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <Badge
            variant="outline"
            className="mb-6 text-xs px-3.5 py-1 bg-white/80 border-[#C7DFC9] text-[#3A6947] backdrop-blur-xs shadow-2xs font-medium inline-flex items-center gap-1.5"
          >
            <Sparkles size={12} className="text-[#0284C7]" />
            SIH 2025 — Problem Statement SIH25008 • Government of Punjab
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="gradient-text">SurakshaOS</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 font-semibold mb-2">
            Disaster Readiness & Response Platform
          </p>
          <p className="text-base text-slate-500 mb-2">
            for Schools and Colleges
          </p>

          <p className="text-lg font-semibold text-[#0284C7] mt-6 mb-8 tracking-wide">
            Learn. Simulate. Prepare. Respond.
          </p>

          <div className="flex items-center justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="gap-2 bg-[#4A845A] hover:bg-[#3A6947] text-white shadow-lg shadow-[#4A845A]/25 text-base px-8 py-6 rounded-xl transition-all duration-200 hover:scale-[1.02]"
              >
                Explore Platform <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 px-6 bg-white/70 backdrop-blur-xs border-y border-[#C7DFC9]/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">The Continuous Readiness Cycle</h2>
            <p className="text-slate-500">Not just information — a complete preparedness system</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 relative">
            {steps.map((step, i) => (
              <div key={step.label} className="relative group">
                <Card
                  className={`text-center p-6 card-hover bg-white/90 backdrop-blur-xs border ${step.accentBorder} h-full rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md`}
                >
                  <CardContent className="p-0 flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3 ${step.accentBg}`}>
                      {step.icon}
                    </div>
                    <h3 className={`font-bold text-sm mb-1 tracking-wider ${step.titleColor}`}>
                      {step.label}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>

                {/* Centered connecting arrow badge */}
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-[15px] top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white shadow-sm border border-slate-200/90 items-center justify-center text-slate-400 group-hover:text-[#4A845A] group-hover:border-[#A8CEAC] transition-all duration-200 pointer-events-none">
                    <ChevronRight size={14} className="stroke-[2.5]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Platform Capabilities</h2>
            <p className="text-slate-500">Everything an institution needs for disaster preparedness</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className={`card-hover border ${feature.border} bg-white/90 backdrop-blur-xs rounded-2xl shadow-xs`}
              >
                <CardContent className="p-6 flex gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-6 bg-gradient-to-r from-[#3A6947] via-[#0284C7] to-[#DB2777] text-white shadow-inner">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold mb-1 tracking-tight">{stat.value}</p>
                <p className="text-sm text-white/80 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Differentiator ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Beyond Awareness</h2>
            <p className="text-slate-500">Common disaster apps provide information. SurakshaOS provides a continuous readiness loop.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-border/60 bg-white/80 backdrop-blur-xs rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-400 mb-4 text-xs uppercase tracking-wider">Traditional Approach</h3>
                <ul className="space-y-3 text-sm text-slate-500">
                  {['Static information pages', 'Simple quizzes', 'Basic leaderboards', 'Static evacuation guides', 'No measurement of actual readiness'].map(item => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="text-rose-400 font-bold mt-0.5">✗</span> {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-[#A8CEAC] bg-gradient-to-br from-[#E3EFE8]/40 via-white to-[#E0F2FE]/30 shadow-lg shadow-[#5D9B6E]/10 rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#3A6947] mb-4 text-xs uppercase tracking-wider">SurakshaOS Approach</h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  {[
                    'Interactive disaster simulations',
                    'Institutional Disaster Readiness Index',
                    'Dynamic evacuation with Dijkstra routing',
                    'AI-powered weakness detection',
                    'Continuous readiness measurement',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-[#4A845A] mt-0.5 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6 bg-gradient-to-b from-[#F2F7F4]/80 via-[#F0F9FF]/50 to-[#FDF2F8]/70 border-t border-[#C7DFC9]/40">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            Know what to do. Practice what to do.<br />
            Measure whether you can do it.
          </h2>
          <p className="text-slate-500 mb-6">Start building institutional disaster preparedness today.</p>
          <Link href="/login">
            <Button size="lg" className="gap-2 bg-[#4A845A] hover:bg-[#3A6947] text-white shadow-lg shadow-[#4A845A]/25 text-base px-8 py-6 rounded-xl">
              Get Started <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-6 px-6 bg-white/60">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-[#4A845A]" />
            <span className="font-medium text-slate-700">SurakshaOS — Disaster Readiness & Response Platform</span>
          </div>
          <p>Smart India Hackathon 2025 • SIH25008 • Government of Punjab</p>
        </div>
      </footer>
    </div>
  );
}
