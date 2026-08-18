import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import FAQ from '@/models/FAQ';
import Meta from '@/models/Meta';
import { initialFAQs } from '@/src/data/initialData';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();
    
    await Meta.findOneAndUpdate(
      { key: 'faqs_initialized' },
      { key: 'faqs_initialized', value: true },
      { upsert: true }
    );

    const updated = await FAQ.findOneAndUpdate({ id }, body, { upsert: true, new: true, setDefaultsOnInsert: true });
    return NextResponse.json({ success: true, faq: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const isInitialized = await Meta.findOne({ key: 'faqs_initialized' });
    if (!isInitialized) {
      const count = await FAQ.countDocuments();
      if (count === 0) {
        // Seed initial items except the one being deleted
        const remaining = initialFAQs.filter(f => f.id !== id);
        if (remaining.length > 0) {
          await FAQ.insertMany(remaining);
        }
      } else {
        await FAQ.findOneAndDelete({ id });
      }
      await Meta.findOneAndUpdate(
        { key: 'faqs_initialized' },
        { key: 'faqs_initialized', value: true },
        { upsert: true }
      );
    } else {
      await FAQ.findOneAndDelete({ id });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
