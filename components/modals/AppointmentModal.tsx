'use client';
import React, { useState } from 'react';
import { X, Calendar, Clock, ShieldCheck, CheckCircle2, Phone, User, Mail, MessageSquare, Send } from 'lucide-react';
import { CounsellingService } from '@/src/types';
import { api } from '@/lib/api-client';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: CounsellingService[];
  preselectedServiceId?: string;
  onSuccessToast?: (msg: string) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  services,
  preselectedServiceId,
  onSuccessToast
}) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceId, setServiceId] = useState(preselectedServiceId || services[0]?.id || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [sessionType, setSessionType] = useState<'Physical' | 'Online'>('Physical');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const selectedSrv = services.find((s) => s.id === serviceId);
  const adminWhatsAppNumber = '+94 74 234 4251';
  const whatsappCleanNumber = '94742344251';

  const getDirectWhatsAppUrl = () => {
    const text = `Hello Helping Hearts Admin,\nI would like to book a counselling appointment.\nService: ${selectedSrv ? selectedSrv.title : 'General Counselling'}\nName: ${fullName || 'Client'}\nPhone: ${phone || 'Not provided'}\nPreferred Date: ${preferredDate || 'Flexible'}\nType: ${sessionType}`;
    return `https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert('Please accept the confidentiality consent to proceed.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.createAppointment({
        fullName,
        email,
        phone,
        serviceId,
        serviceTitle: selectedSrv ? selectedSrv.title : 'General Counselling',
        preferredDate,
        preferredTime,
        sessionType,
        notes
      });

        if (res.success && res.appointment) {
          setSubmittedRef(res.appointment.referenceNo);
          onSuccessToast?.(`Inquiry Submitted! Ref No: ${res.appointment.referenceNo}`);
        }
    } catch (err) {
      alert('Failed to submit appointment request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedRef(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setPreferredDate('');
    setNotes('');
    setConsent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-teal-900 text-white p-6 relative">
          <button
            onClick={handleReset}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
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
              <h2 className="text-xl font-bold tracking-tight">Book a Counselling Session</h2>
              <p className="text-xs text-teal-200">Confidential Inquiry • Direct WhatsApp: {adminWhatsAppNumber}</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {submittedRef ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Appointment Request Received</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you for reaching out to Helping Hearts. Our intake desk will review your request and contact you within 24 hours to confirm your scheduled time.
              </p>
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 max-w-xs mx-auto">
                <p className="text-xs text-teal-700 font-semibold uppercase">Reference Number</p>
                <p className="text-lg font-mono font-bold text-teal-900 tracking-wider">{submittedRef}</p>
              </div>

              {/* Fast-Track WhatsApp Button */}
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2 max-w-md mx-auto text-left">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fast-Track Confirmation on WhatsApp</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Want instant confirmation? Send your reference number directly via WhatsApp: <strong>{adminWhatsAppNumber}</strong>
                </p>
                <a
                  href={`https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent(
                    `Hello Helping Hearts Admin,\nI have just submitted a counselling appointment request.\nReference No: ${submittedRef}\nName: ${fullName}\nPhone: ${phone}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-amber-300" />
                  <span>Send Ref No. on WhatsApp ({adminWhatsAppNumber})</span>
                </a>
              </div>

              <button
                onClick={handleReset}
                className="mt-2 px-6 py-2.5 rounded-xl bg-teal-800 text-white font-medium text-sm hover:bg-teal-900 cursor-pointer"
              >
                Done & Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Direct WhatsApp Callout Banner */}
              <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">Instant Direct WhatsApp Booking</span>
                    <span className="text-[11px] text-emerald-800 block">WhatsApp Hotline: <strong>{adminWhatsAppNumber}</strong></span>
                  </div>
                </div>
                <a
                  href={getDirectWhatsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Privacy Isolation Notice */}
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  <strong>Strict Privacy Guarantee:</strong> Your information is kept strictly confidential and accessible ONLY by authorized counselling administrators. It will never be linked to student LMS records.
                </p>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Select Counselling Service *
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-hidden bg-white"
                  required
                >
                  {services.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.title} ({srv.format})
                    </option>
                  ))}
                </select>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Nimali Jayawardena"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

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
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. nimali@gmail.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {/* Date, Time & Format */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Preferred Time *</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-hidden bg-white"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Session Type *</label>
                  <select
                    value={sessionType}
                    onChange={(e) => setSessionType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-hidden bg-white"
                  >
                    <option value="Physical">In-Person (Colombo)</option>
                    <option value="Online">Online Video Session</option>
                  </select>
                </div>
              </div>

              {/* Inquiry Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Brief Inquiry / Reason for Counselling (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Share any background details you wish us to prepare for..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                ></textarea>
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="consent-check"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-600"
                  required
                />
                <label htmlFor="consent-check" className="text-xs text-slate-600 leading-snug cursor-pointer">
                  I consent to Helping Hearts contacting me confidentially regarding my counselling inquiry. I understand my personal information will be kept strictly private.
                </label>
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-3">
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
                  className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-sm font-semibold shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Request...' : 'Submit Confidential Inquiry'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
