import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { initialUsers } from '@/src/data/initialData';

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(users.length > 0 ? users : initialUsers);
  } catch {
    return NextResponse.json(initialUsers);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();
    const userId = body.id || `usr_${Date.now()}`;
    const userData = {
      ...body,
      id: userId,
      status: body.status || 'ACTIVE',
      createdAt: body.createdAt || new Date().toISOString()
    };

    const created = await User.findOneAndUpdate(
      { $or: [{ id: userId }, { email: body.email }] },
      userData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, user: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
