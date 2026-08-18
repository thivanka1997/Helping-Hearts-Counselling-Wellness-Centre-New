import mongoose, { Schema, Document } from 'mongoose';

const AttendanceSchema = new Schema({
  id: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  courseId: { type: String, required: true },
  courseTitle: { type: String, required: true },
  sessionDate: { type: String, required: true },
  sessionTitle: { type: String, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'Excused'], default: 'Present' },
  markedBy: { type: String, default: 'Admin' },
  remarks: { type: String }
}, { timestamps: true });

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
