'use client';
import React from 'react';
import { User } from '@/src/types';
import { User as UserIcon, Mail, Phone, MapPin, Calendar, ShieldCheck } from 'lucide-react';

interface StudentProfileProps {
  user: User;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ user }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-full bg-teal-800 text-amber-300 font-extrabold text-2xl flex items-center justify-center shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-xs text-slate-500">{user.email}</p>
            <span className="inline-block mt-1 bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Registered LMS Student
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-700">
          <h2 className="text-sm font-bold text-slate-900 uppercase">Student Account Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-500 block">Phone Number</span>
              <strong className="text-slate-800">{user.phone || '+94 75 123 4567'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Account Status</span>
              <strong className="text-emerald-700 uppercase">{user.status}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Enrollment Date</span>
              <strong className="text-slate-800">{user.createdAt}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Primary Institution</span>
              <strong className="text-slate-800">Helping Hearts LMS</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
