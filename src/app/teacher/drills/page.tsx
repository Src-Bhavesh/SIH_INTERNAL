'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherDrillsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/teacher');
  }, [router]);

  return null;
}
