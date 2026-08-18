'use client';

import React, { useState, useEffect } from 'react';
import { EventsWorkshops } from '@/components/public/EventsWorkshops';
import { api } from '@/lib/api-client';
import { EventWorkshop } from '@/src/types';
import { initialEvents } from '@/src/data/initialData';

export default function EventsPage() {
  const [events, setEvents] = useState<EventWorkshop[]>(initialEvents);

  useEffect(() => {
    api.getEvents().then(setEvents).catch(() => {});
  }, []);

  return <EventsWorkshops events={events} />;
}
