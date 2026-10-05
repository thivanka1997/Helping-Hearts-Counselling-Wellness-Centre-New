import mongoose, { Schema } from 'mongoose';

const MarketingLeadSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    district: { type: String, required: true },
    medium: {
      type: String,
      enum: ['Sinhala', 'Tamil', 'English'],
      default: 'Sinhala'
    },
    counsellingInterest: {
      type: String,
      enum: [
        'Yes, definitely',
        'Maybe / Need more information',
        'Just interested in the guide'
      ],
      default: 'Yes, definitely'
    },
    learningMode: {
      type: String,
      enum: ['Online', 'Physical', 'Both'],
      default: 'Online'
    },
    source: {
      type: String,
      enum: [
        'Facebook Group',
        'Facebook Page',
        'WhatsApp',
        'Friend / Referral',
        'Other'
      ],
      default: 'Facebook Group'
    },
    guideName: {
      type: String,
      default: 'Professional Counselling & Mental Health Starter Guide'
    },
    downloaded: { type: Boolean, default: false },
    whatsappForwarded: { type: Boolean, default: false },
    submittedAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true }
);

export default mongoose.models.MarketingLead ||
  mongoose.model('MarketingLead', MarketingLeadSchema);
