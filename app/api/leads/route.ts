import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import MarketingLead from '@/models/MarketingLead';

// ── Google Sheets webhook (Apps Script Web App) ──────────────────────────────
async function sendToGoogleSheet(leadData: {
  fullName: string;
  phone: string;
  email: string;
  district: string;
  medium: string;
  counsellingInterest: string;
  learningMode: string;
  source: string;
  downloaded: boolean;
  submittedAt: string;
}) {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl || webhookUrl.includes('YOUR_SCRIPT_ID_HERE')) {
    console.warn('[Sheets] GOOGLE_SHEET_WEBHOOK_URL not configured — skipping.');
    return;
  }
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
      // Google Apps Script has a redirect — follow it
      redirect: 'follow',
    });
    const text = await res.text();
    console.log('[Sheets] Row written:', text);
  } catch (err) {
    // Non-blocking — don't fail the main request if Sheets is down
    console.error('[Sheets] Failed to write row:', err);
  }
}
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      email = '',
      district,
      medium = 'Sinhala',
      counsellingInterest = 'Yes, definitely',
      learningMode = 'Online',
      source = 'Facebook Group',
      guideName = 'Professional Counselling & Mental Health Starter Guide'
    } = body;

    if (!fullName || !phone || !district) {
      return NextResponse.json(
        { success: false, error: 'Full Name, WhatsApp Number, and District are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const submittedAt = new Date().toISOString();
    const leadId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newLead = new MarketingLead({
      id: leadId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      district: district.trim(),
      medium,
      counsellingInterest,
      learningMode,
      source,
      guideName,
      downloaded: true,
      submittedAt
    });

    await newLead.save();

    // ── Send to Google Sheet (non-blocking) ───────────────────────────────────
    sendToGoogleSheet({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      district: district.trim(),
      medium,
      counsellingInterest,
      learningMode,
      source,
      downloaded: true,
      submittedAt: new Date(submittedAt).toLocaleString('en-GB', { timeZone: 'Asia/Colombo' })
    });
    // ─────────────────────────────────────────────────────────────────────────

    // Prepare pre-formatted WhatsApp message for Ms. Ramsina (+94 74 234 4251)
    const encodedMsg = encodeURIComponent(
      `Hello Ms. Ramsina (Helping Hearts),\n\n` +
      `New Counselling Guide Lead Received! 📥\n\n` +
      `👤 Name: ${fullName.trim()}\n` +
      `📱 WhatsApp: ${phone.trim()}\n` +
      `📍 District: ${district.trim()}\n` +
      `🗣️ Medium: ${medium}\n` +
      `🎓 Interested in Training?: ${counsellingInterest}\n` +
      `🏛️ Preferred Mode: ${learningMode}\n` +
      `🌐 Source: ${source}\n` +
      (email ? `✉️ Email: ${email.trim()}\n` : '') +
      `\nPlease follow up regarding upcoming diploma batches.`
    );

    const whatsappUrl = `https://wa.me/94742344251?text=${encodedMsg}`;

    return NextResponse.json({
      success: true,
      lead: newLead,
      whatsappUrl
    });
  } catch (err: any) {
    console.error('Error saving marketing lead:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to submit form' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const leads = await MarketingLead.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, leads });
  } catch (err: any) {
    console.error('Error fetching marketing leads:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
