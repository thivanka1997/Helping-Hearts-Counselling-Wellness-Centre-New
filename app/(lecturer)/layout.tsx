'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useSession } from 'next-auth/react';
import { UserCheck } from 'lucide-react';

export default function LecturerLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 font-sans">
      <Navbar currentUser={session?.user as any} />

      <div className="bg-purple-950 text-white border-b border-purple-900 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-xs">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300">FACULTY & LECTURER PORTAL</span>
          </div>
          <span className="text-xs text-purple-200">Helping Hearts Academic Management</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}
