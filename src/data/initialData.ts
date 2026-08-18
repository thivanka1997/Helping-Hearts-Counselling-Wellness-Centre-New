import {
  Lecturer,
  CounsellingService,
  Course,
  CourseModule,
  EventWorkshop,
  BlogArticle,
  GalleryMedia,
  SiteSettings,
  User,
  ClientAppointment,
  StudentRegistration,
  AttendanceRecord,
  Announcement,
  Testimonial,
  FAQItem
} from '../types';
import { freeSessionsData } from './freeSessionsData';

export const initialSiteSettings: SiteSettings = {
  siteName: 'Helping Hearts Counselling & Wellness Centre',
  tagline: 'Nurturing Mind, Healing Hearts & Empowering Lives',
  logoUrl: '/src/assets/images/helping_hearts_logo_1786214208419.jpg',
  phonePrimary: '0742344251',
  phoneSecondary: '+94 74 234 4251',
  emergencyHelpline: '1333 (National Helpline) / 0742344251',
  emailPrimary: 'helpingheartscounsellingservic@gmail.com',
  addressPhysical: 'HELPING HEARTS Counselling & Wellness, Thelangapatha Road, Wattala',
  openingHours: 'Mon - Sat: 8:30 AM - 6:00 PM (Appointments Available Sunday)',
  facebookUrl: 'https://facebook.com/helpingheartscentre',
  instagramUrl: 'https://instagram.com/helpingheartscentre',
  linkedinUrl: 'https://linkedin.com/company/helpinghearts',
  youtubeUrl: 'https://youtube.com/@helpingheartscentre',
  currencySymbol: 'LKR',

  // Hero Section
  heroBadge: 'Confidential Counselling & Accredited Psychology Education',
  heroHeadline: 'Helping Hearts',
  heroHeadlineHighlight: 'Counselling & Wellness Centre',
  heroSubheadline: 'A compassionate sanctuary dedicated to emotional healing, mental resilience, family harmony, and professional diploma education in counselling psychology.',
  heroCtaPrimaryText: 'Book Counselling',
  heroCtaSecondaryText: 'Explore LMS Courses',

  // About Section
  aboutHeading: 'About Helping Hearts Wellness',
  aboutStory: 'Founded with a vision to provide confidential, accessible mental healthcare and academic excellence in psychology across Sri Lanka.',
  aboutVision: 'To be Sri Lanka’s foremost ethical sanctuary for mental health wellness and professional psychological education.',
  aboutMission: 'Empowering individuals, families, and academic scholars through compassionate psychotherapy, ethical guidance, and accredited psychological diplomas.',
  aboutValues: ['Strict Confidentiality', 'Empathetic Compassion', 'Academic Rigor', 'Holistic Wellness'],

  // Stats
  statClientsHelped: '2,500+',
  statStudentsTrained: '1,200+',
  statLecturersPanel: '12+',
  statSatisfactionRate: '99%'
};

export const initialLecturers: Lecturer[] = [
  {
    id: 'lec-1',
    name: 'Ramsina Farvin Jelaldeen',
    title: 'Directress, Lecturer, Counselling Psychotherapist, Motivational Speaker & NLP Practitioner',
    photo: '/src/assets/images/regenerated_image_1786279526494.png',
    qualifications: 'Directress, Lecturer, Counselling Psychotherapist, Motivational Speaker & NLP Practitioner',
    specialization: 'Counselling Psychotherapy, Motivational Speaking, NLP Practice & Leadership',
    bio: 'Directress, Lecturer, Counselling Psychotherapist, Motivational Speaker & NLP Practitioner at Helping Hearts Counselling & Wellness Centre.',
    coursesAssigned: ['crs-1', 'crs-3'],
    email: 'helpingheartscounsellingservic@gmail.com',
    phone: '0742344251',
    displayOrder: 1
  },
  {
    id: 'lec-2',
    name: 'Ruwan Samarasinghe',
    title: 'Mind Management Trainer, Author, Transformative Coach, Counselor, Certified NLP Practitioner & Mindfulness Master Trainer',
    photo: '/src/assets/images/regenerated_image_1786719149348.jpg',
    qualifications: 'Mind Management Trainer, Author, Transformative Coach, Counselor, Certified NLP Practitioner & Mindfulness Master Trainer',
    specialization: 'Mind Management, Transformative Coaching, Counseling, NLP & Mindfulness Master Training',
    bio: 'Mind Management Trainer, Author, Transformative Coach, Counselor, Certified NLP Practitioner & Mindfulness Master Trainer.',
    coursesAssigned: ['crs-5'],
    email: 'helpingheartscounsellingservic@gmail.com',
    phone: '0742344251',
    displayOrder: 2
  },
  {
    id: 'lec-3',
    name: 'Lalin Gunaratne',
    title: 'Lecturer, Psychological Counselor, Corporate Training Specialist & NLP Master Practitioner',
    photo: '/src/assets/images/regenerated_image_1786719148136.jpg',
    qualifications: 'Lecturer, Psychological Counselor, Corporate Training Specialist & NLP Master Practitioner',
    specialization: 'Psychological Counseling, Corporate Training & NLP Practice',
    bio: 'Lecturer, Psychological Counselor, Corporate Training Specialist & NLP Master Practitioner.',
    coursesAssigned: ['crs-4'],
    email: 'helpingheartscounsellingservic@gmail.com',
    phone: '0742344251',
    displayOrder: 3
  },
  {
    id: 'lec-4',
    name: 'Sumihiri Bhashitha Senavirathna',
    title: 'Attorney at Law, Notary Public Commissioner for Oaths & Counselling Psychotherapist',
    photo: '/src/assets/images/regenerated_image_1786719152849.jpg',
    qualifications: 'Attorney at Law, Notary Public Commissioner for Oaths & Counselling Psychotherapist',
    specialization: 'Legal Practice, Oaths Commission & Counselling Psychotherapy',
    bio: 'Attorney at Law, Notary Public Commissioner for Oaths & Counselling Psychotherapist.',
    coursesAssigned: ['crs-6'],
    email: 'helpingheartscounsellingservic@gmail.com',
    phone: '0742344251',
    displayOrder: 4
  },
  {
    id: 'lec-5',
    name: 'Dr. Kavinda De Silva',
    title: 'Medical officer in psychiatry and psychotherapist',
    photo: '/src/assets/images/regenerated_image_1786719154352.jpg',
    qualifications: 'Medical officer in psychiatry and psychotherapist',
    specialization: 'Psychiatry & Psychotherapy',
    bio: 'Medical officer in psychiatry and psychotherapist.',
    coursesAssigned: ['crs-2'],
    email: 'helpingheartscounsellingservic@gmail.com',
    phone: '0742344251',
    displayOrder: 5
  },
  {
    id: 'lec-6',
    name: 'Miss NIRMANI WEERARATHNE',
    title: 'Coordinator',
    photo: '/src/assets/images/regenerated_image_1786718038328.jpg',
    qualifications: 'Bachelor of Business Management in HRM',
    specialization: 'Course Coordination & Student Affairs',
    bio: 'Coordinator at Helping Hearts Counselling & Wellness Centre.',
    coursesAssigned: ['crs-1', 'crs-2', 'crs-3', 'crs-4', 'crs-5', 'crs-6'],
    email: 'helpingheartscounsellingservic@gmail.com',
    phone: '0742344251',
    displayOrder: 6
  }
];

