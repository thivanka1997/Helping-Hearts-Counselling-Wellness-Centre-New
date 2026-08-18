'use client';
import React from 'react';
import { Course, CourseModule, Lecturer } from '@/src/types';
import { GraduationCap, Clock, Calendar, CheckCircle2, User, ArrowLeft, BookOpen, FileText, Video } from 'lucide-react';

interface CourseDetailProps {
  course: Course;
  modules: CourseModule[];
  lecturer?: Lecturer;
  onBack: () => void;
  onOpenRegister: () => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({
  course,
  modules,
  lecturer,
  onBack,
  onOpenRegister
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-teal-800 hover:text-teal-950 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Course Catalog
      </button>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-500 text-slate-950 text-[10px] font-bold uppercase px-2.5 py-1 rounded">
              {course.level}
            </span>
            <span className="bg-teal-800 text-teal-100 text-[10px] font-bold uppercase px-2.5 py-1 rounded border border-teal-700">
              {course.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{course.title}</h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{course.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-teal-800 text-xs">
            <div>
              <span className="text-teal-300 block">Duration</span>
              <span className="font-bold text-white text-sm">{course.duration}</span>
            </div>
            <div>
              <span className="text-teal-300 block">Schedule</span>
              <span className="font-bold text-white text-sm">{course.schedule}</span>
            </div>
            <div>
              <span className="text-teal-300 block">Tuition Fee</span>
              <span className="font-bold text-amber-300 text-sm">{course.currency || 'LKR'} {(course.fee ?? (course as any).price ?? 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-800/90 p-6 rounded-2xl border border-slate-700 text-center space-y-4">
          <img src={course.image} alt={course.title} className="rounded-xl object-cover h-44 w-full shadow-md" />
          <p className="text-xs text-slate-300">
            Manual Bank Transfer Slip verification required before LMS access is activated.
          </p>
          <button
            onClick={onOpenRegister}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all"
          >
            Register & Submit Payment Slip
          </button>
        </div>
      </div>

      {/* Outcomes & Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-700" /> What You Will Learn
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {(course.outcomes || []).length > 0 ? (
              course.outcomes.map((o, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-teal-700 font-bold">•</span>
                  <span>{o}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic text-xs">Comprehensive clinical &amp; therapeutic foundations covered in this program.</li>
            )}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-teal-700" /> Admission Requirements
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {(course.requirements || []).length > 0 ? (
              course.requirements.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic text-xs">G.C.E. Advanced Level qualification or equivalent professional background.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Assigned Lecturer */}
      {lecturer && (
        <div className="bg-teal-50 border border-teal-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <img
            src={lecturer.photo}
            alt={lecturer.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md shrink-0"
          />
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold text-teal-800 uppercase">Assigned Faculty Member</span>
            <h3 className="text-xl font-bold text-slate-900">{lecturer.name}</h3>
            <p className="text-xs font-semibold text-teal-900">{lecturer.title}</p>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{lecturer.bio}</p>
          </div>
        </div>
      )}
    </div>
  );
};
