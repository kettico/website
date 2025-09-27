// src/app/api/place/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PCell } from '@/app/(pages)/place/PCellComponent';

const BOARD_ID = 'main';
const ROWS = 50;
const COLS = 50;

async function createBoard(boardId: string, rows: number, cols: number) {
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ boardId, row: r, col: c, color: '#ffffff' });
    }
  }
  await prisma.cell.createMany({ data: cells });
}

export async function GET() {
  try {
    // Check if board exists
    const existing = await prisma.cell.findFirst({
      where: { boardId: BOARD_ID },
    });

    if (!existing) {
      // create it if it doesn't exist
      await createBoard(BOARD_ID, ROWS, COLS);
    }

    // Fetch all cells
    const cells = await prisma.cell.findMany({
      where: { boardId: BOARD_ID },
    });

    // Convert to 2D array
    const grid: PCell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      grid[r] = [];
      for (let c = 0; c < COLS; c++) {
        const cell = cells.find((x) => x.row === r && x.col === c);
        grid[r][c] = cell || { row: r, col: c, color: '#ffffff' };
      }
    }

    return NextResponse.json(grid);
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}

export async function POST(req: Request) {
  try {
    const { row, col, color } = await req.json();

    // Upsert the cell
    const updated = await prisma.cell.upsert({
      where: {
        boardId_row_col: {
          boardId: BOARD_ID,
          row,
          col,
        },
      },
      update: { color },
      create: { boardId: BOARD_ID, row, col, color },
    });

    const cells = await prisma.cell.findMany({ where: { boardId: BOARD_ID } });
    // convert to 2D array as in GET
    return NextResponse.json(cells);
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}
