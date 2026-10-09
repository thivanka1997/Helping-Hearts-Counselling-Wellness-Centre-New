'use client';
import React, { useEffect } from 'react';
import { X, Play, Calendar, GraduationCap, ShieldCheck, Heart } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
  description?: string;
  onOpenAppointment?: () => void;
  onOpenRegister?: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoUrl = 'https://drive.google.com/file/d/1noKss0u6jMGuXkw0ZD-Kpp2cx8-Td1G0/preview',
  title = 'Helping Hearts Counselling & Wellness Centre',
  description = 'Empowering minds, healing hearts, and nurturing holistic well-being with professional psychological counselling and accredited education.',
  onOpenAppointment,
  onOpenRegister,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Format video url if needed
  let embedUrl = videoUrl;
  if (videoUrl.includes('drive.google.com/file/d/')) {
    const fileIdMatch = videoUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      embedUrl = `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
  } else if (videoUrl.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(videoUrl.split('?')[1]);
    const v = urlParams.get('v');
    if (v) embedUrl = `https://www.youtube.com/embed/${v}?autoplay=1`;
  } else if (videoUrl.includes('youtu.be/')) {
    const v = videoUrl.split('youtu.be/')[1]?.split('?')[0];
    if (v) embedUrl = `https://www.youtube.com/embed/${v}?autoplay=1`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-4xl bg-slate-900 border border-teal-700/60 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight line-clamp-1">{title}</h3>
              <p className="text-xs text-amber-300 font-medium">Official Promotional Video</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative w-full bg-black aspect-video flex items-center justify-center">
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer / Info / Action buttons */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
              <Heart className="w-3.5 h-3.5 fill-teal-400 text-teal-400" />
              <span>Helping Hearts Counselling & Wellness Centre</span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">{description}</p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            {onOpenAppointment && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAppointment();
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-teal-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            )}
            {onOpenRegister && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRegister();
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm border border-teal-600/60 transition-all flex items-center justify-center gap-1.5"
              >
                <GraduationCap className="w-4 h-4 text-amber-300" />
                <span>Join Diploma</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
