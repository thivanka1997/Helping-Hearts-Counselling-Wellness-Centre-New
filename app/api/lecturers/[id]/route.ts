import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Lecturer from '@/models/Lecturer';
import User from '@/models/User';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();
    const updated = await Lecturer.findOneAndUpdate({ id }, body, { upsert: true, new: true, setDefaultsOnInsert: true });

    if (updated) {
      // Sync into User collection in MongoDB
      try {
        const lecUserId = updated.userId || `usr_${updated.id}`;
        await User.findOneAndUpdate(
          { $or: [{ id: lecUserId }, { email: updated.email }] },
          {
            id: lecUserId,
            name: updated.name,
            email: updated.email,
            role: 'LECTURER',
            phone: updated.phone,
            avatar: updated.photo,
            username: updated.username || (updated.email ? updated.email.split('@')[0] : undefined),
            password: updated.password || undefined,
            status: 'ACTIVE'
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (syncErr) {
        console.warn('Failed to sync updated lecturer to User collection:', syncErr);
      }
    }

    return NextResponse.json({ success: true, lecturer: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const deleted = await Lecturer.findOneAndDelete({ id });
    if (deleted) {
      const lecUserId = deleted.userId || `usr_${deleted.id}`;
      await User.findOneAndDelete({ $or: [{ id: lecUserId }, { email: deleted.email }] });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

