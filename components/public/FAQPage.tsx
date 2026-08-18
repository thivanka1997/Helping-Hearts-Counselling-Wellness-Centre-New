'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, GraduationCap, Lock, Phone } from 'lucide-react';
import { FAQItem } from '@/src/types';
import { initialFAQs } from '@/src/data/initialData';
import { api } from '@/lib/api-client';

interface FAQPageProps {
  onOpenAppointment: () => void;
  onOpenRegister: () => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onOpenAppointment, onOpenRegister }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFAQs);

  useEffect(() => {
    api.getFAQs().then(setFaqs).catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold tracking-widest text-teal-800 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
          Got Questions?
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-600 text-sm">
          Everything you need to know about our counselling confidentiality and interactive LMS diploma courses.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-teal-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-teal-700 shrink-0" />
                  {item.question}
                </span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-teal-800' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/50">
                  <p className="pt-3">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-teal-50 border border-teal-200 rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-teal-950">Have a Specific Question?</h3>
        <p className="text-xs text-teal-800 max-w-md mx-auto">
          Contact our intake desk directly or book a confidential consultation to discuss your specific needs.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenAppointment}
            className="px-5 py-2.5 rounded-xl bg-teal-800 text-white font-bold text-xs shadow-xs"
          >
            Book Session
          </button>
          <button
            onClick={onOpenRegister}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-xs"
          >
            Student Registration
          </button>
        </div>
      </div>
    </div>
  );
};
