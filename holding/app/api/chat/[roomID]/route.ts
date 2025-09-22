import { NextRequest, NextResponse } from 'next/server';
import { messages } from '@/util/DB';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ roomID: string }> }
) {
  const { roomID } = await context.params;
  // your logic here
  return NextResponse.json([]);
}

export async function POST(
  req: Request,
  { params }: { params: { roomID: string } }
) {
  const body = await req.json();
  const newMessage = {
    id: `msg-${Date.now()}`,
    sender: body.sender || 'Anonymous',
    content: body.content || '',
    timestamp: new Date().toISOString(),
    roomID: params.roomID,
  };
  messages.push(newMessage);
  return NextResponse.json(newMessage, { status: 201 });
}
