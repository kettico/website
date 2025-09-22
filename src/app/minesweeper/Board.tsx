import { MSBoard, MSCell } from '@/types/Minesweeper';
import styles from './minesweeper.module.css';
import { useEffect, useState } from 'react';
import CellComponent from './CellComponent';

export default function Board({
  BoardID,
  setBoardID,
}: {
  BoardID: number;
  setBoardID: (id: number) => void;
}) {
  const [board, setBoard] = useState<MSBoard>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const colCount = board?.cells?.[0]?.length || 0;

  async function GetBoard() {
    try {
      setLoading(true);
      const res = await fetch(`/api/minesweeper?id=${BoardID}`);
      const data = await res.json();
      setBoard(data);
    } catch {
      setError('Failed to load board');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    GetBoard();
  }, [BoardID]);

  async function handleCellClick(col: number, row: number) {
    if (!board) return;

    const cell = board.cells?.[row]?.[col];
    if (!cell || cell.status !== 'hidden') return;

    const updatedCell = { ...cell, status: 'revealed' };

    try {
      const res = await fetch('/api/minesweeper/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardID: board.id,
          newCell: updatedCell,
        }),
      });

      if (!res.ok) throw new Error('Failed to update cell');

      // Optional: fetch updated board or mutate locally
      const newBoard = { ...board };
      newBoard.cells[row][col] = updatedCell;

      if (updatedCell.value === 0) {
        revealAdjacent(newBoard.cells, col, row);
      }

      setBoard(newBoard);
    } catch (err) {
      console.error(err);
    }
  }

  function revealAdjacent(cells: MSCell[][], col: number, row: number) {
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

    for (const [dx, dy] of directions) {
      const nx = col + dx;
      const ny = row + dy;
      const neighbor = cells[ny]?.[nx];
      if (neighbor && neighbor.status === 'hidden') {
        neighbor.status = 'revealed';
        if (neighbor.value === 0) {
          revealAdjacent(cells, nx, ny);
        }
      }
    }
  }

  function handleCellRightClick(col: number, row: number) {
    if (!board) return;

    const newBoard = { ...board };
    const cell = newBoard.cells?.[row]?.[col];
    if (!cell || cell.status === 'revealed') return;

    cell.status = cell.status === 'flagged' ? 'hidden' : 'flagged';

    setBoard(newBoard);
  }

  return (
    <div>
      <button onClick={() => setBoardID(-1)}> Leave Board </button>
      <h1> BoardID: {BoardID}</h1>

      {loading ? (
        <p>Loading Board...</p>
      ) : (
        <div>
          <div
            className={styles.boardGrid}
            style={{ gridTemplateColumns: `repeat(${colCount}, 40px)` }}
          >
            {board?.cells?.flat().map((cell: MSCell) => (
              <CellComponent
                key={`${cell.row}-${cell.col}`}
                CellData={cell}
                onClick={() => handleCellClick(cell.row, cell.col)}
                onRightClick={() => handleCellRightClick(cell.row, cell.col)}
              />
            ))}
          </div>
        </div>
      )}

      {error && <p className={styles.statusText}>{error}</p>}
    </div>
  );
}
