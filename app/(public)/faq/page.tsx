'use client';

import React, { useState, useEffect } from 'react';
import { FAQPage } from '@/components/public/FAQPage';
import { AppointmentModal } from '@/components/modals/AppointmentModal';
import { StudentRegistrationModal } from '@/components/modals/StudentRegistrationModal';
import { api } from '@/lib/api-client';
import { CounsellingService, Course } from '@/src/types';
import { initialCounsellingServices, initialCourses } from '@/src/data/initialData';

export default function FAQRoutePage() {
  const [services, setServices] = useState<CounsellingService[]>(initialCounsellingServices);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    api.getServices().then(setServices).catch(() => {});
    api.getCourses().then(setCourses).catch(() => {});
  }, []);

  return (
    <>
      <FAQPage
        onOpenAppointment={() => setIsAppointmentOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />
      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        services={services}
      />
      <StudentRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        courses={courses}
      />
    </>
  );
}
