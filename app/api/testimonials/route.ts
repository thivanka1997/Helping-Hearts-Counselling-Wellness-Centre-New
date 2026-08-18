import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import Meta from '@/models/Meta';
import { initialTestimonials } from '@/src/data/initialData';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) return NextResponse.json(initialTestimonials);

    const isInitialized = await Meta.findOne({ key: 'testimonials_initialized' });
    if (!isInitialized) {
      const count = await Testimonial.countDocuments();
      if (count === 0) {
        await Testimonial.insertMany(initialTestimonials);
      }
      await Meta.findOneAndUpdate(
        { key: 'testimonials_initialized' },
        { key: 'testimonials_initialized', value: true },
        { upsert: true }
      );
    }

    const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(testimonials);
  } catch (err: any) {
    console.error('Error fetching testimonials:', err);
    return NextResponse.json(initialTestimonials);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const testId = body.id || `test_${Date.now()}`;
    const newTestimonial = {
      id: testId,
      createdAt: body.createdAt || new Date().toISOString().split('T')[0],
      ...body
    };

    await connectToDatabase();
    await Meta.findOneAndUpdate(
      { key: 'testimonials_initialized' },
      { key: 'testimonials_initialized', value: true },
      { upsert: true }
    );

    const created = await Testimonial.findOneAndUpdate(
      { id: testId },
      newTestimonial,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, testimonial: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
