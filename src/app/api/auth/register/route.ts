import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }
  const user = await prisma.user.create({ data: { username, password } });
  return NextResponse.json({ message: 'User Created', user });
}
