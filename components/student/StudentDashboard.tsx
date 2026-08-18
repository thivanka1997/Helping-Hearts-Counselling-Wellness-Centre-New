'use client';
import React from 'react';
import { User, Course, AttendanceRecord, Announcement } from '@/src/types';
import { GraduationCap, BookOpen, CheckCircle2, Clock, Bell, Award, UserCheck, Calendar, ArrowRight, Video } from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  courses: Course[];
  attendance: AttendanceRecord[];
  announcements: Announcement[];
  onOpenCourseViewer: (courseId: string) => void;
  setCurrentView: (v: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  courses,
  attendance,
  announcements,
  onOpenCourseViewer,
  setCurrentView
}) => {
  // Enrolled courses (for demo, first 2 courses)
  const myCourses = courses.slice(0, 2);

  // Student specific attendance
  const studentAtt = attendance.filter((a) => a.studentName === user.name || a.studentId === 'std-1');
  const presentCount = studentAtt.filter((a) => a.status === 'Present').length;
  const attPercentage = studentAtt.length > 0 ? Math.round((presentCount / studentAtt.length) * 100) : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Widget */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold text-amber-300 uppercase bg-teal-950/80 px-3 py-1 rounded-full border border-teal-700">
            Student LMS Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Welcome Back, {user.name}!</h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
            Track your diploma modules, watch video lectures, download Google Drive study guides, and review attendance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenCourseViewer(myCourses[0]?.id || 'crs-1')}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Video className="w-4 h-4" /> Continue Learning
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Enrolled Courses</p>
            <p className="text-xl font-bold text-slate-900">{myCourses.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Lessons Completed</p>
            <p className="text-xl font-bold text-slate-900">3 / 8</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Attendance Rate</p>
            <p className="text-xl font-bold text-emerald-700">{attPercentage}%</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">LMS Certificates</p>
            <p className="text-xl font-bold text-slate-900">1 Issued</p>
          </div>
        </div>
      </div>

      {/* Main Grid: My Courses & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: My Courses */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">My Active Programs</h2>
            <button
              onClick={() => setCurrentView('student-courses')}
              className="text-xs font-semibold text-teal-800 hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {myCourses.map((crs) => (
              <div
                key={crs.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5 hover:border-teal-300 transition-all"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img src={crs.image} alt={crs.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-teal-800 uppercase bg-teal-50 px-2 py-0.5 rounded">
                      {crs.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{crs.title}</h3>
                    <p className="text-xs text-slate-500">Lecturer: {crs.lecturerName}</p>
                    <div className="w-36 bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                      <div className="bg-teal-700 h-full w-[45%]"></div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenCourseViewer(crs.id)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5 text-amber-300" /> Enter Course Room
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Announcements & Upcoming Classes */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600" /> Course Announcements
            </h3>

            <div className="space-y-3">
              {announcements.map((anc) => (
                <div key={anc.id} className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60 text-xs space-y-1">
                  <p className="font-bold text-amber-950">{anc.title}</p>
                  <p className="text-slate-700 leading-snug">{anc.content}</p>
                  <span className="text-[10px] text-amber-800 block pt-1 font-mono">{anc.createdAt} • {anc.authorName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
