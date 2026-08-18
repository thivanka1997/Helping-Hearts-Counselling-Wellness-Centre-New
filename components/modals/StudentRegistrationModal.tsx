'use client';
import React, { useState } from 'react';
import { X, GraduationCap, Upload, CheckCircle2, ShieldCheck, CreditCard, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Course } from '@/src/types';
import { api } from '@/lib/api-client';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  preselectedCourseId?: string;
  onSuccessToast?: (msg: string) => void;
}

export const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  isOpen,
  onClose,
  courses,
  preselectedCourseId,
  onSuccessToast
}) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [courseId, setCourseId] = useState(preselectedCourseId || courses[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'Online Gateway' | 'Cash'>('Bank Transfer');
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipRef, setSlipRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSubmitted, setRegistrationSubmitted] = useState<boolean>(false);

  const selectedCourse = courses.find((c) => c.id === courseId) || courses[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSlipFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock payment slip upload URL
      const mockSlipUrl = slipFile
        ? `https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop`
        : 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop';

      const res = await api.createRegistration({
        fullName,
        email,
        phone,
        dob,
        address,
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
        paymentMethod,
        paymentSlipUrl: mockSlipUrl,
        paymentRef: slipRef || `SLIP-${Math.floor(100000 + Math.random() * 900000)}`,
        amountPaid: selectedCourse.fee
      });

      if (res.success) {
        setRegistrationSubmitted(true);
        onSuccessToast?.('Registration submitted! Awaiting payment verification.');
      }
    } catch (err) {
      alert('Failed to process registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRegistrationSubmitted(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setDob('');
    setAddress('');
    setSlipFile(null);
    setSlipRef('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-teal-900 text-white p-6 relative">
          <button
            onClick={handleReset}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-11 h-11 rounded-full bg-white p-0.5 border border-teal-300 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              <img
                src="/assets/images/helping_hearts_logo_1786214208419.jpg"
                alt="Helping Hearts Logo"
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Student Course Registration</h2>
              <p className="text-xs text-teal-200">Interactive LMS Admission & Manual Payment Verification</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {registrationSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Registration & Payment Slip Submitted!</h3>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Your application for <strong>{selectedCourse?.title}</strong> has been received. Our finance administration will verify your bank slip within 12-24 hours and issue your LMS login credentials.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2 text-xs text-slate-700">
                <p className="font-semibold text-slate-900 border-b pb-1">Application Summary:</p>
                <div className="flex justify-between">
                  <span>Student Name:</span>
                  <span className="font-medium">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selected Course:</span>
                  <span className="font-medium">{selectedCourse?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Course Fee:</span>
                  <span className="font-bold text-teal-800">{selectedCourse?.currency} {(selectedCourse?.fee ?? (selectedCourse as any)?.price ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    Pending Verification
                  </span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 rounded-xl bg-teal-800 text-white font-medium text-sm hover:bg-teal-900"
              >
                Close & Return to Home
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Registration Instructions Banner */}
              <div className="bg-teal-50 border border-teal-200/80 rounded-2xl p-3.5 space-y-1.5 text-xs text-teal-950">
                <p className="font-extrabold text-teal-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-700" /> How Student Registration & LMS Access Works:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                  <div className="bg-white p-2 rounded-xl border border-teal-100 shadow-2xs">
                    <span className="font-bold text-teal-800 block mb-0.5">1. Fill Details & Slip</span>
                    <span className="text-slate-600">Select course, enter contact info & upload bank deposit slip.</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-teal-100 shadow-2xs">
                    <span className="font-bold text-teal-800 block mb-0.5">2. Admin Verification</span>
                    <span className="text-slate-600">Admin reviews bank slip & activates student account status.</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-teal-100 shadow-2xs">
                    <span className="font-bold text-teal-800 block mb-0.5">3. Access LMS Portal</span>
                    <span className="text-slate-600">Log in via "Portal Login" using your registered email.</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Course Choice & Fee */}
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
                <label className="block text-xs font-bold text-teal-900 uppercase mb-1">
                  Selected Program *
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-teal-300 text-sm font-semibold focus:ring-2 focus:ring-teal-600 bg-white"
                  required
                >
                  {courses.map((crs) => (
                    <option key={crs.id} value={crs.id}>
                      {crs.title} - LKR {(crs.fee ?? (crs as any).price ?? 0).toLocaleString()} ({crs.duration})
                    </option>
                  ))}
                </select>

                {selectedCourse && (
                  <div className="mt-3 text-xs text-teal-800 flex flex-wrap items-center justify-between gap-2 border-t border-teal-200/60 pt-2">
                    <span>Lecturer: <strong>{selectedCourse.lecturerName}</strong></span>
                    <span>Schedule: <strong>{selectedCourse.schedule}</strong></span>
                    <span className="text-sm font-bold text-teal-950">
                      Fee: {selectedCourse.currency} {(selectedCourse.fee ?? (selectedCourse as any).price ?? 0).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Step 2: Student Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Student Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Saman Kumara"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. student@helpinghearts.lk"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +94 77 123 4567"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date of Birth *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Home Address *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 123 Main Street, Colombo 03"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {/* Step 3: Bank Transfer Details & Upload & WhatsApp Option */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-teal-800" /> Payment & Verification Method
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    Bank Deposit or WhatsApp
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-white p-3 rounded-xl border border-slate-200 font-mono">
                  <p><strong>Bank:</strong> Commercial Bank of Ceylon</p>
                  <p><strong>Account Name:</strong> Helping Hearts Counselling & Wellness Centre</p>
                  <p><strong>Account No:</strong> 8009 1122 3300</p>
                  <p><strong>Branch:</strong> Cinnamon Gardens Branch</p>
                  <p className="text-emerald-700 font-bold font-sans pt-1"><strong>WhatsApp Hotline:</strong> +94 74 234 4251</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Transaction Ref / Slip No.
                    </label>
                    <input
                      type="text"
                      value={slipRef}
                      onChange={(e) => setSlipRef(e.target.value)}
                      placeholder="e.g. TRX-99881122"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Upload Bank Transfer Slip *
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-800 file:text-white hover:file:bg-teal-900 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">Fast-Track Option: Send Slip via WhatsApp</p>
                    <p className="text-[11px] text-emerald-700">Send your payment receipt directly to our admin team on WhatsApp (+94 74 234 4251) for instant verification.</p>
                  </div>
                  <a
                    href={`https://wa.me/94742344251?text=${encodeURIComponent(
                      `Hi Helping Hearts Admin, I want to submit my payment slip for course registration.\nStudent Name: ${fullName || 'Student'}\nEmail: ${email}\nCourse: ${selectedCourse?.title}\nRef: ${slipRef || 'Pending'}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Send Slip on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Registration...' : 'Submit Registration & Payment Slip'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
