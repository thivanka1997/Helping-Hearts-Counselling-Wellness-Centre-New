import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Event from '@/models/Event';
import Meta from '@/models/Meta';
import { initialEvents } from '@/src/data/initialData';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();
    await Meta.findOneAndUpdate(
      { key: 'events_initialized' },
      { key: 'events_initialized', value: true },
      { upsert: true }
    );
    const updated = await Event.findOneAndUpdate({ id }, body, { upsert: true, new: true, setDefaultsOnInsert: true });
    return NextResponse.json({ success: true, event: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const isInitialized = await Meta.findOne({ key: 'events_initialized' });
    if (!isInitialized) {
      const count = await Event.countDocuments();
      if (count === 0) {
        const remaining = initialEvents.filter(e => e.id !== id);
        if (remaining.length > 0) await Event.insertMany(remaining);
      } else {
        await Event.findOneAndDelete({ id });
      }
      await Meta.findOneAndUpdate(
        { key: 'events_initialized' },
        { key: 'events_initialized', value: true },
        { upsert: true }
      );
    } else {
      await Event.findOneAndDelete({ id });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
