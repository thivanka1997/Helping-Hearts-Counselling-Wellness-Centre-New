'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminStudents } from '@/components/admin/AdminStudents';
import { api } from '@/lib/api-client';
import { StudentRegistration, Course } from '@/src/types';
import { initialRegistrations, initialCourses } from '@/src/data/initialData';

export default function AdminStudentsRoute() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<StudentRegistration[]>(initialRegistrations);
  const [courses, setCourses] = useState<Course[]>(initialCourses);

  useEffect(() => {
    api.getRegistrations().then(setRegistrations).catch(() => {});
    api.getCourses().then(setCourses).catch(() => {});
  }, []);

  const handleAddStudent = async (newStudent: StudentRegistration) => {
    setRegistrations(prev => [newStudent, ...prev]);
    try {
      const res = await api.createRegistration(newStudent);
      if (res?.registration) {
        setRegistrations(prev => prev.map(r => r.id === newStudent.id ? res.registration : r));
      }
    } catch (err) {
      console.error('Failed to persist student registration to MongoDB:', err);
    }
  };

  const handleUpdateStatus = async (id: string, status: any, reason?: string, credentials?: any) => {
    const username = credentials?.username;
    const password = credentials?.password;
    setRegistrations(prev =>
      prev.map(r => r.id === id ? {
        ...r,
        status,
        adminNotes: reason || r.adminNotes,
        assignedUsername: username || r.assignedUsername || r.email,
        assignedPassword: password || r.assignedPassword || 'Student2026#HH'
      } : r)
    );
    try {
      await api.updateRegistration(id, {
        status,
        rejectionReason: reason,
        adminNotes: reason,
        ...(username ? { assignedUsername: username } : {}),
        ...(password ? { assignedPassword: password } : {})
      });
    } catch (err) {
      console.error('Failed to update student status/credentials in MongoDB:', err);
    }
  };

  const handleUpdateCredentials = async (id: string, username: string, password: string) => {
    setRegistrations(prev =>
      prev.map(r => r.id === id ? { ...r, assignedUsername: username, assignedPassword: password } : r)
    );
    try {
      await api.updateRegistration(id, { assignedUsername: username, assignedPassword: password });
    } catch (err) {
      console.error('Failed to update credentials in MongoDB:', err);
    }
  };

  return (
    <AdminStudents
      registrations={registrations}
      courses={courses}
      onAddStudent={handleAddStudent}
      onUpdateStatus={handleUpdateStatus}
      onUpdateCredentials={handleUpdateCredentials}
      onDirectLoginAsStudent={() => router.push('/student/dashboard')}
      onSuccessToast={(msg) => alert(msg)}
    />
  );
}
