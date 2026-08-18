'use client';
import React, { useState } from 'react';
import { BlogArticle } from '@/src/types';
import { Search, Calendar, User, Tag, ArrowRight, X, Video, Film } from 'lucide-react';
import { getYouTubeEmbedUrl } from '@/src/utils/mediaUtils';

interface BlogPageProps {
  blogs: BlogArticle[];
}

export const BlogPage: React.FC<BlogPageProps> = ({ blogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlog, setSelectedBlog] = useState<BlogArticle | null>(null);

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-widest text-teal-800 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
          Psychology & Wellness Articles
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Mental Health Insights & Blog
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Expert articles on anxiety management, marital therapy, self-care practices, and child development written by our faculty.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search articles by keyword or topic..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-teal-600 focus:outline-hidden shadow-xs"
        />
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBlogs.map((b) => {
          const videoEmbed = getYouTubeEmbedUrl(b.videoUrl);
          return (
            <article
              key={b.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 bg-slate-900">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 bg-teal-900/90 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {b.category}
                  </span>
                  {videoEmbed && (
                    <span className="absolute bottom-3 left-3 bg-rose-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                      <Video className="w-3 h-3" /> Video Article
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-teal-700" /> {b.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-700" /> {b.publishedAt}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-teal-800 transition-colors">
                    {b.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{b.summary}</p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100/80 mt-2">
                <button
                  onClick={() => setSelectedBlog(b)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  Read Article {videoEmbed ? '& Watch Video' : ''} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Blog Article Reader Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100 my-8">
            <div className="relative h-64 bg-slate-900">
              <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                <span className="bg-teal-100 text-teal-900 px-2.5 py-0.5 rounded-full uppercase text-[10px]">
                  {selectedBlog.category}
                </span>
                <span>By {selectedBlog.author}</span>
                <span>•</span>
                <span>Published {selectedBlog.publishedAt}</span>
              </div>

              <h1 className="text-2xl font-bold text-slate-900">{selectedBlog.title}</h1>

              {/* Embedded Video Player inside Modal if present */}
              {getYouTubeEmbedUrl(selectedBlog.videoUrl) && (
                <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                    <Video className="w-4 h-4 text-rose-500" /> Featured Article Video
                  </div>
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                    <iframe
                      src={getYouTubeEmbedUrl(selectedBlog.videoUrl)!}
                      title="Blog Video Player"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-line border-t border-slate-100 pt-4">
                {selectedBlog.content}
              </div>

              {selectedBlog.tags && (
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
                  {selectedBlog.tags.map((t, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2.5 py-1 rounded-lg">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
