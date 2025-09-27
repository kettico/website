import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.password !== password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Login successful', user });
}
