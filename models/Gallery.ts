import mongoose, { Schema, Document } from 'mongoose';

const MediaItemSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['IMAGE', 'YOUTUBE_VIDEO'], default: 'IMAGE' },
  url: { type: String, required: true },
  thumbnailUrl: { type: String },
  title: { type: String },
  caption: { type: String },
  folder: { type: String }
});

const GallerySchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['IMAGE', 'YOUTUBE_VIDEO', 'ALBUM'], default: 'IMAGE' },
  url: { type: String, required: true },
  thumbnailUrl: { type: String },
  category: { type: String, default: 'Gallery' },
  folder: { type: String },
  caption: { type: String },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  items: [MediaItemSchema]
}, { timestamps: true });

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
