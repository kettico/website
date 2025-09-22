// /app/api/place/route.ts
import { getGrid } from '@/util/DB';
import { updateCell } from '@/util/DB';
import { NextRequest, NextResponse } from 'next/server';



export async function GET() {
  return NextResponse.json(getGrid());
}

export async function POST(req: NextRequest) {
  const { x, y, color } = await req.json();
  const updated = updateCell(x, y, color);
  return NextResponse.json(updated);
}
