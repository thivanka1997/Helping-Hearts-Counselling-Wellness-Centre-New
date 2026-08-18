'use client';

import React, { useState, useEffect } from 'react';
import { AdminCMS } from '@/components/admin/AdminCMS';
import { api } from '@/lib/api-client';
import { SiteSettings, EventWorkshop, BlogArticle, GalleryMedia, Testimonial, FAQItem, CounsellingService } from '@/src/types';
import {
  initialSiteSettings,
  initialEvents,
  initialBlogs,
  initialGallery,
  initialTestimonials,
  initialFAQs,
  initialCounsellingServices
} from '@/src/data/initialData';

export default function AdminCMSRoute() {
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFAQs);
  const [services, setServices] = useState<CounsellingService[]>(initialCounsellingServices);
  const [events, setEvents] = useState<EventWorkshop[]>(initialEvents);
  const [blogs, setBlogs] = useState<BlogArticle[]>(initialBlogs);
  const [gallery, setGallery] = useState<GalleryMedia[]>(initialGallery);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
    api.getTestimonials().then(setTestimonials).catch(() => {});
    api.getFAQs().then(setFaqs).catch(() => {});
    api.getServices().then(setServices).catch(() => {});
    api.getEvents().then(setEvents).catch(() => {});
    api.getBlogs().then(setBlogs).catch(() => {});
    api.getGallery().then(setGallery).catch(() => {});
  }, []);

  return (
    <AdminCMS
      settings={settings}
      testimonials={testimonials}
      faqs={faqs}
      services={services}
      events={events}
      blogs={blogs}
      gallery={gallery}
      onSaveSettings={async (s) => {
        setSettings(s);
        const res = await api.updateSettings(s);
        if (res && (res as any).settings) {
          setSettings((res as any).settings);
        }
      }}
      onSaveTestimonial={(t) => {
        setTestimonials(prev => {
          const exists = prev.some(x => x.id === t.id);
          return exists ? prev.map(x => x.id === t.id ? t : x) : [t, ...prev];
        });
        const exists = testimonials.some(x => x.id === t.id);
        if (exists) {
          api.updateTestimonial(t.id, t);
        } else {
          api.createTestimonial(t);
        }
      }}
      onDeleteTestimonial={(id) => {
        setTestimonials(prev => prev.filter(x => x.id !== id));
        api.deleteTestimonial(id);
      }}
      onSaveFAQ={(f) => {
        setFaqs(prev => {
          const exists = prev.some(x => x.id === f.id);
          return exists ? prev.map(x => x.id === f.id ? f : x) : [...prev, f];
        });
        const exists = faqs.some(x => x.id === f.id);
        if (exists) {
          api.updateFAQ(f.id, f);
        } else {
          api.createFAQ(f);
        }
      }}
      onDeleteFAQ={(id) => {
        setFaqs(prev => prev.filter(x => x.id !== id));
        api.deleteFAQ(id);
      }}
      onSaveService={(srv) => {
        setServices(prev => {
          const exists = prev.some(x => x.id === srv.id);
          return exists ? prev.map(x => x.id === srv.id ? srv : x) : [srv, ...prev];
        });
        const exists = services.some(x => x.id === srv.id);
        if (exists) {
          api.updateService(srv.id, srv);
        } else {
          api.createService(srv);
        }
      }}
      onDeleteService={(id) => {
        setServices(prev => prev.filter(x => x.id !== id));
        api.deleteService(id);
      }}
      onSaveEvent={(e) => {
        setEvents(prev => {
          const exists = prev.some(x => x.id === e.id);
          return exists ? prev.map(x => x.id === e.id ? e : x) : [e, ...prev];
        });
        api.updateEvent(e.id, e);
      }}
      onDeleteEvent={(id) => {
        setEvents(prev => prev.filter(x => x.id !== id));
        api.deleteEvent(id);
      }}
      onSaveBlog={(b) => {
        setBlogs(prev => {
          const exists = prev.some(x => x.id === b.id);
          return exists ? prev.map(x => x.id === b.id ? b : x) : [b, ...prev];
        });
        api.updateBlog(b.id, b);
      }}
      onDeleteBlog={(id) => {
        setBlogs(prev => prev.filter(x => x.id !== id));
        api.deleteBlog(id);
      }}
      onSaveGallery={(g) => {
        setGallery(prev => {
          const exists = prev.some(x => x.id === g.id);
          return exists ? prev.map(x => x.id === g.id ? g : x) : [g, ...prev];
        });
        api.updateGalleryItem(g.id, g);
      }}
      onDeleteGallery={(id) => {
        setGallery(prev => prev.filter(x => x.id !== id));
        api.deleteGalleryItem(id);
      }}
      onSuccessToast={(msg) => alert(msg)}
    />
  );
}