export const initialCounsellingServices: CounsellingService[] = [
  {
    id: 'srv-1',
    title: 'Individual Counseling',
    slug: 'individual-counseling',
    shortDesc: 'Safe, confidential one-on-one sessions addressing personal challenges, emotional clarity, and life transitions.',
    fullDesc: 'Our Individual Counseling service provides a compassionate, non-judgmental space to explore personal thoughts, emotional struggles, and life goals. Guided by certified psychotherapists, clients build emotional resilience, self-empowerment, and effective coping strategies.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Personalized one-on-one therapeutic focus',
      'Confidential and empathetic setting',
      'Emotional regulation and clarity',
      'Strengthened personal boundaries and self-awareness'
    ],
    sessionDuration: '50 Minutes per Session',
    format: 'Both',
    category: 'Individual Care',
    featured: true
  },
  {
    id: 'srv-2',
    title: 'Anxiety & Stress Management',
    slug: 'anxiety-stress-management',
    shortDesc: 'Evidence-based techniques to alleviate chronic worry, panic symptoms, tension, and everyday stress.',
    fullDesc: 'Comprehensive therapeutic support designed to identify anxiety triggers, break fear-driven thought cycles, and restore calm. Sessions integrate cognitive restructuring, somatic breathing exercises, and nervous system regulation tools.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Identification of anxiety triggers and cognitive loops',
      'Somatic calming and diaphragmatic breathing tools',
      'Reduction in panic symptoms and bodily tension',
      'Practical daily stress reduction routines'
    ],
    sessionDuration: '50 Minutes per Session',
    format: 'Both',
    category: 'Stress & Mental Health',
    featured: true
  },
  {
    id: 'srv-3',
    title: 'Depression & Emotional Support',
    slug: 'depression-emotional-support',
    shortDesc: 'Gentle, compassionate guidance through low mood, emotional heaviness, grief, and hopelessness.',
    fullDesc: 'A safe, supportive clinical environment helping individuals navigate depressive episodes, persistent sadness, loss of motivation, and emotional numbness. We focus on gentle behavioral activation, self-compassion, and rekindling hope.',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Safe processing of low mood and overwhelming emotions',
      'Behavioral activation and gradual routine rebuilding',
      'Cultivation of deep self-compassion and inner strength',
      'Reconnecting with personal meaning and joy'
    ],
    sessionDuration: '50 Minutes per Session',
    format: 'Both',
    category: 'Stress & Mental Health',
    featured: true
  },
  {
    id: 'srv-4',
    title: 'Relationship Counseling',
    slug: 'relationship-counseling',
    shortDesc: 'Strengthen emotional intimacy, resolve ongoing conflict, and build healthy communication in couples.',
    fullDesc: 'Structured relational guidance for partners seeking to overcome communication barriers, rebuild broken trust, de-escalate recurring disputes, and cultivate mutual emotional understanding and connection.',
    image: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'De-escalate destructive argument cycles',
      'Establish active listening and empathetic dialogue',
      'Rebuild emotional safety and relational trust',
      'Constructive conflict resolution techniques'
    ],
    sessionDuration: '60 - 75 Minutes per Session',
    format: 'Both',
    category: 'Relationships & Family',
    featured: true
  },
  {
    id: 'srv-5',
    title: 'Child & Adolescent Counseling',
    slug: 'child-adolescent-counseling',
    shortDesc: 'Age-tailored psychological support, expressive therapy, and guidance for children and teens.',
    fullDesc: 'Specialized counseling utilizing creative media, play, and adolescent-centered cognitive tools to help children and teenagers process anxiety, behavioral challenges, peer pressure, identity issues, and school difficulties.',
    image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Age-appropriate creative and expressive therapy techniques',
      'Emotional vocabulary development for children',
      'Navigating adolescent identity and peer pressure',
      'Collaborative guidance for parents and guardians'
    ],
    sessionDuration: '50 Minutes per Session',
    format: 'In-Person',
    category: 'Youth & Students',
    featured: true
  },
  {
    id: 'srv-6',
    title: 'Student Mental Health Support',
    slug: 'student-mental-health-support',
    shortDesc: 'Targeted mental wellbeing counseling addressing exam anxiety, study fatigue, concentration, and academic pressure.',
    fullDesc: 'Dedicated psychological support crafted for school, college, and university students facing performance anxiety, fear of failure, procrastination, and academic burnout. We help students balance mental wellbeing with academic achievement.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Overcoming exam anxiety and fear of failure',
      'Focus enhancement and procrastination management',
      'Stress management strategies during study periods',
      'Healthy work-life-study balance techniques'
    ],
    sessionDuration: '50 Minutes per Session',
    format: 'Both',
    category: 'Youth & Students',
    featured: true
  },
  {
    id: 'srv-7',
    title: 'Counseling for Drug Addiction & Substance Use',
    slug: 'drug-addiction-substance-counseling',
    shortDesc: 'Empathetic, non-judgmental counseling, relapse prevention, and emotional recovery for substance dependency.',
    fullDesc: 'Confidential clinical counseling helping individuals understand root triggers of substance dependency, develop relapse prevention blueprints, rebuild emotional sovereignty, and regain control of their health and future.',
    image: 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Confidential, non-stigmatizing recovery atmosphere',
      'Identification of triggers and cravings management',
      'Relapse prevention and coping blueprint design',
      'Rebuilding family trust and self-worth'
    ],
    sessionDuration: '50 - 60 Minutes per Session',
    format: 'Both',
    category: 'Specialized Counseling',
    featured: true
  },
  {
    id: 'srv-8',
    title: 'Mindfulness-Based Counseling',
    slug: 'mindfulness-based-counseling',
    shortDesc: 'Grounding practices, present-moment awareness, and mindful emotional regulation for inner peace.',
    fullDesc: 'Integrating evidence-based mindfulness principles with counseling psychotherapy to cultivate present-moment grounding, reduce mental chatter, enhance emotional stability, and break repetitive overthinking cycles.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Present-moment grounding and breathwork integration',
      'Reduction of ruminative overthinking and mental noise',
      'Emotional equilibrium and stress detachment',
      'Cultivation of mindfulness in daily living'
    ],
    sessionDuration: '50 Minutes per Session',
    format: 'Both',
    category: 'Mindfulness & Growth',
    featured: true
  },
  {
    id: 'srv-9',
    title: 'Self-Esteem & Personal Development Counseling',
    slug: 'self-esteem-personal-development',
    shortDesc: 'Overcome self-doubt, reframe negative self-beliefs, and build unwavering confidence and self-worth.',
    fullDesc: 'Transformative counseling focused on dismantling self-criticism, building self-acceptance, setting healthy boundaries, and aligning actions with authentic personal values for lifelong confidence.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Dismantling internal self-criticism and imposter feelings',
      'Developing authentic self-worth and confidence',
      'Assertiveness training and boundary setting',
      'Personal empowerment and goal realization'
    ],
    sessionDuration: '50 Minutes per Session',
    format: 'Both',
    category: 'Mindfulness & Growth',
    featured: true
  },
  {
    id: 'srv-10',
    title: 'Parenting Support Counseling',
    slug: 'parenting-support-counseling',
    shortDesc: 'Practical guidance, positive parenting strategies, and emotional support for mothers, fathers, and caregivers.',
    fullDesc: 'Supportive counseling addressing the everyday complexities of parenting, toddler/child tantrums, adolescent resistance, parental burnout, and creating nurturing, resilient family communication environments.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Positive discipline and emotional coaching techniques',
      'Managing parental stress, fatigue, and overwhelm',
      'Strengthening attachment and parent-child bonds',
      'Constructive strategies for handling behavioural challenges'
    ],
    sessionDuration: '50 Minutes per Session',
    format: 'Both',
    category: 'Relationships & Family',
    featured: true
  },
  {
    id: 'srv-11',
    title: 'Workplace Stress & Burnout Support',
    slug: 'workplace-stress-burnout-support',
    shortDesc: 'Recovery pathways, work-life boundary setting, and mental revitalization for working professionals.',
    fullDesc: 'Focused psychological counseling for corporate executives, healthcare workers, educators, and professionals facing exhaustion, chronic occupational stress, cynicism, and loss of workplace vitality.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Burnout symptom assessment and recovery roadmap',
      'Establishing firm professional and personal boundaries',
      'Restoring mental energy, motivation, and focus',
      'Corporate stress mitigation and coping tactics'
    ],
    sessionDuration: '50 Minutes per Session',
    format: 'Both',
    category: 'Workplace & Career',
    featured: true
  },
  {
    id: 'srv-12',
    title: 'Career Guidance & Counseling',
    slug: 'career-guidance-counseling',
    shortDesc: 'Clarity, aptitude exploration, and psychological support for career transitions and professional pathways.',
    fullDesc: 'Comprehensive career counseling blending aptitude exploration, interest profiling, and psychological guidance to help students, job seekers, and transitioning professionals make confident, fulfilling career decisions.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Aptitude, personality, and career interest profiling',
      'Overcoming career crossroads confusion and indecision',
      'Actionable goal mapping and skill alignment',
      'Confidence building for interviews and career transitions'
    ],
    sessionDuration: '50 - 60 Minutes per Session',
    format: 'Both',
    category: 'Workplace & Career',
    featured: true
  },
  {
    id: 'srv-13',
    title: 'Relaxing Art & Craft Sessions',
    slug: 'relaxing-art-craft-sessions',
    shortDesc: 'Mindful creative expression, therapeutic painting, pottery, and crafts to unwind and destress.',
    fullDesc: 'Gentle, soothing art-based therapeutic sessions designed to release tension, engage the senses, and discover relaxation through colors, textures, painting, and tactile crafts in a peaceful environment.',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Non-verbal emotional release and deep relaxation',
      'Sensory mindfulness through hands-on creative crafts',
      'No previous art skill required — purely expressive',
      'Soothing group or individual studio environment'
    ],
    sessionDuration: '60 - 90 Minutes per Session',
    format: 'In-Person',
    category: 'Mindfulness & Growth',
    featured: true
  }
];

