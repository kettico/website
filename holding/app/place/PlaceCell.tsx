// PlaceCell.tsx
'use client';
import { PlaceCell } from "@/types/PlaceCell";
import styles from './place.module.css';

export default function PlaceCellComponent({ cell, onClick }: { cell: PlaceCell; onClick: (cell: PlaceCell) => void }) {
  return (
    <div
      className={styles.cell}
      style={{ backgroundColor: cell.color }}
      onClick={() => onClick(cell)}
    />
  );
}