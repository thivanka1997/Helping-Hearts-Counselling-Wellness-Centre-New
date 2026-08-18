import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import Meta from '@/models/Meta';
import { initialGallery } from '@/src/data/initialData';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();
    await Meta.findOneAndUpdate(
      { key: 'gallery_initialized' },
      { key: 'gallery_initialized', value: true },
      { upsert: true }
    );
    const updated = await Gallery.findOneAndUpdate({ id }, body, { upsert: true, new: true, setDefaultsOnInsert: true });
    return NextResponse.json({ success: true, item: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const isInitialized = await Meta.findOne({ key: 'gallery_initialized' });
    if (!isInitialized) {
      const count = await Gallery.countDocuments();
      if (count === 0) {
        const remaining = initialGallery.filter(g => g.id !== id);
        if (remaining.length > 0) await Gallery.insertMany(remaining);
      } else {
        await Gallery.findOneAndDelete({ id });
      }
      await Meta.findOneAndUpdate(
        { key: 'gallery_initialized' },
        { key: 'gallery_initialized', value: true },
        { upsert: true }
      );
    } else {
      await Gallery.findOneAndDelete({ id });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
