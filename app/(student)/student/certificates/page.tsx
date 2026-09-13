'use client';

import React from 'react';
import { StudentCertificates } from '@/components/student/StudentCertificates';
import { useStudentUser } from '@/lib/useStudentUser';

export default function StudentCertificatesPage() {
  const { user: currentUser } = useStudentUser();

  return <StudentCertificates user={currentUser} />;
}