export const initialCourses: Course[] = [
  {
    id: 'crs-1',
    title: 'Diploma in Professional Counselling Psychology',
    slug: 'diploma-counselling-psychology',
    shortDesc: 'A comprehensive 6-month diploma preparing students with fundamental therapeutic skills, ethics, and practical counselling techniques.',
    description: 'This diploma course provides a deep foundation in human behavior, counselling theories, communication skills, micro-counselling techniques, and ethical clinical practice. Designed for prospective counselors, social workers, teachers, and healthcare professionals.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    lecturerId: 'lec-1',
    lecturerName: 'Ms. Ramsina Farvin Jelaldeen',
    duration: '6 Months (24 Weeks)',
    schedule: 'Saturdays: 9:00 AM - 1:00 PM',
    fee: 45000,
    currency: 'LKR',
    category: 'Diploma Programs',
    level: 'Beginner',
    status: 'Published',
    outcomes: [
      'Understand core psychological theories (Psychoanalysis, CBT, Humanistic)',
      'Master active listening, paraphrasing, and empathetic inquiry',
      'Conduct structured intake interviews and psychological assessments',
      'Apply strict ethical guidelines and confidentiality protocols in practice'
    ],
    requirements: [
      'G.C.E. Advanced Level qualification or equivalent experience',
      'Interest in human mental health and empathetic communication'
    ],
    modulesCount: 4,
    enrolledStudentsCount: 32,
    createdAt: '2026-01-15'
  },
  {
    id: 'crs-2',
    title: 'Advanced Certificate in Cognitive Behavioral Therapy (CBT)',
    slug: 'advanced-cbt-certificate',
    shortDesc: 'Specialized clinical training in structuring CBT protocols for anxiety, depression, and cognitive distortion.',
    description: 'Master the principles of Cognitive Behavioral Therapy. Learn cognitive restructuring, behavioral experiments, exposure hierarchies, and homework design under expert psychiatric guidance.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    lecturerId: 'lec-2',
    lecturerName: 'Dr. Kavinda De Silva',
    duration: '3 Months (12 Weeks)',
    schedule: 'Sundays: 2:00 PM - 5:00 PM',
    fee: 35000,
    currency: 'LKR',
    category: 'Certificate Programs',
    level: 'Intermediate',
    status: 'Published',
    outcomes: [
      'Identify core cognitive distortions and automatic negative thoughts',
      'Construct thought records and behavioral activity schedules',
      'Formulate clinical CBT cases across mood and anxiety disorders'
    ],
    requirements: [
      'Prior qualification in Psychology, Counselling, Nursing, or Medicine'
    ],
    modulesCount: 3,
    enrolledStudentsCount: 18,
    createdAt: '2026-02-01'
  },
  {
    id: 'crs-3',
    title: 'Certificate in Stress Management & Mindfulness',
    slug: 'mindfulness-stress-management',
    shortDesc: 'Practical self-care and client guidance techniques for stress reduction, grounding, and mindfulness.',
    description: 'Learn mindfulness-based stress reduction (MBSR) techniques, somatic nervous system regulation, and lifestyle interventions for mental vitality.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    lecturerId: 'lec-1',
    lecturerName: 'Ms. Ramsina Farvin Jelaldeen',
    duration: '2 Months (8 Weeks)',
    schedule: 'Wednesdays: 6:00 PM - 8:00 PM (Online)',
    fee: 22000,
    currency: 'LKR',
    category: 'Short Courses',
    level: 'All Levels',
    status: 'Published',
    outcomes: [
      'Understand the neurobiology of stress and cortisol responses',
      'Lead guided meditation and grounding body scan exercises',
      'Design personal and client stress recovery plans'
    ],
    requirements: ['Open to all interested individuals'],
    modulesCount: 2,
    enrolledStudentsCount: 24,
    createdAt: '2026-02-10'
  },
  {
    id: 'crs-4',
    title: 'Couples & Family Dynamics Counselling',
    slug: 'couples-family-counselling',
    shortDesc: 'Advanced therapeutic framework for systemic family therapy, marital counselling, and dispute resolution.',
    description: 'Explore relationship dynamics, genograms, attachment theory, and systemic intervention models for working with couples and families.',
    image: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=800&auto=format&fit=crop',
    lecturerId: 'lec-3',
    lecturerName: 'Mr. Lalin Gunaratne',
    duration: '4 Months (16 Weeks)',
    schedule: 'Saturdays: 2:00 PM - 6:00 PM',
    fee: 38000,
    currency: 'LKR',
    category: 'Specialist Courses',
    level: 'Intermediate',
    status: 'Published',
    outcomes: [
      'Draw and analyze family genograms',
      'Facilitate joint therapy sessions with balanced neutrality',
      'Address attachment styles and repair emotional ruptures'
    ],
    requirements: ['Diploma in Counselling or social work background'],
    modulesCount: 3,
    enrolledStudentsCount: 15,
    createdAt: '2026-02-15'
  }
];

