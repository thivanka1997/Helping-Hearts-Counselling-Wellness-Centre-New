'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { StudentProfile } from '@/components/student/StudentProfile';
import { User } from '@/src/types';
import { initialUsers } from '@/src/data/initialData';

export default function StudentProfilePage() {
  const { data: session } = useSession();
  const currentUser: User = (session?.user as any) || initialUsers.find(u => u.role === 'STUDENT') || initialUsers[0];

  return <StudentProfile user={currentUser} />;
}
