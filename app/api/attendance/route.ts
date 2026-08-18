import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import { initialAttendance } from '@/src/data/initialData';

export async function GET() {
  try {
    await connectToDatabase();
    const records = await Attendance.find().sort({ sessionDate: -1 }).lean();
    return NextResponse.json(records.length > 0 ? records : initialAttendance);
  } catch {
    return NextResponse.json(initialAttendance);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newRecord = { id: `att_${Date.now()}`, ...body };
    await connectToDatabase();
    const created = await Attendance.create(newRecord);
    return NextResponse.json({ success: true, record: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
