'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CourseCatalog } from '@/components/public/CourseCatalog';
import { StudentRegistrationModal } from '@/components/modals/StudentRegistrationModal';
import { api } from '@/lib/api-client';
import { Course } from '@/src/types';
import { initialCourses } from '@/src/data/initialData';

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    api.getCourses().then(setCourses).catch(() => {});
  }, []);

  return (
    <>
      <CourseCatalog
        courses={courses}
        onSelectCourse={(crsId) => router.push(`/courses/${crsId}`)}
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
