'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home } from '@/components/public/Home';
import { AppointmentModal } from '@/components/modals/AppointmentModal';
import { StudentRegistrationModal } from '@/components/modals/StudentRegistrationModal';
import { VideoModal } from '@/components/modals/VideoModal';
import { api } from '@/lib/api-client';
import { CounsellingService, Course, Lecturer, EventWorkshop, BlogArticle, GalleryMedia, Testimonial, SiteSettings } from '@/src/types';
import {
  initialCounsellingServices,
  initialCourses,
  initialLecturers,
  initialEvents,
  initialBlogs,
  initialGallery,
  initialTestimonials,
  initialSiteSettings
} from '@/src/data/initialData';

export default function HomePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [services, setServices] = useState<CounsellingService[]>(initialCounsellingServices);
  const [lecturers, setLecturers] = useState<Lecturer[]>(initialLecturers);
  const [events, setEvents] = useState<EventWorkshop[]>(initialEvents);
  const [blogs, setBlogs] = useState<BlogArticle[]>(initialBlogs);
  const [gallery, setGallery] = useState<GalleryMedia[]>(initialGallery);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);

  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    api.getCourses().then(setCourses).catch(() => {});
    api.getServices().then(setServices).catch(() => {});
    api.getLecturers().then(setLecturers).catch(() => {});
    api.getEvents().then(setEvents).catch(() => {});
    api.getBlogs().then(setBlogs).catch(() => {});
    api.getGallery().then(setGallery).catch(() => {});
    api.getTestimonials().then(setTestimonials).catch(() => {});
    api.getSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <>
      <Home
        courses={courses}
        services={services}
        lecturers={lecturers}
        events={events}
        blogs={blogs}
        gallery={gallery}
        testimonials={testimonials}
        settings={settings}
        onOpenAppointment={() => setIsAppointmentOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenVideo={() => setIsVideoOpen(true)}
        onSelectCourse={(crsId) => router.push(`/courses/${crsId}`)}
        setCurrentView={(view) => router.push(`/${view === 'home' ? '' : view}`)}
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

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl="https://drive.google.com/file/d/1noKss0u6jMGuXkw0ZD-Kpp2cx8-Td1G0/preview"
        title="Helping Hearts Counselling & Wellness Centre"
        description="Discover our compassionate psychological counselling, serene sanctuary in Wattala, and professional diploma training programs in collaboration with CIMS Campus."
        onOpenAppointment={() => {
          setIsVideoOpen(false);
          setIsAppointmentOpen(true);
        }}
        onOpenRegister={() => {
          setIsVideoOpen(false);
          setIsRegisterOpen(true);
        }}
      />
    </>
  );
}