export const initialCourseModules: CourseModule[] = [
  {
    id: 'mod-101',
    courseId: 'crs-1',
    title: 'Module 01: Foundations of Counselling Psychology',
    description: 'Introduction to psychological paradigms, active listening, and therapeutic rapport.',
    order: 1,
    lessons: [
      {
        id: 'les-101',
        moduleId: 'mod-101',
        title: 'Lesson 01: Introduction to Counselling Principles & Ethics',
        description: 'Core overview of counselling versus advising, therapist boundaries, and ethical guidelines.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Clean YouTube embed link
        durationMinutes: 45,
        order: 1,
        resources: [
          {
            id: 'res-1',
            title: 'Counselling Ethics Handbook (PDF)',
            type: 'PDF',
            url: 'https://drive.google.com/file/d/123456789/view',
            description: 'Essential ethical guidelines for practicing counsellors in Sri Lanka.'
          },
          {
            id: 'res-2',
            title: 'Therapeutic Rapport Worksheet (DOC)',
            type: 'DOC',
            url: 'https://drive.google.com/file/d/987654321/view',
            description: 'Self-reflection guide for intake communication.'
          }
        ]
      },
      {
        id: 'les-102',
        moduleId: 'mod-101',
        title: 'Lesson 02: Micro-Skills: Active Listening & Paraphrasing',
        description: 'Practical exercise on verbal and non-verbal attending behavior.',
        videoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
        durationMinutes: 50,
        order: 2,
        resources: [
          {
            id: 'res-3',
            title: 'Micro-Skills Observation Sheet',
            type: 'PDF',
            url: 'https://drive.google.com/file/d/abcdef123/view',
            description: 'Checklist for practical roleplay sessions.'
          }
        ]
      }
    ]
  },
  {
    id: 'mod-102',
    courseId: 'crs-1',
    title: 'Module 02: Major Counselling Theories in Practice',
    description: 'Comparative study of Psychoanalysis, Person-Centered Therapy, and Gestalt models.',
    order: 2,
    lessons: [
      {
        id: 'les-103',
        moduleId: 'mod-102',
        title: 'Lesson 03: Person-Centered Therapy (Carl Rogers Model)',
        description: 'Unconditional positive regard, congruence, and accurate empathy.',
        videoUrl: 'https://www.youtube.com/watch?v=fEqJ86K856k',
        durationMinutes: 60,
        order: 1,
        resources: [
          {
            id: 'res-4',
            title: 'Carl Rogers Core Conditions Summary',
            type: 'PDF',
            url: 'https://drive.google.com/file/d/sample-rogers/view',
            description: 'Key lecture slides and reading assignment.'
          }
        ]
      }
    ]
  }
];

