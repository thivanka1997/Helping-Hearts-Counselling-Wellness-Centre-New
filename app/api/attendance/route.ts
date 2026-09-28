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

    try {
      await connectToDatabase();
      // Check if student already marked present for this session today
      const existing = await Attendance.findOne({
        $or: [
          { studentId: body.studentId },
          { studentName: body.studentName }
        ],
        courseId: body.courseId,
        sessionTitle: body.sessionTitle,
        sessionDate: body.sessionDate
      });

      if (existing) {
        return NextResponse.json({
          success: true,
          record: existing,
          alreadyLogged: true,
          message: 'Attendance was already recorded for this session today.'
        });
      }

      const created = await Attendance.create(newRecord);
      return NextResponse.json({ success: true, record: created, alreadyLogged: false });
    } catch (dbErr) {
      // Fallback for in-memory / local mode
      const existsInMem = initialAttendance.some(
        (a) =>
          (a.studentId === body.studentId || a.studentName === body.studentName) &&
          a.courseId === body.courseId &&
          a.sessionTitle === body.sessionTitle &&
          a.sessionDate === body.sessionDate
      );
      if (!existsInMem) {
        initialAttendance.unshift(newRecord as any);
      }
      return NextResponse.json({ success: true, record: newRecord, alreadyLogged: existsInMem });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
