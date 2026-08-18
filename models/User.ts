import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../src/types';

export interface IUserDocument extends Document {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  username?: string;
  password?: string;
  assignedPassword?: string;
  courseTitle?: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  createdAt: string;
}

const UserSchema = new Schema<IUserDocument>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'LECTURER', 'STUDENT', 'COUNSELLING_ADMIN'], default: 'STUDENT' },
  phone: { type: String },
  avatar: { type: String },
  username: { type: String },
  password: { type: String },
  assignedPassword: { type: String },
  courseTitle: { type: String },
  status: { type: String, enum: ['ACTIVE', 'PENDING', 'SUSPENDED'], default: 'ACTIVE' },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
