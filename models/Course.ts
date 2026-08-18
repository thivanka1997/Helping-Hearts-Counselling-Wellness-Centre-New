import mongoose, { Schema, Document } from 'mongoose';

export interface ICourseDocument extends Document {
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

const CourseSchema = new Schema<ICourseDocument>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDesc: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  lecturerId: { type: String, required: true },
  lecturerName: { type: String, required: true },
  duration: { type: String, required: true },
  schedule: { type: String, required: true },
  fee: { type: Number, required: true },
  currency: { type: String, default: 'LKR' },
  category: { type: String, default: 'Psychology' },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'], default: 'All Levels' },
  status: { type: String, enum: ['Published', 'Draft', 'Archived'], default: 'Published' },
  outcomes: [{ type: String }],
  requirements: [{ type: String }],
  modulesCount: { type: Number, default: 0 },
  enrolledStudentsCount: { type: Number, default: 0 },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model<ICourseDocument>('Course', CourseSchema);
