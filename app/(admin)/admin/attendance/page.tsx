'use client';

import React, { useState, useEffect } from 'react';
import { AdminAttendance } from '@/components/admin/AdminAttendance';
import { api } from '@/lib/api-client';
import { AttendanceRecord, Course } from '@/src/types';
import { initialAttendance, initialCourses } from '@/src/data/initialData';

export default function AdminAttendanceRoute() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [courses, setCourses] = useState<Course[]>(initialCourses);

  useEffect(() => {
    api.getAttendance().then(setAttendance).catch(() => {});
    api.getCourses().then(setCourses).catch(() => {});
  }, []);

  return <AdminAttendance attendance={attendance} courses={courses} />;
}
