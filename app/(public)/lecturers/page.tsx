'use client';

import React, { useState, useEffect } from 'react';
import { LecturersPage } from '@/components/public/LecturersPage';
import { AppointmentModal } from '@/components/modals/AppointmentModal';
import { api } from '@/lib/api-client';
import { Lecturer, CounsellingService } from '@/src/types';
import { initialLecturers, initialCounsellingServices } from '@/src/data/initialData';

export default function LecturersRoutePage() {
  const [lecturers, setLecturers] = useState<Lecturer[]>(initialLecturers);
  const [services, setServices] = useState<CounsellingService[]>(initialCounsellingServices);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);

  useEffect(() => {
    api.getLecturers().then(setLecturers).catch(() => {});
    api.getServices().then(setServices).catch(() => {});
  }, []);

  return (
    <>
      <LecturersPage
        lecturers={lecturers}
        onOpenAppointment={() => setIsAppointmentOpen(true)}
      />
      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        services={services}
      />
    </>
  );
}
