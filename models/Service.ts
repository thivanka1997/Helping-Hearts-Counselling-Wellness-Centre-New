import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceDocument extends Document {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  benefits: string[];
  sessionDuration: string;
  format: 'In-Person' | 'Online' | 'Both';
  category: string;
  featured: boolean;
}

const ServiceSchema = new Schema<IServiceDocument>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDesc: { type: String, required: true },
  fullDesc: { type: String, required: true },
  image: { type: String, required: true },
  benefits: [{ type: String }],
  sessionDuration: { type: String, required: true },
  format: { type: String, enum: ['In-Person', 'Online', 'Both'], default: 'Both' },
  category: { type: String, default: 'General' },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model<IServiceDocument>('Service', ServiceSchema);
