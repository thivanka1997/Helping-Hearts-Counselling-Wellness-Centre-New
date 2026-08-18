import mongoose, { Schema, Document } from 'mongoose';

const RegistrationSchema = new Schema({
  id: { type: String, required: true, unique: true },
  studentId: { type: String },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: String, default: '' },
  address: { type: String, default: '' },
  courseId: { type: String, required: true },
  courseTitle: { type: String, required: true },
  paymentMethod: { type: String, enum: ['Bank Transfer', 'Online Gateway', 'Cash'], default: 'Bank Transfer' },
  paymentSlipUrl: { type: String },
  paymentRef: { type: String },
  amountPaid: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  rejectionReason: { type: String },
  assignedUsername: { type: String },
  assignedPassword: { type: String },
  adminNotes: { type: String },
  submittedAt: { type: String, default: () => new Date().toISOString() },
  reviewedAt: { type: String }
}, { timestamps: true });

export default mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);
