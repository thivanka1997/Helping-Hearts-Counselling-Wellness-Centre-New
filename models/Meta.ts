import mongoose, { Schema, Document } from 'mongoose';

export interface IMetaDocument extends Document {
  key: string;
  value: any;
  updatedAt: Date;
}

const MetaSchema = new Schema<IMetaDocument>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, default: true }
}, { timestamps: true });

export default mongoose.models.Meta || mongoose.model<IMetaDocument>('Meta', MetaSchema);
