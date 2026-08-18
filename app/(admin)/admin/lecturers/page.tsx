'use client';

import React, { useState, useEffect } from 'react';
import { AdminLecturers } from '@/components/admin/AdminLecturers';
import { api } from '@/lib/api-client';
import { Lecturer, Course } from '@/src/types';
import { initialLecturers, initialCourses } from '@/src/data/initialData';

export default function AdminLecturersRoute() {
  const [lecturers, setLecturers] = useState<Lecturer[]>(initialLecturers);
  const [courses, setCourses] = useState<Course[]>(initialCourses);

  useEffect(() => {
    api.getLecturers().then(setLecturers).catch(() => {});
    api.getCourses().then(setCourses).catch(() => {});
  }, []);

  const handleSave = async (updated: Lecturer) => {
    const exists = lecturers.some(l => l.id === updated.id);
    setLecturers(prev => {
      return exists ? prev.map(l => l.id === updated.id ? updated : l) : [...prev, updated];
    });
    try {
      if (exists) {
        await api.updateLecturer(updated.id, updated);
      } else {
        await api.createLecturer(updated);
      }
    } catch (err) {
      console.error('Failed to save lecturer to MongoDB:', err);
    }
  };

  const handleDelete = async (id: string) => {
    setLecturers(prev => prev.filter(l => l.id !== id));
    try {
      await api.deleteLecturer(id);
    } catch (err) {
      console.error('Failed to delete lecturer from MongoDB:', err);
    }
  };

  return (
    <AdminLecturers
      lecturers={lecturers}
      courses={courses}
      onSaveLecturer={handleSave}
      onDeleteLecturer={handleDelete}
      onSuccessToast={(msg) => alert(msg)}
    />
  );
}
