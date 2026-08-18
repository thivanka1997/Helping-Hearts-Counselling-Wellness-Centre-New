'use client';
import React from 'react';
import { Lecturer } from '@/src/types';
import { Mail, Phone, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface LecturersPageProps {
  lecturers: Lecturer[];
  onOpenAppointment: () => void;
}

export const LecturersPage: React.FC<LecturersPageProps> = ({ lecturers }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-widest text-teal-800 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
          Faculty & Clinical Leadership
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Academic Team
        </h1>
      </div>

      {/* Lecturers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {lecturers.map((lec) => {
          const roles = lec.title.split(/,|&|\|/).map(r => r.trim()).filter(Boolean);

          return (
            <div
              key={lec.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start gap-6 relative overflow-hidden"
            >
              <div className="shrink-0 mx-auto sm:mx-0 text-center space-y-2">
                <img
                  src={lec.photo}
                  alt={lec.name}
                  className="w-32 h-36 sm:w-36 sm:h-40 rounded-2xl object-cover border-2 border-teal-700 shadow-md mx-auto"
                  referrerPolicy="no-referrer"
                />
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  Panel Member
                </span>
              </div>

              <div className="space-y-3.5 flex-1 text-center sm:text-left">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">{lec.name}</h2>
                  <p className="text-xs font-semibold text-teal-800 mt-1 leading-relaxed">{lec.title}</p>
                </div>

                {/* Role Badges */}
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {roles.map((role, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-200"
                    >
                      {role}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600 border-t border-slate-100 justify-center sm:justify-start">
                  <a
                    href={`mailto:${lec.email || 'helpingheartscounsellingservic@gmail.com'}`}
                    className="flex items-center gap-1.5 font-medium text-slate-700 hover:text-teal-800 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>{lec.email || 'helpingheartscounsellingservic@gmail.com'}</span>
                  </a>
                  <a
                    href={`tel:${lec.phone || '0742344251'}`}
                    className="flex items-center gap-1.5 font-medium text-slate-700 hover:text-teal-800 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>{lec.phone || '0742344251'}</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

