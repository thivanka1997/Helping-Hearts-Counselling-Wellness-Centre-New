import {
  SiteSettings,
  CounsellingService,
  ClientAppointment,
  Lecturer,
  Course,
  CourseModule,
  StudentRegistration,
  AttendanceRecord,
  EventWorkshop,
  BlogArticle,
  GalleryMedia,
  Announcement,
  User,
  Testimonial,
  FAQItem
} from '../src/types';
import {
  initialSiteSettings,
  initialLecturers,
  initialCounsellingServices,
  initialCourses,
  initialCourseModules,
  initialEvents,
  initialBlogs,
  initialGallery,
  initialAppointments,
  initialRegistrations,
  initialAttendance,
  initialAnnouncements,
  initialUsers,
  initialTestimonials,
  initialFAQs
} from '../src/data/initialData';

async function fetchJson<T>(url: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (fallback !== undefined) return fallback;
    throw err;
  }
}

export const api = {
  // Settings
  getSettings: () => fetchJson<SiteSettings>('/api/settings', undefined, initialSiteSettings),
  updateSettings: (data: Partial<SiteSettings>) =>
    fetchJson<{ success: boolean; settings: SiteSettings }>('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),

  // Services
  getServices: () => fetchJson<CounsellingService[]>('/api/services', undefined, initialCounsellingServices),
  createService: (data: Omit<CounsellingService, 'id'>) =>
    fetchJson<{ success: boolean; service: CounsellingService }>('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  updateService: (id: string, data: Partial<CounsellingService>) =>
    fetchJson<{ success: boolean }>(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  deleteService: (id: string) =>
    fetchJson<{ success: boolean }>(`/api/services/${id}`, { method: 'DELETE' }),

  // Appointments
  getAppointments: () => fetchJson<ClientAppointment[]>('/api/appointments', undefined, initialAppointments),
  createAppointment: (data: Omit<ClientAppointment, 'id' | 'referenceNo' | 'status' | 'createdAt' | 'updatedAt'>) =>
    fetchJson<{ success: boolean; appointment: ClientAppointment }>('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  updateAppointment: (id: string, data: Partial<ClientAppointment>) =>
    fetchJson<{ success: boolean }>(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),

  // Lecturers
  getLecturers: () => fetchJson<Lecturer[]>('/api/lecturers', undefined, initialLecturers),
  createLecturer: (data: Omit<Lecturer, 'id' | 'displayOrder'>) =>
    fetchJson<{ success: boolean; lecturer: Lecturer }>('/api/lecturers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  updateLecturer: (id: string, data: Partial<Lecturer>) =>
    fetchJson<{ success: boolean }>(`/api/lecturers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  deleteLecturer: (id: string) =>
    fetchJson<{ success: boolean }>(`/api/lecturers/${id}`, { method: 'DELETE' }),

  // Courses
  getCourses: () => fetchJson<Course[]>('/api/courses', undefined, initialCourses),
  createCourse: (data: Omit<Course, 'id' | 'createdAt'>) =>
    fetchJson<{ success: boolean; course: Course }>('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  updateCourse: (id: string, data: Partial<Course>) =>
    fetchJson<{ success: boolean }>(`/api/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  deleteCourse: (id: string) =>
    fetchJson<{ success: boolean }>(`/api/courses/${id}`, { method: 'DELETE' }),
  getCourseModules: (courseId: string) =>
    fetchJson<CourseModule[]>(`/api/courses/${courseId}/modules`, undefined, initialCourseModules.filter(m => m.courseId === courseId)),

  // Student Registrations
  getRegistrations: () => fetchJson<StudentRegistration[]>('/api/registrations', undefined, initialRegistrations),
  createRegistration: (data: Partial<StudentRegistration>) =>
    fetchJson<{ success: boolean; registration: StudentRegistration }>('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  updateRegistration: (id: string, data: Partial<StudentRegistration>) =>
    fetchJson<{ success: boolean; registration?: StudentRegistration }>(`/api/registrations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  updateRegistrationStatus: (id: string, status: 'Approved' | 'Rejected', rejectionReason?: string, extra?: Partial<StudentRegistration>) =>
    fetchJson<{ success: boolean }>(`/api/registrations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, rejectionReason, ...extra })
    }),

  // Attendance
  getAttendance: () => fetchJson<AttendanceRecord[]>('/api/attendance', undefined, initialAttendance),
  markAttendance: (record: Omit<AttendanceRecord, 'id'>) =>
    fetchJson<{ success: boolean; record: AttendanceRecord }>('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    }),

  // Events
  getEvents: () => fetchJson<EventWorkshop[]>('/api/events', undefined, initialEvents),
  createEvent: (data: Omit<EventWorkshop, 'id'>) =>
    fetchJson<{ success: boolean; event: EventWorkshop }>('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  updateEvent: (id: string, data: Partial<EventWorkshop>) =>
    fetchJson<{ success: boolean }>(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  deleteEvent: (id: string) =>
    fetchJson<{ success: boolean }>(`/api/events/${id}`, { method: 'DELETE' }),

  // Blogs
  getBlogs: () => fetchJson<BlogArticle[]>('/api/blogs', undefined, initialBlogs),
  createBlog: (data: Omit<BlogArticle, 'id' | 'publishedAt'>) =>
    fetchJson<{ success: boolean; blog: BlogArticle }>('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  updateBlog: (id: string, data: Partial<BlogArticle>) =>
    fetchJson<{ success: boolean }>(`/api/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  deleteBlog: (id: string) =>
    fetchJson<{ success: boolean }>(`/api/blogs/${id}`, { method: 'DELETE' }),

  // Gallery
  getGallery: () => fetchJson<GalleryMedia[]>('/api/gallery', undefined, initialGallery),
  createGalleryItem: (data: Omit<GalleryMedia, 'id'>) =>
    fetchJson<{ success: boolean; item: GalleryMedia }>('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  updateGalleryItem: (id: string, data: Partial<GalleryMedia>) =>
    fetchJson<{ success: boolean }>(`/api/gallery/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  deleteGalleryItem: (id: string) =>
    fetchJson<{ success: boolean }>(`/api/gallery/${id}`, { method: 'DELETE' }),

  // Announcements
  getAnnouncements: () => fetchJson<Announcement[]>('/api/announcements', undefined, initialAnnouncements),
  createAnnouncement: (data: Omit<Announcement, 'id' | 'createdAt'>) =>
    fetchJson<{ success: boolean; announcement: Announcement }>('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),

  // Testimonials
  getTestimonials: () => fetchJson<Testimonial[]>('/api/testimonials', undefined, initialTestimonials),
  createTestimonial: (data: Omit<Testimonial, 'id' | 'createdAt'>) =>
    fetchJson<{ success: boolean; testimonial: Testimonial }>('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  updateTestimonial: (id: string, data: Partial<Testimonial>) =>
    fetchJson<{ success: boolean; testimonial?: Testimonial }>(`/api/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  deleteTestimonial: (id: string) =>
    fetchJson<{ success: boolean }>(`/api/testimonials/${id}`, { method: 'DELETE' }),

  // FAQs
  getFAQs: () => fetchJson<FAQItem[]>('/api/faqs', undefined, initialFAQs),
  createFAQ: (data: Omit<FAQItem, 'id'>) =>
    fetchJson<{ success: boolean; faq: FAQItem }>('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  updateFAQ: (id: string, data: Partial<FAQItem>) =>
    fetchJson<{ success: boolean; faq?: FAQItem }>(`/api/faqs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  deleteFAQ: (id: string) =>
    fetchJson<{ success: boolean }>(`/api/faqs/${id}`, { method: 'DELETE' }),

  // Direct User Management
  getUsers: () => fetchJson<User[]>('/api/users', undefined, initialUsers),
  createUser: (data: Partial<User>) =>
    fetchJson<{ success: boolean; user: User }>('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  updateUser: (id: string, data: Partial<User>) =>
    fetchJson<{ success: boolean; user?: User }>(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  deleteUser: (id: string) =>
    fetchJson<{ success: boolean }>(`/api/users/${id}`, { method: 'DELETE' })
};
