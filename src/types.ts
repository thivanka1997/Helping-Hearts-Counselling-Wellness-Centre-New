export type UserRole = 'ADMIN' | 'LECTURER' | 'STUDENT' | 'COUNSELLING_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  createdAt: string;
}

export interface Lecturer {
  id: string;
  userId?: string;
  name: string;
  title: string;
  photo: string;
  qualifications: string;
  specialization: string;
  bio: string;
  coursesAssigned: string[]; // course IDs
  email: string;
  phone: string;
  displayOrder: number;
  username?: string;   // portal login username
  password?: string;   // portal login password (set by admin)
}

export interface CounsellingService {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  benefits: string[];
  sessionDuration: string;
  format: 'In-Person' | 'Online' | 'Both';
  category: string;
  featured: boolean;
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Rescheduled' | 'Completed' | 'Cancelled';

export interface ClientAppointment {
  id: string;
  referenceNo: string;
  fullName: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceTitle: string;
  preferredDate: string;
  preferredTime: string;
  sessionType: 'Physical' | 'Online';
  notes?: string;
  status: AppointmentStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'PDF' | 'DOC' | 'PPT' | 'LINK';
  url: string;
  description?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  videoUrl?: string; // YouTube Video URL or ID
  resources: LessonResource[];
  order: number;
  durationMinutes: number;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  image: string;
  lecturerId: string;
  lecturerName: string;
  duration: string;
  schedule: string;
  fee: number;
  currency: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  status: 'Published' | 'Draft' | 'Archived';
  outcomes: string[];
  requirements: string[];
  modulesCount?: number;
  enrolledStudentsCount?: number;
  createdAt: string;
}

export type RegistrationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface StudentRegistration {
  id: string;
  studentId?: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  courseId: string;
  courseTitle: string;
  paymentMethod: 'Bank Transfer' | 'Online Gateway' | 'Cash';
  paymentSlipUrl?: string;
  paymentRef?: string;
  amountPaid: number;
  status: RegistrationStatus;
  rejectionReason?: string;
  assignedUsername?: string;
  assignedPassword?: string;
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED';
  completedLessons: string[]; // lesson IDs
  overallProgress: number; // percentage 0 - 100
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  sessionDate: string;
  sessionTitle: string;
  status: AttendanceStatus;
  markedBy: string;
  remarks?: string;
}

export interface EventWorkshop {
  id: string;
  title: string;
  slug: string;
  type: 'EVENT' | 'WORKSHOP';
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isOnline: boolean;
  image: string;
  videoUrl?: string;
  registrationUrl?: string;
  status: 'PUBLISHED' | 'DRAFT';
  featured: boolean;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  status: 'PUBLISHED' | 'DRAFT';
  featured?: boolean;
  videoUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface MediaItem {
  id: string;
  type: 'IMAGE' | 'YOUTUBE_VIDEO';
  url: string;
  thumbnailUrl?: string;
  title?: string;
  caption?: string;
  folder?: string;
}

export interface GalleryMedia {
  id: string;
  title: string;
  type: 'IMAGE' | 'YOUTUBE_VIDEO' | 'ALBUM';
  url: string;
  thumbnailUrl?: string;
  category: 'Events' | 'Workshops' | 'Training' | 'TV Programmes' | 'Clinical' | 'Ceremonies' | 'Gallery' | string;
  folder?: string; // Folder directory path, e.g. "Workshops/Free Sessions", "Events/Graduation 2025"
  caption?: string;
  date: string;
  items?: MediaItem[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetRole: 'ALL' | 'STUDENTS' | 'LECTURERS';
  courseId?: string;
  createdAt: string;
  authorName: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING';
  isRead: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  photo?: string;
  content: string;
  rating: number; // 1 to 5
  category?: 'STUDENT' | 'CLIENT' | 'WORKSHOP' | 'GENERAL';
  featured: boolean;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl?: string;
  phonePrimary: string;
  phoneSecondary?: string;
  emergencyHelpline: string;
  emailPrimary: string;
  addressPhysical: string;
  openingHours: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  currencySymbol: string;

  // Hero Section Customization
  heroBadge?: string;
  heroHeadline?: string;
  heroHeadlineHighlight?: string;
  heroSubheadline?: string;
  heroCtaPrimaryText?: string;
  heroCtaSecondaryText?: string;

  // About Section Customization
  aboutHeading?: string;
  aboutStory?: string;
  aboutVision?: string;
  aboutMission?: string;
  aboutValues?: string[];

  // Counters / Stats
  statClientsHelped?: string;
  statStudentsTrained?: string;
  statLecturersPanel?: string;
  statSatisfactionRate?: string;
}
