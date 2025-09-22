import { Message } from '@/types/Message';
import { Room } from '@/types/Room';
import { PlaceCell } from '@/types/PlaceCell';
import { MSBoard } from '@/types/Minesweeper';
import { Account } from '@/types/Account';

export const MSBoardDB: Record<number, MSBoard> = {
  1: {
    id: 1,
    name: 'General',
    cells: Array.from({ length: 5 }, (_, row) =>
      Array.from({ length: 5 }, (_, col) => ({
        col,
        row,
        value: (col + row) % 3 === 0 ? -1 : (col + row) % 4, // some dummy logic
        status: 'hidden',
      }))
    ),
  },
};

let MSBoardCounter = 2;
export function GetMSBoardID(): number {
  return MSBoardCounter++;
}

export const rooms: Room[] = [
  { id: '1', name: 'General' },
  { id: '2', name: 'Tech Talk' },
];

export const messages: Message[] = [
  {
    id: 'msg-1',
    sender: 'Alice',
    content: 'Welcome to General!',
    timestamp: new Date().toISOString(),
    roomID: '1',
  },
];

const GRID_SIZE = 100;
// Initialize a 2D grid with default white cells
export const placeGrid: PlaceCell[][] = Array.from(
  { length: GRID_SIZE },
  (_, y) =>
    Array.from({ length: GRID_SIZE }, (_, x) => ({
      x,
      y,
      color: '#ffffff',
      updatedAt: Date.now(),
    }))
);

// Update a cell
export function updateCell(x: number, y: number, color: string): PlaceCell {
  const cell = placeGrid[y][x];
  const updated = { ...cell, color, updatedAt: Date.now() };
  placeGrid[y][x] = updated;
  return updated;
}

// Get the full grid
export function getGrid(): PlaceCell[][] {
  return placeGrid;
}

export const AccountDB: Account[] = [
  { id: 0, username: 'user', password: 'pass' },
];
