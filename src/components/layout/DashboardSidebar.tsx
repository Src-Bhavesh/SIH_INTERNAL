'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import {
  LayoutDashboard, BookOpen, Gamepad2, BarChart3, Lightbulb, Users,
  ClipboardList, Building2, FileText, Shield, LogOut, School
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/lib/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const roleNavItems: Record<UserRole, NavItem[]> = {
  student: [
    { label: 'Dashboard', href: '/student', icon: <LayoutDashboard size={17} /> },
    { label: 'Learn Modules', href: '/student/learn', icon: <BookOpen size={17} /> },
    { label: 'Simulations', href: '/student/simulations', icon: <Gamepad2 size={17} /> },
    { label: 'Results & History', href: '/student/results', icon: <BarChart3 size={17} /> },
    { label: 'Recommendations', href: '/student/recommendations', icon: <Lightbulb size={17} /> },
  ],
  teacher: [
    { label: 'Dashboard', href: '/teacher', icon: <LayoutDashboard size={17} /> },
    { label: 'Class Rosters', href: '/teacher/classes', icon: <Users size={17} /> },
    { label: 'Cohort Reports', href: '/teacher/reports', icon: <FileText size={17} /> },
  ],
  admin: [
    { label: 'Command Center', href: '/admin', icon: <LayoutDashboard size={17} /> },
    { label: 'School Profile', href: '/admin/school', icon: <School size={17} /> },
    { label: 'Buildings & Zones', href: '/admin/buildings', icon: <Building2 size={17} /> },
    { label: 'Scenario Drills', href: '/admin/scenarios', icon: <Gamepad2 size={17} /> },
    { label: 'Campus Drills', href: '/admin/drills', icon: <ClipboardList size={17} /> },
    { label: 'Preparedness Report', href: '/admin/reports', icon: <FileText size={17} /> },
  ],
  district: [
    { label: 'District Monitor', href: '/district', icon: <LayoutDashboard size={17} /> },
  ],
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const navItems = roleNavItems[user.role] || [];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[#E8E2D5] bg-[#FAF7F2] flex flex-col shadow-2xs">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#E8E2D5]">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#587B64] text-white font-bold text-sm shadow-sm shadow-[#587B64]/20">
          <Shield size={20} />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-extrabold tracking-tight text-[#1C221E]">SurakshaOS</h1>
            <span className="h-1.5 w-1.5 rounded-full bg-[#587B64] animate-pulse" />
          </div>
          <p className="text-[10px] text-[#5E6660] font-semibold tracking-wider uppercase">Disaster Readiness</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#5E6660]">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== `/${user.role}` && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all group relative',
                isActive
                  ? 'bg-[#EBF1EC] text-[#375340] border border-[#C5D7C8] shadow-2xs'
                  : 'text-[#48504B] hover:text-[#1C221E] hover:bg-[#F2ECE1]'
              )}
            >
              <div className={cn(
                'transition-transform duration-200 group-hover:scale-110',
                isActive ? 'text-[#375340]' : 'text-[#7A827C] group-hover:text-[#1C221E]'
              )}>
                {item.icon}
              </div>
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#587B64]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info Footer */}
      <div className="p-3 border-t border-[#E8E2D5] bg-[#F4EFE6]/60">
        <div className="p-2.5 rounded-xl bg-[#FFFDF9] border border-[#E8E2D5] shadow-2xs mb-2">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#FDE8EC] border border-[#F8CCD5] text-[#9B2C46] text-xs font-extrabold flex items-center justify-center shrink-0">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#1C221E] truncate">{user.name}</p>
              <p className="text-[10px] text-[#5E6660] capitalize font-medium">{user.role}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-[#5E6660] hover:text-[#DC2626] hover:bg-[#FDE8EC]/60 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut size={13} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
