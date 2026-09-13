import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Registration from '@/models/Registration';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();

    const updated = await User.findOneAndUpdate(
      { $or: [{ id }, { email: id }, { username: id }] },
      { ...body },
      { upsert: true, new: true }
    );

    // If user's name is updated, also sync to matching registrations
    if (body.name) {
      try {
        await Registration.updateMany(
          {
            $or: [
              { studentId: id },
              { email: updated?.email || id },
              { assignedUsername: updated?.username || id }
            ]
          },
          { fullName: body.name }
        );
      } catch (syncErr) {
        console.warn('Could not sync user name to registrations:', syncErr);
      }
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    await User.findOneAndDelete({ id });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
