'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import DashboardSidebar from './DashboardSidebar';
import DashboardNavbar from './DashboardNavbar';
import { UserRole } from '@/lib/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
}

export default function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isRoleAllowed = React.useMemo(() => {
    if (!user) return false;
    if (!requiredRole) return true;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role) || user.role === 'admin';
    }
    // Admin has access to preview all modules and simulations
    return user.role === requiredRole || user.role === 'admin';
  }, [user, requiredRole]);

  React.useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    } else if (mounted && user && !isRoleAllowed) {
      router.push(`/${user.role}`);
    }
  }, [mounted, isAuthenticated, user, isRoleAllowed, router]);

  if (!mounted || !isAuthenticated || !user || !isRoleAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="pl-64">
        <DashboardNavbar />
        <main className="p-6 page-transition">
          {children}
        </main>
      </div>
    </div>
  );
}
