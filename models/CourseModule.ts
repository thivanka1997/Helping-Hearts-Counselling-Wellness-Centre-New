import mongoose, { Schema, Document } from 'mongoose';

const LessonSchema = new Schema({
  id: { type: String, required: true },
  moduleId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  videoUrl: { type: String },
  type: { type: String, default: 'VIDEO' },
  medium: { type: String, default: 'Sinhala' },
  date: { type: String, default: '' },
  meetingId: { type: String },
  meetingPasscode: { type: String },
  meetingTime: { type: String },
  dueDate: { type: String },
  assignmentInstructions: { type: String },
  maxScore: { type: Number, default: 100 },
  resources: [{
    id: { type: String },
    title: { type: String },
    type: { type: String, enum: ['PDF', 'DOC', 'PPT', 'LINK', 'VIDEO', 'ASSIGNMENT', 'MEETING'] },
    url: { type: String },
    description: { type: String },
    dueDate: { type: String },
    medium: { type: String, default: 'Sinhala' },
    date: { type: String, default: '' }
  }],
  order: { type: Number, default: 0 },
  durationMinutes: { type: Number, default: 45 }
});

const CourseModuleSchema = new Schema({
  id: { type: String, required: true, unique: true },
  courseId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
  lessons: [LessonSchema]
}, { timestamps: true });

export default mongoose.models.CourseModule || mongoose.model('CourseModule', CourseModuleSchema);
