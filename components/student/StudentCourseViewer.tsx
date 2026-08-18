'use client';
import React, { useState } from 'react';
import { Course, CourseModule, Lesson } from '@/src/types';
import { Video, FileText, CheckCircle2, ArrowLeft, Download, ExternalLink, ShieldCheck, ChevronRight, Play } from 'lucide-react';

interface StudentCourseViewerProps {
  course: Course;
  modules: CourseModule[];
  onBack: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const StudentCourseViewer: React.FC<StudentCourseViewerProps> = ({
  course,
  modules,
  onBack,
  onSuccessToast
}) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(
    modules[0]?.lessons[0] || {
      id: 'les-demo',
      moduleId: 'mod-1',
      title: 'Lesson 01: Introduction & Orientation',
      description: 'Overview of counselling ethics and therapeutic rapport.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      resources: [],
      order: 1,
      durationMinutes: 45
    }
  );

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(['les-101']);

  const toggleLessonComplete = (lessonId: string) => {
    if (completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds(completedLessonIds.filter((id) => id !== lessonId));
      onSuccessToast?.('Lesson marked as pending.');
    } else {
      setCompletedLessonIds([...completedLessonIds, lessonId]);
      onSuccessToast?.('Lesson marked as complete! 🎉');
    }
  };

  const extractYouTubeId = (url?: string) => {
    if (!url) return 'dQw4w9WgXcQ';
    if (url.includes('v=')) return url.split('v=')[1].split('&')[0];
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1];
    return 'dQw4w9WgXcQ';
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const progressPercent = totalLessons > 0 ? Math.round((completedLessonIds.length / totalLessons) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-lg">
        <div className="space-y-1">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Student Dashboard
          </button>
          <h1 className="text-xl sm:text-2xl font-bold">{course.title}</h1>
          <p className="text-xs text-slate-300">Lecturer: {course.lecturerName}</p>
        </div>

        <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 min-w-[200px] text-xs">
          <div className="flex justify-between font-bold mb-1">
            <span>Overall Progress</span>
            <span className="text-amber-300">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-teal-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main LMS Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Video & Material Player */}
        <div className="lg:col-span-8 space-y-6">
          {/* Responsive YouTube Embed Container */}
          <div className="bg-black rounded-3xl overflow-hidden shadow-xl border border-slate-800 relative">
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeId(selectedLesson.videoUrl)}`}
                title={selectedLesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Video Streaming Disclaimer */}
          <div className="bg-amber-50 border border-amber-200/80 p-3.5 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Phase 1 Embedded Video Stream:</strong> Videos are streamed directly via responsive YouTube unlisted containers inside your LMS. High security Vimeo/Bunny Stream upgrade options available.
            </p>
          </div>

          {/* Lesson Details & Completion Action */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded">
                  Active Lesson
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedLesson.title}</h2>
              </div>

              <button
                onClick={() => toggleLessonComplete(selectedLesson.id)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  completedLessonIds.includes(selectedLesson.id)
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-teal-800 hover:bg-teal-900 text-white shadow-xs'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{completedLessonIds.includes(selectedLesson.id) ? 'Completed ✓' : 'Mark Lesson as Complete'}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{selectedLesson.description}</p>

            {/* Google Drive Learning Materials */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-800" /> Google Drive Learning Materials & Docs
              </h3>

              {selectedLesson.resources && selectedLesson.resources.length > 0 ? (
                <div className="space-y-2">
                  {selectedLesson.resources.map((res) => (
                    <div
                      key={res.id}
                      className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-[11px]">
                          {res.type}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{res.title}</p>
                          <p className="text-slate-500 text-[11px]">{res.description}</p>
                        </div>
                      </div>

                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-teal-800 text-white font-semibold text-[11px] flex items-center gap-1 hover:bg-teal-900 shrink-0"
                      >
                        <span>Open Document</span> <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No additional reading resources attached to this lesson.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Modules Navigation Drawer */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Course Modules ({modules.length})
          </h3>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {modules.map((mod) => (
              <div key={mod.id} className="space-y-2">
                <p className="text-xs font-bold text-teal-900 bg-teal-50 p-2 rounded-xl border border-teal-100">
                  {mod.title}
                </p>

                <div className="space-y-1.5">
                  {mod.lessons.map((les) => {
                    const isSelected = selectedLesson.id === les.id;
                    const isDone = completedLessonIds.includes(les.id);
                    return (
                      <button
                        key={les.id}
                        onClick={() => setSelectedLesson(les)}
                        className={`w-full text-left p-3 rounded-xl text-xs font-medium flex items-center justify-between gap-2 transition-all ${
                          isSelected
                            ? 'bg-teal-800 text-white shadow-xs font-semibold'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Play className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
                          <span className="truncate">{les.title}</span>
                        </div>
                        {isDone && (
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-300' : 'text-emerald-600'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
