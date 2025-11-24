import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Event from "@/lib/models/Event";
import dbConnect from "@/lib/db/db"; 
import { authOptions } from "@/lib/auth"; 

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find().populate("createdBy", "name email");
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Error fetching events" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    const event = await Event.create({
      ...body,
      createdBy: session.user.id,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Error creating event" },
      { status: 500 }
    );
  }
}