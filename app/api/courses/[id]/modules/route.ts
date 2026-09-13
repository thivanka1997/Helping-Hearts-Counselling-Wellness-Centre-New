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

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, type, url, description, moduleId } = body;

    if (!title || !url) {
      return NextResponse.json({ success: false, error: 'Title and URL are required' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if modules exist for this course in MongoDB
    let modules = await CourseModule.find({ courseId: id }).sort({ order: 1 });

    if (!modules || modules.length === 0) {
      // Seed from initial data if available, otherwise initialize first module
      const initialMods = initialCourseModules.filter(m => m.courseId === id);
      if (initialMods.length > 0) {
        await CourseModule.insertMany(initialMods);
      } else {
        const firstModule = new CourseModule({
          id: `mod-${Date.now()}`,
          courseId: id,
          title: 'Module 01: Course Materials & Lecture Recordings',
          description: 'Lectures, presentations, video sessions, and study resources.',
          order: 1,
          lessons: []
        });
        await firstModule.save();
      }
      modules = await CourseModule.find({ courseId: id }).sort({ order: 1 });
    }

    // Identify target module
    let targetModule = moduleId ? modules.find(m => m.id === moduleId) : (modules[modules.length - 1] || modules[0]);
    if (!targetModule) {
      targetModule = modules[0];
    }

    const newResource = {
      id: `res-${Date.now()}`,
      title: title.trim(),
      type: type || 'LINK',
      url: url.trim(),
      description: (description || '').trim()
    };

    if (type === 'VIDEO') {
      // If it's a video lesson, create a dedicated Lesson in the module
      const newLesson = {
        id: `les-${Date.now()}`,
        moduleId: targetModule.id,
        title: title.trim(),
        description: (description || 'Lecture video session and online learning resource.').trim(),
        videoUrl: url.trim(),
        durationMinutes: 60,
        order: (targetModule.lessons?.length || 0) + 1,
        resources: [newResource]
      };
      targetModule.lessons.push(newLesson);
    } else {
      // Non-video resource (PDF, DOC, PPT, LINK)
      if (!targetModule.lessons || targetModule.lessons.length === 0) {
        targetModule.lessons = [{
          id: `les-${Date.now()}`,
          moduleId: targetModule.id,
          title: 'Lecture Materials & Study Resources',
          description: 'Course study guides, reading references, and worksheets.',
          videoUrl: '',
          durationMinutes: 30,
          order: 1,
          resources: [newResource]
        }];
      } else {
        // Attach to the latest lesson in the module
        const lastLessonIndex = targetModule.lessons.length - 1;
        targetModule.lessons[lastLessonIndex].resources.push(newResource);
      }
    }

    await targetModule.save();

    return NextResponse.json({
      success: true,
      module: targetModule,
      resource: newResource
    });
  } catch (err: any) {
    console.error('Error adding course resource/lesson:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
