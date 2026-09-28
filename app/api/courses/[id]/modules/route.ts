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
    const {
      title,
      type,
      url,
      description,
      medium = 'Sinhala',
      date = new Date().toISOString().split('T')[0],
      moduleId,
      meetingId,
      meetingPasscode,
      meetingTime,
      dueDate,
      assignmentInstructions,
      maxScore
    } = body;

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
      description: (description || '').trim(),
      dueDate: dueDate || '',
      medium: medium,
      date: date
    };

    // If it's a dedicated activity (VIDEO, MEETING, ASSIGNMENT, or primary PDF study unit)
    if (type === 'VIDEO' || type === 'MEETING' || type === 'ASSIGNMENT' || type === 'PDF') {
      const newLesson = {
        id: `les-${Date.now()}`,
        moduleId: targetModule.id,
        title: title.trim(),
        description: (description || (
          type === 'MEETING'
            ? 'Live Online Classroom / Zoom Meeting session with course lecturer.'
            : type === 'ASSIGNMENT'
            ? 'Course assignment and assessment submission portal.'
            : type === 'PDF'
            ? 'Official course study document and reference reading material.'
            : 'Lecture video session and online learning resource.'
        )).trim(),
        videoUrl: url.trim(),
        type: type,
        medium: medium,
        date: date,
        meetingId: meetingId || '',
        meetingPasscode: meetingPasscode || '',
        meetingTime: meetingTime || '',
        dueDate: dueDate || '',
        assignmentInstructions: assignmentInstructions || description || '',
        maxScore: Number(maxScore) || 100,
        durationMinutes: type === 'MEETING' ? 90 : type === 'ASSIGNMENT' ? 120 : 60,
        order: (targetModule.lessons?.length || 0) + 1,
        resources: [newResource]
      };
      targetModule.lessons.push(newLesson);
    } else {
      // General resource attachment (DOC, PPT, LINK)
      if (!targetModule.lessons || targetModule.lessons.length === 0) {
        targetModule.lessons = [{
          id: `les-${Date.now()}`,
          moduleId: targetModule.id,
          title: 'Lecture Materials & Study Resources',
          description: 'Course study guides, reading references, and worksheets.',
          videoUrl: '',
          type: 'DOC',
          medium: medium,
          date: date,
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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      lessonId,
      resourceId,
      title,
      type,
      url,
      description,
      medium,
      date,
      meetingId,
      meetingPasscode,
      meetingTime,
      dueDate,
      assignmentInstructions,
      maxScore
    } = body;

    await connectToDatabase();
    let modules = await CourseModule.find({ courseId: id });

    // Seed if empty in database
    if (!modules || modules.length === 0) {
      const initialMods = initialCourseModules.filter(m => m.courseId === id);
      if (initialMods.length > 0) {
        await CourseModule.insertMany(initialMods);
        modules = await CourseModule.find({ courseId: id });
      }
    }

    let updated = false;
    let updatedModule = null;

    for (const mod of modules) {
      if (lessonId) {
        const lesIndex = mod.lessons.findIndex((l: any) => l.id === lessonId);
        if (lesIndex !== -1) {
          const lesson = mod.lessons[lesIndex];
          if (title !== undefined) lesson.title = title.trim();
          if (type !== undefined) lesson.type = type;
          if (url !== undefined) {
            lesson.videoUrl = url.trim();
            if (lesson.resources && lesson.resources.length > 0) {
              lesson.resources[0].url = url.trim();
            }
          }
          if (description !== undefined) lesson.description = description.trim();
          if (medium !== undefined) {
            lesson.medium = medium;
            if (lesson.resources && lesson.resources.length > 0) {
              lesson.resources[0].medium = medium;
            }
          }
          if (date !== undefined) {
            lesson.date = date;
            if (lesson.resources && lesson.resources.length > 0) {
              lesson.resources[0].date = date;
            }
          }
          if (meetingId !== undefined) lesson.meetingId = meetingId;
          if (meetingPasscode !== undefined) lesson.meetingPasscode = meetingPasscode;
          if (meetingTime !== undefined) lesson.meetingTime = meetingTime;
          if (dueDate !== undefined) lesson.dueDate = dueDate;
          if (assignmentInstructions !== undefined) lesson.assignmentInstructions = assignmentInstructions;
          if (maxScore !== undefined) lesson.maxScore = Number(maxScore);

          await mod.save();
          updated = true;
          updatedModule = mod;
          break;
        }
      }

      if (resourceId) {
        let foundRes = false;
        for (const les of mod.lessons) {
          const resIndex = (les.resources || []).findIndex((r: any) => r.id === resourceId);
          if (resIndex !== -1) {
            const res = les.resources[resIndex];
            if (title !== undefined) res.title = title.trim();
            if (type !== undefined) res.type = type;
            if (url !== undefined) res.url = url.trim();
            if (description !== undefined) res.description = description.trim();
            if (medium !== undefined) res.medium = medium;
            if (date !== undefined) res.date = date;
            if (dueDate !== undefined) res.dueDate = dueDate;

            await mod.save();
            updated = true;
            updatedModule = mod;
            foundRes = true;
            break;
          }
        }
        if (foundRes) break;
      }
    }

    if (updated) {
      return NextResponse.json({ success: true, module: updatedModule });
    }

    return NextResponse.json({ success: false, error: 'Target lesson or resource not found' }, { status: 404 });
  } catch (err: any) {
    console.error('Error updating course material:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get('lessonId');
    const resourceId = searchParams.get('resourceId');

    if (!lessonId && !resourceId) {
      return NextResponse.json({ success: false, error: 'lessonId or resourceId query parameter is required' }, { status: 400 });
    }

    await connectToDatabase();
    const modules = await CourseModule.find({ courseId: id });

    let deleted = false;
    for (const mod of modules) {
      if (lessonId) {
        const initialCount = mod.lessons.length;
        mod.lessons = mod.lessons.filter((l: any) => l.id !== lessonId);
        if (mod.lessons.length !== initialCount) {
          await mod.save();
          deleted = true;
          return NextResponse.json({ success: true, module: mod });
        }
      }

      if (resourceId) {
        for (const les of mod.lessons) {
          const initialCount = (les.resources || []).length;
          les.resources = (les.resources || []).filter((r: any) => r.id !== resourceId);
          if (les.resources.length !== initialCount) {
            await mod.save();
            deleted = true;
            return NextResponse.json({ success: true, module: mod });
          }
        }
      }
    }

    if (deleted) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Resource or lesson not found' }, { status: 404 });
  } catch (err: any) {
    console.error('Error deleting course material:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