export const initialEvents: EventWorkshop[] = [
  {
    id: 'evt-free-sessions',
    title: 'Free Sessions: Community Mental Health & Counselling Workshop',
    slug: 'free-sessions-community-counselling-workshop',
    type: 'WORKSHOP',
    description: 'An open-door community outreach initiative providing free confidential psychological guidance, group wellness circles, and stress-coping strategies for the public.',
    date: '2026-08-20',
    startTime: '09:30 AM',
    endTime: '01:30 PM',
    location: 'Helping Hearts Main Centre & Online Support Circle',
    isOnline: true,
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop',
    registrationUrl: 'https://helpingheartswellness.org/free-sessions-registration',
    status: 'PUBLISHED',
    featured: true
  },
  {
    id: 'evt-1',
    title: 'National Mental Health Awareness Symposium 2026',
    slug: 'mental-health-symposium-2026',
    type: 'EVENT',
    description: 'Join leading psychiatrists and psychologists for a day of inspiring keynotes, panel discussions, and community wellness initiatives.',
    date: '2026-09-15',
    startTime: '09:00 AM',
    endTime: '04:00 PM',
    location: 'BMICH Main Hall, Colombo 07',
    isOnline: false,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    registrationUrl: 'https://helpingheartswellness.org/register-event',
    status: 'PUBLISHED',
    featured: true
  },
  {
    id: 'evt-2',
    title: 'Interactive Workshop: Emotional Resilience for Teenagers',
    slug: 'teen-emotional-resilience-workshop',
    type: 'WORKSHOP',
    description: 'A hands-on workshop tailored for adolescents (ages 13-18) to build emotional expression tools, manage exam stress, and boost self-esteem.',
    date: '2026-08-28',
    startTime: '02:00 PM',
    endTime: '05:00 PM',
    location: 'Helping Hearts Auditorium & Online Zoom',
    isOnline: true,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    registrationUrl: 'https://helpingheartswellness.org/register-workshop',
    status: 'PUBLISHED',
    featured: true
  }
];

export const initialBlogs: BlogArticle[] = [
  {
    id: 'blg-bdd-ramsina',
    title: 'මොකක්ද මේ ගොඩක් අය නොදන්න Body Dysmorphic Disorder (BDD) එක කියන්නේ? (Understanding Body Dysmorphic Disorder)',
    slug: 'body-dysmorphic-disorder-bdd-paper-article',
    summary: 'මනෝ උපදේශිකා Ramsina Farvin Jelaldeen විසින් රචිත පුවත්පත් ලිපිය: කාංසා අක්‍රමතාව (Social Anxiety) යටතේ එන ශරීර ස්වභාවය පිළිබඳ අක්‍රමතාවය (BDD), එහි ලක්ෂණ, පුනරාවර්තන හැසිරීම් සහ CBT/Mindfulness/Music/Drama Therapy ප්‍රතිකාර.',
    content: `### මොකක්ද මේ ගොඩක් අය නොදන්න Body Dysmorphic Disorder (BDD) එක කියන්නේ?

**කර්තෘ:** මනෝ උපදේශිකා රම්සිනා ෆර්වින් ජෙලල්දීන් (*Ms. Ramsina Farvin Jelaldeen - Course Founder & Director*)  
**ප්‍රකාශිත දිනය:** 2024.01.25 (පුවත්පත් විශේෂ ලිපිය)

---

#### 1. හැඳින්වීම (Introduction)
කාංසා අක්‍රමතාව (*Social Anxiety*) ගැන මීට කලින් ලිපියකින් ද අපි ඔබව දැනුවත් කළෙමු. නමුත් අද කතා කරන්නේ වෙනස් මාතෘකාවක් පිළිබඳවයි. එනම් **කාංසා අක්‍රමතාව (Social Anxiety) යටතේ එන ශරීර ස්වභාවය පිළිබඳ අක්‍රමතාවය (Body Dysmorphic Disorder - BDD)** යි. මෙය වර්තමාන සමාජයේ ඉතා සුලබව දැකිය හැකි තත්ත්වයකි.

---

#### 2. කුමක්ද මේ Body Dysmorphic Disorder එක කියන්නේ? (What is BDD?)
මෙහිදී සරල වශයෙන් සිදුවන්නේ යම් පුද්ගලයෙකු විසින් තමන්ගේ ශරීරය විශාල වශයෙන් විකෘතියකට ලක් වී ඇතැයි සිතමින් ඇති වන තදබල මානසික පීඩනයයි.
- **පෙනුමේ දෝෂ ලෙස සිතන කරුණු:** ඇද වී ඇති බව, සමේ කැලැල් හෝ කලු වී ඇති බව, විකෘති වී ඇති බව, ශරීරයේ හැඩය වෙනස් වී ඇති බව හෝ ශරීර අවයව වල වෙනස්කම්.
- **මානසික බලපෑම:** සැබවින්ම පෙනෙන දෝෂයක් නොමැතිව වුවද තමන්ගේ පෙනුම පිළිබඳව නිරන්තරයෙන් දැඩි ලැජ්ජාවක් සහ බියක් ඇතිවීම.

---

#### 3. මෙය හඳුනා ගැනීමට තිබෙන ලක්ෂණ මොනවාද? (Key Symptoms & Behaviors)
මේ තත්ත්වය පිළිබඳව අවධානය යොමු කරන්නේ නම් ඉක්මනින් හඳුනාගත හැකිය:
- **තදබල මානසික පීඩනය:** සමාජයට හෝ අන් අය ඉදිරියට යාමට ඇති බිය නිසා බොහෝ සමාජ සම්බන්ධතා ඇහිරී සිටීම.
- **පුනරාවර්තන හැසිරීම් රටා (Repetitive Behavioral Patterns):**
  1. නිතරම කණ්ණාඩියෙන් තමන්ගේ පෙනුම පරීක්ෂා කිරීම (*Excessive mirror checking*)
  2. අධික ලෙස කොණ්ඩය පීරීම හෝ පෙනුම සකස් කිරීම
  3. සම කෑම / කැලැල් සෑරීම (*Skin picking*)
  4. අන් අයගෙන් නිරන්තරයෙන් සහතික හා පුනරීක්ෂණ සෙවීම (*Reassurance seeking*)
  5. හුදකලා වීම හා සමාජයෙන් වෙන්වීම (*Social isolation*)

---

#### 4. මෙයට තිබෙන ප්‍රතිකාර මොනවාද? (Psychotherapeutic Interventions)
මෙබඳු තත්ත්වයන්ගෙන් පෙළෙන පුද්ගලයන් සඳහා **මනෝ උපදේශනය (Psychological Counselling)** අතිශය වැදගත් වේ. **Helping Hearts Counselling & Wellness Centre** හරහා අප මූලික වශයෙන් පහත සඳහන් විද්‍යාත්මක ප්‍රතිකාර ක්‍රමවේද භාවිතා කරනු ලබයි:

- **CBT ප්‍රතිකාර (Cognitive Behavioral Therapy):** සිතුවිලි සහ හැසිරීම් රටා ධනාත්මකව වෙනස් කිරීම.
- **Mindfulness & Meditation:** සිහිනුවණ දියුණු කිරීම හා මානසික ඒකාග්‍රතාව ඇති කිරීම.
- **Music Therapy & Drama Therapy:** කලාත්මක හා ප්‍රකාශනාත්මක මාධ්‍යයන් හරහා මානසික ආතතිය දුරු කිරීම.

මෙම ප්‍රතිකාර ක්‍රමවේද ප්‍රායෝගික භාවිතයේදී එක් එක් පුද්ගලයාගේ ස්වභාවය අනුව පුද්ගලානුබද්ධව (*Tailored approach*) යොදාගනු ලැබේ. මෙය ඉතා සාර්ථකව කළමනාකරණය කර සුවදායක ජීවිතයක් ලබාගත හැක.

---
*වැඩිදුර විමසීම් සහ මනෝ උපදේශන වේලාවන් වෙන්කරවා ගැනීමට Helping Hearts ආයතනය හා සම්බන්ධ වන්න: 0742344251*`,
    image: '/src/assets/images/bdd_paper_article_1786275528886.jpg',
    author: 'Ms. Ramsina Farvin Jelaldeen',
    category: 'Paper Articles & BDD',
    tags: ['BDD', 'Body Dysmorphic Disorder', 'Social Anxiety', 'Paper Article', 'Psychotherapy', 'Ramsina Farvin Jelaldeen'],
    publishedAt: '2024-01-25',
    status: 'PUBLISHED',
    featured: true,
    metaTitle: 'Body Dysmorphic Disorder (BDD) Paper Article | Ms. Ramsina Farvin Jelaldeen',
    metaDescription: 'Read the official published paper article on Body Dysmorphic Disorder (BDD) by Ms. Ramsina Farvin Jelaldeen at Helping Hearts Counselling & Wellness Centre.'
  },
  {
    id: 'blg-1',
    title: 'Understanding Anxiety: 5 Grounding Techniques You Can Practice Today',
    slug: 'understanding-anxiety-grounding-techniques',
    summary: 'Simple somatic strategies to calm a racing heart and restore mental focus during unexpected anxiety episodes.',
    content: `Anxiety is a natural nervous system response to perceived threat. However, when chronic, it can significantly affect daily quality of life.

### The 5-4-3-2-1 Sensory Method

When you feel panic rising, focus on your immediate surroundings:
1. **5 Things You Can See:** Notice subtle details in your environment.
2. **4 Things You Can Touch:** Feel the fabric of your chair or the texture of your desk.
3. **3 Things You Can Hear:** Listen for distant ambient sounds.
4. **2 Things You Can Smell:** Inhale subtle aromas around you.
5. **1 Thing You Can Taste:** Notice the lingering taste in your mouth.

Practicing diaphragmatic breathing alongside sensory grounding signaling safety to your amygdala, bringing your heart rate back to baseline.`,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    author: 'Ms. Ramsina Farvin Jelaldeen',
    category: 'Mental Health Tips',
    tags: ['Anxiety', 'Grounding', 'Mindfulness', 'Self-Care'],
    publishedAt: '2026-07-20',
    status: 'PUBLISHED',
    metaTitle: '5 Grounding Techniques for Anxiety | Helping Hearts',
    metaDescription: 'Learn effective grounding techniques for managing panic and anxiety from senior psychologist Ms. Ramsina Farvin Jelaldeen.'
  },
  {
    id: 'blg-2',
    title: 'The Art of Active Listening in Relationships',
    slug: 'art-of-active-listening-couples',
    summary: 'Why listening to understand rather than to reply is the foundation of long-lasting partnership intimacy.',
    content: `Most communication breakdowns happen when partners listen with the sole intent to defend themselves. Active listening transforms conflict into connection.

### Core Rules for Couples:
- Hold eye contact without checking smartphones.
- Reflect back what you heard before stating your rebuttal.
- Validate your partner's emotion even if you disagree with their conclusion.`,
    image: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=800&auto=format&fit=crop',
    author: 'Mr. Lalin Gunaratne',
    category: 'Relationship Advice',
    tags: ['Couples', 'Communication', 'Relationships'],
    publishedAt: '2026-08-01',
    status: 'PUBLISHED'
  }
];

