'use client';

import React, { useState, useEffect } from 'react';
import { StudentAttendance } from '@/components/student/StudentAttendance';
import { api } from '@/lib/api-client';
import { AttendanceRecord, User } from '@/src/types';
import { initialAttendance, initialUsers } from '@/src/data/initialData';
import { useStudentUser } from '@/lib/useStudentUser';

export default function StudentAttendancePage() {
  const { user: currentUser } = useStudentUser();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);

  useEffect(() => {
    api.getAttendance().then(setAttendance).catch(() => {});
  }, []);

  return <StudentAttendance user={currentUser} attendance={attendance} />;
}
