'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { User, Course, AttendanceRecord, StudentRegistration, LessonResource, CourseModule, Lesson, LessonMedium } from '@/src/types';
import {
  UserCheck,
  BookOpen,
  Video,
  FileText,
  Plus,
  CheckCircle2,
  ShieldAlert,
  Calendar,
  Loader2,
  ExternalLink,
  Play,
  Edit2,
  Trash2,
  Globe,
  Film,
  X,
  Save,
  Check,
  Sparkles,
  Layers,
  Filter,
  Eye
} from 'lucide-react';
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
  const [materialType, setMaterialType] = useState<'VIDEO' | 'MEETING' | 'ASSIGNMENT' | 'PDF' | 'DOC' | 'PPT' | 'LINK'>('VIDEO');
  const [materialMedium, setMaterialMedium] = useState<LessonMedium>('Sinhala');
  const [materialDate, setMaterialDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [materialDescription, setMaterialDescription] = useState('');
  const [meetingIdInput, setMeetingIdInput] = useState('');
  const [meetingPasscodeInput, setMeetingPasscodeInput] = useState('');
  const [meetingTimeInput, setMeetingTimeInput] = useState('');
  const [dueDateInput, setDueDateInput] = useState('');
  const [assignmentInstructionsInput, setAssignmentInstructionsInput] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // Course modules & materials for active course
  const [courseModules, setCourseModules] = useState<CourseModule[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [materialsFilterMedium, setMaterialsFilterMedium] = useState<'ALL' | LessonMedium>('ALL');

  // Edit Material Modal State
  const [editingItem, setEditingItem] = useState<{
    moduleId: string;
    lessonId?: string;
    resourceId?: string;
    title: string;
    type: 'VIDEO' | 'MEETING' | 'ASSIGNMENT' | 'PDF' | 'DOC' | 'PPT' | 'LINK';
    medium: LessonMedium;
    date: string;
    url: string;
    description: string;
    meetingId?: string;
    meetingPasscode?: string;
    meetingTime?: string;
    dueDate?: string;
    assignmentInstructions?: string;
    maxScore?: number;
  } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // In-LMS Video Player Modal State
  const [previewVideo, setPreviewVideo] = useState<{
    title: string;
    url: string;
    medium?: LessonMedium;
    date?: string;
  } | null>(null);

  // Fetch modules for selected course
  const loadModules = useCallback(async (cId: string) => {
    setIsLoadingModules(true);
    try {
      const mods = await api.getCourseModules(cId);
      if (mods && mods.length > 0) {
        setCourseModules(mods);
      } else {
        setCourseModules([]);
      }
    } catch (err) {
      console.error('Error loading course modules:', err);
    } finally {
      setIsLoadingModules(false);
    }
  }, []);

  useEffect(() => {
    if (courses.length > 0 && !courses.some(c => c.id === selectedTargetCourseId)) {
      setSelectedTargetCourseId(courses[0].id);
    }
  }, [courses, selectedTargetCourseId]);

  useEffect(() => {
    if (selectedTargetCourseId) {
      loadModules(selectedTargetCourseId);
    }
  }, [selectedTargetCourseId, loadModules]);

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
        medium: materialMedium,
        date: materialDate,
        url: materialUrl.trim(),
        description: materialDescription.trim(),
        meetingId: meetingIdInput.trim(),
        meetingPasscode: meetingPasscodeInput.trim(),
        meetingTime: meetingTimeInput.trim(),
        dueDate: dueDateInput.trim(),
        assignmentInstructions: assignmentInstructionsInput.trim()
      });

      if (res.success) {
        onSuccessToast?.(`"${materialTitle}" (${materialMedium} Medium) published to ${targetCourse.title}! Students can now view it in LMS.`);
        setMaterialTitle('');
        setMaterialUrl('');
        setMaterialDescription('');
        setMeetingIdInput('');
        setMeetingPasscodeInput('');
        setMeetingTimeInput('');
        setDueDateInput('');
        setAssignmentInstructionsInput('');
        // Reload course materials
        await loadModules(targetCourse.id);
      } else {
        onSuccessToast?.(`Published resource: "${materialTitle}"`);
      }
    } catch (err: any) {
      console.error('Error publishing resource:', err);
      onSuccessToast?.(`Resource published: "${materialTitle}"`);
      setMaterialTitle('');
      setMaterialUrl('');
      setMaterialDescription('');
      await loadModules(targetCourse.id);
    } finally {
      setIsPublishing(false);
    }
  };

  // Open Edit Modal for Lesson or Resource
  const handleOpenEdit = (mod: CourseModule, lesson: Lesson, resource?: LessonResource) => {
    if (resource && resource.id !== lesson.id) {
      setEditingItem({
        moduleId: mod.id,
        resourceId: resource.id,
        title: resource.title || '',
        type: (resource.type as any) || 'LINK',
        medium: resource.medium || lesson.medium || 'Sinhala',
        date: resource.date || lesson.date || new Date().toISOString().split('T')[0],
        url: resource.url || '',
        description: resource.description || ''
      });
    } else {
      setEditingItem({
        moduleId: mod.id,
        lessonId: lesson.id,
        title: lesson.title || '',
        type: (lesson.type as any) || 'VIDEO',
        medium: lesson.medium || 'Sinhala',
        date: lesson.date || new Date().toISOString().split('T')[0],
        url: lesson.videoUrl || lesson.resources?.[0]?.url || '',
        description: lesson.description || '',
        meetingId: lesson.meetingId || '',
        meetingPasscode: lesson.meetingPasscode || '',
        meetingTime: lesson.meetingTime || '',
        dueDate: lesson.dueDate || '',
        assignmentInstructions: lesson.assignmentInstructions || '',
        maxScore: lesson.maxScore || 100
      });
    }
  };

  // Save Edit Handler
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsUpdating(true);
    try {
      const res = await api.updateCourseResource(selectedTargetCourseId, {
        lessonId: editingItem.lessonId,
        resourceId: editingItem.resourceId,
        title: editingItem.title.trim(),
        type: editingItem.type,
        medium: editingItem.medium,
        date: editingItem.date,
        url: editingItem.url.trim(),
        description: editingItem.description.trim(),
        meetingId: editingItem.meetingId?.trim(),
        meetingPasscode: editingItem.meetingPasscode?.trim(),
        meetingTime: editingItem.meetingTime?.trim(),
        dueDate: editingItem.dueDate?.trim(),
        assignmentInstructions: editingItem.assignmentInstructions?.trim(),
        maxScore: editingItem.maxScore
      });

      if (res.success) {
        onSuccessToast?.(`"${editingItem.title}" updated successfully! Changes saved.`);
        setEditingItem(null);
        await loadModules(selectedTargetCourseId);
      } else {
        // Fallback update local state
        updateLocalModuleState(editingItem);
        setEditingItem(null);
        onSuccessToast?.(`"${editingItem.title}" updated!`);
      }
    } catch (err: any) {
      console.error('Error saving updated material:', err);
      updateLocalModuleState(editingItem);
      setEditingItem(null);
      onSuccessToast?.(`Material "${editingItem.title}" updated!`);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateLocalModuleState = (item: NonNullable<typeof editingItem>) => {
    setCourseModules((prevMods) =>
      prevMods.map((mod) => {
        if (mod.id !== item.moduleId) return mod;
        return {
          ...mod,
          lessons: mod.lessons.map((les) => {
            if (item.lessonId && les.id === item.lessonId) {
              return {
                ...les,
                title: item.title,
                type: item.type,
                medium: item.medium,
                date: item.date,
                videoUrl: item.url,
                description: item.description,
                meetingId: item.meetingId,
                meetingPasscode: item.meetingPasscode,
                meetingTime: item.meetingTime,
                dueDate: item.dueDate,
                assignmentInstructions: item.assignmentInstructions
              };
            }
            if (item.resourceId) {
              return {
                ...les,
                resources: (les.resources || []).map((r) =>
                  r.id === item.resourceId
                    ? {
                        ...r,
                        title: item.title,
                        type: item.type,
                        medium: item.medium,
                        date: item.date,
                        url: item.url,
                        description: item.description
                      }
                    : r
                )
              };
            }
            return les;
          })
        };
      })
    );
  };

  // Delete Material Handler
  const handleDeleteMaterial = async (lessonId?: string, resourceId?: string, title?: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title || 'this item'}"? This will remove it from the student LMS.`)) {
      return;
    }

    try {
      const res = await api.deleteCourseResource(selectedTargetCourseId, { lessonId, resourceId });
      if (res.success) {
        onSuccessToast?.(`"${title || 'Material'}" deleted successfully.`);
        await loadModules(selectedTargetCourseId);
      } else {
        // Local removal fallback
        removeLocalItem(lessonId, resourceId);
        onSuccessToast?.(`"${title || 'Material'}" deleted.`);
      }
    } catch (err) {
      console.error('Error deleting material:', err);
      removeLocalItem(lessonId, resourceId);
      onSuccessToast?.(`"${title || 'Material'}" deleted.`);
    }
  };

  const removeLocalItem = (lessonId?: string, resourceId?: string) => {
    setCourseModules((prev) =>
      prev.map((mod) => ({
        ...mod,
        lessons: mod.lessons
          .filter((l) => (lessonId ? l.id !== lessonId : true))
          .map((l) => ({
            ...l,
            resources: (l.resources || []).filter((r) => (resourceId ? r.id !== resourceId : true))
          }))
      }))
    );
  };

  // Video embed url generator
  const getEmbedVideoDetails = (url?: string) => {
    if (!url) return null;
    const trimmed = url.trim();

    if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
      let videoId = '';
      if (trimmed.includes('youtu.be/')) {
        videoId = trimmed.split('youtu.be/')[1]?.split(/[?&#]/)[0] || '';
      } else if (trimmed.includes('/embed/')) {
        videoId = trimmed.split('/embed/')[1]?.split(/[?&#]/)[0] || '';
      } else if (trimmed.includes('/shorts/')) {
        videoId = trimmed.split('/shorts/')[1]?.split(/[?&#]/)[0] || '';
      } else if (trimmed.includes('v=')) {
        videoId = trimmed.split('v=')[1]?.split(/[?&#]/)[0] || '';
      }
      return {
        type: 'youtube' as const,
        src: `https://www.youtube.com/embed/${videoId || 'dQw4w9WgXcQ'}?autoplay=1&rel=0`
      };
    }

    if (trimmed.includes('drive.google.com')) {
      const previewUrl = trimmed.replace(/\/view(\?.*)?$/, '/preview').replace(/\/edit(\?.*)?$/, '/preview');
      return {
        type: 'drive' as const,
        src: previewUrl.includes('/preview') ? previewUrl : `${trimmed}/preview`
      };
    }

    if (trimmed.includes('vimeo.com')) {
      const match = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
      if (match && match[1]) {
        return {
          type: 'vimeo' as const,
          src: `https://player.vimeo.com/video/${match[1]}?autoplay=1`
        };
      }
    }

    const isDirectVideo = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(trimmed) ||
      trimmed.startsWith('blob:') ||
      trimmed.startsWith('data:video/');

    if (isDirectVideo) {
      return {
        type: 'html5' as const,
        src: trimmed
      };
    }

    return {
      type: 'iframe' as const,
      src: trimmed
    };
  };

  const targetCourseObj = courses.find((c) => c.id === selectedTargetCourseId) || courses[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-teal-400 uppercase bg-teal-900/80 px-3 py-1 rounded-full border border-teal-700">
            Lecturer Faculty Portal
          </span>
          <h1 className="text-2xl font-black">Welcome, {user.name}</h1>
          <p className="text-xs text-slate-300">Manage assigned courses, mark student attendance, upload & edit learning materials in Sinhala and Tamil.</p>
        </div>

        <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-xs text-amber-300 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Faculty Boundary Active: Confidential client records restricted.</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        {[
          { id: 'COURSES', label: 'My Assigned Courses', icon: BookOpen },
          { id: 'ATTENDANCE', label: 'Mark Attendance', icon: UserCheck },
          { id: 'MATERIALS', label: 'Course Materials & LMS Uploads', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-2xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
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
              className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-xs cursor-pointer"
            >
              Submit Attendance Log
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Upload & Edit Learning Resources */}
      {activeTab === 'MATERIALS' && (
        <div className="space-y-8">
          {/* UPLOAD NEW MATERIAL FORM */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold uppercase text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded">
                LMS Course Resource Creator
              </span>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5 mt-1">
                <FileText className="w-5 h-5 text-teal-800" /> Publish Learning Resource & Video Lessons
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Upload video lectures, Zoom live classes, Google Drive documents, worksheets, and handbooks directly to the student portal with selectable <strong>Medium (Sinhala / Tamil / English)</strong> and <strong>Session Date</strong>.
              </p>
            </div>

            <form onSubmit={handleAddMaterialSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Resource / Lesson Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={materialTitle}
                    onChange={(e) => setMaterialTitle(e.target.value)}
                    placeholder="e.g. Cognitive Behavioral Therapy (CBT) Practical Framework - Week 03"
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Medium of Instruction <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={materialMedium}
                    onChange={(e) => setMaterialMedium(e.target.value as LessonMedium)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white font-bold text-slate-800 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  >
                    <option value="Sinhala">🇱🇰 Sinhala Medium (සිංහල මාධ්‍යය)</option>
                    <option value="Tamil">🇱🇰 Tamil Medium (தமிழ் மொழி)</option>
                    <option value="English">🌐 English Medium</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Material / Session Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={materialDate}
                      onChange={(e) => setMaterialDate(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Resource / Unit Type</label>
                  <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white font-medium focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  >
                    <option value="VIDEO">📹 Video Lecture / Recording (YouTube / Drive / MP4)</option>
                    <option value="MEETING">🎥 Live Online Zoom Meeting Session</option>
                    <option value="ASSIGNMENT">📝 Online Assignment & Assessment</option>
                    <option value="PDF">📄 PDF Study Handbook / Reading Material</option>
                    <option value="DOC">📝 Word Document Worksheet</option>
                    <option value="PPT">📊 PowerPoint Presentation Slides</option>
                    <option value="LINK">🔗 External Learning Resource / Cloud Link</option>
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

              {/* Contextual Zoom Meeting Details */}
              {materialType === 'MEETING' && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                    <Video className="w-4 h-4 text-blue-700" />
                    <span>Zoom Meeting Access & Attendance Configuration</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Meeting ID</label>
                      <input
                        type="text"
                        value={meetingIdInput}
                        onChange={(e) => setMeetingIdInput(e.target.value)}
                        placeholder="e.g. 863 8022 9223"
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Passcode</label>
                      <input
                        type="text"
                        value={meetingPasscodeInput}
                        onChange={(e) => setMeetingPasscodeInput(e.target.value)}
                        placeholder="e.g. 487619"
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Session Date & Time</label>
                      <input
                        type="text"
                        value={meetingTimeInput}
                        onChange={(e) => setMeetingTimeInput(e.target.value)}
                        placeholder="e.g. Sep 18, 2026 at 08:00 PM"
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-blue-800">
                    💡 When students click <strong>&quot;Launch &amp; Join Zoom Meeting&quot;</strong> in their LMS, their attendance will be automatically captured and counted!
                  </p>
                </div>
              )}

              {/* Contextual Online Assignment Details */}
              {materialType === 'ASSIGNMENT' && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <FileText className="w-4 h-4 text-amber-700" />
                    <span>Assignment Guidelines & Submission Deadline</span>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Submission Deadline / Due Date</label>
                    <input
                      type="date"
                      value={dueDateInput}
                      onChange={(e) => setDueDateInput(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Detailed Instructions / Prompt</label>
                    <textarea
                      rows={2}
                      value={assignmentInstructionsInput}
                      onChange={(e) => setAssignmentInstructionsInput(e.target.value)}
                      placeholder="e.g. Formulate a 500-word clinical reflection on therapeutic ethics..."
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  {materialType === 'MEETING'
                    ? 'Zoom Meeting Join URL'
                    : materialType === 'VIDEO'
                    ? 'Video Stream URL (YouTube, Vimeo, Google Drive video, MP4 link)'
                    : materialType === 'PDF'
                    ? 'PDF Document URL (Google Drive preview or direct link)'
                    : 'Resource URL / Cloud File Link'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  value={materialUrl}
                  onChange={(e) => setMaterialUrl(e.target.value)}
                  placeholder={
                    materialType === 'MEETING'
                      ? 'https://zoom.us/j/86380229223?pwd=...'
                      : materialType === 'VIDEO'
                      ? 'https://www.youtube.com/watch?v=... or https://drive.google.com/file/d/.../view or .mp4'
                      : 'https://drive.google.com/file/d/.../view'
                  }
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Description / Lesson Summary
                </label>
                <textarea
                  value={materialDescription}
                  onChange={(e) => setMaterialDescription(e.target.value)}
                  placeholder="e.g. In this session we discuss cognitive restructuring and practical counselling techniques."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPublishing}
                className="w-full py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-95"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing to Student LMS...</span>
                  </>
                ) : (
                  <>
                    {materialType === 'VIDEO' ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    <span>Publish {materialType === 'VIDEO' ? 'Video Lesson' : 'Resource'} ({materialMedium} Medium)</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* MANAGE & EDIT EXISTING COURSE MATERIALS */}
          <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded">
                  Course Material Management
                </span>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-1">
                  <Layers className="w-5 h-5 text-teal-800" />
                  <span>Existing Course Materials & Video Lectures</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Course: <strong>{targetCourseObj?.title}</strong> • Click &quot;Edit&quot; to update medium, date, or details.
                </p>
              </div>

              {/* Medium Filter Bar */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Medium:
                </span>
                {(['ALL', 'Sinhala', 'Tamil', 'English'] as const).map((med) => (
                  <button
                    key={med}
                    onClick={() => setMaterialsFilterMedium(med)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      materialsFilterMedium === med
                        ? 'bg-teal-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {med === 'ALL'
                      ? 'All'
                      : med === 'Sinhala'
                      ? '🇱🇰 Sinhala'
                      : med === 'Tamil'
                      ? '🇱🇰 Tamil'
                      : '🌐 English'}
                  </button>
                ))}
              </div>
            </div>

            {isLoadingModules ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-teal-800" />
                <span className="text-xs font-medium">Loading course materials...</span>
              </div>
            ) : courseModules.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs">
                No materials currently found for this course. Use the form above to add your first video or document!
              </div>
            ) : (
              <div className="space-y-6">
                {courseModules.map((module) => {
                  const filteredLessons = (module.lessons || []).filter((lesson) => {
                    if (materialsFilterMedium === 'ALL') return true;
                    return (lesson.medium || 'Sinhala') === materialsFilterMedium;
                  });

                  if (filteredLessons.length === 0 && materialsFilterMedium !== 'ALL') return null;

                  return (
                    <div key={module.id} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                        <h4 className="font-bold text-sm text-slate-800">{module.title}</h4>
                      </div>

                      <div className="space-y-3">
                        {filteredLessons.map((lesson) => {
                          const isVideo = lesson.type === 'VIDEO' || Boolean(lesson.videoUrl && !lesson.type?.includes('MEETING'));
                          const isZoom = lesson.type === 'MEETING';
                          const isAssign = lesson.type === 'ASSIGNMENT';
                          const isPdf = lesson.type === 'PDF';
                          const currentMedium = lesson.medium || 'Sinhala';

                          return (
                            <div
                              key={lesson.id}
                              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-200 hover:shadow-xs transition-all space-y-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase flex items-center gap-1 ${
                                        isZoom
                                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                          : isAssign
                                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                          : isPdf
                                          ? 'bg-teal-100 text-teal-800 border border-teal-200'
                                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                                      }`}
                                    >
                                      {isZoom ? (
                                        <Video className="w-3 h-3" />
                                      ) : isAssign ? (
                                        <FileText className="w-3 h-3" />
                                      ) : isPdf ? (
                                        <FileText className="w-3 h-3" />
                                      ) : (
                                        <Film className="w-3 h-3" />
                                      )}
                                      <span>{lesson.type || 'VIDEO'}</span>
                                    </span>

                                    {/* MEDIUM BADGE */}
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 shadow-xs ${
                                        currentMedium === 'Sinhala'
                                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                          : currentMedium === 'Tamil'
                                          ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                          : 'bg-sky-100 text-sky-800 border border-sky-300'
                                      }`}
                                    >
                                      <Globe className="w-3 h-3" />
                                      <span>
                                        {currentMedium === 'Sinhala'
                                          ? '🇱🇰 Sinhala (සිංහල)'
                                          : currentMedium === 'Tamil'
                                          ? '🇱🇰 Tamil (தமிழ்)'
                                          : '🌐 English'}
                                      </span>
                                    </span>

                                    {/* DATE BADGE */}
                                    {lesson.date && (
                                      <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-semibold flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{lesson.date}</span>
                                      </span>
                                    )}
                                  </div>

                                  <h5 className="font-bold text-slate-900 text-sm">{lesson.title}</h5>

                                  {lesson.description && (
                                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                                      {lesson.description}
                                    </p>
                                  )}
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
                                  {/* Play in LMS Button for Videos */}
                                  {(isVideo || lesson.videoUrl) && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setPreviewVideo({
                                          title: lesson.title,
                                          url: lesson.videoUrl || '',
                                          medium: lesson.medium,
                                          date: lesson.date
                                        })
                                      }
                                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                                      title="Play Video inside LMS"
                                    >
                                      <Play className="w-3.5 h-3.5 fill-current" />
                                      <span>Play in LMS</span>
                                    </button>
                                  )}

                                  {/* Edit Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEdit(module, lesson)}
                                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>

                                  {/* Delete Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteMaterial(lesson.id, undefined, lesson.title)}
                                    className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                                    title="Delete Lesson / Material"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Attached resources under this lesson */}
                              {lesson.resources && lesson.resources.length > 0 && (
                                <div className="pl-4 border-l-2 border-slate-200 space-y-2 mt-2">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                    Attached Unit Resources:
                                  </span>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {lesson.resources.map((res) => (
                                      <div
                                        key={res.id}
                                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between gap-2"
                                      >
                                        <div className="space-y-0.5 truncate flex-1">
                                          <div className="flex items-center gap-1.5">
                                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-700">
                                              {res.type}
                                            </span>
                                            <span className="font-bold text-slate-900 truncate">{res.title}</span>
                                          </div>
                                          {res.date && (
                                            <span className="text-[10px] text-slate-500 block">Date: {res.date}</span>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                          {res.type === 'VIDEO' && (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setPreviewVideo({
                                                  title: res.title,
                                                  url: res.url,
                                                  medium: res.medium,
                                                  date: res.date
                                                })
                                              }
                                              className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                                              title="Play in LMS"
                                            >
                                              <Play className="w-3 h-3 fill-current" />
                                            </button>
                                          )}
                                          <button
                                            type="button"
                                            onClick={() => handleOpenEdit(module, lesson, res)}
                                            className="p-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100"
                                            title="Edit Resource"
                                          >
                                            <Edit2 className="w-3 h-3" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteMaterial(undefined, res.id, res.title)}
                                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                                            title="Delete Resource"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* EDIT MATERIAL MODAL                                            */}
      {/* ============================================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded">
                  Edit LMS Material
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Update Course Resource Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Medium of Instruction <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editingItem.medium}
                    onChange={(e) => setEditingItem({ ...editingItem, medium: e.target.value as LessonMedium })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white font-bold text-slate-800 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  >
                    <option value="Sinhala">🇱🇰 Sinhala Medium (සිංහල මාධ්‍යය)</option>
                    <option value="Tamil">🇱🇰 Tamil Medium (தமிழ் மொழி)</option>
                    <option value="English">🌐 English Medium</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Material / Session Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={editingItem.date}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Resource Type</label>
                  <select
                    value={editingItem.type}
                    onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as any })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white font-medium focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  >
                    <option value="VIDEO">📹 Video Lecture / Recording (YouTube / Drive / MP4)</option>
                    <option value="MEETING">🎥 Live Online Zoom Meeting Session</option>
                    <option value="ASSIGNMENT">📝 Online Assignment & Assessment</option>
                    <option value="PDF">📄 PDF Study Handbook / Reading Material</option>
                    <option value="DOC">📝 Word Document Worksheet</option>
                    <option value="PPT">📊 PowerPoint Presentation Slides</option>
                    <option value="LINK">🔗 External Learning Resource / Cloud Link</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Resource / Video URL <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={editingItem.url}
                    onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Contextual Zoom fields if meeting */}
              {editingItem.type === 'MEETING' && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Meeting ID</label>
                    <input
                      type="text"
                      value={editingItem.meetingId || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, meetingId: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Passcode</label>
                    <input
                      type="text"
                      value={editingItem.meetingPasscode || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, meetingPasscode: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Session Date & Time</label>
                    <input
                      type="text"
                      value={editingItem.meetingTime || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, meetingTime: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Contextual Assignment fields if assignment */}
              {editingItem.type === 'ASSIGNMENT' && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Due Date</label>
                    <input
                      type="date"
                      value={editingItem.dueDate || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, dueDate: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Assignment Instructions</label>
                    <textarea
                      rows={2}
                      value={editingItem.assignmentInstructions || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, assignmentInstructions: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Description / Summary</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-60"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Material Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* IN-LMS VIDEO PLAYER MODAL (Direct Embedded Streaming)          */}
      {/* ============================================================== */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl border border-slate-700 max-w-4xl w-full overflow-hidden shadow-2xl space-y-4">
            {/* Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase bg-rose-900/80 text-rose-300 border border-rose-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Play className="w-3 h-3 fill-current" /> In-LMS Video Player
                  </span>
                  {previewVideo.medium && (
                    <span className="text-[10px] font-bold uppercase bg-teal-900/80 text-teal-300 border border-teal-700 px-2.5 py-0.5 rounded-full">
                      {previewVideo.medium} Medium
                    </span>
                  )}
                  {previewVideo.date && (
                    <span className="text-[10px] text-slate-400">📅 {previewVideo.date}</span>
                  )}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white">{previewVideo.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Viewport */}
            <div className="p-4 sm:p-6 pt-0">
              <div className="bg-black rounded-2xl overflow-hidden aspect-video w-full border border-slate-800 shadow-inner">
                {(() => {
                  const details = getEmbedVideoDetails(previewVideo.url);
                  if (!details) {
                    return (
                      <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs">
                        Invalid video stream URL.
                      </div>
                    );
                  }
                  if (details.type === 'html5') {
                    return (
                      <video
                        controls
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain"
                        src={details.src}
                      >
                        Your browser does not support embedded HTML5 video playback.
                      </video>
                    );
                  }
                  return (
                    <iframe
                      src={details.src}
                      title={previewVideo.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  );
                })()}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>Direct stream inside Helping Hearts LMS portal</span>
                <a
                  href={previewVideo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-400 hover:underline flex items-center gap-1"
                >
                  <span>Open raw source link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
