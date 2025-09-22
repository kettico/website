// PlaceGrid.tsx
'use client';
import { PlaceCell } from "@/types/PlaceCell";
import PlaceCellComponent from './PlaceCell';
import styles from './place.module.css';

export default function PlaceGrid({ grid, onCellClick }: {
  grid: PlaceCell[][];
  onCellClick: (cell: PlaceCell) => void;
}) {
  return (
    <div className={styles.grid}>
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <PlaceCellComponent key={`${x}-${y}`} cell={cell} onClick={onCellClick} />
        ))
      )}
    </div>
  );
}