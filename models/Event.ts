import mongoose, { Schema, Document } from 'mongoose';

const EventSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: { type: String, enum: ['EVENT', 'WORKSHOP'], default: 'EVENT' },
  description: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: String, required: true },
  isOnline: { type: Boolean, default: false },
  image: { type: String, required: true },
  videoUrl: { type: String },
  registrationUrl: { type: String },
  status: { type: String, enum: ['PUBLISHED', 'DRAFT'], default: 'PUBLISHED' },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
