import { NextResponse } from 'next/server';
import { rooms } from '../route'; // reuse mock DB
import { Message } from '@/app/(pages)/chat/types';

let nextMessageID = 100; // start high so no clashes with seeded ones

// GET all messages in a room
export async function GET(req: Request) {
  // parse the id from the URL
  const url = new URL(req.url);
  const idParam = url.pathname.split('/').pop(); // last segment
  const id = idParam ? parseInt(idParam, 10) : NaN;

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const room = rooms.find((r) => r.id === id);

  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  return NextResponse.json(room);
}
// POST new message
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const roomID = parseInt(params.id, 10);
  const room = rooms.find((r) => r.id === roomID);

  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  const { sender, content } = await req.json();

  const newMessage: Message = {
    id: nextMessageID++,
    sender: sender ?? 'Anonymous',
    content,
    createdAt: new Date().toISOString(),
  };

  room.messages.push(newMessage);

  return NextResponse.json(newMessage);
}
