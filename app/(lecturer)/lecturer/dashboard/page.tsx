'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { LecturerDashboard } from '@/components/lecturer/LecturerDashboard';
import { api } from '@/lib/api-client';
import { Course, AttendanceRecord, StudentRegistration, User } from '@/src/types';
import { initialCourses, initialAttendance, initialRegistrations, initialUsers } from '@/src/data/initialData';

export default function LecturerDashboardPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [registrations, setRegistrations] = useState<StudentRegistration[]>(initialRegistrations);

  const currentUser: User = (session?.user as any) || initialUsers.find(u => u.role === 'LECTURER') || initialUsers[0];

  useEffect(() => {
    api.getCourses().then(setCourses).catch(() => {});
    api.getAttendance().then(setAttendance).catch(() => {});
    api.getRegistrations().then(setRegistrations).catch(() => {});
  }, []);

  const handleMarkAttendance = async (record: Omit<AttendanceRecord, 'id'>) => {
    try {
      const res = await api.markAttendance(record);
      if (res.success && res.record) {
        setAttendance([res.record, ...attendance]);
      }
    } catch {
      const newAtt = { id: `att_${Date.now()}`, ...record };
      setAttendance([newAtt, ...attendance]);
    }
  };

  return (
    <LecturerDashboard
      user={currentUser}
      courses={courses}
      attendance={attendance}
      registrations={registrations}
      onMarkAttendance={handleMarkAttendance}
      onSuccessToast={(msg) => alert(msg)}
    />
  );
}
