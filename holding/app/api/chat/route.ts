import { NextResponse } from 'next/server';
import { rooms } from '@/util/DB';

export async function GET() {
  return NextResponse.json(rooms);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newRoom = {
    id: String(Date.now()),
    name: body.name || 'Untitled Room',
  };
  rooms.push(newRoom);
  return NextResponse.json(newRoom, { status: 201 });
}
