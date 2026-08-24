// ═══════════════════════════════════════════════════════════════
// SurakshaOS — Auth System (Demo)
// Simple cookie-based auth with seeded demo accounts.
// ═══════════════════════════════════════════════════════════════

import { User, UserRole } from './types';
import { getUserByEmail } from './data';

const DEMO_PASSWORD = 'demo123';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Validate demo credentials
 */
export function validateCredentials(email: string, password: string): AuthResult {
  if (password !== DEMO_PASSWORD) {
    return { success: false, error: 'Invalid password. Use "demo123" for demo accounts.' };
  }

  const user = getUserByEmail(email);
  if (!user) {
    return { success: false, error: 'Account not found. Use a registered email (e.g. meera@demo.com, teacher@demo.com, admin@demo.com).' };
  }

  return { success: true, user };
}

/**
 * Get the dashboard route for a given role
 */
export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case 'student': return '/student';
    case 'teacher': return '/teacher';
    case 'admin': return '/admin';
    case 'district': return '/district';
    default: return '/login';
  }
}

/**
 * Get the role label for display
 */
export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'student': return 'Student';
    case 'teacher': return 'Teacher';
    case 'admin': return 'Administrator';
    case 'district': return 'District Authority';
    default: return 'Unknown';
  }
}

/**
 * Demo accounts for login page display (Clean professional badges)
 */
export const demoAccounts = [
  { email: 'teacher4@demo.com', role: 'teacher' as UserRole, label: 'Class 7B Teacher', name: 'Meera Nair', initials: 'MN', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { email: 'teacher@demo.com', role: 'teacher' as UserRole, label: 'Class 12A Teacher', name: 'Mrs. Anita Sharma', initials: 'AS', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { email: 'teacher2@demo.com', role: 'teacher' as UserRole, label: 'Class 10A Teacher', name: 'Mr. Vikram Patel', initials: 'VP', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { email: 'admin@demo.com', role: 'admin' as UserRole, label: 'Administrator', name: 'Dr. Rajinder Singh', initials: 'RS', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { email: 'district@demo.com', role: 'district' as UserRole, label: 'District Authority', name: 'Sh. Harpreet Kaur', initials: 'HK', color: 'bg-slate-100 text-slate-800 border-slate-300' },
];
