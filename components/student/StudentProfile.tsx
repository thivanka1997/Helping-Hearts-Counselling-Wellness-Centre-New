'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/src/types';
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Edit3,
  CheckCircle2,
  Sparkles,
  Save,
  RotateCcw
} from 'lucide-react';
import { useStudentUser } from '@/lib/useStudentUser';

interface StudentProfileProps {
  user?: User;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ user: initialPropUser }) => {
  const { user: studentUser, updateStudentName, resetStudentName } = useStudentUser();
  const activeUser = initialPropUser || studentUser;

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(activeUser.name || '');
  const [phone, setPhone] = useState(activeUser.phone || '+94 75 123 4567');
  const [email, setEmail] = useState(activeUser.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (activeUser?.name) setFullName(activeUser.name);
    if (activeUser?.phone) setPhone(activeUser.phone);
    if (activeUser?.email) setEmail(activeUser.email);
  }, [activeUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsSaving(true);
    setSuccessMsg(null);

    try {
      await updateStudentName(fullName.trim(), { phone: phone.trim(), email: email.trim() });
      setSuccessMsg(`Student name successfully updated to "${fullName.trim()}"!`);
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch {
      alert('Failed to update student profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Reset student profile name back to default?')) {
      resetStudentName();
      setSuccessMsg('Reset to default student profile.');
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Success Banner */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-800 to-teal-950 text-amber-300 font-extrabold text-2xl flex items-center justify-center shadow-md border-2 border-teal-700">
              {fullName ? fullName.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{fullName || activeUser.name}</h1>
                <span className="inline-block bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Active Student
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-teal-700" />
                <span>{email || activeUser.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span>{isEditing ? 'Cancel Edit' : 'Change Student Name'}</span>
            </button>
            <button
              onClick={handleResetToDefault}
              title="Reset to default student"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Change Name & Profile Form */}
        {isEditing && (
          <form
            onSubmit={handleSave}
            className="bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 text-white p-6 rounded-2xl space-y-4 border border-teal-700 shadow-md animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between border-b border-teal-800 pb-3">
              <h2 className="text-sm font-bold text-amber-300 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Update Student Display Name & Info
              </h2>
              <span className="text-[10px] text-teal-200 bg-teal-800/80 px-2 py-0.5 rounded font-mono">
                LMS Profile Synchronizer
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-teal-100 block">
                  Student Full Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your student name (e.g. Kasun Perera, Anushka Wickramasinghe)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-teal-900/90 border border-teal-600 text-white text-sm font-semibold focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all placeholder:text-teal-400"
                />
                <p className="text-[11px] text-teal-200">
                  This name will appear on your Student LMS Dashboard banner, attendance records, and certificates.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-teal-100 block">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +94 77 123 4567"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-teal-900/90 border border-teal-600 text-white text-xs font-semibold focus:border-amber-400 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-teal-100 block">Student Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@helpinghearts.lk"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-teal-900/90 border border-teal-600 text-white text-xs font-semibold focus:border-amber-400 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-teal-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-teal-200 hover:text-white hover:bg-teal-800/60 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving Changes...' : 'Save Student Name & Profile'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Read-Only Account Info Grid */}
        <div className="space-y-4 text-xs text-slate-700">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Student Account & Enrolment Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-500 block">Student Name</span>
              <strong className="text-slate-900 text-sm font-bold">{fullName || activeUser.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Contact Phone</span>
              <strong className="text-slate-800 font-medium">{phone || activeUser.phone || '+94 75 123 4567'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Account Status</span>
              <strong className="text-emerald-700 font-bold uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{activeUser.status || 'ACTIVE'}</span>
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Primary Institution</span>
              <strong className="text-slate-800 font-medium">Helping Hearts LMS & Wellness Centre</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
