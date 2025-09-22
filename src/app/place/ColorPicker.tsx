// ColorPicker.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './place.module.css';

export default function ColorPicker({
  onColorSelect,
}: {
  onColorSelect: (color: string) => void;
}) {
  const [color, setColor] = useState('#ff0000');
  const [collapsed, setCollapsed] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Drag logic
useEffect(() => {
  const picker = pickerRef.current;
  if (!picker) return;

  const handleMouseDown = (e: MouseEvent) => {
    dragOffset.current = {
      x: e.clientX - picker.offsetLeft,
      y: e.clientY - picker.offsetTop,
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!picker) return;
    picker.style.left = `${e.clientX - dragOffset.current.x}px`;
    picker.style.top = `${e.clientY - dragOffset.current.y}px`;
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const dragHandle = picker.querySelector('.dragHandle');
  if (dragHandle) {
    dragHandle.addEventListener('mousedown', handleMouseDown as EventListener);
  }

  return () => {
    if (dragHandle) {
      dragHandle.removeEventListener('mousedown', handleMouseDown as EventListener);
    }
  };
}, []);

  function isValidColor(value: string): boolean {
  if (typeof window === 'undefined') return false;

  const s = new Option().style;
  s.color = value.trim();
  return s.color !== '';
}



  return (
    <div ref={pickerRef} className={styles.picker}>
      <div className="dragHandle" style={{ cursor: 'move' }}>
        <button onClick={() => setCollapsed(!collapsed)} className={styles.toggle}>
          🎨 {collapsed ? 'Expand' : 'Collapse'}
        </button>
      </div>

      {!collapsed && (
        <div className={styles.panel}>
          <input
            type="text"
            value={color}
            onChange={(e) => {
                const newColor = e.target.value;
                setColor(newColor);

                if (isValidColor(newColor)) {
                onColorSelect(newColor); // only apply if valid
                }
            }}
            placeholder="#ff0000"
            className={`${styles.input} ${isValidColor(color) ? '' : styles.invalid}`}
            />
          <div className={styles.preview} style={{ backgroundColor: color }} /> 
        </div>
      )}
    </div>
  );
}