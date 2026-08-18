'use client';
import React, { useState } from 'react';
import { EventWorkshop } from '@/src/types';
import { Calendar, Clock, MapPin, Video, ExternalLink, X } from 'lucide-react';
import { getYouTubeEmbedUrl } from '@/src/utils/mediaUtils';

interface EventsWorkshopsProps {
  events: EventWorkshop[];
}

export const EventsWorkshops: React.FC<EventsWorkshopsProps> = ({ events }) => {
  const [filter, setFilter] = useState<'ALL' | 'EVENT' | 'WORKSHOP'>('ALL');
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const filtered = filter === 'ALL' ? events : events.filter((e) => e.type === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-widest text-teal-800 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
          Community Engagement
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Events & Wellness Workshops
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Participate in mental health symposia, adolescent emotional resilience workshops, and clinical seminars organized by Helping Hearts.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2">
        {(['ALL', 'EVENT', 'WORKSHOP'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === type
                ? 'bg-teal-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {type === 'ALL' ? 'All Gatherings' : type === 'EVENT' ? 'Symposia & Events' : 'Interactive Workshops'}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((evt) => {
          const embedUrl = getYouTubeEmbedUrl(evt.videoUrl);
          return (
            <div
              key={evt.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 bg-slate-900">
                  <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase px-2.5 py-1 rounded shadow-xs">
                    {evt.type}
                  </span>
                  <span className="absolute top-3 right-3 bg-teal-900/90 text-white font-bold text-[10px] px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {evt.isOnline ? 'Virtual Zoom' : 'In-Person'}
                  </span>

                  {embedUrl && (
                    <button
                      onClick={() => setActiveVideoUrl(embedUrl)}
                      className="absolute bottom-3 left-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 transition-transform hover:scale-105"
                    >
                      <Video className="w-4 h-4" /> Watch Event Video
                    </button>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-slate-900">{evt.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{evt.description}</p>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                    <p className="flex items-center gap-2 font-semibold text-teal-900">
                      <Calendar className="w-4 h-4 text-teal-700" /> {evt.date} ({evt.startTime} - {evt.endTime})
                    </p>
                    <p className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4 text-teal-700" /> {evt.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 mt-2 flex gap-2">
                {evt.registrationUrl && (
                  <a
                    href={evt.registrationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <span>Register for Event</span> <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {embedUrl && (
                  <button
                    onClick={() => setActiveVideoUrl(embedUrl)}
                    className="px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-rose-200"
                  >
                    <Video className="w-4 h-4" /> Video
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Modal Player */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-slate-950 rounded-3xl shadow-2xl w-full max-w-3xl p-4 border border-slate-800 space-y-3 relative">
            <div className="flex justify-between items-center px-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-500" /> Event Video Highlight
              </span>
              <button
                onClick={() => setActiveVideoUrl(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800">
              <iframe
                src={activeVideoUrl}
                title="Event Video Player"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
