'use client';

import React, { useState, useEffect } from 'react';
import { ContactPage } from '@/components/public/ContactPage';
import { api } from '@/lib/api-client';
import { SiteSettings } from '@/src/types';
import { initialSiteSettings } from '@/src/data/initialData';

export default function ContactRoutePage() {
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
  }, []);

  return <ContactPage settings={settings} />;
}
