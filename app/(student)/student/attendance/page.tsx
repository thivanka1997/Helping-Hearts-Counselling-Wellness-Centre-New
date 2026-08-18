'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { StudentAttendance } from '@/components/student/StudentAttendance';
import { api } from '@/lib/api-client';
import { AttendanceRecord, User } from '@/src/types';
import { initialAttendance, initialUsers } from '@/src/data/initialData';

export default function StudentAttendancePage() {
  const { data: session } = useSession();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);

  const currentUser: User = (session?.user as any) || initialUsers.find(u => u.role === 'STUDENT') || initialUsers[0];

  useEffect(() => {
    api.getAttendance().then(setAttendance).catch(() => {});
  }, []);

  return <StudentAttendance user={currentUser} attendance={attendance} />;
}
