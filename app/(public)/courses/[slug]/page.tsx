'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CourseDetail } from '@/components/public/CourseDetail';
import { StudentRegistrationModal } from '@/components/modals/StudentRegistrationModal';
import { api } from '@/lib/api-client';
import { Course, CourseModule, Lecturer } from '@/src/types';
import { initialCourses, initialCourseModules, initialLecturers } from '@/src/data/initialData';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [lecturers, setLecturers] = useState<Lecturer[]>(initialLecturers);
  const [modules, setModules] = useState<CourseModule[]>(initialCourseModules);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    api.getCourses().then(setCourses).catch(() => {});
    api.getLecturers().then(setLecturers).catch(() => {});
  }, []);

  const course = courses.find((c) => c.id === slug || c.slug === slug) || courses[0];
  const lecturer = lecturers.find((l) => l.id === course?.lecturerId);

  useEffect(() => {
    if (course?.id) {
      api.getCourseModules(course.id).then(setModules).catch(() => {});
    }
  }, [course?.id]);

  return (
    <>
      <CourseDetail
        course={course}
        modules={modules.filter((m) => m.courseId === course?.id)}
        lecturer={lecturer}
        onBack={() => router.push('/courses')}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />
      <StudentRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        courses={courses}
        preselectedCourseId={course?.id}
      />
    </>
  );
}
