'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Mail, MapPin, Clock, ShieldCheck, MessageSquare } from 'lucide-react';
import { SiteSettings } from '@/src/types';

interface FooterProps {
  setCurrentView?: (view: string) => void;
  settings?: SiteSettings;
  onOpenAppointment?: () => void;
}

const VIEW_MAP: Record<string, string> = {
  about: '/about',
  services: '/services',
  courses: '/courses',
  lecturers: '/lecturers',
  events: '/events',
  blog: '/blog',
  gallery: '/gallery',
  faq: '/faq',
  contact: '/contact'
};

export const Footer: React.FC<FooterProps> = ({ setCurrentView, settings, onOpenAppointment }) => {
  const router = useRouter();

  const handleNav = (viewId: string) => {
    if (setCurrentView) setCurrentView(viewId);
    const target = VIEW_MAP[viewId] || ('/' + viewId);
    router.push(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white p-0.5 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={settings?.logoUrl || '/assets/images/helping_hearts_logo_1786214208419.jpg'}
                  alt="Helping Hearts Logo"
                  className="w-full h-full object-contain rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">HELPING HEARTS</span>
                <span className="block text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
                  Counselling & Wellness
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Providing confidential, professional counselling services and accredited diploma education in psychology and behavioral wellness.
            </p>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-xs space-y-1">
              <div className="flex items-center gap-2 font-semibold text-amber-400">
                <ShieldCheck className="w-4 h-4" /> 100% Confidential Guarantee
              </div>
              <p className="text-slate-400">
                All client counselling records are strictly guarded and isolated from student educational systems.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-teal-500 pl-2">
              Quick Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { id: 'about', label: 'About Our Centre' },
                { id: 'services', label: 'Counselling Services' },
                { id: 'courses', label: 'Diploma & Certificate Courses' },
                { id: 'lecturers', label: 'Meet Our Lecturers' },
                { id: 'events', label: 'Events & Workshops' },
                { id: 'blog', label: 'Articles & Mental Health Blog' },
                { id: 'gallery', label: 'Photo & Video Gallery' },
                { id: 'faq', label: 'Frequently Asked Questions' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNav(link.id)}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <span className="text-teal-500">�</span> {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-teal-500 pl-2">
              Contact & Hours
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-1" />
                <span>{settings?.addressPhysical || 'HELPING HEARTS Counselling & Wellness, Thelangapatha Road, Wattala'}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{settings?.phonePrimary} / {settings?.phoneSecondary}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/94742344251?text=Hello%20Helping%20Hearts%20Admin,%20I%20would%20like%20to%20book%20a%20counselling%20appointment."
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-300 transition-colors text-emerald-400 font-bold"
                >
                  WhatsApp: +94 74 234 4251
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{settings?.emailPrimary}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-1" />
                <span>{settings?.openingHours}</span>
              </li>
            </ul>

            <button
              onClick={() => onOpenAppointment ? onOpenAppointment() : router.push('/services')}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-medium text-xs flex items-center justify-center gap-2 border border-teal-700 transition-all shadow-sm cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" /> Book Confidential Appointment
            </button>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Emergency & Support
            </h3>
            <div className="bg-rose-950/40 border border-rose-800/60 p-4 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-rose-300 block uppercase tracking-wider">
                Immediate Mental Health Help
              </span>
              <p className="text-xs text-rose-200 leading-relaxed">
                If you or a loved one is in immediate psychological distress, please contact national helpline <strong>1333</strong> or visit your nearest hospital emergency unit.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>� {new Date().getFullYear()} Helping Hearts Counselling & Wellness Centre. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => handleNav('faq')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Privacy & Confidentiality Policy
            </button>
            <button onClick={() => handleNav('contact')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Location & Access
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
