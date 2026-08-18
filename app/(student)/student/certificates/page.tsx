'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { StudentCertificates } from '@/components/student/StudentCertificates';
import { User } from '@/src/types';
import { initialUsers } from '@/src/data/initialData';

export default function StudentCertificatesPage() {
  const { data: session } = useSession();
  const currentUser: User = (session?.user as any) || initialUsers.find(u => u.role === 'STUDENT') || initialUsers[0];

  return <StudentCertificates user={currentUser} />;
}
