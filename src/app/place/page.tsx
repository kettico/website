'use client';
import { useRef, useState } from 'react';
import { PlaceCell } from '@/types/PlaceCell';
import PlaceGrid from './PlaceGrid';
import ColorPicker from './ColorPicker';
import { usePlacePolling } from '@/hooks/Place';
import styles from "./place.module.css"

export default function PlacePage() {
  const [grid, setGrid] = useState<PlaceCell[][]>([]);
  const [selectedColor, setSelectedColor] = useState('#ff0000');

  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef<HTMLDivElement>(null);


  usePlacePolling(setGrid, 3000); // Poll every 3 seconds

  function handleWheel(e: React.WheelEvent) {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 5)); // clamp between 0.5x and 5x
}

  function handleCellClick(cell: PlaceCell) {
    fetch('/api/place', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x: cell.x, y: cell.y, color: selectedColor }),
    }).then(() => {
      setGrid(prev => {
        const updated = [...prev];
        updated[cell.y][cell.x] = { ...cell, color: selectedColor, updatedAt: Date.now() };
        return updated;
      });
    });
  }

  return (
    <main>
      <div className={styles.container}>

      
      <div
  ref={zoomRef}
  onWheel={handleWheel}
  style={{
    overflow: 'hidden',
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <div
    style={{
      transform: `scale(${zoom})`,
      transformOrigin: 'center center',
      transition: 'transform 0.1s ease-out',
    }}
  >

      <PlaceGrid grid={grid} onCellClick={handleCellClick} />
        </div>
</div>
</div>
      <ColorPicker onColorSelect={setSelectedColor} />
    </main>
  );
}