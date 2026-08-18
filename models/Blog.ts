import mongoose, { Schema, Document } from 'mongoose';

const BlogSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, default: 'Mental Health' },
  tags: [{ type: String }],
  publishedAt: { type: String, default: () => new Date().toISOString().split('T')[0] },
  status: { type: String, enum: ['PUBLISHED', 'DRAFT'], default: 'PUBLISHED' },
  featured: { type: Boolean, default: false },
  videoUrl: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String }
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
