'use client';
import React, { useState } from 'react';
import { Course } from '@/src/types';
import { GraduationCap, Clock, Calendar, Search, BookOpen, User, Sparkles } from 'lucide-react';

interface CourseCatalogProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
  onOpenRegister: () => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({ courses, onSelectCourse, onOpenRegister }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(courses.map((c) => c.category)))];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-widest text-teal-800 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
          Academic LMS Programs
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Counselling & Psychology Course Catalog
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Comprehensive diploma and certificate programs with video lectures, downloadable Google Drive materials, and manual payment slip registration.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses or keywords..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((crs) => (
          <div
            key={crs.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48">
                <img src={crs.image} alt={crs.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase px-2.5 py-1 rounded-md shadow-xs">
                  {crs.level}
                </span>
                <span className="absolute top-3 right-3 bg-teal-900/90 text-white font-bold text-[10px] px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {crs.duration}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">{crs.category}</span>
                <h3 className="text-xl font-bold text-slate-900 leading-snug">{crs.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{crs.shortDesc}</p>

                <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>Lecturer: <strong className="text-slate-800">{crs.lecturerName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>Schedule: <strong className="text-slate-800">{crs.schedule}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100/80 mt-4 space-y-3">
              <div className="flex items-center justify-between bg-teal-50 p-3 rounded-2xl border border-teal-100">
                <span className="text-xs text-teal-800 font-medium">Total Tuition Fee</span>
                <span className="text-lg font-black text-teal-950">
                  {crs.currency || 'LKR'} {(crs.fee ?? (crs as any).price ?? 0).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectCourse(crs.id)}
                  className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={onOpenRegister}
                  className="py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Register & Pay
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
