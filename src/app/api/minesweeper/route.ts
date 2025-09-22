import { NextResponse } from 'next/server';
import { GetMSBoardID, MSBoardDB } from '@/util/DB';
import MakeBoard from '@/util/Minesweeper';
import { MSCell, MSBoard } from '@/types/Minesweeper';

export { HANDLER as GET, HANDLER as POST };

export async function HANDLER(req: Request) {
  const method = req.method;
  const url = new URL(req.url);

  if (method == 'GET') {
    const id = url.searchParams.get('id');

    if (id) {
      return GETBoardByID(parseInt(id));
    } else {
      return GETAllBoardsMeta();
    }
  }

  if (method == 'POST') {
    const body = await req.json();
    return POSTNewBoard(body);
  }

  // Fallback for everything else
  return NextResponse.json({ error: 'Method not handled' }, { status: 405 });
}

async function GETBoardByID(id: number): Promise<Response> {
  const board = MSBoardDB[id];
  if (!board) {
    return NextResponse.json({ error: 'Board not found' }, { status: 404 });
  }
  return NextResponse.json(board);
}

async function GETAllBoardsMeta() {
  const metaOnly = Object.values(MSBoardDB).map(({ id, name }) => ({
    id,
    name,
  }));
  return NextResponse.json(metaOnly);
}

async function POSTNewBoard(body: { name: string }): Promise<Response> {
  const { name } = body;
  const id = GetMSBoardID();

  if (!id || MSBoardDB[id]) {
    return NextResponse.json(
      { error: 'Invalid or duplicate board ID' },
      { status: 400 }
    );
  }

  MSBoardDB[id] = {
    id,
    name,
    cells: MakeBoard(10, 10), // or generate dummy grid
  };

  return NextResponse.json(MSBoardDB[id], { status: 201 });
}

async function UPDATECell(boardID: number, newCell: MSCell): Promise<Response> {
  const board = MSBoardDB[boardID];

  if (!board || !board.cells) {
    return NextResponse.json({ error: 'Invalid board ID' }, { status: 400 });
  }

  const updatedBoard = { ...board };
  updatedBoard.cells = board.cells.map((row, r) =>
    row.map((cell, c) =>
      r === newCell.row && c === newCell.col ? newCell : cell
    )
  );

  // Save back to DB
  MSBoardDB[boardID] = updatedBoard;

  return NextResponse.json({ success: true });
}
