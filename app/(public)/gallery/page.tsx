'use client';

import React, { useState, useEffect } from 'react';
import { GalleryPage } from '@/components/public/GalleryPage';
import { api } from '@/lib/api-client';
import { GalleryMedia } from '@/src/types';
import { initialGallery } from '@/src/data/initialData';

export default function GalleryRoutePage() {
  const [gallery, setGallery] = useState<GalleryMedia[]>(initialGallery);

  useEffect(() => {
    api.getGallery().then(setGallery).catch(() => {});
  }, []);

  return <GalleryPage gallery={gallery} />;
}
