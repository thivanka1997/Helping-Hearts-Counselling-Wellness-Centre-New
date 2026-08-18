import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Service from '@/models/Service';
import Meta from '@/models/Meta';
import { initialCounsellingServices } from '@/src/data/initialData';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();
    await Meta.findOneAndUpdate(
      { key: 'services_initialized' },
      { key: 'services_initialized', value: true },
      { upsert: true }
    );
    const updated = await Service.findOneAndUpdate({ id }, body, { upsert: true, new: true, setDefaultsOnInsert: true });
    return NextResponse.json({ success: true, service: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const isInitialized = await Meta.findOne({ key: 'services_initialized' });
    if (!isInitialized) {
      const count = await Service.countDocuments();
      if (count === 0) {
        const remaining = initialCounsellingServices.filter(s => s.id !== id);
        if (remaining.length > 0) await Service.insertMany(remaining);
      } else {
        await Service.findOneAndDelete({ id });
      }
      await Meta.findOneAndUpdate(
        { key: 'services_initialized' },
        { key: 'services_initialized', value: true },
        { upsert: true }
      );
    } else {
      await Service.findOneAndDelete({ id });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
