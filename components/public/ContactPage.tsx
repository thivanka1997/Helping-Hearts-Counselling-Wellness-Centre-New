'use client';
import React, { useState } from 'react';
import { SiteSettings } from '@/src/types';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ShieldCheck, MessageSquare } from 'lucide-react';

interface ContactPageProps {
  settings: SiteSettings;
  onSuccessToast?: (msg: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings, onSuccessToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    onSuccessToast?.('Contact message sent successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-widest text-teal-800 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Contact Helping Hearts
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          We welcome your inquiries regarding counselling appointments, diploma admissions, or organizational wellness partnerships.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Information & Map Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-lg border border-slate-800">
            <h2 className="text-xl font-bold border-b border-slate-800 pb-3">Centre Information</h2>

            <ul className="space-y-4 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Physical Address</strong>
                  <span>{settings.addressPhysical}</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Phone Inquiries</strong>
                  <span>{settings.phonePrimary} / {settings.phoneSecondary}</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">WhatsApp Hotline</strong>
                  <a
                    href="https://wa.me/94742344251?text=Hello%20Helping%20Hearts%20Admin,%20I%20have%20an%20inquiry."
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-bold underline transition-colors"
                  >
                    +94 74 234 4251 (Instant Chat)
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Email Desk</strong>
                  <span>{settings.emailPrimary}</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Hours of Operation</strong>
                  <span>{settings.openingHours}</span>
                </div>
              </li>
            </ul>

            <div className="bg-rose-950/60 p-4 rounded-2xl border border-rose-800/80 text-xs space-y-1">
              <p className="font-bold text-rose-300 uppercase">24/7 Crisis Hotline</p>
              <p className="text-rose-200">{settings.emergencyHelpline}</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-teal-700 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900">Message Delivered</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you for contacting Helping Hearts. Our front desk will respond to your query shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-5 py-2 rounded-xl bg-teal-800 text-white text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Send an Inquiry Message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 ..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject *</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Message *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="How can Helping Hearts assist you today?"
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-300" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
