import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import { initialAppointments } from '@/src/data/initialData';

export async function GET() {
  try {
    await connectToDatabase();
    const appointments = await Appointment.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(appointments.length > 0 ? appointments : initialAppointments);
  } catch {
    return NextResponse.json(initialAppointments);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newAppointment = {
      id: `app_${Date.now()}`,
      referenceNo: `HH-APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...body
    };
    await connectToDatabase();
    const created = await Appointment.create(newAppointment);
    return NextResponse.json({ success: true, appointment: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
