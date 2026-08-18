'use client';
import React, { useState, useEffect } from 'react';
import { SiteSettings, EventWorkshop, BlogArticle, GalleryMedia, MediaItem, Testimonial, FAQItem, CounsellingService } from '@/src/types';
import {
  Edit3,
  Save,
  Plus,
  Trash2,
  Globe,
  FileText,
  Image,
  Calendar,
  X,
  Video,
  Upload,
  Film,
  ExternalLink,
  Layers,
  Play,
  Star,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  HelpCircle,
  HeartHandshake,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { getYouTubeEmbedUrl } from '@/src/utils/mediaUtils';

interface AdminCMSProps {
  settings: SiteSettings;
  testimonials?: Testimonial[];
  faqs?: FAQItem[];
  services?: CounsellingService[];
  events: EventWorkshop[];
  blogs: BlogArticle[];
  gallery: GalleryMedia[];
  onSaveSettings: (settings: SiteSettings) => void;
  onSaveTestimonial?: (t: Testimonial) => void;
  onDeleteTestimonial?: (id: string) => void;
  onSaveFAQ?: (f: FAQItem) => void;
  onDeleteFAQ?: (id: string) => void;
  onSaveService?: (s: CounsellingService) => void;
  onDeleteService?: (id: string) => void;
  onSaveEvent: (evt: EventWorkshop) => void;
  onDeleteEvent?: (id: string) => void;
  onSaveBlog: (blog: BlogArticle) => void;
  onDeleteBlog?: (id: string) => void;
  onSaveGallery: (item: GalleryMedia) => void;
  onDeleteGallery?: (id: string) => void;
  onSuccessToast?: (msg: string) => void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  settings,
  testimonials = [],
  faqs = [],
  services = [],
  events,
  blogs,
  gallery,
  onSaveSettings,
  onSaveTestimonial,
  onDeleteTestimonial,
  onSaveFAQ,
  onDeleteFAQ,
  onSaveService,
  onDeleteService,
  onSaveEvent,
  onDeleteEvent,
  onSaveBlog,
  onDeleteBlog,
  onSaveGallery,
  onDeleteGallery,
  onSuccessToast
}) => {
  const [activeTab, setActiveTab] = useState<'SETTINGS' | 'TESTIMONIALS' | 'FAQS' | 'SERVICES' | 'EVENTS' | 'BLOGS' | 'GALLERY'>('SETTINGS');
  const [siteForm, setSiteForm] = useState<SiteSettings>(settings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    if (settings) {
      setSiteForm(settings);
    }
  }, [settings]);
  // About Values editing helper
  const [valuesInput, setValuesInput] = useState<string>('');

  // Testimonial Form State & Modal
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const defaultTestimonialState: Partial<Testimonial> = {
    name: '',
    role: 'Student / Client',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    content: '',
    rating: 5,
    category: 'STUDENT',
    featured: true
  };
  const [testimonialForm, setTestimonialForm] = useState<Partial<Testimonial>>(defaultTestimonialState);

  // FAQ Form State & Modal
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [editingFAQId, setEditingFAQId] = useState<string | null>(null);
  const defaultFAQState: Partial<FAQItem> = {
    question: '',
    answer: '',
    category: 'General',
    order: faqs.length + 1
  };
  const [faqForm, setFaqForm] = useState<Partial<FAQItem>>(defaultFAQState);

  // Service Form State & Modal
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const defaultServiceState: Partial<CounsellingService> = {
    title: '',
    slug: '',
    shortDesc: '',
    fullDesc: '',
    image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=800&auto=format&fit=crop',
    benefits: ['Confidential 1-on-1 Guidance', 'Certified Psychotherapy Framework', 'Practical Coping Strategies'],
    sessionDuration: '60 Minutes',
    format: 'Both',
    category: 'Individual Therapy',
    featured: true
  };
  const [serviceForm, setServiceForm] = useState<Partial<CounsellingService>>(defaultServiceState);

  // Modals
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);

  // Event Form State
  const defaultEventState: Partial<EventWorkshop> = {
    title: '',
    type: 'EVENT',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00 AM',
    endTime: '12:00 PM',
    location: 'Main Auditorium, Helping Hearts, Colombo 07',
    isOnline: false,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
    videoUrl: '',
    registrationUrl: 'https://forms.gle/sampleEvent',
    status: 'PUBLISHED',
    featured: true
  };
  const [eventForm, setEventForm] = useState<Partial<EventWorkshop>>(defaultEventState);

  // Blog Form State
  const defaultBlogState: Partial<BlogArticle> = {
    title: '',
    summary: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1499209974431-9dac3cea0047?q=80&w=800&auto=format&fit=crop',
    videoUrl: '',
    author: 'Ms. Ramsina Farvin Jelaldeen',
    category: 'Clinical Psychology',
    tags: ['MentalHealth', 'Wellness', 'Psychotherapy'],
    publishedAt: new Date().toISOString().split('T')[0],
    status: 'PUBLISHED'
  };
  const [blogForm, setBlogForm] = useState<Partial<BlogArticle>>(defaultBlogState);

  // Gallery Form State
  const defaultGalleryState: Partial<GalleryMedia> = {
    title: '',
    type: 'ALBUM',
    url: '',
    thumbnailUrl: '',
    category: 'Events',
    caption: '',
    date: new Date().toISOString().split('T')[0]
  };
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryMedia>>(defaultGalleryState);
  const [modalGalleryItems, setModalGalleryItems] = useState<MediaItem[]>([]);
  const [modalMediaMode, setModalMediaMode] = useState<'PHOTO' | 'VIDEO'>('PHOTO');
  const [tempPhotoUrl, setTempPhotoUrl] = useState('');
  const [tempPhotoCaption, setTempPhotoCaption] = useState('');
  const [tempVideoUrl, setTempVideoUrl] = useState('');
  const [tempVideoTitle, setTempVideoTitle] = useState('');
  const [cmsItemToDelete, setCmsItemToDelete] = useState<{
    type: 'EVENT' | 'BLOG' | 'GALLERY' | 'TESTIMONIAL' | 'FAQ' | 'SERVICE';
    id: string;
    title: string;
    subtitle?: string;
  } | null>(null);

  const openNewGalleryModal = () => {
    setEditingGalleryId(null);
    setGalleryForm(defaultGalleryState);
    setModalGalleryItems([]);
    setTempPhotoUrl('');
    setTempPhotoCaption('');
    setTempVideoUrl('');
    setTempVideoTitle('');
    setIsGalleryModalOpen(true);
  };

  const openEditGalleryModal = (item: GalleryMedia) => {
    setEditingGalleryId(item.id);
    setGalleryForm({
      title: item.title,
      type: item.type,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl,
      category: item.category,
      caption: item.caption,
      date: item.date || new Date().toISOString().split('T')[0]
    });
    if (item.items && item.items.length > 0) {
      setModalGalleryItems(item.items);
    } else {
      setModalGalleryItems([
        {
          id: `item-${Date.now()}`,
          type: item.type === 'YOUTUBE_VIDEO' ? 'YOUTUBE_VIDEO' : 'IMAGE',
          url: item.url,
          thumbnailUrl: item.thumbnailUrl || item.url,
          title: item.title,
          caption: item.caption
        }
      ]);
    }
    setTempPhotoUrl('');
    setTempPhotoCaption('');
    setTempVideoUrl('');
    setTempVideoTitle('');
    setIsGalleryModalOpen(true);
  };

  // Image Upload Handler helper
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUrl(reader.result);
          onSuccessToast?.(`Image "${file.name}" uploaded successfully!`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Open modal handlers
  const openNewEventModal = () => {
    setEditingEventId(null);
    setEventForm(defaultEventState);
    setIsEventModalOpen(true);
  };

  const openEditEventModal = (evt: EventWorkshop) => {
    setEditingEventId(evt.id);
    setEventForm(evt);
    setIsEventModalOpen(true);
  };

  const openNewBlogModal = () => {
    setEditingBlogId(null);
    setBlogForm(defaultBlogState);
    setIsBlogModalOpen(true);
  };

  const openEditBlogModal = (blog: BlogArticle) => {
    setEditingBlogId(blog.id);
    setBlogForm(blog);
    setIsBlogModalOpen(true);
  };

  // Testimonials Handlers
  const openNewTestimonialModal = () => {
    setEditingTestimonialId(null);
    setTestimonialForm(defaultTestimonialState);
    setIsTestimonialModalOpen(true);
  };

  const openEditTestimonialModal = (t: Testimonial) => {
    setEditingTestimonialId(t.id);
    setTestimonialForm(t);
    setIsTestimonialModalOpen(true);
  };

  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.name || !testimonialForm.content) return;
    const tId = editingTestimonialId || `test-${Date.now()}`;
    const newTestimonial: Testimonial = {
      id: tId,
      name: testimonialForm.name || 'Anonymous',
      role: testimonialForm.role || 'Client / Student',
      photo: testimonialForm.photo || '',
      content: testimonialForm.content || '',
      rating: Number(testimonialForm.rating) || 5,
      category: (testimonialForm.category as any) || 'GENERAL',
      featured: !!testimonialForm.featured,
      createdAt: testimonialForm.createdAt || new Date().toISOString().split('T')[0]
    };
    onSaveTestimonial?.(newTestimonial);
    setIsTestimonialModalOpen(false);
    onSuccessToast?.(editingTestimonialId ? 'Testimonial updated successfully!' : 'New testimonial published successfully!');
  };

  // FAQ Handlers
  const openNewFAQModal = () => {
    setEditingFAQId(null);
    setFaqForm(defaultFAQState);
    setIsFAQModalOpen(true);
  };

  const openEditFAQModal = (f: FAQItem) => {
    setEditingFAQId(f.id);
    setFaqForm(f);
    setIsFAQModalOpen(true);
  };

  const handleFAQSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) return;
    const fId = editingFAQId || `faq-${Date.now()}`;
    const newFAQ: FAQItem = {
      id: fId,
      question: faqForm.question || '',
      answer: faqForm.answer || '',
      category: faqForm.category || 'General',
      order: Number(faqForm.order) || 1
    };
    onSaveFAQ?.(newFAQ);
    setIsFAQModalOpen(false);
    onSuccessToast?.(editingFAQId ? 'FAQ item updated successfully!' : 'New FAQ item created successfully!');
  };

  // Service Handlers
  const openNewServiceModal = () => {
    setEditingServiceId(null);
    setServiceForm(defaultServiceState);
    setIsServiceModalOpen(true);
  };

  const openEditServiceModal = (s: CounsellingService) => {
    setEditingServiceId(s.id);
    setServiceForm(s);
    setIsServiceModalOpen(true);
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.shortDesc) return;
    const sId = editingServiceId || `srv-${Date.now()}`;
    const newService: CounsellingService = {
      id: sId,
      slug: (serviceForm.title || 'service').toLowerCase().replace(/\s+/g, '-'),
      title: serviceForm.title || 'Untitled Service',
      shortDesc: serviceForm.shortDesc || '',
      fullDesc: serviceForm.fullDesc || serviceForm.shortDesc || '',
      image: serviceForm.image || 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=800&auto=format&fit=crop',
      benefits: Array.isArray(serviceForm.benefits) ? serviceForm.benefits : ['Confidential Consultation'],
      sessionDuration: serviceForm.sessionDuration || '60 Minutes',
      format: (serviceForm.format as any) || 'Both',
      category: serviceForm.category || 'Individual Therapy',
      featured: !!serviceForm.featured
    };
    onSaveService?.(newService);
    setIsServiceModalOpen(false);
    onSuccessToast?.(editingServiceId ? 'Counselling service updated successfully!' : 'New counselling service created and published!');
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingSettings(true);
      await Promise.resolve(onSaveSettings(siteForm));
      onSuccessToast?.('Site settings & Global Brand content saved and published live to database!');
    } catch {
      onSuccessToast?.('Failed to save site settings. Please check your connection.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.description) return;
    const evtId = editingEventId || `evt-${Date.now()}`;
    const newEvent: EventWorkshop = {
      id: evtId,
      slug: (eventForm.title || 'event').toLowerCase().replace(/\s+/g, '-'),
      title: eventForm.title || 'Untitled Event',
      type: eventForm.type || 'EVENT',
      description: eventForm.description || '',
      date: eventForm.date || new Date().toISOString().split('T')[0],
      startTime: eventForm.startTime || '09:00 AM',
      endTime: eventForm.endTime || '12:00 PM',
      location: eventForm.location || 'Colombo',
      isOnline: !!eventForm.isOnline,
      image: eventForm.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
      videoUrl: eventForm.videoUrl || '',
      registrationUrl: eventForm.registrationUrl || '',
      status: eventForm.status || 'PUBLISHED',
      featured: !!eventForm.featured
    };
    onSaveEvent(newEvent);
    setIsEventModalOpen(false);
    onSuccessToast?.(editingEventId ? 'Event updated successfully!' : 'New Event / Workshop created and published!');
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.content) return;
    const blgId = editingBlogId || `blg-${Date.now()}`;
    const newBlog: BlogArticle = {
      id: blgId,
      slug: (blogForm.title || 'blog').toLowerCase().replace(/\s+/g, '-'),
      title: blogForm.title || 'Untitled Article',
      summary: blogForm.summary || '',
      content: blogForm.content || '',
      image: blogForm.image || 'https://images.unsplash.com/photo-1499209974431-9dac3cea0047?q=80&w=800&auto=format&fit=crop',
      videoUrl: blogForm.videoUrl || '',
      author: blogForm.author || 'Helping Hearts Faculty',
      category: blogForm.category || 'General Psychology',
      tags: typeof blogForm.tags === 'string' ? (blogForm.tags as string).split(',').map(s => s.trim()) : (blogForm.tags || ['Wellness']),
      publishedAt: blogForm.publishedAt || new Date().toISOString().split('T')[0],
      status: blogForm.status || 'PUBLISHED'
    };
    onSaveBlog(newBlog);
    setIsBlogModalOpen(false);
    onSuccessToast?.(editingBlogId ? 'Blog article updated successfully!' : 'New Psychology Article published to Blog!');
  };

  const getYouTubeVideoId = (urlStr?: string): string | null => {
    if (!urlStr) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlStr.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title) {
      alert('Please enter an Asset Title');
      return;
    }

    let finalItems = [...modalGalleryItems];

    // If no items in list yet, but URL was typed in the fallback input
    if (finalItems.length === 0 && galleryForm.url) {
      const isVid = galleryForm.type === 'YOUTUBE_VIDEO';
      const vId = isVid ? getYouTubeVideoId(galleryForm.url) : null;
      const thumb = vId ? `https://img.youtube.com/vi/${vId}/hqdefault.jpg` : (galleryForm.thumbnailUrl || galleryForm.url);
      finalItems.push({
        id: `item-${Date.now()}`,
        type: isVid ? 'YOUTUBE_VIDEO' : 'IMAGE',
        url: galleryForm.url,
        thumbnailUrl: thumb,
        title: galleryForm.title,
        caption: galleryForm.caption
      });
    }

    if (finalItems.length === 0) {
      alert('Please add at least one photo or video under this Asset Title.');
      return;
    }

    const coverItem = finalItems[0];
    const hasPhotos = finalItems.some((it) => it.type === 'IMAGE');
    const hasVideos = finalItems.some((it) => it.type === 'YOUTUBE_VIDEO');

    let assetType: 'IMAGE' | 'YOUTUBE_VIDEO' | 'ALBUM' = 'ALBUM';
    if (finalItems.length === 1) {
      assetType = coverItem.type === 'YOUTUBE_VIDEO' ? 'YOUTUBE_VIDEO' : 'IMAGE';
    } else if (hasPhotos && hasVideos) {
      assetType = 'ALBUM';
    } else if (hasVideos && !hasPhotos) {
      assetType = 'YOUTUBE_VIDEO';
    } else {
      assetType = 'IMAGE';
    }

    const newItem: GalleryMedia = {
      id: editingGalleryId || `gal-${Date.now()}`,
      title: galleryForm.title || 'Media Asset',
      type: assetType,
      url: coverItem.url,
      thumbnailUrl: coverItem.thumbnailUrl || coverItem.url,
      category: (galleryForm.category as any) || 'Gallery',
      caption: galleryForm.caption,
      date: galleryForm.date || new Date().toISOString().split('T')[0],
      items: finalItems
    };

    onSaveGallery(newItem);
    setIsGalleryModalOpen(false);
    onSuccessToast?.(editingGalleryId ? `Asset "${newItem.title}" updated (${finalItems.length} items)!` : `New asset "${newItem.title}" published with ${finalItems.length} media items!`);
  };

  const eventYouTubeEmbed = getYouTubeEmbedUrl(eventForm.videoUrl);
  const blogYouTubeEmbed = getYouTubeEmbedUrl(blogForm.videoUrl);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Website CMS & Content Management</h1>
          <p className="text-xs text-slate-500">Administrator portal to manage website details, add/edit Events & Workshops, write Blogs, and upload pictures or video URLs.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'SETTINGS', label: 'Site & Hero Content', icon: Globe },
          { id: 'TESTIMONIALS', label: `Testimonials (${testimonials.length})`, icon: MessageSquare },
          { id: 'FAQS', label: `FAQs (${faqs.length})`, icon: HelpCircle },
          { id: 'SERVICES', label: `Services (${services.length})`, icon: HeartHandshake },
          { id: 'EVENTS', label: `Events (${events.length})`, icon: Calendar },
          { id: 'BLOGS', label: `Blogs (${blogs.length})`, icon: FileText },
          { id: 'GALLERY', label: `Gallery (${gallery.length})`, icon: Image }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Site Settings & Public Content */}
      {activeTab === 'SETTINGS' && (
        <form onSubmit={handleSettingsSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6 max-w-4xl text-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-700" /> Global Brand & Contact Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Site Title *</label>
              <input
                type="text"
                value={siteForm.siteName}
                onChange={(e) => setSiteForm({ ...siteForm, siteName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Logo Image URL or Local Upload</label>
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-full border border-slate-300 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
                  <img
                    src={siteForm.logoUrl || '/src/assets/images/helping_hearts_logo_1786214208419.jpg'}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <input
                  type="text"
                  value={siteForm.logoUrl || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, logoUrl: e.target.value })}
                  placeholder="/src/assets/images/helping_hearts_logo_1786214208419.jpg"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                />
                <label className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-300 cursor-pointer shrink-0 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFileUpload(e, (url) => setSiteForm({ ...siteForm, logoUrl: url }))}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Tagline / Subtitle *</label>
              <input
                type="text"
                value={siteForm.tagline}
                onChange={(e) => setSiteForm({ ...siteForm, tagline: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                required
              />
            </div>

            {/* HERO SECTION CUSTOMIZATION */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-teal-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Homepage Hero Banner Content
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Hero Badge Text</label>
                  <input
                    type="text"
                    value={siteForm.heroBadge || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, heroBadge: e.target.value })}
                    placeholder="Confidential Counselling & Accredited Psychology Education"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Primary CTA Button Text</label>
                  <input
                    type="text"
                    value={siteForm.heroCtaPrimaryText || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, heroCtaPrimaryText: e.target.value })}
                    placeholder="Book Counselling"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Hero Main Headline</label>
                  <input
                    type="text"
                    value={siteForm.heroHeadline || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, heroHeadline: e.target.value })}
                    placeholder="Helping Hearts Counselling & Wellness Centre"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Secondary CTA Button Text</label>
                  <input
                    type="text"
                    value={siteForm.heroCtaSecondaryText || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, heroCtaSecondaryText: e.target.value })}
                    placeholder="Explore LMS Courses"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Hero Main Subtitle / Narrative</label>
                <textarea
                  value={siteForm.heroSubheadline || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, heroSubheadline: e.target.value })}
                  placeholder="A compassionate sanctuary dedicated to emotional healing..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                ></textarea>
              </div>
            </div>

            {/* ABOUT US PAGE CONTENT */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-teal-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" /> About Us Page Content
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">About Page Heading</label>
                  <input
                    type="text"
                    value={siteForm.aboutHeading || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, aboutHeading: e.target.value })}
                    placeholder="Nurturing Mind, Healing Hearts & Empowering Lives"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">About Section Story (Home Page)</label>
                  <textarea
                    value={siteForm.aboutStory || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, aboutStory: e.target.value })}
                    placeholder="Helping Hearts was established to provide compassionate, evidence-based psychological services..."
                    rows={3}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Vision Statement</label>
                  <textarea
                    value={siteForm.aboutVision || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, aboutVision: e.target.value })}
                    rows={2}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  ></textarea>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Mission Statement</label>
                  <textarea
                    value={siteForm.aboutMission || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, aboutMission: e.target.value })}
                    rows={2}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  ></textarea>
                </div>
              </div>

              {/* About Values / Bullet Points Editor */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">About Key Values / Bullet Points (Home Page)</label>
                <div className="space-y-2">
                  {(siteForm.aboutValues || []).map((val, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => {
                          const updated = [...(siteForm.aboutValues || [])];
                          updated[idx] = e.target.value;
                          setSiteForm({ ...siteForm, aboutValues: updated });
                        }}
                        className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (siteForm.aboutValues || []).filter((_, i) => i !== idx);
                          setSiteForm({ ...siteForm, aboutValues: updated });
                        }}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer shrink-0"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={valuesInput}
                      onChange={(e) => setValuesInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (valuesInput.trim()) {
                            setSiteForm({ ...siteForm, aboutValues: [...(siteForm.aboutValues || []), valuesInput.trim()] });
                            setValuesInput('');
                          }
                        }
                      }}
                      placeholder="Type a value and press Enter or click Add..."
                      className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (valuesInput.trim()) {
                          setSiteForm({ ...siteForm, aboutValues: [...(siteForm.aboutValues || []), valuesInput.trim()] });
                          setValuesInput('');
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">These bullet points appear in the Home page About section. Press Enter or click Add to add each item.</p>
                </div>
              </div>
            </div>

            {/* VISION, MISSION CARDS */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-teal-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-600" /> Vision &amp; Mission Card Text
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Vision Statement</label>
                  <textarea
                    value={siteForm.aboutVision || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, aboutVision: e.target.value })}
                    placeholder="Empowering healers, transforming lives through exceptional psychotherapeutic training..."
                    rows={3}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  ></textarea>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Mission Statement</label>
                  <textarea
                    value={siteForm.aboutMission || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, aboutMission: e.target.value })}
                    placeholder="Leading the way in psychotherapeutic education, we cultivate a community of skilled, empathetic therapists..."
                    rows={3}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* LIVE IMPACT COUNTERS */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-teal-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Live Impact Counters &amp; Statistics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Clients Helped</label>
                  <input
                    type="text"
                    value={siteForm.statClientsHelped || '2,500+'}
                    onChange={(e) => setSiteForm({ ...siteForm, statClientsHelped: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Students Trained</label>
                  <input
                    type="text"
                    value={siteForm.statStudentsTrained || '1,200+'}
                    onChange={(e) => setSiteForm({ ...siteForm, statStudentsTrained: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Faculty Lecturers</label>
                  <input
                    type="text"
                    value={siteForm.statLecturersPanel || '12+'}
                    onChange={(e) => setSiteForm({ ...siteForm, statLecturersPanel: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Satisfaction Rate</label>
                  <input
                    type="text"
                    value={siteForm.statSatisfactionRate || '99%'}
                    onChange={(e) => setSiteForm({ ...siteForm, statSatisfactionRate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* CONTACT DETAILS */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-teal-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-600" /> Helpline &amp; Contact Channels
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Primary Phone</label>
                  <input
                    type="text"
                    value={siteForm.phonePrimary}
                    onChange={(e) => setSiteForm({ ...siteForm, phonePrimary: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Emergency 24/7 Helpline</label>
                  <input
                    type="text"
                    value={siteForm.emergencyHelpline}
                    onChange={(e) => setSiteForm({ ...siteForm, emergencyHelpline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold text-rose-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Primary Email</label>
                  <input
                    type="email"
                    value={siteForm.emailPrimary}
                    onChange={(e) => setSiteForm({ ...siteForm, emailPrimary: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Opening Hours</label>
                  <input
                    type="text"
                    value={siteForm.openingHours}
                    onChange={(e) => setSiteForm({ ...siteForm, openingHours: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Physical Address</label>
                <input
                  type="text"
                  value={siteForm.addressPhysical}
                  onChange={(e) => setSiteForm({ ...siteForm, addressPhysical: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSavingSettings}
            className="w-full py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-amber-300" /> {isSavingSettings ? 'Saving to Database...' : 'Save & Publish Site Content Live'}
          </button>
        </form>
      )}

      {/* Tab 2: TESTIMONIALS MANAGER */}
      {activeTab === 'TESTIMONIALS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Student &amp; Client Testimonials ({testimonials.length})</h2>
              <p className="text-xs text-slate-500">Create, edit, and delete authentic reviews and student success stories.</p>
            </div>
            <button
              onClick={openNewTestimonialModal}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> Add New Testimonial
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {testimonials.map((t) => (
              <div key={t.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-all">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {t.category && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                        {t.category}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-700 text-xs italic leading-relaxed">"{t.content}"</p>

                  <div className="flex items-center gap-2.5 pt-2 border-t border-slate-200/80">
                    <div className="w-8 h-8 rounded-full bg-teal-200 text-teal-900 font-bold flex items-center justify-center text-xs overflow-hidden shrink-0">
                      {t.photo ? <img src={t.photo} alt={t.name} className="w-full h-full object-cover" /> : t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{t.name}</p>
                      <p className="text-[10px] text-teal-700">{t.role}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditTestimonialModal(t)}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs flex items-center gap-1 border border-teal-200 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  {onDeleteTestimonial && (
                    <button
                      onClick={() => setCmsItemToDelete({ type: 'TESTIMONIAL', id: t.id, title: t.name, subtitle: t.role })}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: FAQS MANAGER */}
      {activeTab === 'FAQS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Frequently Asked Questions ({faqs.length})</h2>
              <p className="text-xs text-slate-500">Create, edit, and delete questions and answers shown on the FAQ page.</p>
            </div>
            <button
              onClick={openNewFAQModal}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> Add FAQ Item
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {faqs.map((f, idx) => (
              <div key={f.id || idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                      {f.category || 'General'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{f.question}</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{f.answer}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => openEditFAQModal(f)}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs flex items-center gap-1 border border-teal-200 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  {onDeleteFAQ && (
                    <button
                      onClick={() => setCmsItemToDelete({ type: 'FAQ', id: f.id, title: f.question, subtitle: f.category })}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: COUNSELLING SERVICES MANAGER */}
      {activeTab === 'SERVICES' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Counselling Services ({services.length})</h2>
              <p className="text-xs text-slate-500">Manage clinical counselling categories, session durations, formats, and benefit outlines.</p>
            </div>
            <button
              onClick={openNewServiceModal}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> Add Counselling Service
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {services.map((srv) => (
              <div key={srv.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="h-36 rounded-xl overflow-hidden mb-2 relative bg-slate-900">
                    <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 bg-teal-900/90 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                      {srv.format}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-teal-700 uppercase">{srv.category}</span>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{srv.title}</h3>
                  <p className="text-slate-600 line-clamp-2 mt-1">{srv.shortDesc}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-semibold">⏱️ {srv.sessionDuration}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditServiceModal(srv)}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs flex items-center gap-1 border border-teal-200 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    {onDeleteService && (
                      <button
                        onClick={() => setCmsItemToDelete({ type: 'SERVICE', id: srv.id, title: srv.title, subtitle: srv.category })}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Events & Workshops */}
      {activeTab === 'EVENTS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">Events & Workshops Manager ({events.length})</h2>
              <p className="text-xs text-slate-500">Create or edit events and workshops with custom photos and YouTube video URLs.</p>
            </div>
            <button
              onClick={openNewEventModal}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add Event / Workshop
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {events.map((e) => (
              <div key={e.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 relative flex flex-col justify-between">
                <div>
                  <div className="h-40 rounded-xl overflow-hidden mb-2 relative group bg-slate-900">
                    <img src={e.image} alt={e.title} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                    <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase shadow-xs">
                      {e.type}
                    </span>
                    <span className="absolute top-2 right-2 bg-teal-900/90 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                      {e.isOnline ? 'Virtual' : 'In-Person'}
                    </span>
                    {e.videoUrl && (
                      <span className="absolute bottom-2 left-2 bg-rose-600 text-white font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 shadow-xs">
                        <Video className="w-3 h-3" /> Video Link
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{e.title}</h3>
                  <p className="text-slate-600 line-clamp-2 mt-1">{e.description}</p>
                  <div className="text-slate-500 font-mono text-[11px] mt-2 flex flex-wrap gap-2">
                    <span>📅 {e.date}</span>
                    <span>📍 {e.location}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${e.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                    {e.status}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditEventModal(e)}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs flex items-center gap-1 border border-teal-200"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    {onDeleteEvent && (
                      <button
                        onClick={() => setCmsItemToDelete({ type: 'EVENT', id: e.id, title: e.title, subtitle: `${e.date} • ${e.location}` })}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Blog Posts */}
      {activeTab === 'BLOGS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">Psychology Blog Manager ({blogs.length})</h2>
              <p className="text-xs text-slate-500">Publish articles, upload header pictures, and attach video links for readers.</p>
            </div>
            <button
              onClick={openNewBlogModal}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add Blog Article
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {blogs.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 relative flex flex-col justify-between">
                <div>
                  <div className="h-36 rounded-xl overflow-hidden mb-2 relative bg-slate-900">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-teal-800 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase shadow-xs">
                      {b.category}
                    </span>
                    {b.videoUrl && (
                      <span className="absolute bottom-2 left-2 bg-rose-600 text-white font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 shadow-xs">
                        <Video className="w-3 h-3" /> Video Included
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{b.title}</h3>
                  <p className="text-slate-600 line-clamp-2 mt-1">{b.summary}</p>
                  <p className="text-slate-500 text-[11px] mt-2">Author: <strong>{b.author}</strong> • {b.publishedAt}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${b.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                    {b.status}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditBlogModal(b)}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs flex items-center gap-1 border border-teal-200"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    {onDeleteBlog && (
                      <button
                        onClick={() => setCmsItemToDelete({ type: 'BLOG', id: b.id, title: b.title, subtitle: `Author: ${b.author} • ${b.category}` })}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Gallery */}
      {activeTab === 'GALLERY' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Gallery Media Assets & Albums ({gallery.length})</h2>
              <p className="text-xs text-slate-500">Group multiple photos and YouTube videos under a single Asset Title.</p>
            </div>
            <button
              onClick={openNewGalleryModal}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Asset (Photos & Videos)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-xs">
            {gallery.map((g) => {
              const gItems = g.items || [{ type: g.type, url: g.url }];
              const photosCount = gItems.filter((x) => x.type === 'IMAGE').length;
              const videosCount = gItems.filter((x) => x.type === 'YOUTUBE_VIDEO').length;

              return (
                <div key={g.id} className="group relative p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all space-y-2.5 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                      <img src={g.thumbnailUrl || g.url} alt={g.title} className="h-full w-full object-cover" />
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-slate-950/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {photosCount > 0 && <span>📸 {photosCount}</span>}
                        {photosCount > 0 && videosCount > 0 && <span>•</span>}
                        {videosCount > 0 && <span className="text-rose-300">🎥 {videosCount}</span>}
                      </div>
                      <span className="absolute top-2 right-2 text-[10px] bg-slate-900/80 backdrop-blur-xs text-amber-300 px-2 py-0.5 rounded-full font-bold">
                        {g.category}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs line-clamp-2 leading-snug">{g.title}</h4>
                    {g.caption && <p className="text-[11px] text-slate-500 line-clamp-1">{g.caption}</p>}
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">{g.date || 'Recent'}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditGalleryModal(g)}
                        className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold transition-colors cursor-pointer flex items-center gap-1 text-[11px] px-2.5"
                        title="Edit Asset"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      {onDeleteGallery && (
                        <button
                          onClick={() => setCmsItemToDelete({ type: 'GALLERY', id: g.id, title: g.title, subtitle: `${g.category} • ${g.items?.length || 1} media items` })}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer flex items-center gap-1 text-[11px] px-2"
                          title="Delete Asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Event */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 border border-slate-100 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4 text-amber-800" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingEventId ? 'Edit Event / Workshop' : 'Add New Event or Workshop'}
                </h3>
              </div>
              <button onClick={() => setIsEventModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            <form onSubmit={handleEventSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Title *</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. Clinical Symposium on Adolescent Mental Health"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Type</label>
                  <select
                    value={eventForm.type}
                    onChange={(e) => setEventForm({ ...eventForm, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  >
                    <option value="EVENT">EVENT</option>
                    <option value="WORKSHOP">WORKSHOP</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Status</label>
                  <select
                    value={eventForm.status}
                    onChange={(e) => setEventForm({ ...eventForm, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Start Time</label>
                  <input
                    type="text"
                    value={eventForm.startTime}
                    onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                    placeholder="09:00 AM"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">End Time</label>
                  <input
                    type="text"
                    value={eventForm.endTime}
                    onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                    placeholder="12:00 PM"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    placeholder="Auditorium, Helping Hearts, Colombo 07"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={!!eventForm.isOnline}
                      onChange={(e) => setEventForm({ ...eventForm, isOnline: e.target.checked })}
                      className="w-4 h-4 text-teal-700 rounded focus:ring-teal-600"
                    />
                    <span>Is Virtual / Online Zoom Session?</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Description *</label>
                <textarea
                  rows={3}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Event agenda, keynote speakers, and target audience..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>

              {/* Cover Photo Picture Field */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="block font-bold text-slate-800 uppercase flex items-center justify-between">
                  <span>Cover Picture / Photo</span>
                  <span className="text-[10px] text-teal-800 font-normal">Upload file or enter image URL</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <input
                    type="text"
                    value={eventForm.image || ''}
                    onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... or Base64"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                  />
                  <label className="w-full sm:w-auto px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-xs">
                    <Upload className="w-3.5 h-3.5 text-amber-300" /> Choose Photo File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(e, (url) => setEventForm({ ...eventForm, image: url }))}
                    />
                  </label>
                </div>

                {/* Picture Preview */}
                {eventForm.image && (
                  <div className="mt-2 relative rounded-xl overflow-hidden h-32 border border-slate-200 bg-slate-900 flex items-center justify-center">
                    <img src={eventForm.image} alt="Preview" className="h-full w-full object-cover" />
                    <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                      Picture Live Preview
                    </div>
                  </div>
                )}
              </div>

              {/* Video URL & YouTube Live Preview */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="block font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-rose-600" /> YouTube Video URL / Link
                </label>
                <input
                  type="text"
                  value={eventForm.videoUrl || ''}
                  onChange={(e) => setEventForm({ ...eventForm, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                />

                {/* Live YouTube Embed Preview */}
                {eventYouTubeEmbed && (
                  <div className="mt-2 space-y-1">
                    <span className="text-[10px] font-bold text-teal-800 flex items-center gap-1">
                      <Film className="w-3 h-3 text-rose-600" /> YouTube Video Preview:
                    </span>
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-300 bg-black">
                      <iframe
                        src={eventYouTubeEmbed}
                        title="Event Video Preview"
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Registration Form Link</label>
                <input
                  type="text"
                  value={eventForm.registrationUrl || ''}
                  onChange={(e) => setEventForm({ ...eventForm, registrationUrl: e.target.value })}
                  placeholder="https://forms.gle/..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold flex items-center gap-2 shadow-xs"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  {editingEventId ? 'Update Event' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Blog Article */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 border border-slate-100 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4 text-teal-800" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingBlogId ? 'Edit Psychology Article' : 'Add New Psychology Article'}
                </h3>
              </div>
              <button onClick={() => setIsBlogModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            <form onSubmit={handleBlogSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Article Title *</label>
                <input
                  type="text"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  placeholder="e.g. Body Dysmorphic Disorder (BDD) & Clinical CBT Interventions"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Short Summary *</label>
                <input
                  type="text"
                  value={blogForm.summary}
                  onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                  placeholder="Concise introductory summary for preview cards..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Article Content *</label>
                <textarea
                  rows={6}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="Full clinical or educational article text..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-sans"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    placeholder="e.g. Psychotherapy / BDD"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Author Name</label>
                  <input
                    type="text"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    placeholder="e.g. Ms. Ramsina Farvin Jelaldeen"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Publish Date</label>
                  <input
                    type="date"
                    value={blogForm.publishedAt}
                    onChange={(e) => setBlogForm({ ...blogForm, publishedAt: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(blogForm.tags) ? blogForm.tags.join(', ') : blogForm.tags || ''}
                    onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value as any })}
                    placeholder="BDD, Anxiety, MentalHealth"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Cover Photo Picture Field */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="block font-bold text-slate-800 uppercase flex items-center justify-between">
                  <span>Header Picture / Article Photo</span>
                  <span className="text-[10px] text-teal-800 font-normal">Upload photo or enter URL</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <input
                    type="text"
                    value={blogForm.image || ''}
                    onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... or Base64"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                  />
                  <label className="w-full sm:w-auto px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-xs">
                    <Upload className="w-3.5 h-3.5 text-amber-300" /> Choose Photo File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(e, (url) => setBlogForm({ ...blogForm, image: url }))}
                    />
                  </label>
                </div>

                {/* Picture Preview */}
                {blogForm.image && (
                  <div className="mt-2 relative rounded-xl overflow-hidden h-32 border border-slate-200 bg-slate-900 flex items-center justify-center">
                    <img src={blogForm.image} alt="Preview" className="h-full w-full object-cover" />
                    <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                      Picture Live Preview
                    </div>
                  </div>
                )}
              </div>

              {/* Video URL Field */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="block font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-rose-600" /> YouTube Video URL / Link (Optional)
                </label>
                <input
                  type="text"
                  value={blogForm.videoUrl || ''}
                  onChange={(e) => setBlogForm({ ...blogForm, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                />

                {/* Live YouTube Embed Preview */}
                {blogYouTubeEmbed && (
                  <div className="mt-2 space-y-1">
                    <span className="text-[10px] font-bold text-teal-800 flex items-center gap-1">
                      <Film className="w-3 h-3 text-rose-600" /> Video Preview:
                    </span>
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-300 bg-black">
                      <iframe
                        src={blogYouTubeEmbed}
                        title="Blog Video Preview"
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold flex items-center gap-2 shadow-xs"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  {editingBlogId ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Gallery Item */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 border border-slate-100 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-800" />
                {editingGalleryId ? 'Edit Asset & Attached Photos/Videos' : 'Create Asset with Multiple Photos & Videos'}
              </h3>
              <button onClick={() => setIsGalleryModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleGallerySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Asset Title * (Album / Event Name)</label>
                <input
                  type="text"
                  value={galleryForm.title || ''}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  placeholder="e.g. Annual Mindfulness & Mental Health Symposium"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={galleryForm.category || 'Events'}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="Events">Events</option>
                    <option value="Workshops">Workshops</option>
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
                    value={galleryForm.date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setGalleryForm({ ...galleryForm, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Album Description / Caption</label>
                <textarea
                  rows={2}
                  value={galleryForm.caption || ''}
                  onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                  placeholder="Short description or caption for this asset..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              {/* Multi-Item Manager */}
              <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-teal-800" /> Attached Photos & Videos ({modalGalleryItems.length})
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setModalMediaMode('PHOTO')}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                        modalMediaMode === 'PHOTO' ? 'bg-teal-800 text-white' : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      + Add Photos
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalMediaMode('VIDEO')}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                        modalMediaMode === 'VIDEO' ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      + Add Video
                    </button>
                  </div>
                </div>

                {modalMediaMode === 'PHOTO' ? (
                  <div className="bg-white p-3 rounded-xl border border-teal-200 space-y-2">
                    <label className="w-full py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-2">
                      <Upload className="w-3.5 h-3.5" /> Batch Upload Photos from Computer
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (!files) return;
                          Array.from(files).forEach((file: File, i: number) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setModalGalleryItems((prev) => [
                                  ...prev,
                                  {
                                    id: `item-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 5)}`,
                                    type: 'IMAGE',
                                    url: reader.result as string,
                                    thumbnailUrl: reader.result as string,
                                    title: file.name.replace(/\.[^/.]+$/, ''),
                                    caption: ''
                                  }
                                ]);
                              }
                            };
                            reader.readAsDataURL(file);
                          });
                          e.target.value = '';
                        }}
                      />
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempPhotoUrl}
                        onChange={(e) => setTempPhotoUrl(e.target.value)}
                        placeholder="Or paste photo image URL..."
                        className="w-full p-2 rounded-lg border border-slate-300 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!tempPhotoUrl.trim()) return;
                          setModalGalleryItems((prev) => [
                            ...prev,
                            {
                              id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                              type: 'IMAGE',
                              url: tempPhotoUrl.trim(),
                              thumbnailUrl: tempPhotoUrl.trim(),
                              title: tempPhotoCaption || 'Photo',
                              caption: tempPhotoCaption
                            }
                          ]);
                          setTempPhotoUrl('');
                          setTempPhotoCaption('');
                        }}
                        className="px-3 py-2 bg-teal-700 text-white font-bold rounded-lg shrink-0 cursor-pointer text-xs"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-3 rounded-xl border border-rose-200 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempVideoUrl}
                        onChange={(e) => setTempVideoUrl(e.target.value)}
                        placeholder="Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
                        className="w-full p-2 rounded-lg border border-slate-300 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!tempVideoUrl.trim()) return;
                          const vId = getYouTubeVideoId(tempVideoUrl.trim());
                          const thumb = vId
                            ? `https://img.youtube.com/vi/${vId}/hqdefault.jpg`
                            : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop';
                          setModalGalleryItems((prev) => [
                            ...prev,
                            {
                              id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                              type: 'YOUTUBE_VIDEO',
                              url: tempVideoUrl.trim(),
                              thumbnailUrl: thumb,
                              title: tempVideoTitle || 'YouTube Stream',
                              caption: ''
                            }
                          ]);
                          setTempVideoUrl('');
                          setTempVideoTitle('');
                        }}
                        className="px-3 py-2 bg-rose-700 text-white font-bold rounded-lg shrink-0 cursor-pointer text-xs"
                      >
                        + Add Video
                      </button>
                    </div>
                  </div>
                )}

                {/* Attached items list */}
                {modalGalleryItems.length > 0 && (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {modalGalleryItems.map((it, idx) => (
                      <div
                        key={it.id || idx}
                        className={`p-2 rounded-xl border flex items-center gap-2.5 ${
                          idx === 0 ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="relative w-12 h-10 rounded-md overflow-hidden bg-slate-900 shrink-0">
                          <img src={it.thumbnailUrl || it.url} alt="thumb" className="w-full h-full object-cover" />
                          {it.type === 'YOUTUBE_VIDEO' && (
                            <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play className="w-3 h-3 text-white fill-white" />
                            </span>
                          )}
                        </div>
                        <div className="grow min-w-0">
                          <div className="flex items-center gap-1">
                            <span
                              className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                it.type === 'YOUTUBE_VIDEO' ? 'bg-rose-100 text-rose-800' : 'bg-teal-100 text-teal-800'
                              }`}
                            >
                              {it.type === 'YOUTUBE_VIDEO' ? 'Video' : 'Photo'}
                            </span>
                            {idx === 0 && (
                              <span className="text-[8px] bg-amber-500 text-slate-950 font-bold px-1 rounded">
                                Cover
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-slate-900 truncate">{it.title || `Item ${idx + 1}`}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setModalGalleryItems((prev) => {
                                  const arr = [...prev];
                                  const [ch] = arr.splice(idx, 1);
                                  arr.unshift(ch);
                                  return arr;
                                });
                              }}
                              className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded cursor-pointer"
                            >
                              Set Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setModalGalleryItems((prev) => prev.filter((_, i) => i !== idx))}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalGalleryItems.length === 0 && !galleryForm.url}
                  className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 disabled:bg-slate-300 text-white font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  {editingGalleryId ? 'Update Asset' : 'Publish Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Testimonial */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 border border-slate-100 space-y-4 my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                {editingTestimonialId ? 'Edit Testimonial' : 'Create New Testimonial'}
              </h3>
              <button onClick={() => setIsTestimonialModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleTestimonialSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Author Name *</label>
                  <input
                    type="text"
                    value={testimonialForm.name || ''}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                    placeholder="e.g. Nadeesha Wickramasinghe"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={testimonialForm.category || 'STUDENT'}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="STUDENT">Student / Graduate</option>
                    <option value="CLIENT">Counselling Client</option>
                    <option value="WORKSHOP">Workshop Attendee</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Role / Credential *</label>
                <input
                  type="text"
                  value={testimonialForm.role || ''}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                  placeholder="e.g. Higher Diploma in Psychology Graduate"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Photo URL / Upload</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={testimonialForm.photo || ''}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, photo: e.target.value })}
                    placeholder="Paste avatar URL..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                  <label className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-300 cursor-pointer shrink-0 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(e, (url) => setTestimonialForm({ ...testimonialForm, photo: url }))}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Star Rating (1 - 5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTestimonialForm({ ...testimonialForm, rating: star })}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${(testimonialForm.rating || 5) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-slate-700 ml-2">{testimonialForm.rating || 5} Stars</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Review / Message Content *</label>
                <textarea
                  value={testimonialForm.content || ''}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                  rows={3}
                  placeholder="Share their learning experience or counselling breakthrough..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  required
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="test-featured"
                  checked={!!testimonialForm.featured}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, featured: e.target.checked })}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="test-featured" className="font-bold text-slate-700 cursor-pointer">
                  Feature on Homepage
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  {editingTestimonialId ? 'Save Testimonial' : 'Publish Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit FAQ */}
      {isFAQModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 border border-slate-100 space-y-4 my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-teal-800" />
                {editingFAQId ? 'Edit FAQ Item' : 'Create FAQ Item'}
              </h3>
              <button onClick={() => setIsFAQModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleFAQSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={faqForm.category || 'General'}
                    onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                    placeholder="e.g. Counselling & Confidentiality"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Display Order</label>
                  <input
                    type="number"
                    value={faqForm.order || 1}
                    onChange={(e) => setFaqForm({ ...faqForm, order: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Question *</label>
                <input
                  type="text"
                  value={faqForm.question || ''}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="e.g. Is my counselling session strictly confidential?"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Answer *</label>
                <textarea
                  value={faqForm.answer || ''}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  rows={4}
                  placeholder="Provide comprehensive, clear explanation..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs leading-relaxed"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFAQModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  {editingFAQId ? 'Save FAQ' : 'Publish FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Service */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-6 border border-slate-100 space-y-4 my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-teal-800" />
                {editingServiceId ? 'Edit Counselling Service' : 'Create Counselling Service'}
              </h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleServiceSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Service Title *</label>
                <input
                  type="text"
                  value={serviceForm.title || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  placeholder="e.g. Individual Psychotherapy & CBT"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={serviceForm.category || 'Individual Therapy'}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Format</label>
                  <select
                    value={serviceForm.format || 'Both'}
                    onChange={(e) => setServiceForm({ ...serviceForm, format: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="Both">Both (Physical & Online)</option>
                    <option value="In-Person">In-Person Only</option>
                    <option value="Online">Online Only</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Duration</label>
                  <input
                    type="text"
                    value={serviceForm.sessionDuration || '60 Minutes'}
                    onChange={(e) => setServiceForm({ ...serviceForm, sessionDuration: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Image URL or Local Upload</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={serviceForm.image || ''}
                    onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                  <label className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-300 cursor-pointer shrink-0 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(e, (url) => setServiceForm({ ...serviceForm, image: url }))}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Short Description *</label>
                <input
                  type="text"
                  value={serviceForm.shortDesc || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, shortDesc: e.target.value })}
                  placeholder="One-line summary shown on service cards..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Clinical Description</label>
                <textarea
                  value={serviceForm.fullDesc || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, fullDesc: e.target.value })}
                  rows={3}
                  placeholder="Comprehensive explanation of therapeutic modalities..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  {editingServiceId ? 'Save Service' : 'Publish Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IN-APP CMS DELETE CONFIRMATION MODAL */}
      {cmsItemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Delete {
                    cmsItemToDelete.type === 'EVENT' ? 'Event' :
                    cmsItemToDelete.type === 'BLOG' ? 'Blog Article' :
                    cmsItemToDelete.type === 'TESTIMONIAL' ? 'Testimonial' :
                    cmsItemToDelete.type === 'FAQ' ? 'FAQ Item' :
                    cmsItemToDelete.type === 'SERVICE' ? 'Counselling Service' :
                    'Gallery Asset'
                  }?
                </h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-800 line-clamp-1">{cmsItemToDelete.title}</p>
              {cmsItemToDelete.subtitle && (
                <p className="text-slate-500 text-[11px]">{cmsItemToDelete.subtitle}</p>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete this item from your public portal?
            </p>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setCmsItemToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (cmsItemToDelete) {
                    if (cmsItemToDelete.type === 'EVENT') {
                      onDeleteEvent?.(cmsItemToDelete.id);
                      onSuccessToast?.('Event deleted successfully.');
                    } else if (cmsItemToDelete.type === 'BLOG') {
                      onDeleteBlog?.(cmsItemToDelete.id);
                      onSuccessToast?.('Blog article deleted successfully.');
                    } else if (cmsItemToDelete.type === 'GALLERY') {
                      onDeleteGallery?.(cmsItemToDelete.id);
                      onSuccessToast?.('Asset deleted from gallery successfully.');
                    } else if (cmsItemToDelete.type === 'TESTIMONIAL') {
                      onDeleteTestimonial?.(cmsItemToDelete.id);
                      onSuccessToast?.('Testimonial deleted successfully.');
                    } else if (cmsItemToDelete.type === 'FAQ') {
                      onDeleteFAQ?.(cmsItemToDelete.id);
                      onSuccessToast?.('FAQ item deleted successfully.');
                    } else if (cmsItemToDelete.type === 'SERVICE') {
                      onDeleteService?.(cmsItemToDelete.id);
                      onSuccessToast?.('Counselling service deleted successfully.');
                    }
                    setCmsItemToDelete(null);
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

