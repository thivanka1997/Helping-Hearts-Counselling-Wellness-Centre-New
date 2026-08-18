import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CourseModule from '@/models/CourseModule';
import { initialCourseModules } from '@/src/data/initialData';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const modules = await CourseModule.find({ courseId: id }).sort({ order: 1 }).lean();
    return NextResponse.json(modules.length > 0 ? modules : initialCourseModules.filter(m => m.courseId === id));
  } catch {
    const { id } = await params;
    return NextResponse.json(initialCourseModules.filter(m => m.courseId === id));
  }
}
