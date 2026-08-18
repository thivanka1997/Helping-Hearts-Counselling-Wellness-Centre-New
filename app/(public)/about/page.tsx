'use client';

import React, { useState, useEffect } from 'react';
import { AboutUs } from '@/components/public/AboutUs';
import { AppointmentModal } from '@/components/modals/AppointmentModal';
import { api } from '@/lib/api-client';
import { Lecturer, CounsellingService, SiteSettings } from '@/src/types';
import { initialLecturers, initialCounsellingServices, initialSiteSettings } from '@/src/data/initialData';

export default function AboutPage() {
  const [lecturers, setLecturers] = useState<Lecturer[]>(initialLecturers);
  const [services, setServices] = useState<CounsellingService[]>(initialCounsellingServices);
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);

  useEffect(() => {
    api.getLecturers().then(setLecturers).catch(() => {});
    api.getServices().then(setServices).catch(() => {});
    api.getSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <>
      <AboutUs
        lecturers={lecturers}
        settings={settings}
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
