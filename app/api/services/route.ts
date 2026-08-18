import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Service from '@/models/Service';
import Meta from '@/models/Meta';
import { initialCounsellingServices } from '@/src/data/initialData';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) return NextResponse.json(initialCounsellingServices);

    const isInitialized = await Meta.findOne({ key: 'services_initialized' });
    if (!isInitialized) {
      const count = await Service.countDocuments();
      if (count === 0) {
        await Service.insertMany(initialCounsellingServices);
      }
      await Meta.findOneAndUpdate(
        { key: 'services_initialized' },
        { key: 'services_initialized', value: true },
        { upsert: true }
      );
    }

    const services = await Service.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(services);
  } catch {
    return NextResponse.json(initialCounsellingServices);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const srvId = body.id || `srv_${Date.now()}`;
    const newService = { id: srvId, ...body };
    await connectToDatabase();
    await Meta.findOneAndUpdate(
      { key: 'services_initialized' },
      { key: 'services_initialized', value: true },
      { upsert: true }
    );
    const created = await Service.findOneAndUpdate(
      { id: srvId },
      newService,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ success: true, service: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
