'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AppointmentModal } from '@/components/modals/AppointmentModal';
import { StudentRegistrationModal } from '@/components/modals/StudentRegistrationModal';
import { LoginModal } from '@/components/modals/LoginModal';
import { api } from '@/lib/api-client';
import { CounsellingService, Course, SiteSettings, User } from '@/src/types';
import { initialSiteSettings, initialCounsellingServices, initialCourses } from '@/src/data/initialData';
import { CheckCircle2, X } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [services, setServices] = useState<CounsellingService[]>(initialCounsellingServices);
  const [courses, setCourses] = useState<Course[]>(initialCourses);

  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
    api.getServices().then(setServices).catch(() => {});
    api.getCourses().then(setCourses).catch(() => {});
  }, []);

  const handleOpenAppointment = (serviceId?: string) => {
    setPreselectedServiceId(serviceId);
    setIsAppointmentOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-teal-700 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-teal-300 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <Navbar
        currentUser={session?.user as any}
        onOpenAppointment={() => handleOpenAppointment()}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        settings={settings}
      />

      <main className="flex-1">
        {children}
      </main>

      <Footer
        settings={settings}
        onOpenAppointment={() => handleOpenAppointment()}
      />

      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        services={services}
        preselectedServiceId={preselectedServiceId}
        onSuccessToast={showToast}
      />

      <StudentRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        courses={courses}
        onSuccessToast={showToast}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={() => {}}
        onSuccessToast={showToast}
      />
    </div>
  );
}
