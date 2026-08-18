import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import FAQ from '@/models/FAQ';
import Meta from '@/models/Meta';
import { initialFAQs } from '@/src/data/initialData';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) return NextResponse.json(initialFAQs);

    const isInitialized = await Meta.findOne({ key: 'faqs_initialized' });
    if (!isInitialized) {
      const count = await FAQ.countDocuments();
      if (count === 0) {
        await FAQ.insertMany(initialFAQs);
      }
      await Meta.findOneAndUpdate(
        { key: 'faqs_initialized' },
        { key: 'faqs_initialized', value: true },
        { upsert: true }
      );
    }

    const faqs = await FAQ.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json(faqs);
  } catch (err: any) {
    console.error('Error fetching faqs:', err);
    return NextResponse.json(initialFAQs);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const faqId = body.id || `faq_${Date.now()}`;
    const newFAQ = {
      id: faqId,
      order: body.order ?? 0,
      ...body
    };

    await connectToDatabase();
    await Meta.findOneAndUpdate(
      { key: 'faqs_initialized' },
      { key: 'faqs_initialized', value: true },
      { upsert: true }
    );

    const created = await FAQ.findOneAndUpdate(
      { id: faqId },
      newFAQ,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, faq: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
