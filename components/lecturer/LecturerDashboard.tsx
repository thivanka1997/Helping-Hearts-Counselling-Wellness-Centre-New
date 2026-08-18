'use client';
import React, { useState } from 'react';
import { User, Course, AttendanceRecord, StudentRegistration } from '@/src/types';
import { UserCheck, BookOpen, Video, FileText, Plus, CheckCircle2, ShieldAlert, Calendar } from 'lucide-react';

interface LecturerDashboardProps {
  user: User;
  courses: Course[];
  attendance: AttendanceRecord[];
  registrations: StudentRegistration[];
  onMarkAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  onSuccessToast?: (msg: string) => void;
}

export const LecturerDashboard: React.FC<LecturerDashboardProps> = ({
  user,
  courses,
  attendance,
  registrations,
  onMarkAttendance,
  onSuccessToast
}) => {
  const [activeTab, setActiveTab] = useState<'COURSES' | 'ATTENDANCE' | 'MATERIALS'>('COURSES');

  // Mark attendance form
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionTitle, setSessionTitle] = useState('Weekly Clinical Lecture');
  const [selectedStudent, setSelectedStudent] = useState('Saman Kumara');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'crs-1');
  const [attStatus, setAttStatus] = useState<'Present' | 'Absent' | 'Late' | 'Excused'>('Present');

  // Add material form
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialUrl, setMaterialUrl] = useState('');
  const [materialType, setMaterialType] = useState<'PDF' | 'DOC' | 'PPT' | 'LINK'>('PDF');

  const handleMarkAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const crs = courses.find((c) => c.id === selectedCourseId);
    onMarkAttendance({
      studentId: 'std-1',
      studentName: selectedStudent,
      courseId: selectedCourseId,
      courseTitle: crs ? crs.title : 'Diploma in Counselling',
      sessionDate,
      sessionTitle,
      status: attStatus,
      markedBy: user.name
    });
    onSuccessToast?.(`Attendance marked as ${attStatus} for ${selectedStudent}`);
  };

  const handleAddMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccessToast?.(`New resource "${materialTitle}" published to student LMS!`);
    setMaterialTitle('');
    setMaterialUrl('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-teal-400 uppercase bg-teal-900/80 px-3 py-1 rounded-full border border-teal-700">
            Lecturer Faculty Portal
          </span>
          <h1 className="text-2xl font-black">Welcome, {user.name}</h1>
          <p className="text-xs text-slate-300">Manage assigned courses, mark student attendance, and upload learning materials.</p>
        </div>

        <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-xs text-amber-300 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Faculty Boundary Active: Confidential client records restricted.</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        {[
          { id: 'COURSES', label: 'My Assigned Courses', icon: BookOpen },
          { id: 'ATTENDANCE', label: 'Mark Attendance', icon: UserCheck },
          { id: 'MATERIALS', label: 'Upload Learning Resources', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-2xl font-bold text-xs flex items-center gap-2 transition-all ${
                isSelected
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Assigned Courses */}
      {activeTab === 'COURSES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((crs) => (
            <div key={crs.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <span className="text-[10px] font-bold text-teal-800 uppercase bg-teal-50 px-2.5 py-0.5 rounded">
                {crs.category}
              </span>
              <h3 className="text-lg font-bold text-slate-900">{crs.title}</h3>
              <p className="text-xs text-slate-600">{crs.description}</p>
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                <p>Schedule: <strong>{crs.schedule}</strong></p>
                <p>Enrolled Students: <strong>32 Active</strong></p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Mark Attendance */}
      {activeTab === 'ATTENDANCE' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs max-w-2xl mx-auto space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-teal-800" /> Mark Session Attendance
          </h2>

          <form onSubmit={handleMarkAttendanceSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Select Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm bg-white"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Session Date</label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Session Title</label>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Student Name</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="Saman Kumara">Saman Kumara</option>
                  <option value="Anushka Wickramasinghe">Anushka Wickramasinghe</option>
                  <option value="Nimali Jayawardena">Nimali Jayawardena</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Attendance Status</label>
                <select
                  value={attStatus}
                  onChange={(e) => setAttStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm bg-white font-bold"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Excused">Excused</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-xs"
            >
              Submit Attendance Log
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Upload Learning Resources */}
      {activeTab === 'MATERIALS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs max-w-2xl mx-auto space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-800" /> Publish Learning Resource
          </h2>

          <form onSubmit={handleAddMaterialSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Resource Title *</label>
              <input
                type="text"
                value={materialTitle}
                onChange={(e) => setMaterialTitle(e.target.value)}
                placeholder="e.g. Cognitive Restructuring Guide (PDF)"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Resource Type</label>
                <select
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="DOC">Word Document</option>
                  <option value="PPT">PowerPoint Slides</option>
                  <option value="LINK">Google Drive URL</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Target Course</label>
                <select className="w-full p-2.5 rounded-xl border border-slate-300 text-sm bg-white">
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Google Drive URL / External Link *</label>
              <input
                type="url"
                value={materialUrl}
                onChange={(e) => setMaterialUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-xs"
            >
              Publish Resource to Enrolled Students
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
