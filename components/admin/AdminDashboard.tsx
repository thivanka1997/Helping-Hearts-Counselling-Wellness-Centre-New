'use client';
import React from 'react';
import { User, StudentRegistration, ClientAppointment, Course, Lecturer, EventWorkshop, BlogArticle } from '@/src/types';
import { Lock, Users, CreditCard, Calendar, BookOpen, UserCheck, Eye, CheckCircle2, XCircle, AlertCircle, Database, Sparkles, FileText } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  registrations: StudentRegistration[];
  appointments: ClientAppointment[];
  courses: Course[];
  lecturers: Lecturer[];
  events: EventWorkshop[];
  blogs: BlogArticle[];
  setCurrentAdminTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  registrations,
  appointments,
  courses,
  lecturers,
  events,
  blogs,
  setCurrentAdminTab
}) => {
  const pendingRegistrations = registrations.filter((r) => r.status === 'Pending');
  const pendingAppointments = appointments.filter((a) => a.status === 'Pending');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-teal-800">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-xs font-bold text-amber-300 uppercase bg-teal-800 px-3 py-1 rounded-full border border-teal-700">
              System Administrator Portal
            </span>
            <span className="text-xs bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-800">
              FULL ACCESS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Helping Hearts Management Console</h1>
          <p className="text-xs sm:text-sm text-teal-200">
            Overview of student enrollments, payment slip verifications, client appointments, LMS courses, and website CMS content.
          </p>
        </div>

        <button
          onClick={() => setCurrentAdminTab('USER_GUIDE')}
          className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <FileText className="w-4 h-4 text-slate-950" />
          <span>📖 System User Guide (PDF)</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Pending Slips', val: pendingRegistrations.length, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', tab: 'STUDENTS' },
          { label: 'Pending Inquiries', val: pendingAppointments.length, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200', tab: 'APPOINTMENTS' },
          { label: 'Active Courses', val: courses.length, color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200', tab: 'COURSES' },
          { label: 'Faculty Members', val: lecturers.length, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', tab: 'LECTURERS' },
          { label: 'Total Students', val: registrations.length + 30, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', tab: 'STUDENTS' },
          { label: 'Appointments', val: appointments.length, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', tab: 'APPOINTMENTS' },
          { label: 'Upcoming Events', val: events.length, color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200', tab: 'CMS' },
          { label: 'Published Blogs', val: blogs.length, color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200', tab: 'CMS' }
        ].map((kpi, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentAdminTab(kpi.tab)}
            className={`${kpi.bg} border rounded-2xl p-3.5 text-center shadow-2xs hover:scale-105 transition-transform cursor-pointer`}
          >
            <span className="text-[10px] font-bold text-slate-600 uppercase block truncate">{kpi.label}</span>
            <span className={`text-2xl font-black ${kpi.color} mt-0.5 block`}>{kpi.val}</span>
          </button>
        ))}
      </div>

      {/* Pending Action Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Pending Payment Verifications */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-600" /> Pending Manual Payment Verification ({pendingRegistrations.length})
            </h2>
            <button
              onClick={() => setCurrentAdminTab('STUDENTS')}
              className="text-xs text-teal-800 font-bold hover:underline"
            >
              View All Slips →
            </button>
          </div>

          <div className="space-y-3">
            {pendingRegistrations.length > 0 ? (
              pendingRegistrations.map((reg) => (
                <div key={reg.id} className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{reg.fullName}</span>
                    <span className="font-mono text-teal-900 font-bold">LKR {(reg.amountPaid ?? 0).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-600">Course: <strong>{reg.courseTitle}</strong></p>
                  <p className="text-slate-500 font-mono">Ref / Slip: {reg.paymentRef || 'Uploaded'}</p>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => setCurrentAdminTab('STUDENTS')}
                      className="px-3 py-1.5 rounded-lg bg-teal-800 text-white font-bold text-[11px]"
                    >
                      Inspect Slip & Approve
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic py-4 text-center">No pending bank payment slips awaiting review.</p>
            )}
          </div>
        </div>

        {/* Right: Pending Counselling Inquiries */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-600" /> Confidential Counselling Inquiries ({pendingAppointments.length})
            </h2>
            <button
              onClick={() => setCurrentAdminTab('APPOINTMENTS')}
              className="text-xs text-teal-800 font-bold hover:underline"
            >
              Manage Desk →
            </button>
          </div>

          <div className="space-y-3">
            {pendingAppointments.length > 0 ? (
              pendingAppointments.map((app) => (
                <div key={app.id} className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200/80 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{app.fullName} ({app.phone})</span>
                    <span className="bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded text-[10px]">
                      {app.sessionType}
                    </span>
                  </div>
                  <p className="text-slate-700">Service: <strong>{app.serviceTitle}</strong></p>
                  <p className="text-slate-600">Date: {app.preferredDate} @ {app.preferredTime}</p>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => setCurrentAdminTab('APPOINTMENTS')}
                      className="px-3 py-1.5 rounded-lg bg-teal-800 text-white font-bold text-[11px]"
                    >
                      Confirm Session
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic py-4 text-center">No new client appointment inquiries pending.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
