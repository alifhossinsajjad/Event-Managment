import dbConnect from '@/lib/db/db';
import Event from '@/lib/models/Event';
import { NextResponse } from 'next/server';


export async function GET(request, { params }) {
  try {
    await dbConnect();
    const event = await Event.findById(params.id).populate('createdBy', 'name email');
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching event' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const event = await Event.findByIdAndDelete(params.id);
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting event' }, { status: 500 });
  }
}