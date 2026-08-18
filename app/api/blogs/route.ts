import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Blog from '@/models/Blog';
import Meta from '@/models/Meta';
import { initialBlogs } from '@/src/data/initialData';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) return NextResponse.json(initialBlogs);

    const isInitialized = await Meta.findOne({ key: 'blogs_initialized' });
    if (!isInitialized) {
      const count = await Blog.countDocuments();
      if (count === 0) {
        await Blog.insertMany(initialBlogs);
      }
      await Meta.findOneAndUpdate(
        { key: 'blogs_initialized' },
        { key: 'blogs_initialized', value: true },
        { upsert: true }
      );
    }

    const blogs = await Blog.find().sort({ publishedAt: -1 }).lean();
    return NextResponse.json(blogs);
  } catch {
    return NextResponse.json(initialBlogs);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const blogId = body.id || `blg_${Date.now()}`;
    const newBlog = {
      id: blogId,
      publishedAt: body.publishedAt || new Date().toISOString().split('T')[0],
      ...body
    };
    await connectToDatabase();
    await Meta.findOneAndUpdate(
      { key: 'blogs_initialized' },
      { key: 'blogs_initialized', value: true },
      { upsert: true }
    );
    const created = await Blog.findOneAndUpdate(
      { id: blogId },
      newBlog,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ success: true, blog: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
