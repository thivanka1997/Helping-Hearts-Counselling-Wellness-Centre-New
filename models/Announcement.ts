import mongoose, { Schema, Document } from 'mongoose';

const AnnouncementSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  targetRole: { type: String, enum: ['ALL', 'STUDENTS', 'LECTURERS'], default: 'ALL' },
  courseId: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() },
  authorName: { type: String, default: 'Administration' }
}, { timestamps: true });

export default mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
