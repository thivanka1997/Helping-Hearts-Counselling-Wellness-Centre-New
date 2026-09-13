'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StudentCourseViewer } from '@/components/student/StudentCourseViewer';
import { api } from '@/lib/api-client';
import { Course, CourseModule } from '@/src/types';
import { initialCourses, initialCourseModules } from '@/src/data/initialData';

export default function StudentCourseViewerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [modules, setModules] = useState<CourseModule[]>(initialCourseModules);

  useEffect(() => {
    api.getCourses().then(setCourses).catch(() => {});
  }, []);

  const course = courses.find((c) => c.id === courseId || (c as any)._id === courseId || c.slug === courseId) || courses[0];

  useEffect(() => {
    if (course?.id) {
      api.getCourseModules(course.id).then((fetchedMods) => {
        if (fetchedMods && fetchedMods.length > 0) {
          setModules(fetchedMods);
        }
      }).catch(() => {});
    }
  }, [course?.id]);

  const courseModules = modules.filter((m) => m.courseId === course?.id);
  const activeModules = courseModules.length > 0 ? courseModules : modules;

  return (
    <StudentCourseViewer
      course={course}
      modules={activeModules}
      onBack={() => router.push('/student/dashboard')}
      onSuccessToast={(msg) => alert(msg)}
    />
  );
}
