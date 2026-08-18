import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Course from '@/models/Course';
import { initialCourses } from '@/src/data/initialData';

export async function GET() {
  try {
    await connectToDatabase();
    const courses = await Course.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(courses.length > 0 ? courses : initialCourses);
  } catch {
    return NextResponse.json(initialCourses);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newCourse = {
      id: `crs_${Date.now()}`,
      modulesCount: 0,
      enrolledStudentsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      ...body
    };
    await connectToDatabase();
    const created = await Course.create(newCourse);
    return NextResponse.json({ success: true, course: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