export const initialGallery: GalleryMedia[] = [
  {
    id: 'gal-free-sessions',
    title: 'Free Sessions: Community Mental Health & Counselling Workshops',
    type: 'ALBUM',
    url: freeSessionsData[0].posterSvgUrl,
    thumbnailUrl: freeSessionsData[0].posterSvgUrl,
    category: 'Workshops',
    folder: 'Workshops/Free Sessions',
    caption: 'Official promotional posters and documentation for our 8 Free Sessions community workshops — including Sport Psychology, STI Awareness, Mindfulness 5 Steps, Nada Yoga Sound Alchemy, Family Planning, Personal Transformation, and Overcoming Exam Anxiety.',
    date: '2026-08-01',
    items: freeSessionsData.map((session, index) => ({
      id: `free-session-flyer-${index + 1}`,
      type: 'IMAGE' as const,
      url: session.posterSvgUrl,
      thumbnailUrl: session.posterSvgUrl,
      folder: 'Workshops/Free Sessions',
      title: session.titleSinhala ? `${session.titleSinhala} | ${session.title}` : session.title,
      caption: `Trainer: ${session.speakerName} (${session.speakerTitle}) • Date & Time: ${session.date}, ${session.time} • Platform: ${session.platform} • Inquiries: ${session.contactNumber}. ${session.description}`
    }))
  },
  {
    id: 'gal-1',
    title: 'Diploma Student Graduation Ceremony 2025',
    type: 'ALBUM',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    category: 'Training',
    folder: 'Training/Graduation 2025',
    caption: 'Celebrating our proud graduates of the Professional Counselling Diploma with ceremonial awards and keynote addresses.',
    date: '2025-12-10',
    items: [
      {
        id: 'item-1-1',
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
        folder: 'Training/Graduation 2025',
        title: 'Graduating Cohort Group Photo',
        caption: 'Diploma in Applied Counselling batch of 2025 at the BMICH auditorium.'
      },
      {
        id: 'item-1-2',
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop',
        folder: 'Training/Graduation 2025',
        title: 'Certificates Presentation Stage',
        caption: 'Outstanding achievement awards handed out by Chief Academic Officer.'
      },
      {
        id: 'item-1-3',
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop',
        folder: 'Training/Graduation 2025',
        title: 'Faculty & Student Mentorship Circle',
        caption: 'Lecturers sharing valedictory congratulations with certified practitioners.'
      },
      {
        id: 'item-1-4',
        type: 'YOUTUBE_VIDEO',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        folder: 'Training/Graduation 2025',
        title: 'Graduation Ceremony Highlights Reel',
        caption: 'Video montage and graduate testimonial speeches.'
      }
    ]
  },
  {
    id: 'gal-2',
    title: 'Community Mindfulness Workshop Highlights',
    type: 'ALBUM',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    category: 'Workshops',
    folder: 'Workshops/Mindfulness in Park',
    caption: 'Outdoor mindfulness and nervous system regulation session conducted at Viharamahadevi Park.',
    date: '2026-03-15',
    items: [
      {
        id: 'item-2-1',
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
        folder: 'Workshops/Mindfulness in Park',
        title: 'Guided Morning Meditation in the Park',
        caption: 'Deep breathing practice under the morning canopy.'
      },
      {
        id: 'item-2-2',
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
        folder: 'Workshops/Mindfulness in Park',
        title: 'Somatic Movement & Posture Grounding',
        caption: 'Gentle somatic exercises for anxiety relief and mental decompression.'
      },
      {
        id: 'item-2-3',
        type: 'YOUTUBE_VIDEO',
        url: 'https://www.youtube.com/watch?v=inpok4MKVLM',
        thumbnailUrl: 'https://img.youtube.com/vi/inpok4MKVLM/hqdefault.jpg',
        folder: 'Workshops/Mindfulness in Park',
        title: 'Mindfulness Practice Video Walkthrough',
        caption: 'Full 5-minute guided grounding routine.'
      }
    ]
  },
  {
    id: 'gal-3',
    title: 'Understanding CBT Seminar & Clinical Case Studies',
    type: 'ALBUM',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    category: 'Events',
    folder: 'Events/CBT Clinical Seminar',
    caption: 'Keynote introduction to Cognitive Behavioral Therapy frameworks and case studies by Dr. Kavinda De Silva.',
    date: '2026-05-20',
    items: [
      {
        id: 'item-3-1',
        type: 'YOUTUBE_VIDEO',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
        folder: 'Events/CBT Clinical Seminar',
        title: 'Seminar Keynote Stream',
        caption: 'Live presentation on identifying automatic negative thoughts (ANTs).'
      },
      {
        id: 'item-3-2',
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
        folder: 'Events/CBT Clinical Seminar',
        title: 'Case Study Interactive Workshop',
        caption: 'Trainees examining real clinical case vignettes in focus groups.'
      }
    ]
  },
  {
    id: 'gal-4',
    title: 'National Television Mental Health Awareness Live Broadcast',
    type: 'ALBUM',
    url: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=800&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=800&auto=format&fit=crop',
    category: 'TV Programmes',
    folder: 'Media & TV/Awareness Broadcasts',
    caption: 'Special studio panel discussion on stress management, youth mental health, and destigmatizing therapy.',
    date: '2026-06-10',
    items: [
      {
        id: 'item-4-1',
        type: 'YOUTUBE_VIDEO',
        url: 'https://www.youtube.com/watch?v=inpok4MKVLM',
        thumbnailUrl: 'https://img.youtube.com/vi/inpok4MKVLM/hqdefault.jpg',
        folder: 'Media & TV/Awareness Broadcasts',
        title: 'Live Studio Interview & Q&A Segment',
        caption: 'Senior psychotherapist addressing caller questions on coping with exam and workplace stress.'
      },
      {
        id: 'item-4-2',
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=800&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=800&auto=format&fit=crop',
        folder: 'Media & TV/Awareness Broadcasts',
        title: 'TV Studio Recording Set',
        caption: 'Behind-the-scenes recording with the broadcast production team.'
      },
      {
        id: 'item-4-3',
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=800&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=800&auto=format&fit=crop',
        folder: 'Media & TV/Awareness Broadcasts',
        title: 'Panel Discussion & Expert Insights',
        caption: 'Clinical faculty discussing community mental wellness strategies.'
      }
    ]
  }
];

