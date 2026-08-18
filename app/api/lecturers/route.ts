import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Lecturer from '@/models/Lecturer';
import User from '@/models/User';
import { initialLecturers } from '@/src/data/initialData';

export async function GET() {
  try {
    await connectToDatabase();
    const lecturers = await Lecturer.find().sort({ displayOrder: 1 }).lean();
    return NextResponse.json(lecturers.length > 0 ? lecturers : initialLecturers);
  } catch {
    return NextResponse.json(initialLecturers);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();
    const count = await Lecturer.countDocuments();
    const lecId = body.id || `lec_${Date.now()}`;
    const newLecturer = {
      ...body,
      id: lecId,
      displayOrder: body.displayOrder || count + 1
    };
    const created = await Lecturer.findOneAndUpdate(
      { id: lecId },
      newLecturer,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Sync into User collection in MongoDB
    try {
      const lecUserId = newLecturer.userId || `usr_${lecId}`;
      await User.findOneAndUpdate(
        { $or: [{ id: lecUserId }, { email: newLecturer.email }] },
        {
          id: lecUserId,
          name: newLecturer.name,
          email: newLecturer.email,
          role: 'LECTURER',
          phone: newLecturer.phone,
          avatar: newLecturer.photo,
          username: newLecturer.email ? newLecturer.email.split('@')[0] : undefined,
          status: 'ACTIVE'
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (syncErr) {
      console.warn('Failed to sync lecturer to User collection:', syncErr);
    }

    return NextResponse.json({ success: true, lecturer: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

