'use client';
import React, { useState } from 'react';
import { BookOpen, Download, Search, GraduationCap, Users, ShieldCheck, Calendar, KeyRound, FileText, Printer, CheckCircle2, HelpCircle, ExternalLink, Phone, Video, CreditCard, Lock, Layers, Sparkles } from 'lucide-react';

export const AdminUserGuide: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'ALL' | 'STUDENT' | 'LECTURER' | 'CLIENT' | 'ADMIN'>('ALL');
  const [activeAccordion, setActiveAccordion] = useState<string | null>('student-enrollment');

  const guideSections = [
    {
      id: 'student-enrollment',
      role: 'STUDENT',
      icon: GraduationCap,
      color: 'text-teal-700 bg-teal-50 border-teal-200',
      title: '🎓 Student Enrollment & Payment Slip Process',
      summary: 'Step-by-step instructions for students enrolling in Diploma and Certificate courses.',
      steps: [
        {
          step: 1,
          title: 'Browse & Select Course',
          description: 'Students click "Diplomas & Courses" from the top navigation or home page, pick their desired course (e.g. Higher Diploma in Counseling Psychology), and click "Enroll Now".'
        },
        {
          step: 2,
          title: 'Complete Registration Form',
          description: 'Fill in full name, email, phone number, date of birth, home address, and payment method details.'
        },
        {
          step: 3,
          title: 'Bank Transfer & Slip Upload',
          description: 'Make a bank deposit or online transfer to Helping Hearts institute bank account, take a screenshot or photo of the receipt, and upload it in the registration modal.'
        },
        {
          step: 4,
          title: 'Admin Verification & Activation',
          description: 'The System Administrator reviews the uploaded payment slip in the "Student Slips" tab. Upon approval, student LMS account is activated and access credentials are created.'
        },
        {
          step: 5,
          title: 'LMS Portal Sign In',
          description: 'Student clicks "Portal Login" on top right, selects "Student Portal", logs in with registered email, and gains instant access to video lectures, PDF notes, and attendance tracking.'
        }
      ]
    },
    {
      id: 'student-lms-usage',
      role: 'STUDENT',
      icon: BookOpen,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      title: '📚 Student LMS & Course Viewer Navigation',
      summary: 'How registered students access learning materials, Zoom classes, and track progress.',
      steps: [
        {
          step: 1,
          title: 'Accessing Enrolled Courses',
          description: 'Inside Student Portal, enrollees see active courses with progress bar indicators (% completed).'
        },
        {
          step: 2,
          title: 'Watching HD Video Lectures',
          description: 'Click on any course module to open the interactive video player with HD video streaming and lesson descriptions.'
        },
        {
          step: 3,
          title: 'Downloading Lecture Notes (PDF)',
          description: 'Lecturer notes and PDF guides are listed under course resources for one-click downloading.'
        },
        {
          step: 4,
          title: 'Joining Live Zoom Classes',
          description: 'When a live session is scheduled, click the "Join Live Zoom Class" button directly inside the course viewer.'
        },
        {
          step: 5,
          title: 'Tracking Attendance & Completion',
          description: 'Mark lessons as complete as you finish them. View your official attendance record logged by faculty.'
        }
      ]
    },
    {
      id: 'lecturer-portal',
      role: 'LECTURER',
      icon: Users,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
      title: '👨‍🏫 Lecturer & Faculty Member Guide',
      summary: 'Instructions for lecturers to manage assigned subjects, upload notes, and mark attendance.',
      steps: [
        {
          step: 1,
          title: 'Faculty Portal Sign In',
          description: 'Select "Lecturer Portal" in the Portal Login window. Use your assigned faculty email or demo account.'
        },
        {
          step: 2,
          title: 'Managing Assigned Courses',
          description: 'View courses assigned to you by the institute administration (e.g. Cognitive Behavioral Therapy, Child Psychology).'
        },
        {
          step: 3,
          title: 'Publishing PDF Notes & Study Materials',
          description: 'Upload PDF lecture slides, assignment sheets, and supplementary reading materials for student download.'
        },
        {
          step: 4,
          title: 'Setting Live Zoom Lecture Links',
          description: 'Post scheduled Zoom meeting links and lecture times directly to the student portal.'
        },
        {
          step: 5,
          title: 'Recording Student Attendance',
          description: 'Use the interactive Attendance Register to mark enrolled students as "Present", "Absent", or "Excused".'
        }
      ]
    },
    {
      id: 'counselling-appointments',
      role: 'CLIENT',
      icon: Calendar,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      title: '🧠 Counselling Client Inquiry & Appointment Booking',
      summary: 'How clients request confidential therapy sessions and receive updates.',
      steps: [
        {
          step: 1,
          title: 'Click "Book Counselling"',
          description: 'Clients click the highlighted "Book Counselling" button in the header bar or anywhere on the website.'
        },
        {
          step: 2,
          title: 'Select Speciality & Counsellor',
          description: 'Choose from Individual Therapy, Marriage & Couples, Child & Adolescent, Anxiety, or Career Guidance.'
        },
        {
          step: 3,
          title: 'Choose Session Type & Schedule',
          description: 'Select "In-Person (Colombo Centre)" or "Online Video Call", plus preferred date and time slot.'
        },
        {
          step: 4,
          title: 'Confidential Request Submission',
          description: 'Submit contact details and optional private notes. A unique Reference Number (e.g. REF-2026-9081) is generated immediately.'
        },
        {
          step: 5,
          title: 'Desk Officer Confirmation',
          description: 'Helping Hearts Counselling Desk reviews the request and contacts the client discreetly via Phone/WhatsApp or Email.'
        }
      ]
    },
    {
      id: 'admin-management',
      role: 'ADMIN',
      icon: ShieldCheck,
      color: 'text-amber-800 bg-amber-50 border-amber-200',
      title: '🔐 Administrator Portal Operations & System Rules',
      summary: 'Complete system administration, payment slip verification, course creation, and CMS control.',
      steps: [
        {
          step: 1,
          title: 'Verifying Student Payment Slips',
          description: 'Navigate to "Student Slips" tab. Inspect bank receipt image, verify payment reference, and click "Approve Registration & Grant LMS Access" or "Reject".'
        },
        {
          step: 2,
          title: 'Creating & Editing LMS Courses',
          description: 'In "LMS Courses" tab, add new diploma programs, assign faculty lecturers, upload syllabus images, and manage modules/lessons.'
        },
        {
          step: 3,
          title: 'Managing Lecturer Accounts',
          description: 'In "Lecturer Profiles" tab, create new faculty members, upload profile pictures, set bio/credentials, and assign teaching subjects.'
        },
        {
          step: 4,
          title: 'Managing Website CMS & Emergency Helpline',
          description: 'In "Site CMS" tab, update institute contact details, 24/7 Emergency Helpline number (e.g. 1333), banner announcements, upcoming events, and psychology blog posts.'
        },
        {
          step: 5,
          title: 'Media Library & Database Export',
          description: 'Upload banner images to the Media Library and view/copy full MySQL relational database scripts in "Database Docs".'
        }
      ]
    }
  ];

  const filteredSections = guideSections.filter((sec) => {
    const matchesRole = selectedRole === 'ALL' || sec.role === selectedRole;
    const matchesSearch =
      sec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.steps.some(
        (s) =>
          s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesRole && matchesSearch;
  });

  const handleDownloadPDFManual = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Helping Hearts Counselling & LMS - Official System User Guide</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 40px; color: #0f172a; line-height: 1.6; }
            h1 { color: #115e59; font-size: 26px; margin-bottom: 5px; border-bottom: 2px solid #115e59; padding-bottom: 10px; }
            .subtitle { font-size: 14px; color: #475569; margin-bottom: 30px; }
            .section { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin-bottom: 25px; page-break-inside: avoid; }
            .section-title { color: #0f766e; font-size: 18px; margin-top: 0; margin-bottom: 8px; font-weight: bold; }
            .section-summary { font-size: 13px; color: #334155; margin-bottom: 15px; font-style: italic; }
            .step-item { background: #ffffff; border-left: 4px solid #0d9488; padding: 10px 15px; margin-bottom: 10px; border-radius: 0 8px 8px 0; }
            .step-num { font-weight: bold; color: #0f766e; }
            .step-title { font-weight: bold; color: #0f172a; margin-left: 5px; }
            .step-desc { font-size: 12px; color: #475569; margin-top: 4px; }
            .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <h1>HELPING HEARTS COUNSELLING & WELLNESS CENTRE</h1>
          <div class="subtitle">Official System & LMS User Operating Manual | Version 2.4 | Generated on ${new Date().toLocaleDateString()}</div>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
            <strong style="color: #166534;">System Overview:</strong> This document serves as the complete operational guide and User Interface (UI) blueprint for Students, Lecturers, Counselling Clients, and System Administrators using the Helping Hearts web application and Learning Management System (LMS).
          </div>

          <h2 style="color: #0f766e; border-bottom: 2px solid #0f766e; padding-bottom: 5px; margin-top: 30px;">VISUAL USER INTERFACE (UI) SCREENSHOT MAPS & MOCKUPS</h2>
          <p style="font-size: 12px; color: #475569; margin-bottom: 20px;">The following visual UI mockups illustrate the exact user interface component layouts for Students, Lecturers, Counselling Clients, and System Administrators across the web application and LMS.</p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 35px; page-break-inside: avoid;">
            <!-- UI Screenshot Mockup 1 -->
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 13px; font-weight: bold; color: #115e59; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
                🖥️ 1. Public Navigation & Header UI
              </div>
              <div style="background: #0f172a; color: #fef08a; font-size: 10px; padding: 6px 10px; border-radius: 6px; display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 8px;">
                <span>📞 24/7 Emergency Helpline: 1333</span>
                <span>📅 Book Counselling | 🔒 Portal Login</span>
              </div>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; color: #115e59; font-size: 11px;">❤️ HELPING HEARTS</span>
                <div style="font-size: 9px; color: #475569; font-weight: 600;">
                  <span style="margin-right: 6px;">Home</span>
                  <span style="margin-right: 6px;">Diplomas</span>
                  <span style="margin-right: 6px;">Lecturers</span>
                  <span style="margin-right: 6px;">Blog</span>
                  <span>Contact</span>
                </div>
              </div>
              <div style="font-size: 10px; color: #64748b; margin-top: 8px; line-height: 1.4;">
                <strong>UI Highlights:</strong> Responsive header with emergency contact access, direct links to course catalogs, and separate triggers for client counselling and LMS portal login.
              </div>
            </div>

            <!-- UI Screenshot Mockup 2 -->
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 13px; font-weight: bold; color: #115e59; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
                🎓 2. Student Enrollment & Payment Slip UI
              </div>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 8px; font-size: 10px; font-weight: bold; color: #166534; margin-bottom: 8px;">
                Course: Higher Diploma in Counselling Psychology (LKR 85,000)
              </div>
              <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px; font-size: 9px; color: #334155;">
                <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 4px; margin-bottom: 4px; border-radius: 4px;">Full Name: [ Student Name Input ]</div>
                <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 4px; margin-bottom: 6px; border-radius: 4px;">Email Address: [ student@email.com ]</div>
                <div style="border: 2px dashed #0d9488; background: #ccfbf1; padding: 8px; text-align: center; border-radius: 6px; color: #115e59; font-weight: bold;">
                  📎 Drag & Drop Bank Slip Receipt Image
                </div>
              </div>
              <div style="font-size: 10px; color: #64748b; margin-top: 8px; line-height: 1.4;">
                <strong>UI Highlights:</strong> Modal dialog with course details, student contact inputs, and drag-and-drop file uploader for bank deposit receipt verification.
              </div>
            </div>

            <!-- UI Screenshot Mockup 3 -->
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 13px; font-weight: bold; color: #115e59; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
                📺 3. Student LMS Course Player & Notes UI
              </div>
              <div style="background: #0f172a; color: #ffffff; height: 60px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; margin-bottom: 8px;">
                ▶ HD Video Stream | Module 01: CBT Principles & Applications
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9px;">
                <span style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-weight: bold;">📄 CBT_Lecture_Slides.pdf</span>
                <span style="background: #2563eb; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: bold;">📹 Join Live Zoom Class</span>
              </div>
              <div style="font-size: 10px; color: #64748b; margin-top: 8px; line-height: 1.4;">
                <strong>UI Highlights:</strong> Enrolled student workspace with HD video lesson player, downloadable PDF study materials, and direct live Zoom lecture access.
              </div>
            </div>

            <!-- UI Screenshot Mockup 4 -->
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 13px; font-weight: bold; color: #115e59; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
                👨‍🏫 4. Faculty Lecturer Portal UI
              </div>
              <div style="background: #581c87; color: #ffffff; padding: 6px 10px; border-radius: 6px; font-size: 10px; font-weight: bold; margin-bottom: 6px;">
                Faculty Member: Dr. Anura Perera | Senior Lecturer
              </div>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; font-size: 9px; color: #334155;">
                <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 4px;">
                  <span>Subject: Child & Adolescent Psychology</span>
                  <span style="color: #6b21a8;">+ Upload Study Notes (PDF)</span>
                </div>
                <div style="background: #dcfce7; color: #166534; padding: 4px; border-radius: 4px; font-weight: bold;">
                  Student Attendance Register: [ Mark Present / Absent ]
                </div>
              </div>
              <div style="font-size: 10px; color: #64748b; margin-top: 8px; line-height: 1.4;">
                <strong>UI Highlights:</strong> Lecturer interface to post lecture PDFs, update Zoom meeting links, and maintain student attendance logs.
              </div>
            </div>

            <!-- UI Screenshot Mockup 5 -->
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 13px; font-weight: bold; color: #115e59; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
                🧠 5. Confidential Counselling Booking UI
              </div>
              <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; padding: 6px; font-size: 10px; font-weight: bold; color: #9f1239; margin-bottom: 6px;">
                Specialty: Individual Therapy / Relationship Counseling
              </div>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; font-size: 9px; color: #334155; margin-bottom: 6px;">
                Session Type: [ In-Person Colombo ] or [ Online Video Call ]
              </div>
              <div style="background: #fef3c7; color: #78350f; padding: 6px; border-radius: 6px; font-size: 9px; font-weight: bold; text-align: center;">
                Reference Generated: REF-2026-9081 (Confidential)
              </div>
              <div style="font-size: 10px; color: #64748b; margin-top: 8px; line-height: 1.4;">
                <strong>UI Highlights:</strong> Client booking interface with session type selection, date picker, and instant confidential reference code generation.
              </div>
            </div>

            <!-- UI Screenshot Mockup 6 -->
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="font-size: 13px; font-weight: bold; color: #115e59; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
                🔐 6. System Administrator Control Panel UI
              </div>
              <div style="background: #0f172a; color: #fde047; padding: 6px 10px; border-radius: 6px; font-size: 10px; font-weight: bold; display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span>🔐 Admin Operations Desk</span>
                <span>[+ Add Student] | Pending Slips: 3</span>
              </div>
              <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 6px; font-size: 9px; color: #065f46; space-y: 2px; margin-bottom: 4px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span>Enrollee: K. Perera (Direct Admin / Slip Verified)</span>
                  <span style="background: #047857; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-weight: bold;">Approve & Create Account</span>
                </div>
                <div style="font-size: 8px; color: #115e59; font-family: monospace;">
                  🔑 Assigned User: <strong>k_perera2026</strong> | Pass: <strong>HHStudent#9812</strong> | [🔑 Portal Login]
                </div>
              </div>
              <div style="font-size: 10px; color: #64748b; margin-top: 8px; line-height: 1.4;">
                <strong>UI Highlights:</strong> Central admin desk with "+ Add Student" creation option, bank deposit slip verification, student portal username & password generator, WhatsApp dispatch, and direct portal testing.
              </div>
            </div>
          </div>

          <h2 style="color: #0f766e; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px;">STEP-BY-STEP OPERATING PROCEDURES</h2>

          ${guideSections
            .map(
              (sec) => `
            <div class="section">
              <div class="section-title">${sec.title}</div>
              <div class="section-summary">${sec.summary}</div>
              ${sec.steps
                .map(
                  (s) => `
                <div class="step-item">
                  <span class="step-num">Step ${s.step}:</span> <span class="step-title">${s.title}</span>
                  <div class="step-desc">${s.description}</div>
                </div>
              `
                )
                .join('')}
            </div>
          `
            )
            .join('')}

          <div class="footer">
            Helping Hearts Counselling & Wellness Centre | 24/7 Helpline: 1333 | Confidential & Secure
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    } else {
      alert('Pop-up blocker prevented opening the printable PDF window. Please allow pop-ups for this site.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-800 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 uppercase bg-teal-800 px-3 py-1 rounded-full border border-teal-700">
                Official System Manual
              </span>
              <span className="text-xs bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded font-mono border border-emerald-800">
                v2.4 Live Guide
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-amber-400" /> Complete Website & LMS User Guide
            </h1>
            <p className="text-xs sm:text-sm text-teal-200 max-w-3xl">
              Comprehensive operational manual for Students, Faculty Lecturers, Counselling Desk Officers, and System Administrators.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadPDFManual}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-black shadow-lg hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Download PDF User Guide</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-teal-900/60 p-3 rounded-xl border border-teal-800/80">
            <span className="text-[10px] text-teal-300 font-bold uppercase block">Student Steps</span>
            <span className="text-base font-black text-white">Enrollment to LMS</span>
          </div>
          <div className="bg-teal-900/60 p-3 rounded-xl border border-teal-800/80">
            <span className="text-[10px] text-teal-300 font-bold uppercase block">Faculty Guide</span>
            <span className="text-base font-black text-amber-300">Notes & Zoom Links</span>
          </div>
          <div className="bg-teal-900/60 p-3 rounded-xl border border-teal-800/80">
            <span className="text-[10px] text-teal-300 font-bold uppercase block">Counselling Client</span>
            <span className="text-base font-black text-rose-300">24/7 Booking & Ref No</span>
          </div>
          <div className="bg-teal-900/60 p-3 rounded-xl border border-teal-800/80">
            <span className="text-[10px] text-teal-300 font-bold uppercase block">Admin Verification</span>
            <span className="text-base font-black text-emerald-300">Bank Slip Approval</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search user guide topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-teal-700 outline-none transition-all"
            />
          </div>

          {/* Role Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'ALL', label: 'All Roles' },
              { id: 'STUDENT', label: '🎓 Students' },
              { id: 'LECTURER', label: '👨‍🏫 Lecturers' },
              { id: 'CLIENT', label: '🧠 Clients' },
              { id: 'ADMIN', label: '🔐 Admin' }
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedRole === role.id
                    ? 'bg-teal-800 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Guide Cards Container */}
        <div className="space-y-4 pt-2">
          {filteredSections.length > 0 ? (
            filteredSections.map((sec) => {
              const IconComp = sec.icon;
              const isOpen = activeAccordion === sec.id;

              return (
                <div
                  key={sec.id}
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs transition-all"
                >
                  <div
                    onClick={() => setActiveAccordion(isOpen ? null : sec.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-xl border ${sec.color}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{sec.title}</h3>
                        <p className="text-xs text-slate-500">{sec.summary}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                        {sec.steps.length} Steps
                      </span>
                      <span className="text-slate-400 font-bold text-lg">{isOpen ? '−' : '+'}</span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-5 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3">
                      <div className="grid grid-cols-1 gap-2.5">
                        {sec.steps.map((s) => (
                          <div
                            key={s.step}
                            className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3.5"
                          >
                            <span className="w-7 h-7 rounded-full bg-teal-800 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                              {s.step}
                            </span>
                            <div className="space-y-1">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900">{s.title}</h4>
                              <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              No user guide sections match your search query. Try searching for "bank slip", "zoom", or "counselling".
            </div>
          )}
        </div>
      </div>

      {/* Visual User Interface Screens Gallery */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-700" /> Web & LMS User Interface (UI) Screen Maps
            </h2>
            <p className="text-xs text-slate-500">
              Visual layouts and component blueprints for all application interfaces across Student, Faculty, Client, and Admin views.
            </p>
          </div>
          <button
            onClick={handleDownloadPDFManual}
            className="px-4 py-2 rounded-xl bg-teal-900 hover:bg-teal-850 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Export Full UI Manual (PDF)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* UI Screen 1: Public Header & Navigation */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" /> 1. Public Header & Navigation
              </span>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">
                Web UI
              </span>
            </div>
            {/* UI Mockup Card */}
            <div className="bg-white rounded-xl border border-slate-300/80 p-3 shadow-2xs text-[11px] space-y-2 font-mono">
              <div className="bg-teal-950 text-amber-300 text-[10px] px-2 py-1 rounded flex justify-between font-bold">
                <span>📞 24/7 Helpline: 1333</span>
                <span className="text-amber-400">📅 Book Counselling | 🔒 Portal Login</span>
              </div>
              <div className="flex justify-between items-center bg-slate-100 p-1.5 rounded border border-slate-200">
                <span className="font-bold text-teal-900 text-[10px]">❤️ HELPING HEARTS</span>
                <div className="flex gap-1 text-[9px] text-slate-600 font-semibold">
                  <span>Home</span>
                  <span>Diplomas</span>
                  <span>Lecturers</span>
                  <span>Blog</span>
                  <span>Contact</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Features top utility bar with emergency helpline, separate action buttons for <strong>Book Counselling</strong> and <strong>Portal Login</strong>, and clean main header navigation links.
            </p>
          </div>

          {/* UI Screen 2: Student Registration & Payment Slip */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-teal-600" /> 2. Student Registration & Deposit Slip
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Enrollment Modal
              </span>
            </div>
            <div className="bg-white rounded-xl border border-slate-300/80 p-3 shadow-2xs text-[11px] space-y-2 font-mono">
              <div className="bg-teal-50 text-teal-900 text-[10px] p-1.5 rounded border border-teal-200 font-bold">
                🎓 Course: Higher Diploma in Counselling Psychology (LKR 85,000)
              </div>
              <div className="space-y-1 text-[10px] text-slate-600">
                <div className="bg-slate-100 p-1 rounded">Name: [ Full Name Input ]</div>
                <div className="bg-slate-100 p-1 rounded">Email: [ Student Email ]</div>
                <div className="border-2 border-dashed border-teal-300 p-2 text-center rounded bg-teal-50/50 text-teal-800 font-bold">
                  📎 Drag & Drop Bank Slip Image
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Enables prospective enrollees to submit contact info, upload bank deposit receipts, and trigger automated admin review workflows.
            </p>
          </div>

          {/* UI Screen 3: Student LMS Course Player */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-teal-600" /> 3. Student LMS Player & Notes
              </span>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                LMS Portal
              </span>
            </div>
            <div className="bg-white rounded-xl border border-slate-300/80 p-3 shadow-2xs text-[11px] space-y-2 font-mono">
              <div className="bg-slate-900 text-white h-16 rounded flex items-center justify-center font-bold text-[10px]">
                ▶ HD Lecture Stream | Module 01: CBT Fundamentals
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">📄 CBT_Notes.pdf (Download)</span>
                <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">📹 Join Zoom</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Provides enrolled students with HD video player, one-click PDF slide downloads, live Zoom lecture access, and progress trackers.
            </p>
          </div>

          {/* UI Screen 4: Lecturer Faculty Dashboard */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-600" /> 4. Faculty Lecturer Portal
              </span>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                Faculty UI
              </span>
            </div>
            <div className="bg-white rounded-xl border border-slate-300/80 p-3 shadow-2xs text-[11px] space-y-2 font-mono">
              <div className="bg-purple-900 text-white p-1 rounded font-bold text-[10px]">
                👨‍🏫 Dr. Anura Perera | Senior Lecturer
              </div>
              <div className="bg-slate-100 p-1 rounded text-[9px] text-slate-700 font-bold flex justify-between">
                <span>Subject: Child Psychology</span>
                <span className="text-purple-700">+ Upload PDF Slide</span>
              </div>
              <div className="bg-emerald-50 text-emerald-900 p-1 rounded text-[9px] font-bold">
                Register: Student Attendance [ Present / Absent ]
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Enables faculty members to manage assigned subjects, publish study notes, set Zoom links, and record student attendance.
            </p>
          </div>

          {/* UI Screen 5: Confidential Counselling Booking */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" /> 5. Confidential Counselling Booking
              </span>
              <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">
                Client Modal
              </span>
            </div>
            <div className="bg-white rounded-xl border border-slate-300/80 p-3 shadow-2xs text-[11px] space-y-2 font-mono">
              <div className="bg-rose-50 text-rose-900 p-1 rounded font-bold text-[10px]">
                🧠 Select Therapy: Individual / Marriage / Youth
              </div>
              <div className="bg-slate-100 p-1 rounded text-[9px] text-slate-600">
                Mode: [ In-Person Colombo ] or [ Online Video Call ]
              </div>
              <div className="bg-amber-100 text-amber-950 p-1 rounded text-[9px] font-bold text-center">
                Ref Generated: REF-2026-8812
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Confidential inquiry flow for clients requesting therapy sessions, generating immediate tracking reference numbers.
            </p>
          </div>

          {/* UI Screen 6: System Admin Control Panel */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> 6. System Admin Panel & Verification
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                Admin Panel
              </span>
            </div>
            <div className="bg-white rounded-xl border border-slate-300/80 p-3 shadow-2xs text-[11px] space-y-2 font-mono">
              <div className="bg-slate-900 text-amber-300 p-1 rounded font-bold text-[10px] flex justify-between">
                <span>🔐 Admin Dashboard</span>
                <span>Bank Slips: 3 Pending</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 p-1 rounded text-[9px] text-emerald-900 font-bold flex justify-between">
                <span>Student: K. Perera (Bank Receipt OK)</span>
                <span className="bg-emerald-700 text-white px-1 rounded">Approve & Grant LMS</span>
              </div>
              <div className="bg-slate-100 p-1 rounded text-[9px] text-slate-600">
                CMS: Emergency Helpline 1333 | Courses | DB Schemas
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Central control desk for approving student payment slips, creating LMS courses, editing faculty profiles, updating CMS content, and managing media.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-teal-700" /> Frequently Asked Operational Questions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <p className="font-bold text-teal-900">Q: How long does student bank slip verification take?</p>
            <p className="text-slate-600 leading-relaxed">
              Admin verifies bank deposit slips within 1–12 hours. Students can log in to the LMS immediately after admin approval.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <p className="font-bold text-teal-900">Q: Are counselling session inquiries confidential?</p>
            <p className="text-slate-600 leading-relaxed">
              Yes. All client session requests are stored securely with strict administrative confidentiality protocols compliant with psychological standards.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <p className="font-bold text-teal-900">Q: How do faculty lecturers upload PDF notes?</p>
            <p className="text-slate-600 leading-relaxed">
              Lecturers sign in via "Lecturer Portal", select their course, click "Upload Study Material (PDF)", and the file becomes instantly available to all enrolled students.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <p className="font-bold text-teal-900">Q: Can clients book online video call counselling?</p>
            <p className="text-slate-600 leading-relaxed">
              Yes. Clients can choose "Online Video Call" or "In-Person (Colombo Centre)" when submitting their inquiry form.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
