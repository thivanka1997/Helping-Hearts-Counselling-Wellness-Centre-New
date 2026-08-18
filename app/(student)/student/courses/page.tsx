'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CourseCatalog } from '@/components/public/CourseCatalog';
import { StudentRegistrationModal } from '@/components/modals/StudentRegistrationModal';
import { api } from '@/lib/api-client';
import { Course } from '@/src/types';
import { initialCourses } from '@/src/data/initialData';

export default function StudentCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    api.getCourses().then(setCourses).catch(() => {});
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Enrolled & Available LMS Courses</h1>
        <p className="text-sm text-slate-500">Access your active learning materials or enroll in additional diploma certifications.</p>
      </div>
      <CourseCatalog
        courses={courses}
        onSelectCourse={(crsId) => router.push(`/student/courses/${crsId}`)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />
      <StudentRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        courses={courses}
      />
    </>
  );
}
