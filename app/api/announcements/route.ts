import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Announcement from '@/models/Announcement';
import { initialAnnouncements } from '@/src/data/initialData';

export async function GET() {
  try {
    await connectToDatabase();
    const announcements = await Announcement.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(announcements.length > 0 ? announcements : initialAnnouncements);
  } catch {
    return NextResponse.json(initialAnnouncements);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newAnc = {
      id: `anc_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      ...body
    };
    await connectToDatabase();
    const created = await Announcement.create(newAnc);
    return NextResponse.json({ success: true, announcement: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
