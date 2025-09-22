import { AccountDB } from '@/util/DB';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  for (const account of Object.values(AccountDB)) {
    if (username == account.username) {
      if (password == account.password) {
        const token = {
          token: 'token-{username}',
        };
        return NextResponse.json(token, { status: 201 });
      }
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  }
  return NextResponse.json({ error: 'User not found' }, { status: 404 });
}
