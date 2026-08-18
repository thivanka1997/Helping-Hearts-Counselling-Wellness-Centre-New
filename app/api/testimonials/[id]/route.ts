import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import Meta from '@/models/Meta';
import { initialTestimonials } from '@/src/data/initialData';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();
    
    await Meta.findOneAndUpdate(
      { key: 'testimonials_initialized' },
      { key: 'testimonials_initialized', value: true },
      { upsert: true }
    );

    const updated = await Testimonial.findOneAndUpdate({ id }, body, { upsert: true, new: true, setDefaultsOnInsert: true });
    return NextResponse.json({ success: true, testimonial: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const isInitialized = await Meta.findOne({ key: 'testimonials_initialized' });
    if (!isInitialized) {
      const count = await Testimonial.countDocuments();
      if (count === 0) {
        // Seed initial items except the one being deleted
        const remaining = initialTestimonials.filter(t => t.id !== id);
        if (remaining.length > 0) {
          await Testimonial.insertMany(remaining);
        }
      } else {
        await Testimonial.findOneAndDelete({ id });
      }
      await Meta.findOneAndUpdate(
        { key: 'testimonials_initialized' },
        { key: 'testimonials_initialized', value: true },
        { upsert: true }
      );
    } else {
      await Testimonial.findOneAndDelete({ id });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
