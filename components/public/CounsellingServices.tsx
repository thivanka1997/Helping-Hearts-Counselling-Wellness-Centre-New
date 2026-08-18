'use client';
import React, { useState } from 'react';
import { CounsellingService } from '@/src/types';
import { Calendar, CheckCircle2, Clock, ShieldCheck, Video, MapPin, Sparkles, Search, Brain, Heart, Sparkle, Activity, Layers, HelpCircle, ChevronDown, UserCheck, Lock, MessageSquare } from 'lucide-react';

interface CounsellingServicesProps {
  services: CounsellingService[];
  onOpenAppointmentWithService: (serviceId: string) => void;
}

export const CounsellingServices: React.FC<CounsellingServicesProps> = ({
  services,
  onOpenAppointmentWithService
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Extract categories dynamically
  const categories = ['All', ...Array.from(new Set((services || []).map((s) => s?.category))).filter((c): c is string => Boolean(c))];

  const filteredServices = (services || []).filter((srv) => {
    if (!srv) return false;
    const matchesCategory =
      selectedCategory === 'All' ? true : srv.category === selectedCategory;
    const term = (searchTerm || '').toLowerCase();
    const matchesSearch =
      (srv.title || '').toLowerCase().includes(term) ||
      (srv.shortDesc || '').toLowerCase().includes(term) ||
      (srv.fullDesc || '').toLowerCase().includes(term) ||
      (srv.category || '').toLowerCase().includes(term) ||
      (srv.benefits || []).some((b) => (b || '').toLowerCase().includes(term));

    return matchesCategory && matchesSearch;
  });

  const therapeuticModalities = [
    {
      title: 'Cognitive Behavioral Therapy (CBT)',
      desc: 'Scientific restructuring of negative cognitive distortions, panic responses, obsessive thoughts, and mood disorders.',
      icon: Brain,
      badge: 'Gold Standard CBT'
    },
    {
      title: 'BDD & Somatic Image Therapy',
      desc: 'Specialized protocol for body dysmorphic disorder, perceived physical flaws, mirror checking, and somatic anxiety.',
      icon: Activity,
      badge: 'Published Clinical Protocol'
    },
    {
      title: 'EMDR & Trauma-Informed Care',
      desc: 'Gentle, structured reprocessing of past emotional trauma, complex grief, PTSD, and somatic nervous system regulation.',
      icon: Heart,
      badge: 'Trauma Reprocessing'
    },
    {
      title: 'Neuro-Linguistic Programming (NLP)',
      desc: 'Subconscious belief reframing, emotional anchor installation, rapid phobia cure, and mindset alignment.',
      icon: Sparkles,
      badge: 'Mindset Transformation'
    },
    {
      title: 'Expressive Art & Play Therapy',
      desc: 'Creative non-verbal therapeutic channels for children, adolescents, and adults processing deep-seated emotions.',
      icon: Layers,
      badge: 'Expressive Arts'
    },
    {
      title: 'Person-Centered Psychotherapy',
      desc: 'Empathetic, non-judgmental therapeutic alliance empowering self-actualization and personal sovereignty.',
      icon: UserCheck,
      badge: 'Humanistic Care'
    }
  ];

  const faqs = [
    {
      q: 'What is the difference between general counseling and specialized therapeutic services?',
      a: 'General counseling provides supportive guidance for life transitions, stress, and grief. Specialized therapeutic services (such as CBT, EMDR, BDD Somatic Therapy, and NLP) use structured, evidence-based clinical protocols designed to treat specific psychological conditions, trauma, phobias, and deep-seated cognitive patterns.'
    },
    {
      q: 'Are my therapeutic session records completely confidential?',
      a: 'Yes, absolutely. All client records at Helping Hearts Counselling & Wellness Centre are strictly protected by HIPAA-standard confidentiality guidelines and kept completely separate from educational student records. Information is never shared without your written consent.'
    },
    {
      q: 'Can I attend therapeutic sessions online via video call?',
      a: 'Yes! Most of our therapeutic services (including CBT, BDD therapy, individual counseling, and NLP mindset coaching) are offered both in-person at our Wattala/Colombo center and via encrypted, HD video consultation for clients across Sri Lanka and overseas.'
    },
    {
      q: 'How many sessions will I need?',
      a: 'During your initial intake assessment, your therapist will evaluate your goals and outline a personalized treatment plan. Many clients experience meaningful breakthroughs within 4 to 8 structured sessions.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title & Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-teal-700" /> Professional Clinical Care & Psychotherapy
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Counselling & <span className="text-teal-800 underline decoration-amber-400 decoration-4">Therapeutic Services</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Evidence-based psychological therapy, individual counseling, and specialized clinical treatments delivered by certified psychologists and licensed psychotherapists in Wattala/Colombo and online worldwide.
        </p>
      </div>

      {/* Featured Therapeutic Services Highlight Banner */}
      <div className="relative bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden border border-teal-800/80">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Clinical Expertise
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Specialized Therapeutic Interventions & Clinical Psychotherapy
            </h2>
            <p className="text-teal-100 text-xs sm:text-sm leading-relaxed">
              Facing persistent anxiety, body dissatisfaction (BDD), trauma, phobias, or relationship stress? Our evidence-based therapeutic programs utilize Cognitive Behavioral Therapy (CBT), Somatic Grounding, EMDR, and NLP to facilitate deep emotional healing.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-teal-200">
              <span className="flex items-center gap-1 bg-teal-800/60 px-3 py-1.5 rounded-xl border border-teal-700">
                <Lock className="w-3.5 h-3.5 text-amber-300" /> 100% Confidential
              </span>
              <span className="flex items-center gap-1 bg-teal-800/60 px-3 py-1.5 rounded-xl border border-teal-700">
                <MapPin className="w-3.5 h-3.5 text-amber-300" /> In-Person & Online
              </span>
              <span className="flex items-center gap-1 bg-teal-800/60 px-3 py-1.5 rounded-xl border border-teal-700">
                <UserCheck className="w-3.5 h-3.5 text-amber-300" /> Certified Psychologists
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <Brain className="w-4 h-4" /> Comprehensive Counseling Spectrum
            </h3>
            <ul className="space-y-2 text-xs text-teal-50">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Individual & Stress Management</strong> (Anxiety, Depression, Burnout)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Youth & Student Mental Health</strong> (Child, Adolescent, Exam Stress)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Relationship & Parenting Guidance</strong> (Couples, Family, Career)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Mindfulness & Art Therapy</strong> (Substance Recovery, Art & Crafts)</span>
              </li>
            </ul>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setSelectedCategory('All')}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" /> View All 13 Services
              </button>
              <a
                href="https://wa.me/94742344251?text=Hello%20Helping%20Hearts%20Admin,%20I%20would%20like%20to%20book%20a%20counselling%20session."
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-amber-300" /> WhatsApp (+94 74 234 4251)
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Navigation */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search therapeutic services, CBT, BDD, trauma..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600 outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => {
            const count = cat === 'All' ? services.length : services.filter((s) => s.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedCategory === cat ? 'bg-teal-900 text-teal-200' : 'bg-slate-200 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-slate-700 font-bold text-sm">No counselling or therapeutic service found matching your filter.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchTerm('');
            }}
            className="px-4 py-2 bg-teal-800 text-white text-xs font-bold rounded-xl hover:bg-teal-900"
          >
            Clear Filters & View All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {srv.category === 'Therapeutic Services' && (
                      <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-slate-950" /> Clinical Modality
                      </span>
                    )}
                    <span className="bg-teal-900/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                      {srv.format}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block mb-1">
                      {srv.category}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 leading-snug">{srv.title}</h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{srv.fullDesc}</p>

                  <div className="space-y-1.5 pt-3 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-teal-700" /> Key Session Benefits:
                    </p>
                    <ul className="space-y-1">
                      {(srv.benefits || []).map((b, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100/80 mt-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-1 font-medium text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-teal-700" /> Duration:
                  </span>
                  <span className="font-bold text-slate-900">{srv.sessionDuration}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenAppointmentWithService(srv.id)}
                    className="py-2.5 px-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-300" /> Book Form
                  </button>
                  <a
                    href={`https://wa.me/94742344251?text=${encodeURIComponent(
                      `Hello Helping Hearts Admin,\nI would like to book a session for: ${srv.title}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-300" /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clinical Therapeutic Modalities Showcase */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100/80 px-3 py-1 rounded-full">
            Clinical Approaches & Evidence-Based Frameworks
          </span>
          <h2 className="text-2xl font-black text-slate-900">Therapeutic Modalities Used in Treatment</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Our clinical team integrates multi-disciplinary therapeutic frameworks tailored to your unique psychological profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {therapeuticModalities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Frequently Asked Questions regarding Therapeutic Services */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-slate-900 flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-teal-800" /> Frequently Asked Questions about Therapeutic Sessions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Everything you need to know about starting your confidential therapeutic journey with Helping Hearts.
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-slate-200">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full text-left font-bold text-slate-900 text-sm flex items-center justify-between gap-2 py-1 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${openFaqIndex === idx ? 'rotate-180 text-teal-800' : ''}`}
                />
              </button>
              {openFaqIndex === idx && (
                <p className="text-xs text-slate-600 pt-2 leading-relaxed pl-1 border-l-2 border-teal-700 mt-1">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

