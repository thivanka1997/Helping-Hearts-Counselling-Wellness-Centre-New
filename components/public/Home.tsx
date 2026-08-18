import React from 'react';
import { Heart, Calendar, GraduationCap, ShieldCheck, CheckCircle2, Users, Award, BookOpen, ArrowRight, Phone, Video, Clock, Sparkles, MessageSquare, MapPin, ChevronRight, Target, Eye, Compass, Star, Quote } from 'lucide-react';
import { CounsellingService, Course, Lecturer, EventWorkshop, BlogArticle, GalleryMedia, Testimonial, SiteSettings } from '@/src/types';

interface HomeProps {
  setCurrentView: (view: string) => void;
  onOpenAppointment: () => void;
  onOpenRegister: () => void;
  onSelectCourse: (courseId: string) => void;
  services: CounsellingService[];
  courses: Course[];
  lecturers: Lecturer[];
  events: EventWorkshop[];
  blogs: BlogArticle[];
  gallery: GalleryMedia[];
  testimonials?: Testimonial[];
  settings?: SiteSettings;
}

export const Home: React.FC<HomeProps> = ({
  setCurrentView,
  onOpenAppointment,
  onOpenRegister,
  onSelectCourse,
  services,
  courses,
  lecturers,
  events,
  blogs,
  gallery,
  testimonials = [],
  settings
}) => {
  // CMS-driven content with hardcoded fallbacks
  const heroBadge = settings?.heroBadge || 'Confidential Counselling & Accredited Psychology Education';
  const heroHeadline = settings?.heroHeadline || 'Helping Hearts Counselling & Wellness Centre';
  const heroSubheadline = settings?.heroSubheadline || 'A compassionate sanctuary dedicated to emotional healing, mental resilience, family harmony, and professional diploma education in counselling psychology.';
  const heroCtaPrimary = settings?.heroCtaPrimaryText || 'Book Counselling';
  const heroCtaSecondary = settings?.heroCtaSecondaryText || 'Explore LMS Courses';
  const aboutHeading = settings?.aboutHeading || 'Nurturing Mind, Healing Hearts & Empowering Lives';
  const aboutStory = settings?.aboutStory || 'Helping Hearts Counselling & Wellness Centre was established to provide compassionate, evidence-based psychological services and high-caliber education. Our team comprises senior psychiatrists, clinical psychologists, relationship counsellors, and child therapists.';
  const aboutValues = settings?.aboutValues?.length ? settings.aboutValues : [
    'Strict Client-Student Privacy Isolation',
    'Senior Clinical & Educational Panel',
    'Flexible Physical & Online Sessions',
    'Interactive LMS with Payment Verification'
  ];
  const visionText = settings?.aboutVision || 'Empowering healers, transforming lives through exceptional psychotherapeutic training. Cultivating a world where mental wellness thrives, nurturing holistic well-being for all.';
  const missionText = settings?.aboutMission || 'Leading the way in psychotherapeutic education, we cultivate a community of skilled, empathetic therapists. Our mission is to empower practitioners with cutting-edge expertise, ethics, and tools, driving positive change and fostering mental resilience that transforms lives and communities.';
  const statClients = settings?.statClientsHelped || '1,200+';
  const statStudents = settings?.statStudentsTrained || '1,200+';
  const statLecturers = settings?.statLecturersPanel || '5+';
  const statSatisfaction = settings?.statSatisfactionRate || '99%';
  return (
    <div className="space-y-16 pb-12">
      {/* SECTION 1: HERO */}
      <section className="relative bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 text-white overflow-hidden py-16 lg:py-24 border-b border-teal-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,162,97,0.15),transparent_50%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-800/80 border border-teal-700/80 text-amber-300 text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{heroBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                {heroHeadline.includes('\n') ? (
                  heroHeadline.split('\n').map((line, i) => (
                    <React.Fragment key={i}>{line}{i < heroHeadline.split('\n').length - 1 && <br />}</React.Fragment>
                  ))
                ) : (
                  <>
                    Helping Hearts <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-amber-200 to-amber-300">
                      {heroHeadline.replace('Helping Hearts', '').trim() || 'Counselling & Wellness Centre'}
                    </span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {heroSubheadline}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onOpenAppointment}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-teal-950 font-bold text-base shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5"
                >
                  <Calendar className="w-5 h-5" />
                  <span>{heroCtaPrimary}</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentView('courses');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-white font-semibold text-base border border-teal-600/60 backdrop-blur-xs transition-all flex items-center justify-center gap-2.5"
                >
                  <GraduationCap className="w-5 h-5 text-amber-300" />
                  <span>{heroCtaSecondary}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-teal-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="text-2xl font-black text-amber-300">100%</p>
                  <p className="text-xs text-slate-300">Confidentiality</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-amber-300">{statLecturers}</p>
                  <p className="text-xs text-slate-300">Expert Lecturers</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-amber-300">{statClients}</p>
                  <p className="text-xs text-slate-300">Clients Helped</p>
                </div>
              </div>
            </div>

            {/* Right Feature Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-teal-700/50 shadow-2xl group">
                <img
                  src="/assets/images/helping_hearts_hero_1786205130552.jpg"
                  alt="Helping Hearts Centre Interior"
                  className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Official Circular Logo Badge */}
                <div className="absolute top-4 right-4 z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 border-2 border-amber-400 shadow-xl flex items-center justify-center animate-in zoom-in duration-300">
                  <img
                    src={settings?.logoUrl || "/assets/images/helping_hearts_logo_1786214208419.jpg"}
                    alt="Official Helping Hearts Emblem"
                    className="w-full h-full object-contain rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
                  <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 text-xs space-y-2">
                    <div className="flex items-center justify-between text-amber-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-teal-400" /> Professional Environment
                      </span>
                      <span className="bg-teal-900 text-teal-200 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                        Physical & Online
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs">
                      Wattala sanctuary (Thelangapatha Road) & secure HD video sessions available for remote clients worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT HELPING HEARTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-teal-50/60 rounded-3xl p-8 sm:p-12 border border-teal-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold tracking-widest text-teal-800 uppercase bg-teal-100 px-3 py-1 rounded-full">
              About Helping Hearts
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {aboutHeading}
            </h2>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {aboutStory}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {aboutValues.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-teal-900">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setCurrentView('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-xs"
            >
              Learn More About Our Mission <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-5">
            <img
              src="/assets/images/counselling_session_1786205143705.jpg"
              alt="Counselling Session"
              className="rounded-2xl shadow-md border border-slate-200 object-cover w-full h-64 sm:h-80"
            />
          </div>
        </div>

        {/* Vision, Mission, Objective 3-Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl border border-teal-200 p-6 shadow-xs space-y-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-teal-100 pb-2">Vision</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {visionText}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-amber-100 pb-2">Mission</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {missionText}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-teal-200 p-6 shadow-xs space-y-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-teal-100 pb-2">Objective</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              To deliver exceptional psychotherapeutic training that empowers healers with cutting-edge expertise, ethics, and empathy to transform lives and communities.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: COUNSELLING SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-widest text-teal-800 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Therapeutic Services
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Professional Counselling & Therapy
          </h2>
          <p className="text-slate-600 text-sm">
            Confidential one-on-one, couples, family, and specialized emotional wellness programs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="relative h-44 rounded-xl overflow-hidden mb-3">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 right-3 bg-teal-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {srv.format}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">{srv.category}</span>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                    {srv.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{srv.shortDesc}</p>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700 flex items-center justify-between">
                  <span className="font-medium text-slate-500">Duration:</span>
                  <span className="font-bold text-slate-800">{srv.sessionDuration}</span>
                </div>
              </div>

              <button
                onClick={onOpenAppointment}
                className="mt-5 w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-300" /> Book Appointment
              </button>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => {
              setCurrentView('services');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <span>View All 13 Counselling Services</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </section>

      {/* SECTION 4: FEATURED LMS COURSES */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-amber-400 uppercase bg-teal-900/80 px-3 py-1 rounded-full border border-teal-700">
                Interactive Learning LMS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Diploma & Certificate Courses
              </h2>
            </div>
            <button
              onClick={() => {
                setCurrentView('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-amber-300 hover:text-amber-200 text-sm font-semibold flex items-center gap-1"
            >
              View Full Course Catalog <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((crs) => (
              <div
                key={crs.id}
                className="bg-slate-800 rounded-2xl border border-slate-700 p-5 flex flex-col justify-between hover:border-teal-500 transition-all"
              >
                <div className="space-y-3">
                  <div className="relative h-40 rounded-xl overflow-hidden">
                    <img src={crs.image} alt={crs.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {crs.level}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-2">{crs.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{crs.shortDesc}</p>

                  <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-700/80">
                    <p>Lecturer: <strong className="text-slate-200">{crs.lecturerName}</strong></p>
                    <p>Schedule: <strong className="text-slate-200">{crs.schedule}</strong></p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Course Fee</span>
                    <span className="text-base font-extrabold text-amber-300">
                      {crs.currency || 'LKR'} {(crs.fee ?? (crs as any).price ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectCourse(crs.id)}
                    className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: MEET OUR LECTURERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-widest text-teal-800 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Academic Faculty
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Meet Our Lecturer Panel
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {lecturers.map((lec) => (
            <div
              key={lec.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 text-center hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <img
                  src={lec.photo}
                  alt={lec.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-2 border-teal-600 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <h3 className="text-sm font-bold text-slate-900">{lec.name}</h3>
                <p className="text-[11px] font-semibold text-teal-800 mb-2 leading-tight">{lec.title}</p>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{lec.specialization}</p>
              </div>

              <button
                onClick={() => {
                  setCurrentView('lecturers');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-3 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 text-[11px] font-semibold transition-colors"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: UPCOMING EVENTS & WORKSHOPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-8 text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold tracking-widest text-amber-300 uppercase bg-teal-800/80 px-3 py-1 rounded-full border border-teal-700">
              Community & Learning Events
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Upcoming Workshops & Symposia
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              We regularly organize mental health awareness events, adolescent resilience workshops, and clinical seminars.
            </p>
            {events.slice(0, 1).map((evt) => (
              <div key={evt.id} className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 text-xs space-y-2">
                <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                  {evt.type} • {evt.date}
                </span>
                <h3 className="text-base font-bold text-white">{evt.title}</h3>
                <p className="text-slate-300">{evt.description}</p>
                <p className="text-teal-300 font-semibold">📍 Location: {evt.location}</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5">
            <img
              src="/assets/images/wellness_workshop_1786205155508.jpg"
              alt="Wellness Workshop"
              className="rounded-2xl border border-slate-700 object-cover w-full h-64 shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* SECTION 7: TESTIMONIALS & VOICES OF IMPACT */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold tracking-widest text-teal-800 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              Voices of Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Client &amp; Student Testimonials
            </h2>
            <p className="text-slate-600 text-sm">
              Discover how our therapeutic guidance and diploma education have transformed lives and careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: test.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {test.category && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-100">
                        {test.category}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{test.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-black flex items-center justify-center text-sm overflow-hidden shrink-0 border border-teal-200">
                    {test.photo ? (
                      <img src={test.photo} alt={test.name} className="w-full h-full object-cover" />
                    ) : (
                      test.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">{test.name}</h4>
                    <p className="text-[11px] text-teal-700 font-medium">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 8: CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-4">
        <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-teal-800 text-white rounded-3xl p-10 shadow-xl space-y-4">
          <Heart className="w-12 h-12 text-amber-300 mx-auto fill-amber-300 animate-pulse" />
          <h2 className="text-2xl sm:text-3xl font-black">Begin Your Wellness or Academic Journey Today</h2>
          <p className="text-teal-100 text-sm max-w-xl mx-auto">
            Take the first confidential step towards mental peace or enroll in our professional counselling diploma programs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenAppointment}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md"
            >
              Book a Counselling Session
            </button>
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-950 hover:bg-slate-900 text-white font-bold text-sm border border-teal-700"
            >
              Enroll in LMS Diploma
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
