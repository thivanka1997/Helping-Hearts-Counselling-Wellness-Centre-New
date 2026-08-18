import mongoose, { Schema, Document } from 'mongoose';

export interface IFAQDocument extends Document {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
}

const FAQSchema = new Schema<IFAQDocument>({
  id: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.FAQ || mongoose.model<IFAQDocument>('FAQ', FAQSchema);
