'use client';

import React, { useState, useEffect } from 'react';
import { AdminCourses } from '@/components/admin/AdminCourses';
import { api } from '@/lib/api-client';
import { Course, Lecturer } from '@/src/types';
import { initialCourses, initialLecturers } from '@/src/data/initialData';

export default function AdminCoursesRoute() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [lecturers, setLecturers] = useState<Lecturer[]>(initialLecturers);

  useEffect(() => {
    api.getCourses().then(setCourses).catch(() => {});
    api.getLecturers().then(setLecturers).catch(() => {});
  }, []);

  const handleSaveCourse = async (updatedCrs: Course) => {
    const exists = courses.some(c => c.id === updatedCrs.id);
    if (exists) {
      setCourses(courses.map(c => c.id === updatedCrs.id ? updatedCrs : c));
      api.updateCourse(updatedCrs.id, updatedCrs);
    } else {
      setCourses([updatedCrs, ...courses]);
      api.createCourse(updatedCrs);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    api.deleteCourse(courseId);
  };

  return (
    <AdminCourses
      courses={courses}
      lecturers={lecturers}
      onSaveCourse={handleSaveCourse}
      onDeleteCourse={handleDeleteCourse}
      onSuccessToast={(msg) => alert(msg)}
    />
  );
}
