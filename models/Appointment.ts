import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointmentDocument extends Document {
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
  status: 'Pending' | 'Confirmed' | 'Rescheduled' | 'Completed' | 'Cancelled';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const AppointmentSchema = new Schema<IAppointmentDocument>({
  id: { type: String, required: true, unique: true },
  referenceNo: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  serviceId: { type: String, required: true },
  serviceTitle: { type: String, required: true },
  preferredDate: { type: String, required: true },
  preferredTime: { type: String, required: true },
  sessionType: { type: String, enum: ['Physical', 'Online'], default: 'Physical' },
  notes: { type: String },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled'], default: 'Pending' },
  adminNotes: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

export default mongoose.models.Appointment || mongoose.model<IAppointmentDocument>('Appointment', AppointmentSchema);
