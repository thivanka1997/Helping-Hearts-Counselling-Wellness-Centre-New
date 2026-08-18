'use client';

import React, { useState, useEffect } from 'react';
import { AdminAppointments } from '@/components/admin/AdminAppointments';
import { api } from '@/lib/api-client';
import { ClientAppointment } from '@/src/types';
import { initialAppointments } from '@/src/data/initialData';

export default function AdminAppointmentsRoute() {
  const [appointments, setAppointments] = useState<ClientAppointment[]>(initialAppointments);

  useEffect(() => {
    api.getAppointments().then(setAppointments).catch(() => {});
  }, []);

  const handleUpdateStatus = async (id: string, status: any, notes?: string) => {
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, status, adminNotes: notes || a.adminNotes } : a)
    );
    api.updateAppointment(id, { status, adminNotes: notes });
  };

  return (
    <AdminAppointments
      appointments={appointments}
      onUpdateStatus={handleUpdateStatus}
      onSuccessToast={(msg) => alert(msg)}
    />
  );
}
