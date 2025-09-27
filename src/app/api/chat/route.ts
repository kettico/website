import { NextResponse } from 'next/server';
import { Room } from '@/app/(pages)/chat/types';

// ---- Mock DB ----
export let rooms: Room[] = [
  {
    id: 1,
    name: 'General',
    messages: [
      {
        id: 1,
        sender: 'Alice',
        content: 'Hello everyone!',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        sender: 'Bob',
        content: 'Hi Alice!',
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 2,
    name: 'Random',
    messages: [
      {
        id: 3,
        sender: 'Charlie',
        content: 'Random chat goes here',
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

let nextRoomID = rooms.length + 1;

// ---- Routes ----

// GET all rooms (no messages for list view)
export async function GET() {
  const roomsList = rooms.map(({ id, name }) => ({ id, name }));
  return NextResponse.json(roomsList);
}

// POST new room

export async function POST(req: Request) {
  const { name } = await req.json();
  const newRoom = { id: nextRoomID++, name, messages: [] };
  rooms.push(newRoom);
  return NextResponse.json(newRoom);
}
