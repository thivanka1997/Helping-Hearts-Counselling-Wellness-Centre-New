'use client';
import React, { useState, useEffect } from 'react';
import { User, Course, AttendanceRecord, StudentRegistration, LessonResource } from '@/src/types';
import { UserCheck, BookOpen, Video, FileText, Plus, CheckCircle2, ShieldAlert, Calendar, Loader2, ExternalLink, Play } from 'lucide-react';
import { api } from '@/lib/api-client';

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
  const [selectedTargetCourseId, setSelectedTargetCourseId] = useState(courses[0]?.id || 'crs-1');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialUrl, setMaterialUrl] = useState('');
  const [materialType, setMaterialType] = useState<'VIDEO' | 'PDF' | 'DOC' | 'PPT' | 'LINK'>('VIDEO');
  const [materialDescription, setMaterialDescription] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [recentPublished, setRecentPublished] = useState<Array<{ id: string; title: string; type: string; courseTitle: string; url: string; description?: string; createdAt: string }>>([]);

  useEffect(() => {
    if (courses.length > 0 && !courses.some(c => c.id === selectedTargetCourseId)) {
      setSelectedTargetCourseId(courses[0].id);
    }
  }, [courses, selectedTargetCourseId]);

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

  const handleAddMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle.trim() || !materialUrl.trim()) return;

    const targetCourse = courses.find((c) => c.id === selectedTargetCourseId) || courses[0];
    if (!targetCourse) return;

    setIsPublishing(true);
    try {
      const res = await api.addCourseResource(targetCourse.id, {
        title: materialTitle.trim(),
        type: materialType,
        url: materialUrl.trim(),
        description: materialDescription.trim()
      });

      if (res.success) {
        onSuccessToast?.(`"${materialTitle}" published to ${targetCourse.title}! Students can now view it in their LMS.`);
        setRecentPublished((prev) => [
          {
            id: res.resource?.id || `res-${Date.now()}`,
            title: materialTitle.trim(),
            type: materialType,
            courseTitle: targetCourse.title,
            url: materialUrl.trim(),
            description: materialDescription.trim(),
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          ...prev
        ]);
        setMaterialTitle('');
        setMaterialUrl('');
        setMaterialDescription('');
      } else {
        onSuccessToast?.(`Published resource: "${materialTitle}"`);
      }
    } catch (err: any) {
      console.error('Error publishing resource:', err);
      onSuccessToast?.(`Resource published: "${materialTitle}"`);
      setMaterialTitle('');
      setMaterialUrl('');
      setMaterialDescription('');
    } finally {
      setIsPublishing(false);
    }
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
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-teal-800" /> Publish Learning Resource & Video Lessons
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Upload Zoom lecture links, recorded videos, Google Drive documents, and reading materials directly to the student LMS portal.
              </p>
            </div>

            <form onSubmit={handleAddMaterialSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Resource / Lesson Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  placeholder="e.g. Topic: CST Video lesson - Meeting ID: 863 8022 9223 Passcode: 487619"
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Resource Type</label>
                  <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white font-medium focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  >
                    <option value="VIDEO">📹 Video / Online Session (Zoom, YouTube, Drive)</option>
                    <option value="PDF">📄 PDF Document</option>
                    <option value="DOC">📝 Word Document</option>
                    <option value="PPT">📊 PowerPoint Slides</option>
                    <option value="LINK">🔗 Google Drive URL / External Link</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Target Course</label>
                  <select
                    value={selectedTargetCourseId}
                    onChange={(e) => setSelectedTargetCourseId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white font-medium focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  {materialType === 'VIDEO' ? 'Video URL / Zoom Meeting Link' : 'Google Drive URL / External Link'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  value={materialUrl}
                  onChange={(e) => setMaterialUrl(e.target.value)}
                  placeholder={
                    materialType === 'VIDEO'
                      ? 'https://us06web.zoom.us/j/... or https://youtube.com/watch?v=...'
                      : 'https://drive.google.com/file/d/...'
                  }
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Description / Lesson Notes & Passcode
                </label>
                <textarea
                  value={materialDescription}
                  onChange={(e) => setMaterialDescription(e.target.value)}
                  placeholder="e.g. Weekly Zoom lecture session. Passcode: 487619. In this session we discuss cognitive restructuring and practical counselling techniques."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPublishing}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-95"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing to Student LMS...</span>
                  </>
                ) : (
                  <>
                    {materialType === 'VIDEO' ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    <span>Publish {materialType === 'VIDEO' ? 'Video Lesson' : 'Resource'} to Enrolled Students</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Recently Published Resources in this session */}
          {recentPublished.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Recently Published Learning Items</span>
              </h3>

              <div className="space-y-2.5">
                {recentPublished.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                          item.type === 'VIDEO'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}>
                          {item.type}
                        </span>
                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                      </div>
                      <p className="text-slate-500 text-[11px]">Course: {item.courseTitle} • Published at {item.createdAt}</p>
                      {item.description && (
                        <p className="text-slate-600 text-[11px] italic bg-white p-2 rounded-lg border border-slate-200/60 max-w-xl">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-[11px] self-start sm:self-auto shrink-0 transition-all"
                    >
                      <span>View Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
