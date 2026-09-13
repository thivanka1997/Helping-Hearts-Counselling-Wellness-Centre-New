'use client';
import React, { useState, useRef } from 'react';
import { Lecturer, Course } from '@/src/types';
import { UserCheck, Plus, Edit3, Trash2, Eye, EyeOff, Mail, Phone, BookOpen, Award, Upload, X, Save, Search, User, Link, KeyRound, Lock, Copy, Check, Sparkles, ShieldCheck } from 'lucide-react';

interface AdminLecturersProps {
  lecturers: Lecturer[];
  courses: Course[];
  onSaveLecturer: (lecturer: Lecturer) => void;
  onDeleteLecturer?: (id: string) => void;
  onSuccessToast?: (msg: string) => void;
}

export const AdminLecturers: React.FC<AdminLecturersProps> = ({
  lecturers,
  courses,
  onSaveLecturer,
  onDeleteLecturer,
  onSuccessToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoFileInputRef = useRef<HTMLInputElement>(null);
  
  // Modals
  const [viewingLecturer, setViewingLecturer] = useState<Lecturer | null>(null);
  const [editingLecturerId, setEditingLecturerId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [lecturerToDelete, setLecturerToDelete] = useState<Lecturer | null>(null);

  // Profile Modal Inline Credentials State
  const [isEditingCredentials, setIsEditingCredentials] = useState(false);
  const [credUsername, setCredUsername] = useState('');
  const [credPassword, setCredPassword] = useState('');
  const [showCredPassword, setShowCredPassword] = useState(false);
  const [showEditorPassword, setShowEditorPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form State
  const defaultFormState: Partial<Lecturer> = {
    name: '',
    title: 'Senior Lecturer in Psychology',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    qualifications: 'M.Sc. in Clinical Psychology, B.Sc. (Hons) Psychology',
    specialization: 'Cognitive Behavioral Therapy (CBT), Adolescent Counselling',
    bio: '',
    email: 'lecturer@helpinghearts.lk',
    phone: '+94 11 234 5678',
    coursesAssigned: [],
    displayOrder: lecturers.length + 1,
    username: '',
    password: '',
  };

  const [formState, setFormState] = useState<Partial<Lecturer>>(defaultFormState);

  const generatePassword = () => {
    const num = Math.floor(100 + Math.random() * 900);
    const chars = '!@#$%&*';
    const char = chars[Math.floor(Math.random() * chars.length)];
    return `Lec@2026${char}${num}`;
  };

  const suggestUsername = (name?: string, email?: string) => {
    if (name) {
      const clean = name
        .toLowerCase()
        .replace(/^(dr|mr|mrs|ms|miss|prof)\.?\s+/i, '')
        .replace(/[^a-z0-9]/g, '.')
        .replace(/\.+/g, '.')
        .replace(/^\.|\.$/g, '');
      if (clean) return clean;
    }
    if (email && email.includes('@')) {
      return email.split('@')[0].toLowerCase();
    }
    return `lecturer_${Date.now().toString().slice(-4)}`;
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const openViewModal = (lec: Lecturer) => {
    setViewingLecturer(lec);
    setCredUsername(lec.username || suggestUsername(lec.name, lec.email));
    setCredPassword(lec.password || '');
    setIsEditingCredentials(false);
    setShowCredPassword(false);
  };

  const handleSaveInlineCredentials = () => {
    if (!viewingLecturer) return;
    const finalUsername = credUsername.trim() || suggestUsername(viewingLecturer.name, viewingLecturer.email);
    const updated: Lecturer = {
      ...viewingLecturer,
      username: finalUsername,
      password: credPassword.trim()
    };
    onSaveLecturer(updated);
    setViewingLecturer(updated);
    setIsEditingCredentials(false);
    onSuccessToast?.(`Login credentials saved for ${updated.name}! (Username: ${finalUsername})`);
  };

  // Filtered lecturers
  const filteredLecturers = lecturers.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.qualifications.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingLecturerId(null);
    setFormState({
      ...defaultFormState,
      displayOrder: lecturers.length + 1,
    });
    setIsEditorOpen(true);
  };

  const openEditModal = (lec: Lecturer) => {
    setEditingLecturerId(lec.id);
    setFormState(lec);
    setIsEditorOpen(true);
  };

  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'lecturers');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.url) {
        setFormState((prev) => ({ ...prev, photo: data.url }));
        onSuccessToast?.(`✅ Photo uploaded: "${file.name}"`);
      } else {
        onSuccessToast?.(`❌ Upload failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      onSuccessToast?.('❌ Upload error. Please try again.');
    } finally {
      setUploadingPhoto(false);
      if (photoFileInputRef.current) photoFileInputRef.current.value = '';
    }
  };

  const handleCourseToggle = (courseId: string) => {
    const current = formState.coursesAssigned || [];
    if (current.includes(courseId)) {
      setFormState({
        ...formState,
        coursesAssigned: current.filter((id) => id !== courseId),
      });
    } else {
      setFormState({
        ...formState,
        coursesAssigned: [...current, courseId],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.title) return;

    const lecId = editingLecturerId || `lec-${Date.now()}`;
    const newLecturer: Lecturer = {
      id: lecId,
      userId: formState.userId || `usr-${lecId}`,
      name: formState.name || 'Faculty Member',
      title: formState.title || 'Lecturer in Psychology',
      photo: formState.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      qualifications: formState.qualifications || '',
      specialization: formState.specialization || '',
      bio: formState.bio || '',
      email: formState.email || '',
      phone: formState.phone || '',
      coursesAssigned: formState.coursesAssigned || [],
      displayOrder: formState.displayOrder || lecturers.length + 1,
      username: formState.username || '',
      password: formState.password || '',
    };

    onSaveLecturer(newLecturer);
    setIsEditorOpen(false);
    onSuccessToast?.(
      editingLecturerId
        ? `Lecturer profile for "${newLecturer.name}" updated successfully!`
        : `New Lecturer "${newLecturer.name}" onboarded!`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-100 text-purple-800 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900">Lecturer & Faculty Profiles</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            View, edit profile photos, qualifications, assigned diploma courses, and credentials for academic faculty.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-transform hover:scale-105 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Lecturer Profile
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search lecturers by name, title, qualification or specialization..."
          className="w-full text-xs font-medium focus:outline-hidden text-slate-800 placeholder-slate-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Lecturers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLecturers.map((lec) => {
          const assignedCourseObjs = courses.filter(
            (c) => c.lecturerId === lec.id || (lec.coursesAssigned && lec.coursesAssigned.includes(c.id))
          );

          return (
            <div
              key={lec.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                {/* Photo & Header info */}
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-teal-800 shrink-0 shadow-xs bg-slate-900">
                    <img
                      src={lec.photo}
                      alt={lec.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-extrabold text-slate-900 text-base truncate" title={lec.name}>
                      {lec.name}
                    </h3>
                    <p className="text-xs font-bold text-teal-800 leading-tight">{lec.title}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{lec.email}</span>
                    </div>
                    <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                      {lec.username ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-lg shadow-2xs">
                          <KeyRound className="w-2.5 h-2.5 text-purple-600" />
                          <span className="truncate">Login: {lec.username}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                          Login Not Set
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Qualifications & Specialization */}
                <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="flex items-start gap-2 text-slate-700">
                    <Award className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block text-[11px] uppercase">Qualifications:</span>
                      <p className="text-slate-600 leading-tight">{lec.qualifications}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-slate-700 pt-1 border-t border-slate-200/60">
                    <BookOpen className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block text-[11px] uppercase">Specialization:</span>
                      <p className="text-slate-600 leading-tight">{lec.specialization}</p>
                    </div>
                  </div>
                </div>

                {/* Assigned Courses */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Assigned Diploma Courses ({assignedCourseObjs.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {assignedCourseObjs.length > 0 ? (
                      assignedCourseObjs.map((c) => (
                        <span
                          key={c.id}
                          className="bg-teal-50 text-teal-900 border border-teal-200 text-[10px] font-bold px-2 py-0.5 rounded-lg"
                        >
                          {((c as any).code || c.id) || c.title}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">No courses currently assigned</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => openViewModal(lec)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" /> View Profile
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(lec)}
                    className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-300" /> Edit Profile
                  </button>

                  {onDeleteLecturer && (
                    <button
                      onClick={() => setLecturerToDelete(lec)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 cursor-pointer"
                      title="Delete Lecturer Profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* VIEW PROFILE MODAL */}
      {viewingLecturer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 border border-slate-100 space-y-5 my-8">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={viewingLecturer.photo}
                  alt={viewingLecturer.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-800 shadow-xs"
                />
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{viewingLecturer.name}</h2>
                  <p className="text-xs font-bold text-teal-800">{viewingLecturer.title}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingLecturer(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Email Address</span>
                  <p className="font-semibold text-slate-900 text-sm flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-4 h-4 text-teal-700" /> {viewingLecturer.email}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Contact Phone</span>
                  <p className="font-semibold text-slate-900 text-sm flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-4 h-4 text-teal-700" /> {viewingLecturer.phone}
                  </p>
                </div>
              </div>

              {/* Faculty Portal Login Credentials Section */}
              <div className="bg-gradient-to-r from-purple-50 via-indigo-50/70 to-purple-50 p-4 rounded-2xl border border-purple-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-purple-700" />
                    <span className="font-bold text-purple-950 uppercase text-[11px] tracking-wide">Faculty Portal Login Credentials</span>
                  </div>
                  {!isEditingCredentials && (
                    <button
                      type="button"
                      onClick={() => setIsEditingCredentials(true)}
                      className="px-3 py-1 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs active:scale-95"
                    >
                      <Edit3 className="w-3 h-3 text-amber-300" />
                      <span>{viewingLecturer.username ? 'Edit Credentials' : 'Create Credentials'}</span>
                    </button>
                  )}
                </div>

                {isEditingCredentials ? (
                  /* Inline credentials editor */
                  <div className="space-y-3 bg-white p-4 rounded-xl border border-purple-200 shadow-2xs animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-bold text-slate-700 uppercase text-[10px]">User ID / Username *</label>
                          <button
                            type="button"
                            onClick={() => setCredUsername(suggestUsername(viewingLecturer.name, viewingLecturer.email))}
                            className="text-[10px] text-purple-700 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                          >
                            <Sparkles className="w-3 h-3" /> Auto-Suggest
                          </button>
                        </div>
                        <div className="flex items-center gap-2 border border-slate-300 rounded-xl px-2.5 py-2 bg-slate-50 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <input
                            type="text"
                            value={credUsername}
                            onChange={(e) => setCredUsername(e.target.value)}
                            placeholder="e.g. dr_kavinda or lecturer.name"
                            className="w-full text-xs font-semibold bg-transparent outline-none text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-bold text-slate-700 uppercase text-[10px]">Portal Password *</label>
                          <button
                            type="button"
                            onClick={() => {
                              const newPass = generatePassword();
                              setCredPassword(newPass);
                              setShowCredPassword(true);
                            }}
                            className="text-[10px] text-purple-700 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                          >
                            <Sparkles className="w-3 h-3" /> Generate Password
                          </button>
                        </div>
                        <div className="flex items-center gap-2 border border-slate-300 rounded-xl px-2.5 py-2 bg-slate-50 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
                          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <input
                            type={showCredPassword ? 'text' : 'password'}
                            value={credPassword}
                            onChange={(e) => setCredPassword(e.target.value)}
                            placeholder="Set secure password"
                            className="w-full text-xs font-mono font-semibold bg-transparent outline-none text-slate-900"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCredPassword(!showCredPassword)}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
                            title={showCredPassword ? 'Hide password' : 'Show password'}
                          >
                            {showCredPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-purple-100">
                      <span className="text-[10px] text-slate-500 italic">Credentials will be active for lecturer portal login immediately.</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCredUsername(viewingLecturer.username || '');
                            setCredPassword(viewingLecturer.password || '');
                            setIsEditingCredentials(false);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveInlineCredentials}
                          className="px-4 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                        >
                          <Save className="w-3.5 h-3.5 text-amber-300" />
                          <span>Save Credentials</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Display mode */
                  <div>
                    {viewingLecturer.username ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-purple-200">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">User ID / Username</span>
                          <div className="flex items-center justify-between gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                            <span className="font-mono font-bold text-purple-900 text-xs truncate">{viewingLecturer.username}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(viewingLecturer.username!, 'username')}
                              className="text-slate-400 hover:text-purple-700 cursor-pointer shrink-0"
                              title="Copy username"
                            >
                              {copiedField === 'username' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Password</span>
                          <div className="flex items-center justify-between gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                            <span className="font-mono font-bold text-slate-900 text-xs">
                              {viewingLecturer.password ? (showCredPassword ? viewingLecturer.password : '••••••••••••') : '(Not configured)'}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                              {viewingLecturer.password && (
                                <button
                                  type="button"
                                  onClick={() => setShowCredPassword(!showCredPassword)}
                                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                                  title={showCredPassword ? 'Hide password' : 'Show password'}
                                >
                                  {showCredPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              )}
                              {viewingLecturer.password && (
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(viewingLecturer.password!, 'password')}
                                  className="text-slate-400 hover:text-purple-700 cursor-pointer"
                                  title="Copy password"
                                >
                                  {copiedField === 'password' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-amber-900">⚠️ No Portal Credentials Created Yet</p>
                          <p className="text-[11px] text-amber-800">This lecturer cannot log into the Faculty Dashboard until a User ID and password are created.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEditingCredentials(true)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow-2xs self-start sm:self-auto"
                        >
                          Create Login Now
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <span className="font-bold text-slate-900 uppercase text-[10px] block mb-1">Qualifications</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium">
                  {viewingLecturer.qualifications}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 uppercase text-[10px] block mb-1">Specializations</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium">
                  {viewingLecturer.specialization}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 uppercase text-[10px] block mb-1">Biography</span>
                <p className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line">
                  {viewingLecturer.bio || 'No biography written yet.'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setViewingLecturer(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close View
              </button>
              <button
                onClick={() => {
                  const target = viewingLecturer;
                  setViewingLecturer(null);
                  openEditModal(target);
                }}
                className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-300" /> Edit Profile Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT LECTURER MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 border border-slate-100 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                  <UserCheck className="w-4 h-4 text-purple-800" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {editingLecturerId ? 'Edit Lecturer Profile & Photo' : 'Onboard New Faculty Member'}
                </h3>
              </div>
              <button onClick={() => setIsEditorOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Photo Upload / URL Section */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="block font-bold text-slate-900 uppercase flex items-center justify-between">
                  <span>Profile Photo</span>
                  <span className="text-[10px] text-teal-800 font-normal">Upload file or enter web URL</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  {/* Live preview */}
                  <div className="w-20 h-20 rounded-2xl border-2 border-teal-800 overflow-hidden bg-slate-200 shrink-0 relative shadow-xs flex items-center justify-center">
                    {uploadingPhoto ? (
                      <div className="text-[10px] text-slate-500 font-bold text-center px-1">Uploading…</div>
                    ) : (
                      <img
                        src={formState.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop'}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop'; }}
                      />
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    {/* Web URL Input */}
                    <div className="flex items-center gap-2 border border-slate-300 rounded-xl overflow-hidden bg-white">
                      <span className="pl-2.5 shrink-0"><Link className="w-3.5 h-3.5 text-slate-400" /></span>
                      <input
                        type="text"
                        value={formState.photo || ''}
                        onChange={(e) => setFormState({ ...formState, photo: e.target.value })}
                        placeholder="Paste image URL (https://...)  "
                        className="flex-1 p-2.5 text-xs bg-transparent focus:outline-none font-mono"
                      />
                    </div>

                    {/* Cloudinary File Upload */}
                    <label className={`w-full px-4 py-2 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-xs font-bold transition-all ${
                      uploadingPhoto
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-teal-800 hover:bg-teal-900 text-white'
                    }`}>
                      <Upload className="w-3.5 h-3.5 text-amber-300" />
                      {uploadingPhoto ? 'Uploading to Cloud…' : '📤 Upload Photo File (Cloudinary)'}
                      <input
                        ref={photoFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingPhoto}
                        onChange={handlePhotoFileUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Dr. Kavinda De Silva"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Title / Academic Position *</label>
                  <input
                    type="text"
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    placeholder="e.g. Senior Lecturer in Psychology"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Official Email *</label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="lecturer@helpinghearts.lk"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Academic Qualifications</label>
                <input
                  type="text"
                  value={formState.qualifications}
                  onChange={(e) => setFormState({ ...formState, qualifications: e.target.value })}
                  placeholder="Ph.D. in Clinical Psychology, M.Sc., B.Sc."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Clinical Specializations</label>
                <input
                  type="text"
                  value={formState.specialization}
                  onChange={(e) => setFormState({ ...formState, specialization: e.target.value })}
                  placeholder="Cognitive Behavioral Therapy (CBT), Psychotherapy"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Biography</label>
                <textarea
                  rows={4}
                  value={formState.bio}
                  onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                  placeholder="Brief biography outlining clinical experience and research background..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              {/* Portal Credentials Section */}
              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-purple-700" />
                    <label className="block font-bold text-purple-900 uppercase text-xs">Faculty Portal Login Credentials</label>
                  </div>
                  <span className="text-[10px] text-purple-700 font-semibold bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-300">
                    Faculty Dashboard Access
                  </span>
                </div>
                <p className="text-[11px] text-purple-700">Assign a User ID / username and password so this lecturer can log into the faculty portal.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">User ID / Username</label>
                      <button
                        type="button"
                        onClick={() => setFormState({ ...formState, username: suggestUsername(formState.name, formState.email) })}
                        className="text-[10px] text-purple-700 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        <Sparkles className="w-3 h-3" /> Auto-Suggest
                      </button>
                    </div>
                    <div className="flex items-center gap-2 border border-slate-300 rounded-xl overflow-hidden bg-white px-2.5 py-2 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={formState.username || ''}
                        onChange={(e) => setFormState({ ...formState, username: e.target.value })}
                        placeholder="e.g. dr_kavinda or lecturer.name"
                        className="flex-1 text-xs bg-transparent focus:outline-none text-slate-900 font-semibold"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          const newPass = generatePassword();
                          setFormState({ ...formState, password: newPass });
                          setShowEditorPassword(true);
                        }}
                        className="text-[10px] text-purple-700 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        <Sparkles className="w-3 h-3" /> Generate Password
                      </button>
                    </div>
                    <div className="flex items-center gap-2 border border-slate-300 rounded-xl overflow-hidden bg-white px-2.5 py-2 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type={showEditorPassword ? 'text' : 'password'}
                        value={formState.password || ''}
                        onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                        placeholder="Set or generate secure password"
                        className="flex-1 text-xs bg-transparent focus:outline-none font-mono text-slate-900 font-semibold"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditorPassword(!showEditorPassword)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
                      >
                        {showEditorPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
                {formState.username && (
                  <div className="flex items-center justify-between gap-2 p-2.5 bg-white border border-purple-200 rounded-xl text-[11px]">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-purple-700 font-bold">Login Preview:</span>
                      <span className="font-mono text-slate-700">User: <strong>{formState.username}</strong></span>
                      <span className="text-slate-400">|</span>
                      <span className="font-mono text-slate-700">Pass: <strong>{formState.password ? (showEditorPassword ? formState.password : '••••••••') : '(not set)'}</strong></span>
                    </div>
                    {formState.password && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(`Username: ${formState.username}\nPassword: ${formState.password}`, 'editor_both')}
                        className="text-purple-700 font-bold hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        {copiedField === 'editor_both' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Details</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Course Assignment */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-800 uppercase">Assigned Diploma Courses</label>
                <p className="text-[11px] text-slate-500">Select diploma courses taught by this faculty member:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-h-40 overflow-y-auto">
                  {courses.map((crs) => {
                    const isChecked = (formState.coursesAssigned || []).includes(crs.id);
                    return (
                      <label
                        key={crs.id}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-teal-50 border-teal-300 text-teal-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCourseToggle(crs.id)}
                          className="w-4 h-4 text-teal-700 rounded focus:ring-teal-600"
                        />
                        <span className="truncate">{crs.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold flex items-center gap-2 shadow-xs"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  {editingLecturerId ? 'Save Profile Changes' : 'Create Lecturer Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IN-APP LECTURER DELETE CONFIRMATION MODAL */}
      {lecturerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Delete Lecturer Profile?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-800">{lecturerToDelete.name}</p>
              <p className="text-slate-500 text-[11px]">{lecturerToDelete.title}</p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently remove this lecturer's profile from the system?
            </p>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setLecturerToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (lecturerToDelete) {
                    onDeleteLecturer?.(lecturerToDelete.id);
                    onSuccessToast?.(`Lecturer profile deleted successfully.`);
                    setLecturerToDelete(null);
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
