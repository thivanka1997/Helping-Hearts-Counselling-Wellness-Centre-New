import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonialDocument extends Document {
  id: string;
  name: string;
  role: string;
  photo?: string;
  content: string;
  rating: number;
  category?: string;
  featured: boolean;
  createdAt: string;
}

const TestimonialSchema = new Schema<ITestimonialDocument>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  photo: { type: String },
  content: { type: String, required: true },
  rating: { type: Number, default: 5 },
  category: { type: String, default: 'GENERAL' },
  featured: { type: Boolean, default: true },
  createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

export default mongoose.models.Testimonial || mongoose.model<ITestimonialDocument>('Testimonial', TestimonialSchema);
