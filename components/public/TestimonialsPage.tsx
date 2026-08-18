'use client';

import React, { useState } from 'react';
import { Star, Quote, MessageCircle, GraduationCap, Heart, Users } from 'lucide-react';
import { Testimonial } from '@/src/types';

interface TestimonialsPageProps {
  testimonials: Testimonial[];
}

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  ALL:      { label: 'All Reviews',           color: 'bg-teal-800 text-white border-teal-800' },
  STUDENT:  { label: 'LMS Students',          color: 'bg-purple-700 text-white border-purple-700' },
  CLIENT:   { label: 'Counselling Clients',   color: 'bg-rose-600 text-white border-rose-600' },
  WORKSHOP: { label: 'Workshop Attendees',    color: 'bg-amber-600 text-white border-amber-600' },
  GENERAL:  { label: 'General',               color: 'bg-slate-700 text-white border-slate-700' },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-4 h-4 ${n <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
        />
      ))}
    </div>
  );
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ testimonials }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', ...Array.from(new Set(testimonials.map((t) => t.category || 'GENERAL')))];

  const filtered =
    activeCategory === 'ALL'
      ? testimonials
      : testimonials.filter((t) => (t.category || 'GENERAL') === activeCategory);

  const featured = testimonials.find((t) => t.featured);
  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
      : '5.0';

  const avatarFallback = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d9488&color=fff`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-teal-700/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 bg-teal-800/60 border border-teal-600/60 text-amber-300 text-xs font-bold uppercase px-4 py-1.5 rounded-full tracking-wider">
            <MessageCircle className="w-3.5 h-3.5" /> Real Stories. Real Transformations.
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
            What Our <span className="text-amber-300">Community</span> Says
          </h1>
          <p className="text-teal-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Discover heartfelt stories from our students, counselling clients, and workshop attendees
            who have experienced meaningful change through Helping Hearts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
            {[
              { val: `${testimonials.length}+`, label: 'Verified Reviews' },
              { val: `${avgRating} ?`, label: 'Average Rating' },
              { val: '500+', label: 'Lives Touched' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-amber-300">{s.val}</p>
                <p className="text-xs text-teal-300 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Featured Quote */}
        {featured && (
          <div className="bg-gradient-to-r from-teal-900 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <Quote className="absolute top-4 right-6 w-16 h-16 text-teal-600/40" />
            <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
              <img
                src={featured.photo || avatarFallback(featured.name)}
                alt={featured.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shrink-0 shadow-lg"
                onError={(e) => { (e.target as HTMLImageElement).src = avatarFallback(featured.name); }}
              />
              <div className="space-y-3 flex-1">
                <StarRating rating={featured.rating} />
                <blockquote className="text-base sm:text-lg font-medium text-teal-100 leading-relaxed italic">
                  &ldquo;{featured.content}&rdquo;
                </blockquote>
                <div>
                  <p className="font-extrabold text-white text-sm">{featured.name}</p>
                  <p className="text-teal-300 text-xs">{featured.role}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat] || CATEGORY_META['GENERAL'];
            const count = cat === 'ALL' ? testimonials.length : testimonials.filter((t) => (t.category || 'GENERAL') === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isActive ? meta.color + ' shadow-sm scale-105' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {meta.label}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Testimonials Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => {
              const catMeta = CATEGORY_META[t.category || 'GENERAL'] || CATEGORY_META['GENERAL'];
              return (
                <div
                  key={t.id}
                  className={`bg-white rounded-3xl border shadow-xs hover:shadow-md transition-all p-6 space-y-4 flex flex-col ${
                    t.featured ? 'border-amber-300 ring-2 ring-amber-200 ring-offset-1' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={t.photo || avatarFallback(t.name)}
                      alt={t.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).src = avatarFallback(t.name); }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-extrabold text-slate-900 text-sm truncate">{t.name}</p>
                        {t.featured && (
                          <span className="text-[9px] font-black bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full shrink-0 uppercase tracking-wide">
                            ? Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-tight mt-0.5 line-clamp-2">{t.role}</p>
                      <div className="mt-1.5"><StarRating rating={t.rating} /></div>
                    </div>
                  </div>

                  <div className="relative flex-1">
                    <Quote className="absolute -top-1 -left-1 w-5 h-5 text-teal-100" />
                    <p className="text-slate-700 text-sm leading-relaxed pl-4 italic line-clamp-5">
                      &ldquo;{t.content}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${catMeta.color}`}>
                      {catMeta.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(t.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 space-y-3">
            <MessageCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-slate-500 font-semibold">No testimonials in this category yet.</p>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-50 to-teal-50 border border-amber-200 rounded-3xl p-8 text-center space-y-4">
          <h2 className="text-xl font-black text-slate-900">Ready to Begin Your Journey?</h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Join hundreds of students and clients who have transformed their lives with
            Helping Hearts Counselling &amp; Wellness Centre.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/services" className="px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm rounded-xl shadow-sm transition-all">
              Book a Counselling Session
            </a>
            <a href="/courses" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-sm transition-all">
              Explore LMS Courses
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
