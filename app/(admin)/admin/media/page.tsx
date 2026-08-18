'use client';

import React, { useState, useEffect } from 'react';
import { AdminMediaLibrary } from '@/components/admin/AdminMediaLibrary';
import { api } from '@/lib/api-client';
import { GalleryMedia } from '@/src/types';
import { initialGallery } from '@/src/data/initialData';

export default function AdminMediaRoute() {
  const [gallery, setGallery] = useState<GalleryMedia[]>(initialGallery);

  useEffect(() => {
    api.getGallery().then(setGallery).catch(() => {});
  }, []);

  return (
    <AdminMediaLibrary
      gallery={gallery}
      onSaveMedia={(item) => {
        setGallery(prev => {
          const exists = prev.some(x => x.id === item.id);
          return exists ? prev.map(x => x.id === item.id ? item : x) : [item, ...prev];
        });
        api.updateGalleryItem(item.id, item);
      }}
      onDeleteMedia={(id) => {
        setGallery(prev => prev.filter(x => x.id !== id));
        api.deleteGalleryItem(id);
      }}
      onSuccessToast={(msg) => alert(msg)}
    />
  );
}
