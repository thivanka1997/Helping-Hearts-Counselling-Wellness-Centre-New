import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { initialSiteSettings } from '@/src/data/initialData';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) return NextResponse.json(initialSiteSettings);

    const settings = await Settings.findOne().lean();
    return NextResponse.json(settings || initialSiteSettings);
  } catch {
    return NextResponse.json(initialSiteSettings);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { _id, createdAt, updatedAt, __v, ...cleanBody } = body;
    await connectToDatabase();

    const updated = await Settings.findOneAndUpdate(
      {},
      { $set: cleanBody },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
