import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import Meta from '@/models/Meta';
import { initialGallery } from '@/src/data/initialData';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) return NextResponse.json(initialGallery);

    const isInitialized = await Meta.findOne({ key: 'gallery_initialized' });
    if (!isInitialized) {
      const count = await Gallery.countDocuments();
      if (count === 0) {
        await Gallery.insertMany(initialGallery);
      }
      await Meta.findOneAndUpdate(
        { key: 'gallery_initialized' },
        { key: 'gallery_initialized', value: true },
        { upsert: true }
      );
    }

    const gallery = await Gallery.find().sort({ date: -1 }).lean();
    return NextResponse.json(gallery);
  } catch {
    return NextResponse.json(initialGallery);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const galId = body.id || `gal_${Date.now()}`;
    const newItem = { id: galId, ...body };
    await connectToDatabase();
    await Meta.findOneAndUpdate(
      { key: 'gallery_initialized' },
      { key: 'gallery_initialized', value: true },
      { upsert: true }
    );
    const created = await Gallery.findOneAndUpdate(
      { id: galId },
      newItem,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ success: true, item: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
