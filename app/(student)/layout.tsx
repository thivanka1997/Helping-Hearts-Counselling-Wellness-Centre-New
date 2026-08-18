'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useSession } from 'next-auth/react';
import { GraduationCap, BookOpen, Clock, Award, User } from 'lucide-react';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const navTabs = [
    { label: 'Dashboard', href: '/student/dashboard', icon: GraduationCap },
    { label: 'My Courses', href: '/student/courses', icon: BookOpen },
    { label: 'Attendance', href: '/student/attendance', icon: Clock },
    { label: 'Certificates', href: '/student/certificates', icon: Award },
    { label: 'Profile', href: '/student/profile', icon: User }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 font-sans">
      <Navbar currentUser={session?.user as any} />

      {/* Student LMS Sub-Header */}
      <div className="bg-teal-900 text-white border-b border-teal-800 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-2">
          <div className="flex items-center gap-2 font-bold text-xs shrink-0">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300">STUDENT LMS PORTAL:</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold overflow-x-auto">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'bg-teal-800 text-teal-100 hover:bg-teal-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
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