export const initialAppointments: ClientAppointment[] = [
  {
    id: 'app-1001',
    referenceNo: 'HH-APP-2026-001',
    fullName: 'Nimali Jayawardena',
    email: 'nimali.j@gmail.com',
    phone: '+94 71 888 9900',
    serviceId: 'srv-1',
    serviceTitle: 'Individual Counseling',
    preferredDate: '2026-08-15',
    preferredTime: '10:00 AM',
    sessionType: 'Physical',
    notes: 'Experiencing severe work stress and difficulty sleeping.',
    status: 'Pending',
    createdAt: '2026-08-05T08:30:00Z',
    updatedAt: '2026-08-05T08:30:00Z'
  },
  {
    id: 'app-1002',
    referenceNo: 'HH-APP-2026-002',
    fullName: 'Kamal & Dilhani Perera',
    email: 'kamal.perera@hotmail.com',
    phone: '+94 77 999 1122',
    serviceId: 'srv-4',
    serviceTitle: 'Relationship Counseling',
    preferredDate: '2026-08-16',
    preferredTime: '02:00 PM',
    sessionType: 'Physical',
    notes: 'Seeking guidance for marital communication improvements.',
    status: 'Confirmed',
    adminNotes: 'Assigned to Mr. Lalin Gunaratne (Room 2)',
    createdAt: '2026-08-06T11:20:00Z',
    updatedAt: '2026-08-06T14:10:00Z'
  }
];

