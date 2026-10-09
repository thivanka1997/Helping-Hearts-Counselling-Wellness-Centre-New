'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  CheckCircle2,
  Phone,
  Sparkles,
  ShieldCheck,
  Award,
  BookOpen,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Clock,
  Heart,
  User,
  MapPin,
  Mail,
  GraduationCap
} from 'lucide-react';

const SRI_LANKA_DISTRICTS = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Batticaloa',
  'Ampara',
  'Trincomalee',
  'Kurunegala',
  'Puttalam',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Monaragala',
  'Ratnapura',
  'Kegalle'
];

export default function FreeGuideLandingPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    district: '',
    medium: 'Sinhala',
    counsellingInterest: 'Yes, definitely',
    learningMode: 'Online',
    source: 'Facebook Group'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please enter your WhatsApp contact number.');
      return;
    }
    if (!formData.district) {
      setErrorMessage('Please select your district.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit form.');
      }

      setWhatsappUrl(data.whatsappUrl || 'https://wa.me/94742344251');
      setIsSubmitted(true);

      // Trigger automatic download via Google Drive redirect
      window.open('/api/guide/download', '_blank');
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Brand Header */}
        <div className="text-center space-y-3">

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Pathways to Becoming a Psychological Counselor
            <span className="block text-lg sm:text-2xl lg:text-3xl font-bold text-amber-300 mt-2">
              මනෝවිද්‍යා උපදේශකයෙකු වීමේ මංපෙත්
            </span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A comprehensive practical guide crafted by our counselling faculty under Directress{' '}
            <strong className="text-amber-300">Miss Ramsina Farvin Jelaldeen</strong>. Explore core counselling skills,
            therapeutic ethics, active listening techniques, and psychology career pathways.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
            <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> APA (USA) & ACCPH (UK) Faculty
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-400" /> Sinhala, Tamil & English
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-amber-400" /> 100% Free Instant Download
            </span>
          </div>
        </div>

        {/* Content & Form Container */}
        {!isSubmitted ? (
          <div className="bg-slate-950/90 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

              {/* Left Column: What's inside the guide */}
              <div className="md:col-span-5 space-y-5">
                <div className="bg-gradient-to-br from-teal-950/80 to-slate-900 p-5 rounded-2xl border border-teal-800/60 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold text-xs shadow-md shrink-0">
                      PDF GUIDE
                    </div>
                    <div>
                      <h2 className="font-black text-white text-sm">Official Counselling Study Handbook</h2>
                      <p className="text-[11px] text-teal-300">Helping Hearts Academic Publication</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-teal-800/40">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Introduction to counselling</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Identification of mental illnesses</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Counselling skills training</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Awareness of counselling ethics</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Psychotherapist training</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Counseling interventions for Addictions</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Training on caring for inpatient mental patients</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>How to conduct counselling while resolving language problems that arise during counselling</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Awareness of the laws required during counselling and much more...</span>
                    </div>
                  </div>
                </div>

                {/* Faculty Spotlight Note */}
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
                  <img
                    src="/assets/images/regenerated_image_1786279526494.png"
                    alt="Miss Ramsina Farvin Jelaldeen"
                    className="w-12 h-14 rounded-xl object-cover border border-amber-400 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop';
                    }}
                  />
                  <div>
                    <p className="font-bold text-slate-200">Miss Ramsina Farvin Jelaldeen</p>
                    <p className="text-[11px] text-amber-300">Directress & Consultant Psychotherapist</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">APA (USA) • ACCPH (UK) • ANZMH (Aus/NZ)</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Lead Form */}
              <div className="md:col-span-7 space-y-5">
                <div>
                  <h2 className="text-xl font-black text-white">Get Your Free Copy Now</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Please provide your details below to receive the download link and WhatsApp consultation access.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-semibold">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {/* 1. Full Name */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-200">
                      1. Full Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Asra Fernando"
                        className="w-full pl-9 pr-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* 2. WhatsApp Number */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-200">
                      2. WhatsApp Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 074 234 4251 or +94 7X XXX XXXX"
                        className="w-full pl-9 pr-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      We will share session schedules and admissions updates via WhatsApp.
                    </span>
                  </div>

                  {/* 3. Email Address (Optional) */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-200">
                      3. Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. yourname@gmail.com"
                        className="w-full pl-9 pr-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* 4. District */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-200">
                      4. District <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        required
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
                      >
                        <option value="">Select your district...</option>
                        {SRI_LANKA_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 5. Preferred Medium */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-200">
                      5. Preferred Medium <span className="text-rose-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Sinhala', 'Tamil', 'English'].map((m) => (
                        <label
                          key={m}
                          className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-all text-xs flex items-center justify-center gap-1.5 ${
                            formData.medium === m
                              ? 'bg-amber-400 text-slate-950 border-amber-400'
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                          }`}
                        >
                          <input
                            type="radio"
                            name="medium"
                            value={m}
                            checked={formData.medium === m}
                            onChange={() => setFormData({ ...formData, medium: m as any })}
                            className="sr-only"
                          />
                          <span>{m}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 6. Are you interested in Counselling Training? */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-200">
                      6. Are you interested in Counselling Training? <span className="text-rose-400">*</span>
                    </label>
                    <div className="space-y-2">
                      {[
                        'Yes, definitely',
                        'Maybe / Need more information',
                        'Just interested in the guide'
                      ].map((opt) => (
                        <label
                          key={opt}
                          className={`p-3 rounded-xl border block font-medium cursor-pointer transition-all text-xs flex items-center gap-2.5 ${
                            formData.counsellingInterest === opt
                              ? 'bg-teal-900/60 text-white border-teal-500'
                              : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
                          }`}
                        >
                          <input
                            type="radio"
                            name="counsellingInterest"
                            value={opt}
                            checked={formData.counsellingInterest === opt}
                            onChange={() => setFormData({ ...formData, counsellingInterest: opt })}
                            className="text-amber-500"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 7. Preferred learning mode */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-200">
                      7. Preferred Learning Mode <span className="text-rose-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Online', 'Physical', 'Both'].map((mode) => (
                        <label
                          key={mode}
                          className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-all text-xs flex items-center justify-center gap-1.5 ${
                            formData.learningMode === mode
                              ? 'bg-amber-400 text-slate-950 border-amber-400'
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                          }`}
                        >
                          <input
                            type="radio"
                            name="learningMode"
                            value={mode}
                            checked={formData.learningMode === mode}
                            onChange={() => setFormData({ ...formData, learningMode: mode })}
                            className="sr-only"
                          />
                          <span>{mode}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 8. How did you find us? */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-200">
                      8. How did you find us? <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
                    >
                      <option value="Facebook Group">Facebook Group</option>
                      <option value="Facebook Page">Facebook Page</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Friend / Referral">Friend / Referral</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base shadow-xl hover:shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-60"
                    >
                      <Download className="w-5 h-5 shrink-0" />
                      <span>{isSubmitting ? 'Preparing Your PDF Guide...' : 'Submit & Download Free Guide (PDF)'}</span>
                    </button>
                    <p className="text-[11px] text-slate-500 text-center mt-2">
                      🔒 Your details are 100% confidential and protected by Helping Hearts Privacy Policy.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* THANK YOU SCREEN                                                */
          /* ============================================================== */
          <div className="bg-slate-950 rounded-3xl border border-teal-700 p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
              ❤️
            </div>

            <div className="space-y-3 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Thank you for your interest in Helping Hearts Counselling & Wellness Centre. ❤️
              </h2>
              <p className="text-base sm:text-lg text-emerald-300 font-bold">
                Your counselling guide is ready.
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We have also shared your inquiry with our academic faculty. If your download did not start automatically, please click the button below.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="/api/guide/download"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Download className="w-5 h-5" />
                <span>Download Counselling Guide (PDF)</span>
              </a>

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Send Details to Ms. Ramsina on WhatsApp</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="pt-6 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span>Coordinator (Nirmani): 074 234 4251</span>
              <Link href="/courses" className="text-amber-400 hover:underline font-bold flex items-center gap-1">
                <span>Explore Diploma & Certificate Programmes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
