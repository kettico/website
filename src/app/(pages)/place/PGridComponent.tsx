'use client';
import { useEffect, useState } from 'react';
import PCellComponent, { PCell } from './PCellComponent';
import styles from './place.module.css';

export default function PGridComponent({
  selectedColor,
}: {
  selectedColor: string;
}) {
  const [grid, setGrid] = useState<PCell[][]>([]);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);

  const fetchBoard = async () => {
    try {
      const res = await fetch('/api/place');
      const data: PCell[][] = await res.json();
      setGrid(data);
      setRows(data.length);
      setCols(data[0]?.length || 0);
    } catch (err) {
      console.error('Failed to fetch board:', err);
    }
  };

  const handleClick = async (row: number, col: number) => {
    // Optimistically update local state
    setGrid((prev) => {
      const newGrid = prev.map((r) => [...r]);
      newGrid[row][col] = {
        ...newGrid[row][col],
        color: selectedColor,
      };
      return newGrid;
    });

    // Send update to the server
    try {
      await fetch('/api/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ row, col, color: selectedColor }),
      });
    } catch (err) {
      console.error('Failed to update cell:', err);
    }
  };

  useEffect(() => {
    fetchBoard(); // initial fetch

    const interval = setInterval(fetchBoard, 5000); // poll for other users' updates
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {grid ? (
        <div>
          <h1>
            Size of Grid: {cols}: {rows}
          </h1>
          <div
            className={styles.grid}
            style={{
              gridTemplateColumns: `repeat(${cols}, 20px)`,
              gridTemplateRows: `repeat(${rows}, 20px)`,
            }}
          >
            {grid.map((row) =>
              row.map((cell) => (
                <PCellComponent
                  key={`${cell.row}-${cell.col}`}
                  PCell={cell}
                  onClick={handleClick}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        <div>
          <p> Board Not loaded</p>
        </div>
      )}
    </div>
  );
}
