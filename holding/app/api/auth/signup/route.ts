import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const token = {
    token: 'token',
  };
  return NextResponse.json(token, { status: 201 });
}
