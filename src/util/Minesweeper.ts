import { MSCell } from '@/types/Minesweeper';

export default function MakeBoard(
  rows: number,
  cols: number,
  diff?: number,
  seed?: number
) {
  // Create Empty Grid
  const board: MSCell[][] = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      value: 0,
      status: 'hidden',
    }))
  );

  // Place Bombs
  const totalCells = rows * cols;
  const bombCount = Math.floor(totalCells * (diff ?? 0.15));
  const rng = seed != undefined ? seededRandom(seed) : Math.random;

  let placed = 0;
  while (placed < bombCount) {
    const r = Math.floor(rng() * rows);
    const c = Math.floor(rng() * cols);
    if (board[r][c].value !== -1) {
      board[r][c].value = -1;
      placed++;
    }
  }

  // Increment Values
  const directions = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col].value === -1) continue;

      let count = 0;
      for (const [dx, dy] of directions) {
        const nr = row + dy;
        const nc = col + dx;
        if (board[nr]?.[nc]?.value === -1) count++;
      }

      board[row][col].value = count;
    }
  }

  return board;
}

function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483647;
  };
}
