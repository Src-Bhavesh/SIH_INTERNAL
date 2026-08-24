import { User } from '../types';

export const users: User[] = [
  // ── Admin ──
  {
    id: 'admin-001',
    name: 'Dr. Rajinder Singh',
    email: 'admin@demo.com',
    role: 'admin',
    avatar: '/images/avatars/admin.png',
    schoolId: 'school-001',
  },
  // ── District ──
  {
    id: 'district-001',
    name: 'Sh. Harpreet Kaur',
    email: 'district@demo.com',
    role: 'district',
    avatar: '/images/avatars/district.png',
    schoolId: 'school-001',
  },
  // ── Teachers ──
  {
    id: 'teacher-001',
    name: 'Mrs. Anita Sharma',
    email: 'teacher@demo.com',
    role: 'teacher',
    avatar: '/images/avatars/teacher.png',
    schoolId: 'school-001',
    assignedClasses: ['class-12a', 'class-12b', 'class-11a'],
  },
  {
    id: 'teacher-002',
    name: 'Mr. Vikram Patel',
    email: 'teacher2@demo.com',
    role: 'teacher',
    schoolId: 'school-001',
    assignedClasses: ['class-10a', 'class-10b'],
  },
  {
    id: 'teacher-003',
    name: 'Ms. Priya Kaur',
    email: 'teacher3@demo.com',
    role: 'teacher',
    avatar: '/images/avatars/teacher.png',
    schoolId: 'school-001',
    assignedClasses: ['class-9a', 'class-9b'],
  },
  {
    id: 'teacher-004',
    name: 'Meera Nair',
    email: 'teacher4@demo.com',
    role: 'teacher',
    avatar: '/images/avatars/teacher.png',
    schoolId: 'school-001',
    assignedClasses: ['class-7b'],
  },
];

export function getUserByEmail(email: string): User | undefined {
  const norm = email.toLowerCase().trim();
  if (norm === 'meera@demo.com' || norm === 'meera.nair@demo.com' || norm === 'teacher4@demo.com') {
    return users.find(u => u.id === 'teacher-004');
  }
  if (norm === 'anita@demo.com' || norm === 'teacher@demo.com') {
    return users.find(u => u.id === 'teacher-001');
  }
  if (norm === 'vikram@demo.com' || norm === 'teacher2@demo.com') {
    return users.find(u => u.id === 'teacher-002');
  }
  if (norm === 'priya@demo.com' || norm === 'teacher3@demo.com') {
    return users.find(u => u.id === 'teacher-003');
  }
  if (norm === 'admin@demo.com') {
    return users.find(u => u.id === 'admin-001');
  }
  if (norm === 'district@demo.com') {
    return users.find(u => u.id === 'district-001');
  }
  return users.find(u => u.email.toLowerCase() === norm);
}

export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export function getUsersByRole(role: User['role']): User[] {
  return users.filter(u => u.role === role);
}

export function getStudentsByClass(classId: string): User[] {
  return users.filter(u => u.role === 'student' && u.classId === classId);
}
