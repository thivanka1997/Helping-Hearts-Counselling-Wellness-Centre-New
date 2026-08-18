import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Registration from '@/models/Registration';
import User from '@/models/User';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();
    const updated = await Registration.findOneAndUpdate(
      { id },
      { ...body, reviewedAt: new Date().toISOString() },
      { new: true }
    );

    if (updated) {
      // Sync into User collection in MongoDB
      try {
        const studentUserId = updated.studentId || `usr_${updated.id}`;
        await User.findOneAndUpdate(
          { $or: [{ id: studentUserId }, { email: updated.email }] },
          {
            id: studentUserId,
            name: updated.fullName,
            email: updated.email,
            role: 'STUDENT',
            phone: updated.phone,
            username: updated.assignedUsername || (updated.email ? updated.email.split('@')[0] : undefined),
            password: updated.assignedPassword,
            assignedPassword: updated.assignedPassword,
            courseTitle: updated.courseTitle,
            status: updated.status === 'Approved' ? 'ACTIVE' : updated.status === 'Rejected' ? 'SUSPENDED' : 'PENDING'
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (syncErr) {
        console.warn('Failed to sync updated student to User collection:', syncErr);
      }
    }

    return NextResponse.json({ success: true, registration: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const deleted = await Registration.findOneAndDelete({ id });
    if (deleted) {
      const studentUserId = deleted.studentId || `usr_${deleted.id}`;
      await User.findOneAndDelete({ $or: [{ id: studentUserId }, { email: deleted.email }] });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

