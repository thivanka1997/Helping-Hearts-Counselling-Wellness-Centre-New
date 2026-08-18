'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { api } from '@/lib/api-client';
import {
  StudentRegistration,
  ClientAppointment,
  Course,
  Lecturer,
  EventWorkshop,
  BlogArticle,
  User
} from '@/src/types';
import {
  initialRegistrations,
  initialAppointments,
  initialCourses,
  initialLecturers,
  initialEvents,
  initialBlogs,
  initialUsers
} from '@/src/data/initialData';

export default function AdminDashboardRoute() {
  const router = useRouter();
  const { data: session } = useSession();
  const [registrations, setRegistrations] = useState<StudentRegistration[]>(initialRegistrations);
  const [appointments, setAppointments] = useState<ClientAppointment[]>(initialAppointments);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [lecturers, setLecturers] = useState<Lecturer[]>(initialLecturers);
  const [events, setEvents] = useState<EventWorkshop[]>(initialEvents);
  const [blogs, setBlogs] = useState<BlogArticle[]>(initialBlogs);

  const currentUser: User = (session?.user as any) || initialUsers.find(u => u.role === 'ADMIN') || initialUsers[0];

  useEffect(() => {
    api.getRegistrations().then(setRegistrations).catch(() => { });
    api.getAppointments().then(setAppointments).catch(() => { });
    api.getCourses().then(setCourses).catch(() => { });
    api.getLecturers().then(setLecturers).catch(() => { });
    api.getEvents().then(setEvents).catch(() => { });
    api.getBlogs().then(setBlogs).catch(() => { });
  }, []);

  const tabMap: Record<string, string> = {
    DASHBOARD: '/admin',
    STUDENTS: '/admin/students',
    APPOINTMENTS: '/admin/appointments',
    COUNSELLING_DESK: '/admin/appointments',
    COURSES: '/admin/courses',
    LECTURERS: '/admin/lecturers',
    ATTENDANCE: '/admin/attendance',
    CMS: '/admin/cms',
    MEDIA: '/admin/media',
    DATABASE: '/admin/database',
    USER_GUIDE: '/admin/user-guide'
  };

  return (
    <AdminDashboard
      user={currentUser}
      registrations={registrations}
      appointments={appointments}
      courses={courses}
      lecturers={lecturers}
      events={events}
      blogs={blogs}
      setCurrentAdminTab={(tab) => {
        if (tabMap[tab]) router.push(tabMap[tab]);
      }}
    />
  );
}
