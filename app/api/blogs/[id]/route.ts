import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Blog from '@/models/Blog';
import Meta from '@/models/Meta';
import { initialBlogs } from '@/src/data/initialData';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();
    await Meta.findOneAndUpdate(
      { key: 'blogs_initialized' },
      { key: 'blogs_initialized', value: true },
      { upsert: true }
    );
    const updated = await Blog.findOneAndUpdate({ id }, body, { upsert: true, new: true, setDefaultsOnInsert: true });
    return NextResponse.json({ success: true, blog: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const isInitialized = await Meta.findOne({ key: 'blogs_initialized' });
    if (!isInitialized) {
      const count = await Blog.countDocuments();
      if (count === 0) {
        const remaining = initialBlogs.filter(b => b.id !== id);
        if (remaining.length > 0) await Blog.insertMany(remaining);
      } else {
        await Blog.findOneAndDelete({ id });
      }
      await Meta.findOneAndUpdate(
        { key: 'blogs_initialized' },
        { key: 'blogs_initialized', value: true },
        { upsert: true }
      );
    } else {
      await Blog.findOneAndDelete({ id });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
