'use client';
import { HexColorPicker } from 'react-colorful';
import { useState } from 'react';
import styles from './place.module.css';

export default function DraggableColorPicker({
  onChange,
}: {
  onChange: (color: string) => void;
}) {
  const [color, setColor] = useState('#ff0000');
  const [pos, setPos] = useState({ x: 500, y: 500 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Drag starts only when clicking the handle
  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div className={styles.pickerWrapper} style={{ top: pos.y, left: pos.x }}>
      {/* Drag handle */}
      <div
        className={`${styles.dragHandle} ${dragging ? styles.dragging : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      {/* Color picker box */}
      <div className={styles.pickerBox} style={{ background: color }}>
        <HexColorPicker
          color={color}
          onChange={(c) => {
            setColor(c);
            onChange(c);
          }}
          className={styles.colorPicker}
        />
      </div>
    </div>
  );
}
