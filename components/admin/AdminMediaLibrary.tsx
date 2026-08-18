'use client';
import React, { useState } from 'react';
import { GalleryMedia, MediaItem } from '@/src/types';
import { Image, Video, Plus, Trash2, ExternalLink, Link as LinkIcon, CheckCircle2, Edit3, Upload, Search, Film, X, Star, ArrowUp, ArrowDown, Layers, Sparkles, Play, Folder, FolderPlus, FolderOpen, FolderTree, ChevronRight, Grid, List, MoveRight, HardDrive, Filter, Tag } from 'lucide-react';

interface AdminMediaLibraryProps {
  gallery: GalleryMedia[];
  onSaveMedia?: (item: GalleryMedia) => void;
  onAddMedia?: (item: GalleryMedia) => void;
  onDeleteMedia?: (id: string) => void;
  onSuccessToast?: (msg: string) => void;
}

export const AdminMediaLibrary: React.FC<AdminMediaLibraryProps> = ({
  gallery,
  onSaveMedia,
  onAddMedia,
  onDeleteMedia,
  onSuccessToast
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Events');
  const [folder, setFolder] = useState('Workshops/Free Sessions');
  const [isCustomFolder, setIsCustomFolder] = useState(false);
  const [customFolderInput, setCustomFolderInput] = useState('');
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // List of media items (photos & videos) under this Asset Title
  const [items, setItems] = useState<MediaItem[]>([]);

  // Sub-form for adding items to the current asset
  const [addMode, setAddMode] = useState<'PHOTO' | 'VIDEO'>('PHOTO');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCaption, setVideoCaption] = useState('');

  // Folder Explorer State
  const [activeFolderFilter, setActiveFolderFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'FOLDERS' | 'GRID' | 'LIST'>('FOLDERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PHOTOS_ONLY' | 'VIDEOS_ONLY' | 'MIXED'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<GalleryMedia | null>(null);

  // Folder creation modal state
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [movingAssetId, setMovingAssetId] = useState<string | null>(null);

  const standardFolders = [
    'Workshops/Free Sessions',
    'Training/Graduation 2025',
    'Workshops/Mindfulness in Park',
    'Events/CBT Clinical Seminar',
    'Media & TV/Awareness Broadcasts',
    'Lecturers/Faculty Portraits',
    'Clinical/Therapy Sessions',
    'Branding/Logos & Banners'
  ];

  // Dynamic unique folders list
  const dynamicFolders = Array.from(
    new Set(gallery.map((g) => g.folder || `${g.category || 'General'}`).filter(Boolean))
  ) as string[];
  const allFolders = Array.from(new Set([...standardFolders, ...dynamicFolders]));

  const getYouTubeVideoId = (urlStr: string): string | null => {
    if (!urlStr) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlStr.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Multiple Image File Upload Handler
  const handleMultipleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: File[] = Array.from(files);
    let loadedCount = 0;
    const newItems: MediaItem[] = [];

    fileList.forEach((file: File, index: number) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          newItems.push({
            id: `item-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
            type: 'IMAGE',
            url: reader.result,
            thumbnailUrl: reader.result,
            title: file.name.replace(/\.[^/.]+$/, ''),
            caption: '',
            folder: isCustomFolder ? customFolderInput.trim() : folder
          });
        }
        loadedCount++;
        if (loadedCount === fileList.length) {
          setItems((prev) => [...prev, ...newItems]);
          onSuccessToast?.(`Added ${fileList.length} photo(s) to this asset.`);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  // Add Single Photo via URL
  const handleAddPhotoByUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl.trim()) return;

    const newItem: MediaItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'IMAGE',
      url: photoUrl.trim(),
      thumbnailUrl: photoUrl.trim(),
      title: photoCaption ? photoCaption.substring(0, 30) : 'Photo',
      caption: photoCaption.trim(),
      folder: isCustomFolder ? customFolderInput.trim() : folder
    };

    setItems((prev) => [...prev, newItem]);
    setPhotoUrl('');
    setPhotoCaption('');
    onSuccessToast?.('Photo added to asset list!');
  };

  // Add Single YouTube Video
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    const vId = getYouTubeVideoId(videoUrl.trim());
    const thumb = vId
      ? `https://img.youtube.com/vi/${vId}/hqdefault.jpg`
      : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop';

    const newItem: MediaItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'YOUTUBE_VIDEO',
      url: videoUrl.trim(),
      thumbnailUrl: thumb,
      title: videoTitle.trim() || 'Video Highlight',
      caption: videoCaption.trim(),
      folder: isCustomFolder ? customFolderInput.trim() : folder
    };

    setItems((prev) => [...prev, newItem]);
    setVideoUrl('');
    setVideoTitle('');
    setVideoCaption('');
    onSuccessToast?.('YouTube video added to asset list!');
  };

  const handleRemoveItem = (itemId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    setItems((prev) => {
      const updated = [...prev];
      const [chosen] = updated.splice(index, 1);
      updated.unshift(chosen);
      return updated;
    });
    onSuccessToast?.('Cover media item updated!');
  };

  const handleMoveItem = (index: number, direction: 'UP' | 'DOWN') => {
    setItems((prev) => {
      const updated = [...prev];
      const targetIndex = direction === 'UP' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const startEdit = (asset: GalleryMedia) => {
    setEditingId(asset.id);
    setTitle(asset.title);
    setCategory(asset.category);
    const assetFolder = asset.folder || `${asset.category || 'General'}`;
    setFolder(assetFolder);
    setIsCustomFolder(false);
    setCustomFolderInput('');
    setCaption(asset.caption || '');
    setDate(asset.date || new Date().toISOString().split('T')[0]);

    if (asset.items && asset.items.length > 0) {
      setItems(asset.items);
    } else {
      // Create a fallback item if old format
      setItems([
        {
          id: `item-${Date.now()}`,
          type: asset.type === 'YOUTUBE_VIDEO' ? 'YOUTUBE_VIDEO' : 'IMAGE',
          url: asset.url,
          thumbnailUrl: asset.thumbnailUrl || asset.url,
          title: asset.title,
          caption: asset.caption,
          folder: assetFolder
        }
      ]);
    }

    // Scroll smoothly to the form
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Events');
    setFolder('Workshops/Free Sessions');
    setIsCustomFolder(false);
    setCustomFolderInput('');
    setCaption('');
    setDate(new Date().toISOString().split('T')[0]);
    setItems([]);
    setPhotoUrl('');
    setPhotoCaption('');
    setVideoUrl('');
    setVideoTitle('');
    setVideoCaption('');
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter an Asset Title');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one photo or video under this Asset Title.');
      return;
    }

    const targetFolder = isCustomFolder && customFolderInput.trim()
      ? customFolderInput.trim()
      : folder || `${category || 'General'}`;

    const coverItem = items[0];
    const hasPhotos = items.some((it) => it.type === 'IMAGE');
    const hasVideos = items.some((it) => it.type === 'YOUTUBE_VIDEO');

    let assetType: 'IMAGE' | 'YOUTUBE_VIDEO' | 'ALBUM' = 'ALBUM';
    if (items.length === 1) {
      assetType = coverItem.type === 'YOUTUBE_VIDEO' ? 'YOUTUBE_VIDEO' : 'IMAGE';
    } else if (hasPhotos && hasVideos) {
      assetType = 'ALBUM';
    } else if (hasVideos && !hasPhotos) {
      assetType = 'YOUTUBE_VIDEO';
    } else {
      assetType = 'IMAGE';
    }

    const newAsset: GalleryMedia = {
      id: editingId || `gal-${Date.now()}`,
      title: title.trim(),
      type: assetType,
      url: coverItem.url,
      thumbnailUrl: coverItem.thumbnailUrl || coverItem.url,
      category,
      folder: targetFolder,
      caption: caption.trim(),
      date: date || new Date().toISOString().split('T')[0],
      items: items.map((it) => ({
        ...it,
        folder: it.folder || targetFolder
      }))
    };

    if (onSaveMedia) {
      onSaveMedia(newAsset);
    } else if (onAddMedia) {
      onAddMedia(newAsset);
    }

    onSuccessToast?.(
      editingId
        ? `Asset "${newAsset.title}" updated in folder "${targetFolder}" with ${items.length} items!`
        : `New asset "${newAsset.title}" saved to folder "${targetFolder}" with ${items.length} items!`
    );
    resetForm();
  };

  const handleQuickMoveFolder = (assetId: string, newTargetFolder: string) => {
    const targetAsset = gallery.find((g) => g.id === assetId);
    if (!targetAsset) return;

    const updatedAsset: GalleryMedia = {
      ...targetAsset,
      folder: newTargetFolder,
      items: targetAsset.items?.map((it) => ({ ...it, folder: newTargetFolder }))
    };

    if (onSaveMedia) {
      onSaveMedia(updatedAsset);
    }
    setMovingAssetId(null);
    onSuccessToast?.(`Moved "${targetAsset.title}" to folder "${newTargetFolder}"`);
  };

  const handleCreateNewFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const cleanName = newFolderName.trim().replace(/\/+/g, '/');
    setFolder(cleanName);
    setIsCustomFolder(false);
    setActiveFolderFilter(cleanName);
    setViewMode('GRID');
    setIsNewFolderModalOpen(false);
    setNewFolderName('');
    onSuccessToast?.(`New Folder "${cleanName}" created and ready for assets!`);
  };

  const copyLink = (linkUrl: string, id: string) => {
    navigator.clipboard.writeText(linkUrl);
    setCopiedId(id);
    onSuccessToast?.('Asset cover URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const photoCountInItems = items.filter((it) => it.type === 'IMAGE').length;
  const videoCountInItems = items.filter((it) => it.type === 'YOUTUBE_VIDEO').length;

  // Folder statistics & indexing
  const folderStats = allFolders.map((fName) => {
    const assetsInFolder = gallery.filter(
      (g) => (g.folder || `${g.category || 'General'}`) === fName
    );
    let totalPhotos = 0;
    let totalVideos = 0;

    assetsInFolder.forEach((a) => {
      const aItems = a.items || [{ type: a.type, url: a.url }];
      totalPhotos += aItems.filter((it) => it.type === 'IMAGE').length;
      totalVideos += aItems.filter((it) => it.type === 'YOUTUBE_VIDEO').length;
    });

    return {
      folderName: fName,
      assetCount: assetsInFolder.length,
      photoCount: totalPhotos,
      videoCount: totalVideos,
      coverUrl: assetsInFolder[0]?.thumbnailUrl || assetsInFolder[0]?.url || ''
    };
  });

  const totalPhotosAcrossAll = gallery.reduce((acc, a) => {
    const aItems = a.items || [{ type: a.type, url: a.url }];
    return acc + aItems.filter((it) => it.type === 'IMAGE').length;
  }, 0);

  const totalVideosAcrossAll = gallery.reduce((acc, a) => {
    const aItems = a.items || [{ type: a.type, url: a.url }];
    return acc + aItems.filter((it) => it.type === 'YOUTUBE_VIDEO').length;
  }, 0);

  const filteredGallery = gallery.filter((asset) => {
    const assetFolder = asset.folder || `${asset.category || 'General'}`;
    const matchesFolder = activeFolderFilter === 'ALL' || assetFolder === activeFolderFilter;
    if (!matchesFolder) return false;

    const assetItems = asset.items || [{ type: asset.type, url: asset.url }];
    const hasPhotos = assetItems.some((it) => it.type === 'IMAGE');
    const hasVideos = assetItems.some((it) => it.type === 'YOUTUBE_VIDEO');

    const matchesSearch =
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assetFolder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.caption && asset.caption.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'PHOTOS_ONLY') return hasPhotos && !hasVideos;
    if (activeFilter === 'VIDEOS_ONLY') return hasVideos && !hasPhotos;
    if (activeFilter === 'MIXED') return hasPhotos && hasVideos;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Storage Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Media Library & Folder Structure</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-xs uppercase tracking-wide">
              CMS Assets
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Store, organize, and manage multiple high-resolution photos and YouTube video streams inside categorized folder directories.
          </p>
        </div>

        {/* Global Stats Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs">
            <FolderTree className="w-4 h-4 text-teal-700" />
            <span className="font-bold text-slate-800">{allFolders.length} Folders</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs">
            <Layers className="w-4 h-4 text-indigo-700" />
            <span className="font-bold text-slate-800">{gallery.length} Assets</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs">
            <Image className="w-4 h-4 text-emerald-700" />
            <span className="font-bold text-slate-800">{totalPhotosAcrossAll} Photos</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs">
            <Video className="w-4 h-4 text-rose-700" />
            <span className="font-bold text-slate-800">{totalVideosAcrossAll} Videos</span>
          </div>
          <button
            type="button"
            onClick={() => setIsNewFolderModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
          >
            <FolderPlus className="w-4 h-4 text-amber-300" />
            <span>New Folder</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Comprehensive Asset Builder & Multi-Media Form with Folder Assignment */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 sticky top-20">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {editingId ? <Edit3 className="w-5 h-5 text-teal-800" /> : <Plus className="w-5 h-5 text-amber-500" />}
              {editingId ? 'Edit Asset & Attached Photos/Videos' : 'Create Asset with Photos & Videos'}
            </h2>
            {editingId && (
              <div className="flex items-center gap-2">
                {onDeleteMedia && (
                  <button
                    type="button"
                    onClick={() => {
                      const curr = gallery.find((g) => g.id === editingId);
                      if (curr) setAssetToDelete(curr);
                    }}
                    className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-bold bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1.5 rounded-xl cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bold bg-slate-100 px-2.5 py-1.5 rounded-xl cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSaveAsset} className="space-y-4 text-xs">
            {/* 1. Main Asset Title */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Asset Title * <span className="text-slate-400 font-normal normal-case">(Album / Session Name)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Free Session #9: Mindfulness & Stress Mastery"
                className="w-full p-3 rounded-xl border border-slate-300 font-bold text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
                required
              />
            </div>

            {/* 2. Folder Directory Structure Selector */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <Folder className="w-4 h-4 text-teal-700" />
                  <span>Target Storage Folder *</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomFolder(!isCustomFolder)}
                  className="text-[11px] font-bold text-teal-800 hover:text-teal-950 underline cursor-pointer"
                >
                  {isCustomFolder ? 'Select from list' : '+ Custom Folder'}
                </button>
              </div>

              {isCustomFolder ? (
                <div>
                  <input
                    type="text"
                    value={customFolderInput}
                    onChange={(e) => setCustomFolderInput(e.target.value)}
                    placeholder="e.g. Workshops/Free Sessions or Events/2026"
                    className="w-full p-2.5 rounded-xl border border-teal-400 bg-white font-semibold text-slate-900"
                    required={isCustomFolder}
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Use forward slash <code className="text-teal-800 font-mono">/</code> to create nested subfolders.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <select
                    value={folder}
                    onChange={(e) => setFolder(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800"
                  >
                    {allFolders.map((f) => (
                      <option key={f} value={f}>
                        📁 {f}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsNewFolderModalOpen(true)}
                    className="p-2.5 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-900 shrink-0 cursor-pointer"
                    title="Add new folder"
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* 3. Category and Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800"
                >
                  <option value="Workshops">Workshops</option>
                  <option value="Events">Events</option>
                  <option value="Training">Training</option>
                  <option value="TV Programmes">TV Programmes</option>
                  <option value="Gallery">Gallery</option>
                  <option value="Clinical">Clinical</option>
                  <option value="Ceremonies">Ceremonies</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Event Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800"
                />
              </div>
            </div>

            {/* 4. Description / Caption */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Album Description / Caption</label>
              <textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Brief summary or context about this collection..."
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800"
              />
            </div>

            {/* 5. ATTACHED MEDIA SUB-BUILDER */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-200 pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-800" />
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                    Attached Photos & Videos ({items.length})
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-900">
                  <span className="bg-teal-200/80 px-2 py-0.5 rounded-md">📸 {photoCountInItems} Photos</span>
                  <span className="bg-rose-200/80 text-rose-900 px-2 py-0.5 rounded-md">🎥 {videoCountInItems} Videos</span>
                </div>
              </div>

              {/* Mode Toggle: Add Photos vs Add Videos */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-teal-100/70 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAddMode('PHOTO')}
                  className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    addMode === 'PHOTO'
                      ? 'bg-teal-800 text-white shadow-xs'
                      : 'text-teal-900 hover:bg-teal-200/50'
                  }`}
                >
                  <Image className="w-3.5 h-3.5" /> Add Photos
                </button>
                <button
                  type="button"
                  onClick={() => setAddMode('VIDEO')}
                  className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    addMode === 'VIDEO'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'text-teal-900 hover:bg-teal-200/50'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" /> Add YouTube Videos
                </button>
              </div>

              {/* PHOTO ADDER SUB-PANEL */}
              {addMode === 'PHOTO' && (
                <div className="space-y-3 bg-white p-3.5 rounded-xl border border-teal-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">Upload Multiple Photos or Paste Image URL</span>
                  </div>

                  {/* Multiple Local Files Picker */}
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-teal-300 hover:border-teal-500 rounded-xl p-4 bg-teal-50/40 hover:bg-teal-50 cursor-pointer transition-colors text-center">
                    <Upload className="w-6 h-6 text-teal-700 mb-1" />
                    <span className="font-bold text-teal-950 text-xs">Choose Multiple Photo Files</span>
                    <span className="text-[10px] text-teal-800">PNG, JPG, JPEG, WEBP files supported</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultipleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Single Photo URL fallback */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Or Add Photo from Online URL</span>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 p-2 rounded-lg border border-slate-300 text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddPhotoByUrl}
                        disabled={!photoUrl.trim()}
                        className="px-3 py-2 bg-teal-800 hover:bg-teal-900 disabled:opacity-40 text-white font-bold rounded-lg cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    <input
                      type="text"
                      value={photoCaption}
                      onChange={(e) => setPhotoCaption(e.target.value)}
                      placeholder="Optional caption for this photo..."
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* VIDEO ADDER SUB-PANEL */}
              {addMode === 'VIDEO' && (
                <div className="space-y-3 bg-white p-3.5 rounded-xl border border-rose-200 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                    <Video className="w-4 h-4" />
                    <span>Add YouTube Video Stream / Highlight</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">YouTube URL *</label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... or youtu.be/..."
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs focus:border-rose-600"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Video Title</label>
                      <input
                        type="text"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="e.g. Free Session Live Broadcast"
                        className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Caption / Notes</label>
                      <input
                        type="text"
                        value={videoCaption}
                        onChange={(e) => setVideoCaption(e.target.value)}
                        placeholder="e.g. Keynote speech and Q&A session"
                        className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVideo}
                    disabled={!videoUrl.trim()}
                    className="w-full py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-40 text-white font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Video to Asset List
                  </button>
                </div>
              )}

              {/* LIST OF ATTACHED MEDIA ITEMS WITH REORDER & COVER SELECTION */}
              <div className="space-y-2 pt-1">
                <span className="font-bold text-slate-800 text-xs block">
                  Media Items in this Asset ({items.length})
                </span>

                {items.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-teal-200 rounded-xl bg-white/70 text-slate-400 space-y-1">
                    <Layers className="w-6 h-6 mx-auto text-teal-400" />
                    <p className="font-bold text-xs text-slate-600">No media items attached yet</p>
                    <p className="text-[10px]">Upload multiple photos or add YouTube video links above.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {items.map((it, idx) => (
                      <div
                        key={it.id || idx}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                          idx === 0
                            ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-teal-200'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                          <img
                            src={it.thumbnailUrl || it.url}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                          {it.type === 'YOUTUBE_VIDEO' && (
                            <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play className="w-3.5 h-3.5 text-white fill-white" />
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                it.type === 'YOUTUBE_VIDEO'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-teal-100 text-teal-800'
                              }`}
                            >
                              {it.type === 'YOUTUBE_VIDEO' ? 'Video' : 'Photo'}
                            </span>
                            {idx === 0 && (
                              <span className="text-[9px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-slate-950" /> Cover
                              </span>
                            )}
                          </div>
                          <p className="font-bold text-slate-900 text-xs truncate mt-0.5">
                            {it.title || (it.type === 'YOUTUBE_VIDEO' ? 'YouTube Stream' : `Photo #${idx + 1}`)}
                          </p>
                          {it.caption && (
                            <p className="text-[10px] text-slate-500 truncate">{it.caption}</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetCover(idx)}
                              className="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] transition-colors cursor-pointer"
                              title="Make this the Cover image"
                            >
                              Set Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleMoveItem(idx, 'UP')}
                            disabled={idx === 0}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveItem(idx, 'DOWN')}
                            disabled={idx === items.length - 1}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(it.id)}
                            className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
                            title="Remove from asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Master Asset */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={items.length === 0}
                className="w-full py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 disabled:bg-slate-300 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:cursor-not-allowed"
              >
                {editingId ? <Edit3 className="w-4 h-4 text-amber-300" /> : <Plus className="w-4 h-4 text-amber-300" />}
                <span>
                  {editingId
                    ? `Save Updates to "${title || 'Asset'}" (${items.length} items)`
                    : `Publish Asset to Folder (${items.length} Photos/Videos)`}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: Stored Media Assets Explorer with Folder Hierarchy & Directory Views */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          {/* Explorer Header & View Switches */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-teal-800" />
                <span>Media Explorer</span>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                  {filteredGallery.length} Items
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Browse through folders, inspect multi-item albums, or organize media with 1-click moves.
              </p>
            </div>

            {/* View Mode & Search */}
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewMode('FOLDERS')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    viewMode === 'FOLDERS' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Folder Hierarchy View"
                >
                  <FolderTree className="w-3.5 h-3.5" /> Folders
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('GRID')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    viewMode === 'GRID' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Asset Grid View"
                >
                  <Grid className="w-3.5 h-3.5" /> Grid
                </button>
              </div>

              {/* Search */}
              <div className="relative min-w-[150px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Breadcrumb Navigation Bar */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setActiveFolderFilter('ALL');
                  setViewMode('FOLDERS');
                }}
                className={`font-bold hover:text-teal-800 flex items-center gap-1 cursor-pointer ${
                  activeFolderFilter === 'ALL' ? 'text-teal-900 underline' : 'text-slate-500'
                }`}
              >
                <HardDrive className="w-3.5 h-3.5" /> Media Root
              </button>
              {activeFolderFilter !== 'ALL' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-teal-900 bg-teal-100/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Folder className="w-3 h-3 text-teal-700" />
                    {activeFolderFilter}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveFolderFilter('ALL')}
                    className="text-slate-400 hover:text-slate-600 ml-1 cursor-pointer"
                    title="Clear folder filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>

            {activeFolderFilter !== 'ALL' && (
              <button
                type="button"
                onClick={() => {
                  setActiveFolderFilter('ALL');
                  setViewMode('FOLDERS');
                }}
                className="text-[11px] font-bold text-teal-800 hover:text-teal-950 cursor-pointer"
              >
                ← All Folders
              </button>
            )}
          </div>

          {/* FOLDER HIERARCHY DIRECTORY TILES (When in FOLDERS view and Root) */}
          {viewMode === 'FOLDERS' && activeFolderFilter === 'ALL' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <FolderTree className="w-4 h-4 text-teal-700" />
                  <span>Storage Folder Directories ({folderStats.length})</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsNewFolderModalOpen(true)}
                  className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Folder
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {folderStats.map((stat) => (
                  <div
                    key={stat.folderName}
                    onClick={() => {
                      setActiveFolderFilter(stat.folderName);
                      setViewMode('GRID');
                    }}
                    className="group bg-slate-50 hover:bg-teal-50/60 border border-slate-200 hover:border-teal-400 rounded-2xl p-4 transition-all cursor-pointer shadow-2xs flex items-start gap-3.5"
                  >
                    <div className="w-12 h-12 rounded-xl bg-teal-100 group-hover:bg-teal-700 text-teal-900 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
                      <Folder className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 group-hover:text-teal-900 text-sm truncate">
                        {stat.folderName}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {stat.assetCount} Asset{stat.assetCount !== 1 ? 's' : ''} • {stat.photoCount} Photos • {stat.videoCount} Videos
                      </p>

                      <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-teal-800 group-hover:translate-x-1 transition-transform">
                        <span>Open Folder</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter Chips (Media Type) */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                activeFilter === 'ALL' ? 'bg-teal-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Assets ({filteredGallery.length})
            </button>
            <button
              onClick={() => setActiveFilter('PHOTOS_ONLY')}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                activeFilter === 'PHOTOS_ONLY' ? 'bg-teal-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Photos Only
            </button>
            <button
              onClick={() => setActiveFilter('VIDEOS_ONLY')}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                activeFilter === 'VIDEOS_ONLY' ? 'bg-rose-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Videos Only
            </button>
            <button
              onClick={() => setActiveFilter('MIXED')}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                activeFilter === 'MIXED' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Mixed Albums (Photo + Video)
            </button>
          </div>

          {/* Asset Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredGallery.map((asset) => {
              const assetItems = asset.items || [
                { id: '1', type: asset.type === 'YOUTUBE_VIDEO' ? 'YOUTUBE_VIDEO' : 'IMAGE', url: asset.url }
              ];
              const photosCount = assetItems.filter((x) => x.type === 'IMAGE').length;
              const videosCount = assetItems.filter((x) => x.type === 'YOUTUBE_VIDEO').length;
              const currentFolder = asset.folder || `${asset.category || 'General'}`;

              return (
                <div
                  key={asset.id}
                  className="group relative bg-slate-50 border border-slate-200 hover:border-teal-300 hover:bg-white rounded-2xl p-3.5 space-y-3 text-xs transition-all shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Cover Thumbnail with Badges */}
                    <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                      <img
                        src={asset.thumbnailUrl || asset.url}
                        alt={asset.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Top Badges: Category & Folder */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1">
                        <span className="text-[10px] bg-teal-950/80 backdrop-blur-xs text-amber-300 px-2 py-0.5 rounded-full font-bold truncate max-w-[130px] flex items-center gap-1">
                          <Folder className="w-2.5 h-2.5" />
                          {currentFolder}
                        </span>
                        <span className="text-[10px] bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-full font-bold">
                          {asset.category}
                        </span>
                      </div>

                      {/* Bottom Multi-item Counter Badge */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-xs text-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-xs">
                          {photosCount > 0 && <span>📸 {photosCount}</span>}
                          {photosCount > 0 && videosCount > 0 && <span>•</span>}
                          {videosCount > 0 && <span className="text-rose-300">🎥 {videosCount}</span>}
                          <span className="text-slate-400 ml-0.5">({assetItems.length} total)</span>
                        </div>
                      </div>
                    </div>

                    {/* Mini Thumbnails Strip if multiple items */}
                    {assetItems.length > 1 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {assetItems.slice(0, 4).map((m, mIdx) => (
                          <div
                            key={m.id || mIdx}
                            className="relative w-10 h-9 rounded-md overflow-hidden bg-slate-900 shrink-0 border border-slate-200"
                          >
                            <img
                              src={m.thumbnailUrl || m.url}
                              alt="thumb"
                              className="w-full h-full object-cover"
                            />
                            {m.type === 'YOUTUBE_VIDEO' && (
                              <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Play className="w-2.5 h-2.5 text-white fill-white" />
                              </span>
                            )}
                          </div>
                        ))}
                        {assetItems.length > 4 && (
                          <div className="w-10 h-9 rounded-md bg-teal-100 text-teal-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                            +{assetItems.length - 4}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Title & Caption */}
                    <div>
                      <h3 className="font-bold text-slate-900 leading-snug line-clamp-2 text-sm">{asset.title}</h3>
                      {asset.caption && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{asset.caption}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Move to Folder Toolbar */}
                  <div className="pt-2.5 border-t border-slate-200/80 space-y-2">
                    {/* Quick Move to Folder Selector */}
                    <div className="flex items-center justify-between gap-1 text-[11px] bg-slate-100/90 p-1.5 rounded-xl">
                      <span className="text-slate-500 font-bold flex items-center gap-1 shrink-0">
                        <MoveRight className="w-3 h-3 text-teal-700" /> Folder:
                      </span>
                      <select
                        value={currentFolder}
                        onChange={(e) => handleQuickMoveFolder(asset.id, e.target.value)}
                        className="bg-white border border-slate-200 text-slate-800 text-[10px] font-semibold rounded-lg px-2 py-0.5 max-w-[140px] truncate"
                      >
                        {allFolders.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between gap-1 text-[11px]">
                      <button
                        onClick={() => copyLink(asset.url, asset.id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                        title="Copy Cover URL"
                      >
                        {copiedId === asset.id ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <LinkIcon className="w-3.5 h-3.5" />
                        )}
                        {copiedId === asset.id ? 'Copied' : 'Copy'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => startEdit(asset)}
                          className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold transition-colors cursor-pointer flex items-center gap-1"
                          title="Edit Album & Photos/Videos"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>

                        {onDeleteMedia && (
                          <button
                            onClick={() => setAssetToDelete(asset)}
                            className="px-2 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer flex items-center gap-1"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredGallery.length === 0 && (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Film className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium">No media assets found matching your folder or search filter.</p>
              {activeFolderFilter !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setActiveFolderFilter('ALL')}
                  className="px-3 py-1.5 rounded-xl bg-teal-800 text-white font-bold text-xs"
                >
                  View All Folders
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CREATE NEW FOLDER MODAL */}
      {isNewFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-800">
                <FolderPlus className="w-6 h-6 text-teal-700" />
                <h3 className="font-bold text-slate-900 text-base">Create Storage Folder</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewFolderModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewFolder} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Folder Name / Path *
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Workshops/Free Sessions 2026 or Events/Convocation"
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:border-teal-700"
                  required
                  autoFocus
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Use forward slash <code className="text-teal-800 font-mono">/</code> for parent/child folder hierarchy (e.g. <span className="font-mono text-teal-700">Events/2026/Awards</span>).
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewFolderModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4 text-amber-300" /> Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE ASSET IN-APP CONFIRMATION MODAL */}
      {assetToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Delete Media Asset?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-800 line-clamp-1">{assetToDelete.title}</p>
              <p className="text-slate-500 text-[11px]">
                Folder: <span className="font-semibold text-teal-800">{assetToDelete.folder || assetToDelete.category}</span> •{' '}
                {assetToDelete.items?.length || 1} attached media items
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently remove this asset and all its attached photos and videos from your media library and public gallery?
            </p>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setAssetToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (assetToDelete) {
                    onDeleteMedia?.(assetToDelete.id);
                    if (editingId === assetToDelete.id) {
                      resetForm();
                    }
                    onSuccessToast?.(`Asset "${assetToDelete.title}" deleted successfully.`);
                    setAssetToDelete(null);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
