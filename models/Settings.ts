import mongoose, { Schema, Document } from 'mongoose';

export interface ISettingsDocument extends Document {
  siteName: string;
  tagline: string;
  logoUrl?: string;
  phonePrimary: string;
  phoneSecondary?: string;
  emergencyHelpline: string;
  emailPrimary: string;
  addressPhysical: string;
  openingHours: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  currencySymbol: string;

  heroBadge?: string;
  heroHeadline?: string;
  heroHeadlineHighlight?: string;
  heroSubheadline?: string;
  heroCtaPrimaryText?: string;
  heroCtaSecondaryText?: string;

  aboutHeading?: string;
  aboutStory?: string;
  aboutVision?: string;
  aboutMission?: string;
  aboutValues?: string[];

  statClientsHelped?: string;
  statStudentsTrained?: string;
  statLecturersPanel?: string;
  statSatisfactionRate?: string;
}

const SettingsSchema = new Schema<ISettingsDocument>({
  siteName: { type: String, required: true },
  tagline: { type: String, default: '' },
  logoUrl: { type: String },
  phonePrimary: { type: String, required: true },
  phoneSecondary: { type: String },
  emergencyHelpline: { type: String, default: '1333' },
  emailPrimary: { type: String, required: true },
  addressPhysical: { type: String, required: true },
  openingHours: { type: String, required: true },
  facebookUrl: { type: String },
  instagramUrl: { type: String },
  linkedinUrl: { type: String },
  youtubeUrl: { type: String },
  smtpHost: { type: String },
  smtpPort: { type: String },
  smtpUser: { type: String },
  currencySymbol: { type: String, default: 'LKR' },

  heroBadge: { type: String },
  heroHeadline: { type: String },
  heroHeadlineHighlight: { type: String },
  heroSubheadline: { type: String },
  heroCtaPrimaryText: { type: String },
  heroCtaSecondaryText: { type: String },

  aboutHeading: { type: String },
  aboutStory: { type: String },
  aboutVision: { type: String },
  aboutMission: { type: String },
  aboutValues: [{ type: String }],

  statClientsHelped: { type: String },
  statStudentsTrained: { type: String },
  statLecturersPanel: { type: String },
  statSatisfactionRate: { type: String }
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model<ISettingsDocument>('Settings', SettingsSchema);
