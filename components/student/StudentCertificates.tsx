'use client';
import React from 'react';
import { User } from '@/src/types';
import { Award, Download, Printer, ShieldCheck, Heart } from 'lucide-react';

interface StudentCertificatesProps {
  user: User;
}

export const StudentCertificates: React.FC<StudentCertificatesProps> = ({ user }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-amber-800 uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Academic Accreditation
        </span>
        <h1 className="text-3xl font-black text-slate-900">Issued Course Completion Certificates</h1>
        <p className="text-xs text-slate-600">Verified credentials issued by Helping Hearts Counselling & Wellness Centre.</p>
      </div>

      {/* Certificate Frame */}
      <div className="bg-amber-50/40 border-8 border-teal-900 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden print:border-4 print:shadow-none print:m-0">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-900 text-amber-300 flex items-center justify-center shadow-lg">
            <Heart className="w-8 h-8 fill-amber-300" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-teal-950 uppercase tracking-widest">
            Helping Hearts Counselling & Wellness Centre
          </h2>
          <p className="text-xs text-teal-800 font-bold uppercase tracking-wider">Colombo, Sri Lanka</p>
        </div>

        <div className="space-y-2 py-4 border-y border-amber-200">
          <p className="text-xs text-slate-600 font-serif italic">This is to certify that</p>
          <h3 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 underline underline-offset-8">
            {user.name}
          </h3>
          <p className="text-xs text-slate-600 font-serif italic pt-2">
            has successfully completed all required modules, practical clinical assessments, and attendance criteria for
          </p>
          <h4 className="text-xl font-bold text-teal-900 pt-1">
            Diploma in Professional Counselling Psychology
          </h4>
        </div>

        <div className="flex justify-between items-end pt-8 max-w-lg mx-auto text-xs text-slate-700">
          <div className="border-t border-slate-400 pt-1 px-4 text-center">
            <p className="font-bold text-slate-900">Ms. Ramsina Farvin Jelaldeen</p>
            <p className="text-[10px] text-slate-500">Wellness Director</p>
          </div>
          <div className="border-t border-slate-400 pt-1 px-4 text-center">
            <p className="font-bold text-slate-900">Dr. Kavinda De Silva</p>
            <p className="text-[10px] text-slate-500">Academic Registrar</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-md flex items-center gap-2"
        >
          <Printer className="w-4 h-4 text-amber-300" /> Print / Save PDF Certificate
        </button>
      </div>
    </div>
  );
};
