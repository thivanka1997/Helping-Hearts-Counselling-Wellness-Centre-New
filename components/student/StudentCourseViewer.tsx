'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Course, CourseModule, Lesson, User, LessonResource } from '@/src/types';
import {
  Video,
  FileText,
  CheckCircle2,
  ArrowLeft,
  Download,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Play,
  Calendar,
  Clock,
  ClipboardCheck,
  FileCheck,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Award,
  Search,
  Layers,
  GraduationCap,
  Tv,
  PlayCircle
} from 'lucide-react';
import { useStudentUser } from '@/lib/useStudentUser';

interface StudentCourseViewerProps {
  course: Course;
  modules: CourseModule[];
  user?: User;
  onBack: () => void;
  onSuccessToast?: (msg: string) => void;
}

type MaterialSectionTab = 'ALL' | 'VIDEO' | 'MEETING' | 'PDF' | 'ASSIGNMENT';

interface ZoomAttendanceLog {
  date: string;
  time: string;
  status: 'Present';
  remarks?: string;
}

interface AssignmentSubmission {
  driveUrl?: string;
  writtenAnswer?: string;
  submittedAt: string;
  status: 'Submitted' | 'Graded';
}

export const StudentCourseViewer: React.FC<StudentCourseViewerProps> = ({
  course,
  modules: initialModules,
  user: initialUser,
  onBack,
  onSuccessToast
}) => {
  const { user: liveUser } = useStudentUser();
  const currentStudent = initialUser || liveUser;
  const playerRef = useRef<HTMLDivElement>(null);

  // Local modules state
  const [courseModules, setCourseModules] = useState<CourseModule[]>(initialModules);

  useEffect(() => {
    setCourseModules(initialModules);
  }, [initialModules]);

  // Flatten all lessons
  const allLessons = useMemo(() => {
    return courseModules.flatMap((m) => m.lessons || []);
  }, [courseModules]);

  // Content type detector
  const detectContentType = (lesson: Lesson): 'MEETING' | 'VIDEO' | 'ASSIGNMENT' | 'PDF' => {
    if (lesson.type === 'MEETING') {
      const tLower = (lesson.title || '').toLowerCase();
      if (tLower.includes('recording') || tLower.includes('record')) return 'VIDEO';
      return 'MEETING';
    }
    if (lesson.type === 'ASSIGNMENT') return 'ASSIGNMENT';
    if (lesson.type === 'PDF') return 'PDF';
    if (lesson.type === 'VIDEO') return 'VIDEO';

    const titleLower = (lesson.title || '').toLowerCase();
    const descLower = (lesson.description || '').toLowerCase();
    const urlLower = (lesson.videoUrl || '').toLowerCase();

    // If title specifically mentions recording / recorded, it is a recorded video lecture
    if (titleLower.includes('recording') || titleLower.includes('record') || titleLower.includes('recorded')) {
      return 'VIDEO';
    }

    // Meeting check (Live online classroom)
    if (
      urlLower.includes('zoom.us/j/') ||
      titleLower.includes('topic: cst') ||
      titleLower.includes('live online') ||
      titleLower.includes('live session') ||
      titleLower.includes('zoom meeting') ||
      descLower.includes('meeting id:') ||
      Boolean(lesson.meetingId)
    ) {
      return 'MEETING';
    }

    // Assignment check
    if (
      titleLower.includes('assignment') ||
      titleLower.includes('assegment') ||
      titleLower.includes('assessment') ||
      titleLower.includes('task') ||
      titleLower.includes('rubric') ||
      titleLower.includes('quiz') ||
      descLower.includes('assignment') ||
      descLower.includes('submit')
    ) {
      return 'ASSIGNMENT';
    }

    // PDF check
    if (
      titleLower.endsWith('.pdf') ||
      titleLower.includes('(pdf)') ||
      titleLower.includes('handbook') ||
      titleLower.includes('curriculum guide') ||
      (lesson.resources && lesson.resources.some((r) => r.type === 'PDF') && !lesson.videoUrl)
    ) {
      return 'PDF';
    }

    return 'VIDEO';
  };

  const [selectedLesson, setSelectedLesson] = useState<Lesson>(() => {
    return (
      allLessons[0] || {
        id: 'les-demo',
        moduleId: 'mod-1',
        title: 'Lesson 01: Introduction & Orientation',
        description: 'Overview of counselling ethics, therapeutic rapport, and client assessment fundamentals.',
        videoUrl: 'https://www.youtube.com/watch?v=fEqJ86K856k',
        resources: [],
        order: 1,
        durationMinutes: 45
      }
    );
  });

  // Active section tab for Course Materials Explorer below player
  const [activeMaterialTab, setActiveMaterialTab] = useState<MaterialSectionTab>('ALL');

  // Search query for curriculum
  const [searchQuery, setSearchQuery] = useState('');

  // Persistence keys
  const progressStorageKey = `hh_course_progress_${course.id}_${currentStudent.id || currentStudent.name || 'guest'}`;
  const attendanceStorageKey = `hh_zoom_att_${course.id}_${currentStudent.id || currentStudent.name || 'guest'}`;
  const submissionStorageKey = `hh_assignment_submissions_${course.id}_${currentStudent.id || currentStudent.name || 'guest'}`;

  // Completed lesson IDs
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(progressStorageKey);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return ['les-101'];
  });

  // Zoom attendance click records per lesson
  const [zoomAttendanceLogs, setZoomAttendanceLogs] = useState<Record<string, ZoomAttendanceLog>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(attendanceStorageKey);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {};
  });

  // Assignment submissions per lesson
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<Record<string, AssignmentSubmission>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(submissionStorageKey);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {};
  });

  // Assignment input states
  const [assignmentUrlInput, setAssignmentUrlInput] = useState('');
  const [assignmentTextInput, setAssignmentTextInput] = useState('');
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);
  const [isEditingSubmission, setIsEditingSubmission] = useState(false);

  // Zoom copy feedbacks
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [isRecordingAttendance, setIsRecordingAttendance] = useState(false);
  const [attendanceAlert, setAttendanceAlert] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Personal notes per lesson
  const [personalNotes, setPersonalNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  // Sync selected lesson when modules change
  useEffect(() => {
    if (allLessons.length > 0) {
      const exists = allLessons.some((l) => l.id === selectedLesson?.id);
      if (!exists) {
        setSelectedLesson(allLessons[0]);
      }
    }
  }, [allLessons, selectedLesson?.id]);

  // Load existing submission or reset inputs when selectedLesson changes
  useEffect(() => {
    const existing = assignmentSubmissions[selectedLesson.id];
    if (existing) {
      setAssignmentUrlInput(existing.driveUrl || '');
      setAssignmentTextInput(existing.writtenAnswer || '');
      setIsEditingSubmission(false);
    } else {
      setAssignmentUrlInput('');
      setAssignmentTextInput('');
      setIsEditingSubmission(false);
    }

    // Load personal notes for lesson
    if (typeof window !== 'undefined') {
      const savedNote = localStorage.getItem(`hh_lesson_notes_${selectedLesson.id}`);
      setPersonalNotes(savedNote || '');
    }
    setNotesSaved(false);
    setAttendanceAlert(null);
  }, [selectedLesson.id, assignmentSubmissions]);

  // Save progress to localStorage
  const updateCompletedLessons = (newCompleted: string[]) => {
    setCompletedLessonIds(newCompleted);
    if (typeof window !== 'undefined') {
      localStorage.setItem(progressStorageKey, JSON.stringify(newCompleted));
    }
  };

  const toggleLessonComplete = (lessonId: string, forceComplete?: boolean) => {
    let nextList: string[];
    const isCompleted = completedLessonIds.includes(lessonId);

    if (forceComplete) {
      if (!isCompleted) {
        nextList = [...completedLessonIds, lessonId];
        updateCompletedLessons(nextList);
        onSuccessToast?.('Lesson marked as complete! 🎉');
      }
      return;
    }

    if (isCompleted) {
      nextList = completedLessonIds.filter((id) => id !== lessonId);
      updateCompletedLessons(nextList);
      onSuccessToast?.('Marked as pending.');
    } else {
      nextList = [...completedLessonIds, lessonId];
      updateCompletedLessons(nextList);
      onSuccessToast?.('Lesson marked as complete! 🎉');
    }
  };

  const activeContentType = detectContentType(selectedLesson);

  // Switch to a lesson and smoothly scroll player into view so it plays right on the webpage
  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Safe YouTube ID extractor for in-page embedded playback
  const getEmbedVideoId = (url?: string) => {
    if (!url) return 'fEqJ86K856k';
    const trimmed = url.trim();
    // If the URL was dummy Rick Astley or Fireplace, use real clinical counselling lecture (Carl Rogers Model)
    if (trimmed.includes('dQw4w9WgXcQ') || trimmed.includes('L_LUpnjgPso')) {
      return 'fEqJ86K856k';
    }
    if (trimmed.includes('youtu.be/')) {
      return trimmed.split('youtu.be/')[1].split('?')[0].split('&')[0];
    }
    if (trimmed.includes('youtube.com/watch')) {
      const match = trimmed.match(/[?&]v=([^&]+)/);
      if (match) return match[1];
    }
    if (trimmed.includes('youtube.com/embed/')) {
      return trimmed.split('youtube.com/embed/')[1].split('?')[0].split('&')[0];
    }
    if (trimmed.includes('youtube.com/shorts/')) {
      return trimmed.split('youtube.com/shorts/')[1].split('?')[0].split('&')[0];
    }
    if (trimmed.includes('youtube.com/live/')) {
      return trimmed.split('youtube.com/live/')[1].split('?')[0].split('&')[0];
    }
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    return 'fEqJ86K856k';
  };

  const isGoogleDriveUrl = (url?: string) => {
    return Boolean(url && url.includes('drive.google.com'));
  };

  const isMp4VideoUrl = (url?: string) => {
    return Boolean(url && (url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('.mp4?')));
  };

  // Effective video URL
  const effectiveVideoUrl = (selectedLesson.videoUrl || selectedLesson.resources?.find((r) => r.url)?.url || '').trim();

  // Categorize all lessons across the course
  const categorizedLessons = useMemo(() => {
    const videoRecords: Lesson[] = [];
    const onlineSessions: Lesson[] = [];
    const pdfMaterials: Lesson[] = [];
    const assignmentTasks: Lesson[] = [];

    allLessons.forEach((l) => {
      const type = detectContentType(l);
      if (type === 'VIDEO') videoRecords.push(l);
      else if (type === 'MEETING') onlineSessions.push(l);
      else if (type === 'PDF') pdfMaterials.push(l);
      else if (type === 'ASSIGNMENT') assignmentTasks.push(l);
    });

    return { videoRecords, onlineSessions, pdfMaterials, assignmentTasks };
  }, [allLessons]);

  // Collect all PDF resources from all lessons
  const allPdfResources = useMemo(() => {
    const list: { lessonTitle: string; resource: LessonResource }[] = [];
    allLessons.forEach((l) => {
      (l.resources || []).forEach((res) => {
        if (res.type === 'PDF' || (res.title && res.title.toLowerCase().includes('pdf'))) {
          list.push({ lessonTitle: l.title, resource: res });
        }
      });
    });
    return list;
  }, [allLessons]);

  // Parse Meeting ID & Passcode
  const meetingDetails = useMemo(() => {
    let meetingId = selectedLesson.meetingId || '';
    let passcode = selectedLesson.meetingPasscode || '';
    let meetingTime = selectedLesson.meetingTime || '';
    const textToScan = `${selectedLesson.title} ${selectedLesson.description || ''}`;

    if (!meetingId) {
      const matchId = textToScan.match(/Meeting ID:\s*([0-9\s]+)/i) || textToScan.match(/ID:\s*([0-9\s]{9,13})/i);
      if (matchId) meetingId = matchId[1].trim();
    }
    if (!passcode) {
      const matchPass = textToScan.match(/Passcode:\s*([a-zA-Z0-9]+)/i) || textToScan.match(/Password:\s*([a-zA-Z0-9]+)/i);
      if (matchPass) passcode = matchPass[1].trim();
    }
    if (!meetingTime) {
      const matchTime = textToScan.match(/(\w+\s+\d{1,2},?\s*\d{4}\s+\d{1,2}:\d{2}\s*(?:AM|PM)?)/i) ||
                        textToScan.match(/(Sep\s+\d{1,2},\s*\d{4}\s+\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
      if (matchTime) meetingTime = matchTime[1].trim();
      else meetingTime = 'Scheduled Live Interactive Session';
    }

    return {
      meetingId: meetingId || '863 8022 9223',
      passcode: passcode || '487619',
      meetingTime: meetingTime || 'Sep 18, 2026 at 08:00 PM CST'
    };
  }, [selectedLesson]);

  // Launch Zoom Meeting & log attendance
  const handleLaunchZoomMeeting = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRecordingAttendance(true);

    const now = new Date();
    const clickDateStr = now.toISOString().split('T')[0];
    const clickTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fullTimestamp = `${clickDateStr} at ${clickTimeStr}`;

    const studentId = currentStudent.id || 'std-1';
    const studentName = currentStudent.name || 'Current Student';

    const attendancePayload = {
      studentId,
      studentName,
      courseId: course.id,
      courseTitle: course.title,
      sessionDate: clickDateStr,
      sessionTitle: selectedLesson.title,
      status: 'Present' as const,
      markedBy: 'Zoom LMS Attendance Click (Automated)',
      remarks: `Student joined live Zoom classroom session at ${clickTimeStr} on ${clickDateStr}. Attendance logged and counted.`
    };

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendancePayload)
      });
      const data = await response.json();

      const newLog: ZoomAttendanceLog = {
        date: clickDateStr,
        time: clickTimeStr,
        status: 'Present',
        remarks: attendancePayload.remarks
      };

      const updatedLogs = {
        ...zoomAttendanceLogs,
        [selectedLesson.id]: newLog
      };
      setZoomAttendanceLogs(updatedLogs);
      if (typeof window !== 'undefined') {
        localStorage.setItem(attendanceStorageKey, JSON.stringify(updatedLogs));
      }

      toggleLessonComplete(selectedLesson.id, true);

      if (data.alreadyLogged) {
        setAttendanceAlert({
          message: `Attendance verified! Your attendance was already counted for this session today (${clickDateStr}).`,
          type: 'info'
        });
      } else {
        setAttendanceAlert({
          message: `🎉 Attendance Recorded! You are marked PRESENT for this session on ${clickDateStr} at ${clickTimeStr}. Attendance has been added to your official count.`,
          type: 'success'
        });
      }

      onSuccessToast?.(`✅ Attendance logged: Present on ${clickDateStr} at ${clickTimeStr}!`);
    } catch (err) {
      console.warn('Attendance sync error, storing locally:', err);
      const newLog: ZoomAttendanceLog = {
        date: clickDateStr,
        time: clickTimeStr,
        status: 'Present'
      };
      const updatedLogs = { ...zoomAttendanceLogs, [selectedLesson.id]: newLog };
      setZoomAttendanceLogs(updatedLogs);
      if (typeof window !== 'undefined') {
        localStorage.setItem(attendanceStorageKey, JSON.stringify(updatedLogs));
      }
      toggleLessonComplete(selectedLesson.id, true);
      setAttendanceAlert({
        message: `Attendance recorded: Marked Present on ${fullTimestamp}.`,
        type: 'success'
      });
    } finally {
      setIsRecordingAttendance(false);
      const zoomUrl = selectedLesson.videoUrl || 'https://zoom.us/join';
      window.open(zoomUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Copy helper
  const copyToClipboard = (text: string, type: 'id' | 'pass') => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'id') {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      } else if (type === 'pass') {
        setCopiedPass(true);
        setTimeout(() => setCopiedPass(false), 2000);
      }
    }
  };

  // Assignment submit
  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentUrlInput.trim() && !assignmentTextInput.trim()) {
      alert('Please provide a Google Drive/Cloud document link or write your answer response before submitting.');
      return;
    }

    setIsSubmittingAssignment(true);
    const submission: AssignmentSubmission = {
      driveUrl: assignmentUrlInput.trim(),
      writtenAnswer: assignmentTextInput.trim(),
      submittedAt: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'Submitted'
    };

    const updated = {
      ...assignmentSubmissions,
      [selectedLesson.id]: submission
    };
    setAssignmentSubmissions(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(submissionStorageKey, JSON.stringify(updated));
    }

    toggleLessonComplete(selectedLesson.id, true);
    setIsSubmittingAssignment(false);
    setIsEditingSubmission(false);
    onSuccessToast?.('🎉 Assignment submitted successfully! Marked as complete.');
  };

  // Personal notes save
  const handleSavePersonalNotes = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`hh_lesson_notes_${selectedLesson.id}`, personalNotes);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2500);
    }
  };

  // Progress metrics
  const totalLessons = allLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessonIds.length / totalLessons) * 100) : 0;
  const zoomSessionsAttendedCount = Object.keys(zoomAttendanceLogs).length;
  const assignmentsSubmittedCount = Object.keys(assignmentSubmissions).length;

  // Filter lessons for sidebar
  const filteredLessonsByModule = useMemo(() => {
    return courseModules.map((mod) => {
      const filtered = (mod.lessons || []).filter((l) => {
        const matchesTab = activeMaterialTab === 'ALL' || detectContentType(l) === activeMaterialTab;
        const matchesSearch =
          !searchQuery.trim() ||
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (l.description && l.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesSearch;
      });
      return {
        ...mod,
        filteredLessons: filtered
      };
    });
  }, [courseModules, activeMaterialTab, searchQuery]);

  const activeLessonAttendance = zoomAttendanceLogs[selectedLesson.id];
  const activeLessonSubmission = assignmentSubmissions[selectedLesson.id];

  // Selected lesson order index
  const selectedLessonIndex = allLessons.findIndex((l) => l.id === selectedLesson.id);
  const currentUnitNumber = selectedLessonIndex >= 0 ? selectedLessonIndex + 1 : selectedLesson.order || 1;
  const currentModule = courseModules.find((m) => m.id === selectedLesson.moduleId) || courseModules[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* ============================================================== */}
      {/* TOP LMS HEADER & PROGRESS BAR                                   */}
      {/* ============================================================== */}
      <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold hover:underline mb-1 cursor-pointer transition-transform hover:-translate-x-0.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Student Dashboard
            </button>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">{course.title}</h1>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-teal-900/80 text-teal-300 border border-teal-700">
                LMS Classroom & Learning Portal
              </span>
            </div>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <span>Lecturer / Faculty: <strong className="text-white">{course.lecturerName || 'Ms. Ramsina Farvin Jelaldeen & Panel'}</strong></span>
              <span className="text-slate-500">•</span>
              <span>Enrolled Student: <strong className="text-amber-300">{currentStudent.name}</strong></span>
            </p>
          </div>

          {/* Overall Progress Widget */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80 min-w-[240px] text-xs shadow-inner space-y-2">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Overall Progress
              </span>
              <span className="text-amber-300 text-sm font-black">{progressPercent}%</span>
            </div>

            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-300 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-0.5">
              <span>{completedLessonIds.length} of {totalLessons} Units Completed</span>
              <span className="text-teal-400 font-semibold">{zoomSessionsAttendedCount} Zoom Attended</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2.5 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
            <span>Total Units: <strong>{totalLessons}</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-rose-300 border border-slate-800 flex items-center gap-2">
            <Tv className="w-3.5 h-3.5 text-rose-400" />
            <span>Video Recordings: <strong>{categorizedLessons.videoRecords.length}</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-blue-300 border border-slate-800 flex items-center gap-2">
            <Video className="w-3.5 h-3.5 text-blue-400" />
            <span>Online Zoom: <strong>{categorizedLessons.onlineSessions.length}</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-emerald-300 border border-slate-800 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>PDF Materials: <strong>{categorizedLessons.pdfMaterials.length + allPdfResources.length}</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-amber-300 border border-slate-800 flex items-center gap-2">
            <ClipboardCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Assignments: <strong>{assignmentsSubmittedCount}/{categorizedLessons.assignmentTasks.length || 1}</strong></span>
          </div>

          {progressPercent === 100 && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-2 animate-pulse font-bold">
              <Award className="w-4 h-4 text-amber-300" />
              <span>100% Course Completed! Ready for Certificate Issuance.</span>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MAIN LMS GRID: Left Player/Viewer & Right Modules Navigation     */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Viewer & Lecture Details Container */}
        <div ref={playerRef} className="lg:col-span-8 space-y-6">

          {/* ============================================================ */}
          {/* LECTURE HEADER BAR (Visible above display)                  */}
          {/* ============================================================ */}
          <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-md space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs ${
                  activeContentType === 'MEETING'
                    ? 'bg-blue-900/90 text-blue-200 border border-blue-700'
                    : activeContentType === 'ASSIGNMENT'
                    ? 'bg-amber-900/90 text-amber-200 border border-amber-700'
                    : activeContentType === 'PDF'
                    ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-700'
                    : 'bg-rose-900/90 text-rose-200 border border-rose-700'
                }`}>
                  {activeContentType === 'MEETING' ? (
                    <Video className="w-3.5 h-3.5" />
                  ) : activeContentType === 'ASSIGNMENT' ? (
                    <ClipboardCheck className="w-3.5 h-3.5" />
                  ) : activeContentType === 'PDF' ? (
                    <FileText className="w-3.5 h-3.5" />
                  ) : (
                    <Tv className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {activeContentType === 'MEETING'
                      ? 'Live Online Classroom (Zoom)'
                      : activeContentType === 'ASSIGNMENT'
                      ? 'Clinical Assessment / Task'
                      : activeContentType === 'PDF'
                      ? 'PDF Study Document'
                      : 'Video Lecture Recording'}
                  </span>
                </span>

                <span className="text-[11px] font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                  Unit {currentUnitNumber} of {totalLessons}
                </span>

                {selectedLesson.medium && (
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-950/70 px-2.5 py-1 rounded-full border border-amber-800">
                    {selectedLesson.medium} Medium
                  </span>
                )}

                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> {selectedLesson.durationMinutes || 60}m
                </span>
              </div>

              {/* Completion Toggle */}
              <button
                onClick={() => toggleLessonComplete(selectedLesson.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  completedLessonIds.includes(selectedLesson.id)
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{completedLessonIds.includes(selectedLesson.id) ? 'Completed ✓' : 'Mark as Complete'}</span>
              </button>
            </div>

            <div className="pt-1">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">{selectedLesson.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>{currentModule?.title || 'Main Curriculum'}</span>
                <span>•</span>
                <span>Faculty: <strong className="text-slate-200">{course.lecturerName || 'Ms. Ramsina Farvin Jelaldeen & Panel'}</strong></span>
              </p>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 1. LIVE ZOOM MEETING & ATTENDANCE TRACKER                     */}
          {/* ============================================================ */}
          {activeContentType === 'MEETING' && (
            <div className="bg-gradient-to-br from-slate-950 via-blue-950/80 to-slate-900 rounded-3xl p-6 sm:p-8 border border-blue-900/60 shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Live Online Classroom / Zoom Meeting Session</span>
                </div>

                {activeLessonAttendance ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Attendance Counted: Present ✓</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-800/80 px-3 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Attendance Required on Join</span>
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {selectedLesson.title}
                </h3>
                {selectedLesson.description && (
                  <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
                    {selectedLesson.description}
                  </p>
                )}
              </div>

              {/* Attendance Feedback Alert Banner */}
              {attendanceAlert && (
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-start gap-3 shadow-md animate-in fade-in slide-in-from-top-2 ${
                    attendanceAlert.type === 'success'
                      ? 'bg-emerald-900/90 text-emerald-100 border border-emerald-700'
                      : 'bg-blue-900/90 text-blue-100 border border-blue-700'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <p>{attendanceAlert.message}</p>
                    <p className="text-[11px] font-normal text-emerald-200/80">
                      Logged for: <strong>{currentStudent.name}</strong> • Course: <strong>{course.title}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setAttendanceAlert(null)}
                    className="text-white/80 hover:text-white text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Meeting Access Credentials Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-blue-900/50 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Scheduled Time</span>
                  <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{meetingDetails.meetingTime}</span>
                  </div>
                </div>

                <div className="space-y-1 sm:border-l sm:border-slate-800 sm:pl-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Meeting ID</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white text-xs sm:text-sm tracking-wide">
                      {meetingDetails.meetingId}
                    </span>
                    <button
                      onClick={() => copyToClipboard(meetingDetails.meetingId, 'id')}
                      className="text-amber-300 hover:text-white p-1 rounded transition-colors text-[10px] flex items-center gap-1"
                      title="Copy Meeting ID"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1 sm:border-l sm:border-slate-800 sm:pl-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Passcode</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-300 text-xs sm:text-sm">
                      {meetingDetails.passcode}
                    </span>
                    <button
                      onClick={() => copyToClipboard(meetingDetails.passcode, 'pass')}
                      className="text-amber-300 hover:text-white p-1 rounded transition-colors text-[10px] flex items-center gap-1"
                      title="Copy Passcode"
                    >
                      {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* ACTION: Launch & Join Zoom Button (Triggering Attendance) */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleLaunchZoomMeeting}
                  disabled={isRecordingAttendance}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base shadow-xl hover:shadow-blue-500/40 flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer disabled:opacity-75"
                >
                  <Video className="w-5 h-5 shrink-0" />
                  <span>
                    {isRecordingAttendance ? 'Logging Attendance & Connecting...' : 'Launch & Join Zoom Meeting'}
                  </span>
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </button>
              </div>

              {/* Attendance Verification Seal */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    activeLessonAttendance ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {activeLessonAttendance ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">
                      {activeLessonAttendance
                        ? `Official Attendance: PRESENT (${activeLessonAttendance.date} at ${activeLessonAttendance.time})`
                        : 'Attendance Tracking Active: Recorded automatically upon launching meeting'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Clicking the Zoom button captures your presence and logs it into the official Helping Hearts student attendance ledger.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 2. ONLINE ASSIGNMENT & ASSESSMENT PORTAL                     */}
          {/* ============================================================ */}
          {activeContentType === 'ASSIGNMENT' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 text-white p-6 sm:p-8 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-bold">
                    <ClipboardCheck className="w-4 h-4" />
                    <span>Online Assignment & Clinical Assessment</span>
                  </span>

                  {activeLessonSubmission ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Submitted for Grading ✓
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Pending Submission
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-black">{selectedLesson.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-amber-100/90 pt-1">
                  <span>Due Date: <strong>{selectedLesson.dueDate || 'October 15, 2026'}</strong></span>
                  <span>•</span>
                  <span>Max Score: <strong>{selectedLesson.maxScore || 100} Marks</strong></span>
                  <span>•</span>
                  <span>Evaluator: <strong>{course.lecturerName || 'Ms. Ramsina Farvin Jelaldeen'}</strong></span>
                </div>
              </div>

              {/* Instructions Box */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-amber-700" /> Assignment Instructions & Brief
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {selectedLesson.assignmentInstructions || selectedLesson.description ||
                      'Please read the course materials provided for this module. Formulate your clinical reflection and submit your assessment report as a Google Drive / cloud link or enter your response text below.'}
                  </p>
                </div>

                {/* Submission View / Form */}
                {activeLessonSubmission && !isEditingSubmission ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <h4 className="font-bold text-emerald-950 text-sm">
                          Assessment Submitted on {activeLessonSubmission.submittedAt}
                        </h4>
                      </div>
                      <button
                        onClick={() => setIsEditingSubmission(true)}
                        className="text-xs text-emerald-800 hover:text-emerald-900 font-bold underline cursor-pointer"
                      >
                        Edit / Resubmit Assessment
                      </button>
                    </div>

                    {activeLessonSubmission.driveUrl && (
                      <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Uploaded Document URL</span>
                        <a
                          href={activeLessonSubmission.driveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline font-bold flex items-center gap-1.5 break-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          <span>{activeLessonSubmission.driveUrl}</span>
                        </a>
                      </div>
                    )}

                    {activeLessonSubmission.writtenAnswer && (
                      <div className="bg-white p-4 rounded-xl border border-emerald-200 text-xs space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Submitted Written Reflection</span>
                        <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                          {activeLessonSubmission.writtenAnswer}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-emerald-800 pt-2 border-t border-emerald-200/60">
                      <span>Status: <strong>Awaiting Lecturer Grading</strong></span>
                      <span className="font-semibold text-emerald-700">Course Progress Credited ✓</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAssignmentSubmit} className="space-y-4 text-xs">
                    <div className="border-b border-slate-200 pb-3">
                      <h4 className="font-bold text-slate-900 text-sm">Submit Your Assessment</h4>
                      <p className="text-slate-500 text-[11px]">
                        Submit your assignment either by pasting a Google Drive/OneDrive document share link or typing your essay response.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-700 uppercase">
                        Google Drive / Cloud Document Link
                      </label>
                      <input
                        type="url"
                        value={assignmentUrlInput}
                        onChange={(e) => setAssignmentUrlInput(e.target.value)}
                        placeholder="https://drive.google.com/file/d/... or OneDrive link"
                        className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none"
                      />
                      <span className="text-[11px] text-slate-500 block">
                        Ensure link sharing is set to &ldquo;Anyone with the link can view&rdquo; so the lecturer can review it.
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <label className="block font-bold text-slate-700 uppercase">
                        Or Type / Paste Written Reflection & Answer
                      </label>
                      <textarea
                        rows={6}
                        value={assignmentTextInput}
                        onChange={(e) => setAssignmentTextInput(e.target.value)}
                        placeholder="Type your response, case analysis, or essay answers here..."
                        className="w-full p-3.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none leading-relaxed"
                      ></textarea>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3">
                      {isEditingSubmission && (
                        <button
                          type="button"
                          onClick={() => setIsEditingSubmission(false)}
                          className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmittingAssignment}
                        className="px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                      >
                        <ClipboardCheck className="w-4 h-4" />
                        <span>{isSubmittingAssignment ? 'Submitting...' : 'Submit Assessment for Grading'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 3. PDF STUDY MATERIAL & DOCUMENT VIEWER                      */}
          {/* ============================================================ */}
          {activeContentType === 'PDF' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
              {/* Header Bar */}
              <div className="bg-slate-900 text-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase bg-teal-800 text-teal-200 px-2.5 py-0.5 rounded">
                      PDF Document Study Unit
                    </span>
                    {completedLessonIds.includes(selectedLesson.id) && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
                        Read & Completed ✓
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold">{selectedLesson.title}</h3>
                  <p className="text-xs text-slate-300">{course.title} • Module Document Pack</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {selectedLesson.videoUrl && (
                    <a
                      href={selectedLesson.videoUrl.replace('/preview', '/view')}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  )}
                  <button
                    onClick={() => toggleLessonComplete(selectedLesson.id)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                      completedLessonIds.includes(selectedLesson.id)
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-800 text-white hover:bg-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{completedLessonIds.includes(selectedLesson.id) ? 'Completed ✓' : 'Mark as Read'}</span>
                  </button>
                </div>
              </div>

              {/* Embedded Document Viewer Container */}
              <div className="p-4 sm:p-6 space-y-4">
                {selectedLesson.videoUrl ? (
                  <div className="w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
                    <div className="h-[600px] w-full">
                      <iframe
                        src={selectedLesson.videoUrl.replace('/view', '/preview')}
                        title={selectedLesson.title}
                        className="w-full h-full border-0"
                        allow="autoplay"
                      ></iframe>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-10 text-center border border-dashed border-slate-300 space-y-3">
                    <FileText className="w-12 h-12 text-teal-800 mx-auto" />
                    <h4 className="font-bold text-slate-800 text-base">{selectedLesson.title}</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Please refer to the downloadable handbook resources attached to this lesson below.
                    </p>
                  </div>
                )}

                {selectedLesson.description && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700">
                    <strong className="block font-bold text-slate-900 mb-1">Study Guide Overview:</strong>
                    <p className="leading-relaxed">{selectedLesson.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 4. VIDEO LECTURE DISPLAY (IN-PAGE EMBEDDED STREAM)           */}
          {/* ============================================================ */}
          {activeContentType === 'VIDEO' && (
            <div className="space-y-4">
              <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative">
                <div className="aspect-video w-full relative">
                  {isGoogleDriveUrl(effectiveVideoUrl) ? (
                    <iframe
                      src={effectiveVideoUrl.replace('/view', '/preview')}
                      title={selectedLesson.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : isMp4VideoUrl(effectiveVideoUrl) ? (
                    <video
                      controls
                      playsInline
                      autoPlay
                      key={effectiveVideoUrl}
                      className="w-full h-full object-contain"
                      src={effectiveVideoUrl}
                    >
                      Your browser does not support HTML5 video streaming.
                    </video>
                  ) : (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${getEmbedVideoId(effectiveVideoUrl)}?autoplay=0&playsinline=1&rel=0&modestbranding=1`}
                      title={selectedLesson.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>

                {/* Sub-bar below video */}
                <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>High Definition Lecture Playback • Helping Hearts Secure Stream</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline">Instructor: {course.lecturerName || 'Ms. Ramsina Farvin Jelaldeen & Panel'}</span>
                  </div>
                </div>
              </div>

              {/* Streaming Disclaimer */}
              <div className="bg-teal-50 border border-teal-200/80 p-3.5 rounded-2xl text-xs text-teal-950 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>In-Page Classroom Player:</strong> Recorded video lectures and clinical archives stream directly inside your Helping Hearts LMS portal without leaving the webpage.
                </p>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LECTURER PROFILE & LECTURE DETAILS CARD                      */}
          {/* ============================================================ */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-6 shadow-xs">
            {/* Lecturer Spotlight Section */}
            <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-900 text-white p-5 sm:p-6 rounded-2xl border border-teal-800/60 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="relative shrink-0">
                <img
                  src="/assets/images/regenerated_image_1786279526494.png"
                  alt={course.lecturerName || 'Ms. Ramsina Farvin Jelaldeen'}
                  className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl object-cover border-2 border-amber-400 shadow-md mx-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop';
                  }}
                />
                <span className="absolute -bottom-2 -right-1 bg-amber-400 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                  Faculty
                </span>
              </div>

              <div className="space-y-2 flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                      Lead Course Lecturer & Directress
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {course.lecturerName || 'Ms. Ramsina Farvin Jelaldeen & Panel'}
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold text-teal-300 bg-teal-900/80 px-2.5 py-1 rounded-full border border-teal-700 self-center sm:self-start">
                    Academic Supervisor
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Directress & Consultant Counselling Psychotherapist at Helping Hearts Counselling & Wellness Centre.
                  Accredited by <strong>APA (USA)</strong>, <strong>ACCPH (UK)</strong>, <strong>ANZMH (Aus/NZ)</strong> & <strong>NLPEA (UK)</strong>.
                </p>

                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start pt-1">
                  <span className="bg-teal-900/60 text-teal-200 text-[10px] px-2 py-0.5 rounded-md border border-teal-700">
                    Counselling Psychology
                  </span>
                  <span className="bg-teal-900/60 text-teal-200 text-[10px] px-2 py-0.5 rounded-md border border-teal-700">
                    Psychotherapy & Ethics
                  </span>
                  <span className="bg-teal-900/60 text-teal-200 text-[10px] px-2 py-0.5 rounded-md border border-teal-700">
                    NLP Practitioner
                  </span>
                </div>
              </div>
            </div>

            {/* Lecture Objectives & Overview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-teal-800" />
                  <span>Lecture Overview & Study Objectives</span>
                </h4>
                <span className="text-xs font-semibold text-slate-500">
                  {selectedLesson.date ? `Conducted: ${selectedLesson.date}` : 'Standard Curriculum Unit'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {selectedLesson.description ||
                  'In this lecture, students examine core psychological principles, active communication techniques, case evaluation models, and professional ethical protocols.'}
              </p>
            </div>

            {/* Attached Lesson Documents & Study Files */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-800" /> Attached Lesson Documents & Resources ({selectedLesson.resources?.length || 0})
              </h4>

              {selectedLesson.resources && selectedLesson.resources.length > 0 ? (
                <div className="space-y-2">
                  {selectedLesson.resources.map((res) => {
                    const isVideo = res.type === 'VIDEO';
                    const isZoom = res.type === 'MEETING';
                    const isAssign = res.type === 'ASSIGNMENT';
                    const isPdf = res.type === 'PDF';

                    return (
                      <div
                        key={res.id}
                        className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-100/80 transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-[10px] shrink-0 ${
                              isZoom
                                ? 'bg-blue-100 text-blue-800'
                                : isVideo
                                ? 'bg-rose-100 text-rose-800'
                                : isAssign
                                ? 'bg-amber-100 text-amber-800'
                                : isPdf
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            {isZoom ? (
                              <Video className="w-4 h-4" />
                            ) : isVideo ? (
                              <Play className="w-4 h-4" />
                            ) : isAssign ? (
                              <ClipboardCheck className="w-4 h-4" />
                            ) : (
                              'PDF'
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{res.title}</p>
                            {res.description && (
                              <p className="text-slate-500 text-[11px] mt-0.5">{res.description}</p>
                            )}
                          </div>
                        </div>

                        <a
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`px-3.5 py-1.5 rounded-xl font-semibold text-[11px] flex items-center gap-1.5 self-start sm:self-auto shrink-0 transition-all ${
                            isZoom
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : isVideo
                              ? 'bg-rose-600 hover:bg-rose-700 text-white'
                              : 'bg-teal-800 hover:bg-teal-900 text-white'
                          }`}
                        >
                          {isZoom ? (
                            <>
                              <Video className="w-3.5 h-3.5" />
                              <span>Join Zoom</span>
                              <ExternalLink className="w-3 h-3" />
                            </>
                          ) : isVideo ? (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              <span>Watch Video</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              <span>Open / Download</span>
                              <ExternalLink className="w-3 h-3" />
                            </>
                          )}
                        </a>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No additional external resources attached specifically to this unit.</p>
              )}
            </div>

            {/* Student Personal Study Notes */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" /> Student Session Notes (Private)
                </label>
                {notesSaved && <span className="text-[10px] text-emerald-600 font-bold">Notes Saved ✓</span>}
              </div>
              <textarea
                rows={2}
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                placeholder="Type your personal observations, clinical insights, or questions for the lecturer..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-600 outline-none"
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSavePersonalNotes}
                  className="px-3.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold transition-all cursor-pointer"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* COURSE MATERIALS SECTIONS ("wena wenama section")             */}
          {/* Online Section, Video Records, PDF Materials, Assignments    */}
          {/* ============================================================ */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-6 shadow-xs">
            {/* Section Header & Selector Tabs */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                    Curriculum Content Explorer
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">Course Materials by Category</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Select a section to explore video records, live classes, PDFs, and assessments.
                </p>
              </div>

              {/* Navigation Tabs for Separate Sections */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'ALL', label: 'All Sections', count: totalLessons, icon: Layers },
                  { id: 'VIDEO', label: '📹 Video Records', count: categorizedLessons.videoRecords.length, icon: Tv },
                  { id: 'MEETING', label: '🎥 Online Section (Zoom)', count: categorizedLessons.onlineSessions.length, icon: Video },
                  { id: 'PDF', label: '📄 PDF Study Materials', count: categorizedLessons.pdfMaterials.length + allPdfResources.length, icon: FileText },
                  { id: 'ASSIGNMENT', label: '📝 Tasks & Assessments', count: categorizedLessons.assignmentTasks.length, icon: ClipboardCheck }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeMaterialTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveMaterialTab(tab.id as MaterialSectionTab)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-teal-900 text-white shadow-sm ring-2 ring-teal-700/50'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-teal-800 text-teal-200' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ---------------------------------------------------------- */}
            {/* SECTION 1: VIDEO RECORDS (වීඩියෝ දේශන)                      */}
            {/* ---------------------------------------------------------- */}
            {(activeMaterialTab === 'ALL' || activeMaterialTab === 'VIDEO') && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between bg-rose-50/80 p-3.5 rounded-2xl border border-rose-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                      <Tv className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-rose-950 text-sm">Video Records & Lecture Archive</h4>
                      <p className="text-[11px] text-rose-800">
                        Click any lecture below to play it directly on this webpage ({categorizedLessons.videoRecords.length})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {categorizedLessons.videoRecords.map((les) => {
                    const isSelected = selectedLesson.id === les.id;
                    const isDone = completedLessonIds.includes(les.id);

                    return (
                      <div
                        key={les.id}
                        className={`p-4 rounded-2xl border text-xs space-y-3 transition-all ${
                          isSelected
                            ? 'bg-rose-50/60 border-rose-400 shadow-sm ring-1 ring-rose-400'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                              <Play className="w-3.5 h-3.5 fill-rose-600" />
                            </div>
                            <div className="truncate flex-1 min-w-0">
                              <h5 className="font-bold text-slate-900 truncate text-xs">{les.title}</h5>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {les.description || 'Clinical lecture video stream'}
                              </p>
                            </div>
                          </div>

                          {isDone && (
                            <span className="text-emerald-600 shrink-0" title="Completed">
                              <CheckCircle2 className="w-4 h-4" />
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                          <div className="flex items-center gap-2">
                            <span>⏱ {les.durationMinutes || 60}m</span>
                            {les.medium && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                                {les.medium}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => handleSelectLesson(les)}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>{isSelected ? 'Playing Now' : 'Play Video'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------- */}
            {/* SECTION 2: ONLINE SECTION / ZOOM LIVE (සජීවී දේශන)           */}
            {/* ---------------------------------------------------------- */}
            {(activeMaterialTab === 'ALL' || activeMaterialTab === 'MEETING') && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-blue-950 text-sm">Online Section: Live Zoom Classroom Sessions</h4>
                      <p className="text-[11px] text-blue-800">
                        Live interactive classes with automated attendance logging ({categorizedLessons.onlineSessions.length})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {categorizedLessons.onlineSessions.length > 0 ? (
                    categorizedLessons.onlineSessions.map((les) => {
                      const isSelected = selectedLesson.id === les.id;
                      const hasAttended = Boolean(zoomAttendanceLogs[les.id]);

                      return (
                        <div
                          key={les.id}
                          className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                            isSelected
                              ? 'bg-blue-50/60 border-blue-400 shadow-sm'
                              : 'bg-white hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                              <Video className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-slate-900">{les.title}</h5>
                                {hasAttended && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                    Present ✓
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-500 text-[11px] mt-0.5">
                                {les.meetingTime || les.date || 'Scheduled Live Clinical Training'} • {les.durationMinutes || 90}m
                                {les.medium ? ` • ${les.medium} Medium` : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                            <button
                              onClick={() => handleSelectLesson(les)}
                              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Open Session & Join</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-500 italic p-3">No live Zoom sessions scheduled currently.</p>
                  )}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------- */}
            {/* SECTION 3: PDF STUDY MATERIALS & HANDBOOKS (අධ්‍යයන ලේඛන)     */}
            {/* ---------------------------------------------------------- */}
            {(activeMaterialTab === 'ALL' || activeMaterialTab === 'PDF') && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-emerald-950 text-sm">PDF Study Materials, Handbooks & Worksheets</h4>
                      <p className="text-[11px] text-emerald-800">
                        Official student reference guides, handouts, and clinical reading packs ({categorizedLessons.pdfMaterials.length + allPdfResources.length})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Lessons that are PDFs */}
                  {categorizedLessons.pdfMaterials.map((les) => (
                    <div
                      key={les.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200 text-xs space-y-3 hover:border-emerald-300 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                          PDF
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-slate-900 truncate">{les.title}</h5>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{les.description || 'Curriculum handbook document'}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400">Official Course Pack</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSelectLesson(les)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] cursor-pointer"
                          >
                            Preview in LMS
                          </button>
                          {les.videoUrl && (
                            <a
                              href={les.videoUrl.replace('/preview', '/view')}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Attached PDF resources from all lessons */}
                  {allPdfResources.map(({ lessonTitle, resource }) => (
                    <div
                      key={resource.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200 text-xs space-y-3 hover:border-emerald-300 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                          PDF
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-slate-900 truncate">{resource.title}</h5>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">Lesson: {lessonTitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-[10px] text-emerald-700 font-semibold">{resource.medium || 'Sinhala & Tamil'}</span>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download PDF</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------- */}
            {/* SECTION 4: TASKS & ASSIGNMENTS (පැවරුම්)                   */}
            {/* ---------------------------------------------------------- */}
            {(activeMaterialTab === 'ALL' || activeMaterialTab === 'ASSIGNMENT') && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-700 text-white flex items-center justify-center font-bold">
                      <ClipboardCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-amber-950 text-sm">Online Tasks & Clinical Assessments</h4>
                      <p className="text-[11px] text-amber-800">
                        Practical case evaluations and clinical reflection submissions ({categorizedLessons.assignmentTasks.length})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {categorizedLessons.assignmentTasks.length > 0 ? (
                    categorizedLessons.assignmentTasks.map((les) => {
                      const isSubmitted = Boolean(assignmentSubmissions[les.id]);

                      return (
                        <div
                          key={les.id}
                          className="bg-white p-4 rounded-2xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-300 transition-all"
                        >
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                              <ClipboardCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-slate-900">{les.title}</h5>
                                {isSubmitted ? (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                    Submitted ✓
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                                    Pending
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-500 text-[11px] mt-0.5">
                                Due: {les.dueDate || 'October 15, 2026'} • Max Score: {les.maxScore || 100} Marks
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleSelectLesson(les)}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs self-start sm:self-auto"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>{isSubmitted ? 'View Submission' : 'Submit Assignment'}</span>
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-500 italic p-3">No active assignments assigned for this course currently.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT MODULES & MATERIALS NAVIGATION DRAWER                    */}
        {/* ============================================================== */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs sticky top-6">
          <div className="border-b border-slate-100 pb-3 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Course Curriculum</h3>
                <p className="text-[11px] text-slate-500">{totalLessons} Total Learning Units</p>
              </div>
              <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                {courseModules.length} {courseModules.length === 1 ? 'Module' : 'Modules'}
              </span>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lectures, topics, units..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-700 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pt-1 pb-1">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'VIDEO', label: '📹 Video' },
                { id: 'MEETING', label: '🎥 Zoom' },
                { id: 'PDF', label: '📄 PDF' },
                { id: 'ASSIGNMENT', label: '📝 Task' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveMaterialTab(filter.id as MaterialSectionTab)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeMaterialTab === filter.id
                      ? 'bg-teal-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Module Lessons Accordion List */}
          <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
            {filteredLessonsByModule.map((mod) => (
              <div key={mod.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-teal-950 bg-teal-50 p-2.5 rounded-xl border border-teal-100">
                  <span className="truncate">{mod.title}</span>
                  <span className="text-[10px] text-teal-700 bg-white px-2 py-0.5 rounded-full font-mono shrink-0 ml-1">
                    {mod.lessons?.filter((l) => completedLessonIds.includes(l.id)).length || 0}/
                    {mod.lessons?.length || 0}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {mod.filteredLessons && mod.filteredLessons.length > 0 ? (
                    mod.filteredLessons.map((les) => {
                      const isSelected = selectedLesson.id === les.id;
                      const isDone = completedLessonIds.includes(les.id);
                      const type = detectContentType(les);

                      return (
                        <button
                          key={les.id}
                          onClick={() => handleSelectLesson(les)}
                          className={`w-full text-left p-3 rounded-2xl text-xs font-medium flex items-center justify-between gap-2.5 transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-teal-900 text-white border-teal-800 shadow-md font-semibold'
                              : 'bg-slate-50 hover:bg-slate-100/90 text-slate-700 border-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate flex-1 min-w-0">
                            {/* Type Icon Badge */}
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-teal-800 text-white'
                                  : type === 'MEETING'
                                  ? 'bg-blue-100 text-blue-700'
                                  : type === 'ASSIGNMENT'
                                  ? 'bg-amber-100 text-amber-700'
                                  : type === 'PDF'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-rose-100 text-rose-700'
                              }`}
                            >
                              {type === 'MEETING' ? (
                                <Video className="w-3.5 h-3.5" />
                              ) : type === 'ASSIGNMENT' ? (
                                <ClipboardCheck className="w-3.5 h-3.5" />
                              ) : type === 'PDF' ? (
                                <FileText className="w-3.5 h-3.5" />
                              ) : (
                                <Play className="w-3.5 h-3.5" />
                              )}
                            </div>

                            <div className="truncate min-w-0">
                              <p className="truncate font-semibold text-xs leading-tight">{les.title}</p>
                              <div className="flex items-center gap-1.5 text-[10px] mt-0.5 opacity-80">
                                <span>
                                  {type === 'MEETING'
                                    ? 'Zoom Classroom'
                                    : type === 'ASSIGNMENT'
                                    ? 'Assessment'
                                    : type === 'PDF'
                                    ? 'PDF Document'
                                    : 'Video Lesson'}
                                </span>
                                <span>•</span>
                                <span>{les.durationMinutes || 60}m</span>
                              </div>
                            </div>
                          </div>

                          {/* Completion Indicator */}
                          <div className="shrink-0 flex items-center gap-1">
                            {isDone ? (
                              <CheckCircle2
                                className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-emerald-600'}`}
                              />
                            ) : (
                              <div
                                className={`w-3.5 h-3.5 rounded-full border ${
                                  isSelected ? 'border-teal-400' : 'border-slate-300'
                                }`}
                              ></div>
                            )}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-[11px] text-slate-400 italic p-2">
                      No units matching current filter.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
