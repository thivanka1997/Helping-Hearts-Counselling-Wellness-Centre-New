'use client';

import React, { useState, useEffect } from 'react';
import { CounsellingServices } from '@/components/public/CounsellingServices';
import { AppointmentModal } from '@/components/modals/AppointmentModal';
import { api } from '@/lib/api-client';
import { CounsellingService } from '@/src/types';
import { initialCounsellingServices } from '@/src/data/initialData';

export default function ServicesPage() {
  const [services, setServices] = useState<CounsellingService[]>(initialCounsellingServices);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);

  useEffect(() => {
    api.getServices().then(setServices).catch(() => {});
  }, []);

  const handleOpen = (id?: string) => {
    setSelectedServiceId(id);
    setIsAppointmentOpen(true);
  };

  return (
    <>
      <CounsellingServices
        services={services}
        onOpenAppointmentWithService={handleOpen}
      />
      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        services={services}
        preselectedServiceId={selectedServiceId}
      />
    </>
  );
}
