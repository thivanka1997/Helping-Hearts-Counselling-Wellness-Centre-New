import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Settings from '@/models/Settings';
import Service from '@/models/Service';
import Appointment from '@/models/Appointment';
import Lecturer from '@/models/Lecturer';
import Course from '@/models/Course';
import CourseModule from '@/models/CourseModule';
import Registration from '@/models/Registration';
import Attendance from '@/models/Attendance';
import Event from '@/models/Event';
import Blog from '@/models/Blog';
import Gallery from '@/models/Gallery';
import Announcement from '@/models/Announcement';
import Testimonial from '@/models/Testimonial';
import FAQ from '@/models/FAQ';
import Meta from '@/models/Meta';
import {
  initialUsers,
  initialSiteSettings,
  initialCounsellingServices,
  initialAppointments,
  initialLecturers,
  initialCourses,
  initialCourseModules,
  initialRegistrations,
  initialAttendance,
  initialEvents,
  initialBlogs,
  initialGallery,
  initialAnnouncements,
  initialTestimonials,
  initialFAQs
} from '@/src/data/initialData';

export async function POST(req: Request) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: false, error: 'Database connection not available' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const force = searchParams.get('force') === 'true';

    // Users
    if (force || await User.countDocuments() === 0) {
      if (force) await User.deleteMany({});
      await User.insertMany(initialUsers);
    }

    // Settings
    if (force || await Settings.countDocuments() === 0) {
      if (force) await Settings.deleteMany({});
      await Settings.create(initialSiteSettings);
    }

    // Services
    if (force || await Service.countDocuments() === 0) {
      if (force) await Service.deleteMany({});
      await Service.insertMany(initialCounsellingServices);
    }

    // Appointments
    if (force || await Appointment.countDocuments() === 0) {
      if (force) await Appointment.deleteMany({});
      await Appointment.insertMany(initialAppointments);
    }

    // Lecturers
    if (force || await Lecturer.countDocuments() === 0) {
      if (force) await Lecturer.deleteMany({});
      await Lecturer.insertMany(initialLecturers);
    }

    // Courses
    if (force || await Course.countDocuments() === 0) {
      if (force) await Course.deleteMany({});
      await Course.insertMany(initialCourses);
    }

    // Course Modules
    if (force || await CourseModule.countDocuments() === 0) {
      if (force) await CourseModule.deleteMany({});
      await CourseModule.insertMany(initialCourseModules);
    }

    // Registrations
    if (force || await Registration.countDocuments() === 0) {
      if (force) await Registration.deleteMany({});
      await Registration.insertMany(initialRegistrations);
    }

    // Attendance
    if (force || await Attendance.countDocuments() === 0) {
      if (force) await Attendance.deleteMany({});
      await Attendance.insertMany(initialAttendance);
    }

    // Events
    if (force || await Event.countDocuments() === 0) {
      if (force) await Event.deleteMany({});
      await Event.insertMany(initialEvents);
    }

    // Blogs
    if (force || await Blog.countDocuments() === 0) {
      if (force) await Blog.deleteMany({});
      await Blog.insertMany(initialBlogs);
    }

    // Gallery
    if (force || await Gallery.countDocuments() === 0) {
      if (force) await Gallery.deleteMany({});
      await Gallery.insertMany(initialGallery);
    }

    // Announcements
    if (force || await Announcement.countDocuments() === 0) {
      if (force) await Announcement.deleteMany({});
      await Announcement.insertMany(initialAnnouncements);
    }

    // Testimonials
    if (force || await Testimonial.countDocuments() === 0) {
      if (force) await Testimonial.deleteMany({});
      await Testimonial.insertMany(initialTestimonials);
      await Meta.findOneAndUpdate(
        { key: 'testimonials_initialized' },
        { key: 'testimonials_initialized', value: true },
        { upsert: true }
      );
    }

    // FAQs
    if (force || await FAQ.countDocuments() === 0) {
      if (force) await FAQ.deleteMany({});
      await FAQ.insertMany(initialFAQs);
      await Meta.findOneAndUpdate(
        { key: 'faqs_initialized' },
        { key: 'faqs_initialized', value: true },
        { upsert: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with initial Helping Hearts data.'
    });
  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