export const initialRegistrations: StudentRegistration[] = [
  {
    id: 'reg-2001',
    fullName: 'Saman Kumara',
    email: 'student@helpinghearts.lk',
    phone: '+94 75 123 4567',
    dob: '1998-05-14',
    address: '123 Main Street, Kandy',
    courseId: 'crs-1',
    courseTitle: 'Diploma in Professional Counselling Psychology',
    paymentMethod: 'Bank Transfer',
    paymentSlipUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
    paymentRef: 'SLIP-998822',
    amountPaid: 45000,
    status: 'Approved',
    assignedUsername: 'saman_cbt2026',
    assignedPassword: 'Student2026#HH',
    submittedAt: '2026-08-01T10:00:00Z',
    reviewedAt: '2026-08-02T09:15:00Z'
  },
  {
    id: 'reg-2002',
    fullName: 'Anushka Wickramasinghe',
    email: 'anushka.w@yahoo.com',
    phone: '+94 76 444 8899',
    dob: '2000-11-22',
    address: '45 Galle Road, Panadura',
    courseId: 'crs-2',
    courseTitle: 'Advanced Certificate in Cognitive Behavioral Therapy (CBT)',
    paymentMethod: 'Bank Transfer',
    paymentSlipUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
    paymentRef: 'SLIP-773311',
    amountPaid: 35000,
    status: 'Pending',
    assignedUsername: 'anushka_w2026',
    assignedPassword: 'HHPass2026!3',
    submittedAt: '2026-08-07T14:30:00Z'
  }
];

export const initialAttendance: AttendanceRecord[] = [
  {
    id: 'att-1',
    studentId: 'std-1',
    studentName: 'Saman Kumara',
    courseId: 'crs-1',
    courseTitle: 'Diploma in Professional Counselling Psychology',
    sessionDate: '2026-08-01',
    sessionTitle: 'Orientation & Ethics Lecture',
    status: 'Present',
    markedBy: 'Ms. Ramsina Farvin Jelaldeen'
  },
  {
    id: 'att-2',
    studentId: 'std-1',
    studentName: 'Saman Kumara',
    courseId: 'crs-1',
    courseTitle: 'Diploma in Professional Counselling Psychology',
    sessionDate: '2026-08-08',
    sessionTitle: 'Active Listening Practical Session',
    status: 'Present',
    markedBy: 'Ms. Ramsina Farvin Jelaldeen'
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'anc-1',
    title: 'Welcome to Term 3 - Orientation Details',
    content: 'Dear students, the inauguration session for the Diploma in Counselling will commence on Saturday at 9:00 AM sharp in the Main Auditorium.',
    targetRole: 'STUDENTS',
    courseId: 'crs-1',
    createdAt: '2026-08-01',
    authorName: 'Admin Office'
  }
];

export const initialUsers: User[] = [
  {
    id: 'usr-admin',
    name: 'Chief Administrator',
    email: 'admin@helpinghearts.lk',
    role: 'ADMIN',
    phone: '+94 11 234 5678',
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'usr-counsellor-admin',
    name: 'Counselling Desk Manager',
    email: 'counselling@helpinghearts.lk',
    role: 'COUNSELLING_ADMIN',
    phone: '+94 11 234 5679',
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'usr-lecturer-1',
    name: 'Miss Ramsina Farvin Jelaldeen',
    email: 'ramsina.jelaldeen@helpingheartswellness.org',
    role: 'LECTURER',
    phone: '+94 77 111 2233',
    status: 'ACTIVE',
    createdAt: '2026-01-01'
  },
  {
    id: 'usr-student-1',
    name: 'Saman Kumara',
    email: 'student@helpinghearts.lk',
    role: 'STUDENT',
    phone: '+94 75 123 4567',
    status: 'ACTIVE',
    createdAt: '2026-08-02'
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Nadeesha Wickramasinghe',
    role: 'Higher Diploma in Counselling Psychology Graduate',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    content: 'Studying at Helping Hearts completely transformed my understanding of clinical psychotherapy. The guidance from Ms. Ramsina and the faculty provided both academic depth and practical case supervision that prepared me to serve our community with empathy.',
    rating: 5,
    category: 'STUDENT',
    featured: true,
    createdAt: '2026-06-15'
  },
  {
    id: 'test-2',
    name: 'Dilshan Fernando',
    role: 'Corporate Professional & Individual Counselling Client',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    content: 'The confidential counselling sessions helped me overcome severe burnout and work-related anxiety. The atmosphere is genuinely peaceful, non-judgmental, and deeply professional. I am truly grateful to the clinical team at Helping Hearts.',
    rating: 5,
    category: 'CLIENT',
    featured: true,
    createdAt: '2026-07-02'
  },
  {
    id: 'test-3',
    name: 'Fathima Rizwana',
    role: 'Diploma in Child & Adolescent Psychology Student',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    content: 'The LMS portal with recorded video lessons, downloadable study guides, and interactive Saturday sessions made balancing my family and studies seamless. Highly recommended for anyone passionate about child behavioral psychology!',
    rating: 5,
    category: 'STUDENT',
    featured: true,
    createdAt: '2026-07-20'
  },
  {
    id: 'test-4',
    name: 'Anoma & Kusal Perera',
    role: 'Couples & Family Therapy Clients',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    content: 'Helping Hearts gave our relationship a renewed foundation of mutual understanding, active listening, and trust. The psychotherapists here are exceptionally skilled and compassionate.',
    rating: 5,
    category: 'CLIENT',
    featured: true,
    createdAt: '2026-08-01'
  }
];

export const initialFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Is my counselling session strictly confidential?',
    answer: 'Yes, 100%. All client counselling information is strictly confidential and protected by ethical psychological practice guidelines. Client records are completely isolated and never accessible by students or non-clinical personnel.',
    category: 'Counselling & Confidentiality',
    order: 1
  },
  {
    id: 'faq-2',
    question: 'How does the student manual payment verification work?',
    answer: 'When you register for a course, you can upload your bank deposit slip or transaction reference. Our finance administration verifies your payment slip within 12-24 hours and activates your full access to video lectures and Google Drive materials.',
    category: 'Admissions & LMS',
    order: 2
  },
  {
    id: 'faq-3',
    question: 'Are online counselling sessions as effective as in-person sessions?',
    answer: 'Yes, research demonstrates that encrypted video counselling produces comparable clinical outcomes for anxiety, depression, stress management, and couples therapy. It offers the added convenience of therapy from your home.',
    category: 'Counselling & Confidentiality',
    order: 3
  },
  {
    id: 'faq-4',
    question: 'What qualifications do I need to enroll in the Diploma in Counselling Psychology?',
    answer: 'Applicants require G.C.E. Advanced Level qualification (or equivalent work experience) and a genuine commitment to empathetic human communication.',
    category: 'Admissions & LMS',
    order: 4
  },
  {
    id: 'faq-5',
    question: 'How do I access course learning materials once enrolled?',
    answer: 'Once approved by Admin, simply log into the Student LMS Portal. You will see your enrolled courses, YouTube video modules, downloadable Google Drive reading materials, and attendance history.',
    category: 'Admissions & LMS',
    order: 5
  }
];
