'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useSession } from 'next-auth/react';

const ADMIN_TABS = [
  { id: 'DASHBOARD', label: 'Executive Dashboard', href: '/admin' },
  { id: 'STUDENTS', label: 'Student Slips', href: '/admin/students' },
  { id: 'APPOINTMENTS', label: 'Client Inquiries', href: '/admin/appointments' },
  { id: 'COURSES', label: 'LMS Courses', href: '/admin/courses' },
  { id: 'LECTURERS', label: 'Lecturer Profiles', href: '/admin/lecturers' },
  { id: 'ATTENDANCE', label: 'Attendance', href: '/admin/attendance' },
  { id: 'CMS', label: 'Site CMS', href: '/admin/cms' },
  { id: 'MEDIA', label: 'Media Library', href: '/admin/media' },
  { id: 'DATABASE', label: 'Database Docs', href: '/admin/database' },
  { id: 'USER_GUIDE', label: '?? User Guide (PDF)', href: '/admin/user-guide' }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 font-sans">
      <Navbar currentUser={session?.user as any} />

      {/* Admin Sub-Header Navigation Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-2.5 px-4 sm:px-8 sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-2">
          <div className="flex items-center gap-1 font-bold text-xs shrink-0">
            <span className="text-amber-400">ADMIN CONTROL:</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold overflow-x-auto">
            {ADMIN_TABS.map((tab) => {
              const isActive = tab.href === '/admin' ? pathname === '/admin' : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}
