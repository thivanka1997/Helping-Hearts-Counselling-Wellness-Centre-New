'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { StudentDashboard } from '@/components/student/StudentDashboard';
import { api } from '@/lib/api-client';
import { Course, AttendanceRecord, Announcement, User } from '@/src/types';
import { initialCourses, initialAttendance, initialAnnouncements, initialUsers } from '@/src/data/initialData';

export default function StudentDashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

  const currentUser: User = (session?.user as any) || initialUsers.find(u => u.role === 'STUDENT') || initialUsers[0];

  useEffect(() => {
    api.getCourses().then(setCourses).catch(() => {});
    api.getAttendance().then(setAttendance).catch(() => {});
    api.getAnnouncements().then(setAnnouncements).catch(() => {});
  }, []);

  return (
    <StudentDashboard
      user={currentUser}
      courses={courses}
      attendance={attendance}
      announcements={announcements}
      onOpenCourseViewer={(crsId) => router.push(`/student/courses/${crsId}`)}
      setCurrentView={(view) => {
        if (view === 'student-courses') router.push('/student/courses');
        else if (view === 'student-attendance') router.push('/student/attendance');
        else if (view === 'student-certificates') router.push('/student/certificates');
        else if (view === 'student-profile') router.push('/student/profile');
        else router.push('/student/dashboard');
      }}
    />
  );
}
