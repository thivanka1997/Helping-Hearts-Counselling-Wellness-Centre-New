'use client';
import React, { useState, useEffect } from 'react';
import { GalleryMedia, MediaItem } from '@/src/types';
import { Image, Play, X, ChevronLeft, ChevronRight, Layers, Film, Calendar, Tag, Maximize2, Folder, FolderOpen, FolderTree } from 'lucide-react';

interface GalleryPageProps {
  gallery: GalleryMedia[];
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ gallery }) => {
  const [filterMode, setFilterMode] = useState<'CATEGORY' | 'FOLDER'>('CATEGORY');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeFolder, setActiveFolder] = useState<string>('All');
  const [selectedAsset, setSelectedAsset] = useState<GalleryMedia | null>(null);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [lightboxFilter, setLightboxFilter] = useState<'ALL' | 'IMAGE' | 'YOUTUBE_VIDEO'>('ALL');

  const baseCategories = ['All', 'Events', 'Workshops', 'Training', 'TV Programmes', 'Clinical', 'Ceremonies', 'Gallery'];
  const extraCategories = Array.from(new Set(gallery.map((g) => g.category).filter(Boolean)));
  const categories = ['All', ...Array.from(new Set([...baseCategories.filter(c => c !== 'All'), ...extraCategories]))];

  // Derive folder list from gallery assets
  const folders = ['All', ...Array.from(new Set(gallery.map((g) => g.folder || `${g.category || 'General'}`).filter(Boolean)))];

  const filtered = gallery.filter((item) => {
    if (filterMode === 'CATEGORY') {
      if (activeCategory !== 'All' && item.category !== activeCategory) return false;
    } else {
      const itemFolder = item.folder || `${item.category || 'General'}`;
      if (activeFolder !== 'All' && itemFolder !== activeFolder) return false;
    }
    return true;
  });

  // Helper to extract items array for any asset
  const getAssetItems = (asset: GalleryMedia): MediaItem[] => {
    if (asset.items && asset.items.length > 0) {
      return asset.items;
    }
    return [
      {
        id: asset.id,
        type: asset.type === 'YOUTUBE_VIDEO' ? 'YOUTUBE_VIDEO' : 'IMAGE',
        url: asset.url,
        thumbnailUrl: asset.thumbnailUrl || asset.url,
        title: asset.title,
        caption: asset.caption,
        folder: asset.folder
      }
    ];
  };

  const openAssetLightbox = (asset: GalleryMedia, startIndex = 0) => {
    setSelectedAsset(asset);
    setActiveItemIndex(startIndex);
    setLightboxFilter('ALL');
  };

  const closeLightbox = () => {
    setSelectedAsset(null);
    setActiveItemIndex(0);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedAsset) return;
      const allItems = getAssetItems(selectedAsset);
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        setActiveItemIndex((prev) => (prev + 1) % allItems.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveItemIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAsset]);

  const currentItems = selectedAsset ? getAssetItems(selectedAsset) : [];
  const activeMediaItem = currentItems[activeItemIndex] || currentItems[0];

  const getYouTubeEmbedUrl = (urlStr?: string): string => {
    if (!urlStr) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlStr.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : urlStr;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-widest text-teal-800 uppercase bg-teal-50 px-3.5 py-1 rounded-full border border-teal-100 shadow-2xs">
          Media Gallery & Visual Archive
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Event Albums, Photos & Video Highlights
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Explore documentation from our diploma graduation ceremonies, experiential counselling workshops, free community wellness drives, and media broadcasts.
        </p>
      </div>

      {/* Filter Mode Switch: Category vs Folder Structure */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setFilterMode('CATEGORY')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'CATEGORY' ? 'bg-teal-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Filter by Category
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('FOLDER')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterMode === 'FOLDER' ? 'bg-teal-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" /> Filter by Folder
          </button>
        </div>

        {/* Category Filter Pills */}
        {filterMode === 'CATEGORY' && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Folder Filter Pills */}
        {filterMode === 'FOLDER' && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {folders.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFolder(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeFolder === f
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                <span>{f}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((asset) => {
          const itemsList = getAssetItems(asset);
          const photosCount = itemsList.filter((x) => x.type === 'IMAGE').length;
          const videosCount = itemsList.filter((x) => x.type === 'YOUTUBE_VIDEO').length;
          const currentFolder = asset.folder || `${asset.category || 'General'}`;

          return (
            <div
              key={asset.id}
              onClick={() => openAssetLightbox(asset, 0)}
              className="group relative bg-slate-900 rounded-3xl overflow-hidden shadow-xs cursor-pointer h-80 border border-slate-200 flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              {/* Cover Image */}
              <img
                src={asset.thumbnailUrl || asset.url}
                alt={asset.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-900/40 pointer-events-none" />

              {/* Top Row: Category + Folder + Multi-media pill */}
              <div className="relative z-10 p-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 max-w-[70%]">
                  <span className="bg-slate-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-300/20 truncate">
                    {asset.category}
                  </span>
                  <span className="bg-teal-950/80 backdrop-blur-xs text-teal-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-teal-500/30 truncate flex items-center gap-1">
                    <Folder className="w-2.5 h-2.5" />
                    {currentFolder}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs">
                  {photosCount > 0 && <span>📸 {photosCount}</span>}
                  {photosCount > 0 && videosCount > 0 && <span>•</span>}
                  {videosCount > 0 && <span className="text-rose-300">🎥 {videosCount}</span>}
                </div>
              </div>

              {/* Center Action Hover Hint */}
              <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-4 py-2 rounded-full bg-teal-800/90 text-white font-bold text-xs backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                  <Maximize2 className="w-3.5 h-3.5" /> View Album ({itemsList.length} items)
                </span>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 p-5 space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] text-slate-300 font-medium">
                  {asset.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-300" /> {asset.date}
                    </span>
                  )}
                  {itemsList.length > 1 && (
                    <span className="bg-teal-900/80 text-teal-200 px-2 py-0.2 rounded font-bold">
                      {itemsList.length} items inside
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white leading-snug group-hover:text-amber-200 transition-colors">
                  {asset.title}
                </h3>
                {asset.caption && (
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{asset.caption}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500 space-y-2">
          <Layers className="w-12 h-12 mx-auto text-slate-300" />
          <p className="text-sm font-semibold">No media items found matching this filter.</p>
        </div>
      )}

      {/* RICH MULTI-ITEM LIGHTBOX / ALBUM VIEWER */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="relative bg-slate-900 rounded-3xl max-w-5xl w-full p-4 sm:p-6 border border-slate-800 text-white space-y-4 my-auto shadow-2xl flex flex-col max-h-[95vh]">
            {/* Header: Title, Category, Counter & Close */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wide">
                    {selectedAsset.category}
                  </span>
                  {selectedAsset.folder && (
                    <span className="text-[11px] font-bold bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-500/30 flex items-center gap-1">
                      <Folder className="w-3 h-3" /> {selectedAsset.folder}
                    </span>
                  )}
                  {selectedAsset.date && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> {selectedAsset.date}
                    </span>
                  )}
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono">
                    {activeItemIndex + 1} / {currentItems.length}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {selectedAsset.title}
                </h2>
                {selectedAsset.caption && (
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedAsset.caption}</p>
                )}
              </div>

              <button
                type="button"
                onClick={closeLightbox}
                className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Stage Display (Image or YouTube Embed) */}
            <div className="relative flex-1 min-h-[280px] sm:min-h-[380px] max-h-[55vh] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
              {activeMediaItem?.type === 'YOUTUBE_VIDEO' ? (
                <iframe
                  src={getYouTubeEmbedUrl(activeMediaItem.url)}
                  title={activeMediaItem.title || 'YouTube Video'}
                  className="w-full h-full min-h-[360px] border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={activeMediaItem?.url}
                  alt={activeMediaItem?.title || selectedAsset.title}
                  className="max-h-full max-w-full object-contain"
                />
              )}

              {/* Prev / Next Arrows */}
              {currentItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveItemIndex((prev) => (prev - 1 + currentItems.length) % currentItems.length);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-xs transition-all cursor-pointer shadow-lg border border-slate-700"
                    title="Previous item"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveItemIndex((prev) => (prev + 1) % currentItems.length);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-xs transition-all cursor-pointer shadow-lg border border-slate-700"
                    title="Next item"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Active Item Caption / Subtitle */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2 text-xs">
              <div className="min-w-0">
                <p className="font-bold text-amber-300 truncate">
                  {activeMediaItem?.title || `Item #${activeItemIndex + 1}`}
                </p>
                {activeMediaItem?.caption && (
                  <p className="text-slate-300 text-[11px] mt-0.5 line-clamp-2">{activeMediaItem.caption}</p>
                )}
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-slate-800 text-slate-300 shrink-0">
                {activeMediaItem?.type === 'YOUTUBE_VIDEO' ? '🎥 YouTube Video' : '📸 Photo'}
              </span>
            </div>

            {/* Thumbnails Filmstrip / Carousel if multiple items */}
            {currentItems.length > 1 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Album Items ({currentItems.length})</span>
                  <span>Click thumbnail to switch view</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {currentItems.map((item, idx) => (
                    <button
                      key={item.id || idx}
                      type="button"
                      onClick={() => setActiveItemIndex(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeItemIndex === idx
                          ? 'border-amber-400 scale-105 shadow-md shadow-amber-400/20'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={item.thumbnailUrl || item.url}
                        alt="thumb"
                        className="w-full h-full object-cover"
                      />
                      {item.type === 'YOUTUBE_VIDEO' && (
                        <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
