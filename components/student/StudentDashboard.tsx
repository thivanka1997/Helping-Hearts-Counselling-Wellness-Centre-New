'use client';

import React, { useState } from 'react';
import { User, Course, AttendanceRecord, Announcement } from '@/src/types';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  Bell,
  Award,
  UserCheck,
  Calendar,
  ArrowRight,
  Video,
  Edit3,
  Save,
  X,
  Sparkles
} from 'lucide-react';
import { useStudentUser } from '@/lib/useStudentUser';

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
  const { user: liveStudentUser, updateStudentName } = useStudentUser();
  const displayName = liveStudentUser.name || user.name;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingName, setEditingName] = useState(displayName);
  const [isSavingName, setIsSavingName] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Enrolled courses (for demo, first 2 courses)
  const myCourses = courses.slice(0, 2);

  // Student specific attendance
  const studentAtt = attendance.filter(
    (a) => a.studentName === displayName || a.studentName === user.name || a.studentId === 'std-1'
  );
  const presentCount = studentAtt.filter((a) => a.status === 'Present').length;
  const attPercentage = studentAtt.length > 0 ? Math.round((presentCount / studentAtt.length) * 100) : 100;

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingName.trim()) return;

    setIsSavingName(true);
    try {
      await updateStudentName(editingName.trim());
      setFeedbackToast(`Student name updated to "${editingName.trim()}"!`);
      setIsEditModalOpen(false);
      setTimeout(() => setFeedbackToast(null), 4000);
    } catch {
      alert('Failed to update student name.');
    } finally {
      setIsSavingName(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{feedbackToast}</span>
          </div>
          <button onClick={() => setFeedbackToast(null)} className="text-white text-xs font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Welcome Widget */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            <span className="text-xs font-bold text-amber-300 uppercase bg-teal-950/80 px-3 py-1 rounded-full border border-teal-700">
              Student LMS Dashboard
            </span>
            <span className="text-[10px] text-teal-200 bg-teal-800/80 px-2.5 py-0.5 rounded-full border border-teal-700/60 font-mono">
              Role: Student Learner
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start pt-1">
            <h1 className="text-2xl sm:text-3xl font-black">Welcome Back, {displayName}!</h1>
            <button
              onClick={() => {
                setEditingName(displayName);
                setIsEditModalOpen(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-teal-950/80 hover:bg-teal-700 text-amber-300 hover:text-white text-xs font-bold border border-teal-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              title="Change Student Name"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Change Name</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
            Track your diploma modules, watch video lectures, download Google Drive study guides, and review attendance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenCourseViewer(myCourses[0]?.id || 'crs-1')}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Video className="w-4 h-4" /> Continue Learning
          </button>
        </div>
      </div>

      {/* Change Student Name Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-teal-800" /> Change Student Name
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveName} className="space-y-4">
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700 block">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  placeholder="Enter your student name..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  autoFocus
                />
                <p className="text-[11px] text-slate-500">
                  This updates your name on this dashboard, LMS portal header, attendance, and your course certificates.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingName}
                  className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>{isSavingName ? 'Saving...' : 'Save Student Name'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Attendance Rate</p>
            <p className="text-xl font-bold text-slate-900">{attPercentage}%</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Sessions Attended</p>
            <p className="text-xl font-bold text-slate-900">{presentCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">LMS Status</p>
            <p className="text-xl font-bold text-slate-900">Good Standing</p>
          </div>
        </div>
      </div>

      {/* Main LMS Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Active Enrolled Courses */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-teal-800" /> My Enrolled Diploma Programs
            </h2>
            <button
              onClick={() => setCurrentView('student-courses')}
              className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {myCourses.map((crs) => (
              <div
                key={crs.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-teal-400 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img src={crs.image} alt={crs.title} className="w-full h-full object-cover" />
                  </div>
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
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
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
