import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Event from '@/models/Event';
import Meta from '@/models/Meta';
import { initialEvents } from '@/src/data/initialData';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) return NextResponse.json(initialEvents);

    const isInitialized = await Meta.findOne({ key: 'events_initialized' });
    if (!isInitialized) {
      const count = await Event.countDocuments();
      if (count === 0) {
        await Event.insertMany(initialEvents);
      }
      await Meta.findOneAndUpdate(
        { key: 'events_initialized' },
        { key: 'events_initialized', value: true },
        { upsert: true }
      );
    }

    const events = await Event.find().sort({ date: 1 }).lean();
    return NextResponse.json(events);
  } catch {
    return NextResponse.json(initialEvents);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const evtId = body.id || `evt_${Date.now()}`;
    const newEvent = { id: evtId, ...body };
    await connectToDatabase();
    await Meta.findOneAndUpdate(
      { key: 'events_initialized' },
      { key: 'events_initialized', value: true },
      { upsert: true }
    );
    const created = await Event.findOneAndUpdate(
      { id: evtId },
      newEvent,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ success: true, event: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
