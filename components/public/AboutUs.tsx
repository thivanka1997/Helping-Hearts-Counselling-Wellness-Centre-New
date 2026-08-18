'use client';
import React from 'react';
import { Heart, ShieldCheck, Target, Eye, Compass, Award, CheckCircle2, Users, Briefcase, GraduationCap, MapPin, Calendar, Sparkles, Star, Mail, Phone, BookOpen, Code2, Server, Globe, ExternalLink, Cpu, Database } from 'lucide-react';
import { Lecturer, SiteSettings } from '@/src/types';

interface AboutUsProps {
  lecturers: Lecturer[];
  onOpenAppointment: () => void;
  settings?: SiteSettings;
}

export const AboutUs: React.FC<AboutUsProps> = ({ lecturers, onOpenAppointment, settings }) => {
  // CMS-driven content with hardcoded fallbacks
  const aboutHeading = settings?.aboutHeading || 'Nurturing Mind, Healing Hearts & Empowering Lives';
  const visionText = settings?.aboutVision || 'Empowering healers, transforming lives through exceptional psychotherapeutic training. Cultivating a world where mental wellness thrives, nurturing holistic well-being for all.';
  const missionText = settings?.aboutMission || 'Leading the way in psychotherapeutic education, we cultivate a community of skilled, empathetic therapists. Our mission is to empower practitioners with cutting-edge expertise, ethics, and tools, driving positive change and fostering mental resilience.';
  const statClients = settings?.statClientsHelped || '2,500+';
  const statStudents = settings?.statStudentsTrained || '1,200+';
  const statLecturers = settings?.statLecturersPanel || '12+';
  const statSatisfaction = settings?.statSatisfactionRate || '99%';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-widest text-teal-800 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
          About Our Centre &amp; Leadership
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {aboutHeading}
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Founded and led by Miss Ramsina Farvin Jelaldeen with a steadfast commitment to psychological well-being, clinical excellence, and holistic community empowerment across Sri Lanka.
        </p>
      </div>

      {/* Founder & Director Spotlight Card */}
      <div className="bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-teal-800 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 text-center space-y-3">
            <div className="relative inline-block">
              <img
                src="/assets/images/regenerated_image_1786279526494.png"
                alt="Miss Ramsina Farvin Jelaldeen - Directress & Counselling Psychotherapist"
                className="w-56 h-72 sm:w-64 sm:h-80 rounded-2xl object-cover mx-auto border-4 border-amber-400/90 shadow-2xl transition-transform hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div>
              <h2 className="text-2xl font-black text-white">Miss Ramsina Farvin Jelaldeen</h2>
              <p className="text-xs font-semibold text-amber-300 mt-0.5">Directress | Coun. Psychotherapist | Lecturer | NLP Practitioner</p>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {['Founder & Directress', 'Psychotherapist', 'Academic Lecturer', 'Certified NLP Coach', 'Transformational Coach', 'Hypnosis Practitioner', 'Social Services Facilitator'].map((badge) => (
                <span key={badge} className="bg-teal-800/80 text-teal-100 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-teal-700">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Founder's Vision & Profile
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold leading-tight text-white">
              "Healing Begins When Human Hearts Are Heard Without Judgment"
            </h3>

            <div className="bg-teal-900/40 p-4 rounded-2xl border border-teal-800/50 space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
              <p className="italic">
                "Involvement in work where I can utilize skill and creativity to improve the systems that effectively contribute to the growth of the organization."
              </p>
              <p className="text-slate-300 text-xs">
                A self-motivated and hardworking professional who always strives to achieve the highest standard possible at any given task while maintaining positive relationships. Possesses exceptional communication capabilities with the practical acumen to manage complex psychological cases, fostering mutual respect and collaborative excellence.
              </p>
            </div>

            {/* Memberships & Accreditations Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-amber-400/20 text-center">
                <span className="text-amber-300 font-bold block">APA (USA)</span>
                <span className="text-slate-300 text-[10px]">Member</span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-amber-400/20 text-center">
                <span className="text-amber-300 font-bold block">SRILNAC</span>
                <span className="text-slate-300 text-[10px]">Member</span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-amber-400/20 text-center">
                <span className="text-amber-300 font-bold block">ACCPH (UK)</span>
                <span className="text-slate-300 text-[10px]">Lifetime Accredited</span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-amber-400/20 text-center">
                <span className="text-amber-300 font-bold block">ANZMH (Aus/NZ)</span>
                <span className="text-slate-300 text-[10px]">Mental Health Assoc</span>
              </div>
            </div>

            {/* Core Skills Chips */}
            <div className="pt-1">
              <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Key Competencies & Expertise:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Counselling & Psychotherapy',
                  'Emotional Intelligence',
                  'Public Speaking',
                  'Research & Analysis',
                  'Leadership',
                  'Problem Solving',
                  'Teamwork',
                  'Time Management',
                  'Adaptability'
                ].map((skill) => (
                  <span key={skill} className="bg-slate-900/90 text-slate-200 text-[11px] px-2.5 py-0.5 rounded-md border border-slate-700 font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* APA Certification Banner & Booking */}
            <div className="bg-slate-950/80 rounded-2xl p-4 border border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <Star className="w-5 h-5 fill-slate-950" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-300">Directress of Helping Hearts Counselling & Wellness (Pvt) Ltd</p>
                  <p className="text-[11px] text-slate-300">Lifetime Member NLPEA (UK) • Former SLNIPC Snr Ex.Co. Member</p>
                </div>
              </div>
              <button
                onClick={onOpenAppointment}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shrink-0 transition-colors shadow-xs cursor-pointer"
              >
                Book Session with Directress
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vision, Mission, Objective */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Key Administration & Technical Leadership Section (Bottom of Page) */}
      <div className="space-y-6 pt-4 border-t-2 border-slate-200">
        <div className="border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest bg-teal-100 text-teal-900 px-3 py-1 rounded-full border border-teal-200">
              Institutional Operations & Technology
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2 mt-2">
            <Users className="w-7 h-7 text-teal-800" /> Key Administration & Technical Leadership
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Meet the dedicated leaders steering academic course coordination, student welfare, admissions, and digital systems architecture at Helping Hearts.
          </p>
        </div>

        {/* Course Coordinator Spotlight Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-teal-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 text-center space-y-3">
              <div className="relative inline-block">
                <img
                  src="/assets/images/regenerated_image_1786718038328.jpg"
                  alt="Miss NIRMANI WEERARATHNE - Coordinator"
                  className="w-48 h-60 sm:w-56 sm:h-68 rounded-2xl object-cover mx-auto border-3 border-teal-600 shadow-lg transition-transform hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-2 -right-2 bg-teal-800 text-white p-2 rounded-2xl font-bold text-xs shadow-md flex items-center gap-1">
                  <GraduationCap className="w-4 h-4 text-amber-300" /> Academic Staff
                </div>
              </div>
              
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">Miss NIRMANI WEERARATHNE</h2>
                <p className="text-xs font-bold text-teal-800 mt-0.5 uppercase tracking-wider">Coordinator</p>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-xl p-2.5 text-center">
                <span className="text-[11px] font-bold text-teal-950 block">
                  BACHELOR OF BUSINESS MANAGEMENT IN HRM
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                {['Academic Coordination', 'Student Inquiries', 'Curriculum Logistics', 'Admissions Desk'].map((badge) => (
                  <span key={badge} className="bg-teal-50 text-teal-900 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-teal-200">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-widest bg-teal-100 px-3 py-1 rounded-full border border-teal-200">
                  Course Administration & Student Affairs
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold leading-tight text-slate-900">
                Supporting Every Student's Learning Pathway & Professional Growth
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                As the Coordinator at Helping Hearts Counselling & Wellness Centre, <strong>Miss NIRMANI WEERARATHNE</strong> is committed to facilitating a smooth, high-standard educational experience for all students. Holding a <strong>Bachelor of Business Management in HRM</strong>, she oversees batch scheduling, student orientation, lecture operations, course inquiry assistance, and distribution of essential learning materials.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-teal-50/70 border border-teal-100">
                  <CheckCircle2 className="w-4 h-4 text-teal-800 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Student Inquiries & Admissions</p>
                    <p className="text-slate-600 text-[11px]">Guiding prospective students on course modules, enrollment requirements, and qualification pathways.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-teal-50/70 border border-teal-100">
                  <CheckCircle2 className="w-4 h-4 text-teal-800 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Academic & Resource Support</p>
                    <p className="text-slate-600 text-[11px]">Coordinating lecture schedules, assignments, attendance records, and student learning resources.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 text-xs border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <GraduationCap className="w-4 h-4 text-teal-800" />
                  <span className="font-semibold text-slate-800">Academic Background:</span>
                  <span className="text-teal-900 font-medium">Bachelor of Business Management in HRM</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Mail className="w-4 h-4 text-teal-800" />
                    <a href="mailto:helpingheartscounsellingservic@gmail.com" className="text-teal-900 font-semibold hover:underline">
                      helpingheartscounsellingservic@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Phone className="w-4 h-4 text-teal-800" />
                    <a href="https://wa.me/94742344251" target="_blank" rel="noopener noreferrer" className="text-teal-900 font-semibold hover:underline">
                      0742344251
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Administration & Web Developer Spotlight Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-sky-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 text-center space-y-3">
              <div className="relative inline-block">
                <img
                  src="/assets/images/regenerated_image_1786734800921.png"
                  alt="Mr. G.R Thivanka Randimal - System Administrator & Web Developer"
                  className="w-48 h-60 sm:w-56 sm:h-68 rounded-2xl object-cover mx-auto border-3 border-sky-600 shadow-lg transition-transform hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-2 -right-2 bg-sky-800 text-white p-2 rounded-2xl font-bold text-xs shadow-md flex items-center gap-1">
                  <Code2 className="w-4 h-4 text-amber-300" /> Tech & Systems
                </div>
              </div>
              
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">Mr. G.R Thivanka Randimal</h2>
                <p className="text-xs font-bold text-sky-800 mt-0.5 uppercase tracking-wider">System Administration & Web Developer</p>
              </div>

              <div className="bg-sky-50 border border-sky-200 rounded-xl p-2.5 text-center">
                <span className="text-[11px] font-bold text-sky-950 block">
                  B.SC. IN BUSINESS INFORMATION SYSTEMS (SPECIAL)
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                {['System Administration', 'Web Development', 'LMS Architecture', 'Information Security'].map((badge) => (
                  <span key={badge} className="bg-sky-50 text-sky-900 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-sky-200">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-800 uppercase tracking-widest bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
                  Information Systems & Digital Architecture
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold leading-tight text-slate-900">
                Architecting Secure, High-Performance Digital Infrastructure & Learning Platforms
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <strong>Mr. G.R Thivanka Randimal</strong> spearheads the digital systems architecture, web portal development, and institutional IT operations at Helping Hearts Counselling & Wellness Centre. Holding a specialized degree in <strong>Business Information Systems</strong>, he ensures the continuous reliability of student LMS portals, data integrity, secure appointment scheduling systems, and modern digital engagement tools.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-sky-50/70 border border-sky-100">
                  <Server className="w-4 h-4 text-sky-800 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Systems & Infrastructure Management</p>
                    <p className="text-slate-600 text-[11px]">Managing cloud databases, portal servers, data protection, and enterprise reliability.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-sky-50/70 border border-sky-100">
                  <Globe className="w-4 h-4 text-sky-800 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Web Application & LMS Development</p>
                    <p className="text-slate-600 text-[11px]">Developing interactive student portals, digital courseware delivery, and responsive user experiences.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 text-xs border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <GraduationCap className="w-4 h-4 text-sky-800" />
                  <span className="font-semibold text-slate-800">Academic Background:</span>
                  <span className="text-sky-900 font-medium">B.Sc. in Business Information Systems (Special)</span>
                </div>

                <a
                  href="https://www.linkedin.com/in/thivanka-randimal-premarathna-bb1044224/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-xs transition-all shadow-xs hover:shadow-md cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 fill-white" />
                  <span>Connect on LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

