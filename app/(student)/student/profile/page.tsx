'use client';

import React from 'react';
import { StudentProfile } from '@/components/student/StudentProfile';
import { useStudentUser } from '@/lib/useStudentUser';

export default function StudentProfilePage() {
  const { user: currentUser } = useStudentUser();

  return <StudentProfile user={currentUser} />;
}
