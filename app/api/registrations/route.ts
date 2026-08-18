import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Registration from '@/models/Registration';
import User from '@/models/User';
import { initialRegistrations } from '@/src/data/initialData';

export async function GET() {
  try {
    await connectToDatabase();
    const registrations = await Registration.find().sort({ submittedAt: -1 }).lean();
    return NextResponse.json(registrations.length > 0 ? registrations : initialRegistrations);
  } catch {
    return NextResponse.json(initialRegistrations);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const regId = body.id || `reg_${Date.now()}`;
    const newReg = {
      id: regId,
      status: body.status || 'Pending',
      submittedAt: body.submittedAt || new Date().toISOString(),
      ...body
    };
    await connectToDatabase();
    const created = await Registration.findOneAndUpdate(
      { id: regId },
      newReg,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Sync into User collection in MongoDB
    try {
      const studentUserId = newReg.studentId || `usr_${regId}`;
      await User.findOneAndUpdate(
        { $or: [{ id: studentUserId }, { email: newReg.email }] },
        {
          id: studentUserId,
          name: newReg.fullName,
          email: newReg.email,
          role: 'STUDENT',
          phone: newReg.phone,
          username: newReg.assignedUsername || (newReg.email ? newReg.email.split('@')[0] : undefined),
          password: newReg.assignedPassword,
          assignedPassword: newReg.assignedPassword,
          courseTitle: newReg.courseTitle,
          status: newReg.status === 'Approved' ? 'ACTIVE' : 'PENDING',
          createdAt: newReg.submittedAt || new Date().toISOString()
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (syncErr) {
      console.warn('Failed to sync student to User collection:', syncErr);
    }

    return NextResponse.json({ success: true, registration: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

