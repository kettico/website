// src/app/api/place/route.ts
import { NextResponse } from 'next/server';
import { PCell } from '@/app/(pages)/place/PCellComponent';
import fs from 'fs/promises';
import path from 'path';

const ROWS = 50;
const COLS = 50;
const BOARD_FILE = path.resolve('./src/app/api/place/place.json');

async function readBoard(): Promise<PCell[][]> {
  try {
    const data = await fs.readFile(BOARD_FILE, 'utf-8');
    return JSON.parse(data) as PCell[][];
  } catch {
    // If file doesn't exist, create a fresh board
    const grid: PCell[][] = Array.from({ length: ROWS }, (_, r) =>
      Array.from({ length: COLS }, (_, c) => ({
        row: r,
        col: c,
        color: '#ffffff',
      }))
    );
    await fs.writeFile(BOARD_FILE, JSON.stringify(grid), 'utf-8');
    return grid;
  }
}

async function writeBoard(grid: PCell[][]) {
  await fs.writeFile(BOARD_FILE, JSON.stringify(grid), 'utf-8');
}

export async function GET() {
  const grid = await readBoard();
  return NextResponse.json(grid);
}

export async function POST(req: Request) {
  try {
    const { row, col, color } = await req.json();
    const grid = await readBoard();
    grid[row][col].color = color;
    await writeBoard(grid);
    return NextResponse.json(grid[row][col]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
