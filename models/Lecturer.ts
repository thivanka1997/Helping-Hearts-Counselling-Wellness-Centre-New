import mongoose, { Schema, Document } from 'mongoose';

export interface ILecturerDocument extends Document {
  id: string;
  userId?: string;
  name: string;
  title: string;
  photo: string;
  qualifications: string;
  specialization: string;
  bio: string;
  coursesAssigned: string[];
  email: string;
  phone: string;
  displayOrder: number;
  username?: string;
  password?: string;
}

const LecturerSchema = new Schema<ILecturerDocument>({
  id: { type: String, required: true, unique: true },
  userId: { type: String },
  name: { type: String, required: true },
  title: { type: String, required: true },
  photo: { type: String, required: true },
  qualifications: { type: String, required: true },
  specialization: { type: String, required: true },
  bio: { type: String, required: true },
  coursesAssigned: [{ type: String }],
  email: { type: String, required: true },
  phone: { type: String, required: true },
  displayOrder: { type: Number, default: 0 },
  username: { type: String },
  password: { type: String }
}, { timestamps: true });

export default mongoose.models.Lecturer || mongoose.model<ILecturerDocument>('Lecturer', LecturerSchema);
