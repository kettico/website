'use client';
import { useState } from 'react';
import ColorPicker from './ColorPicker';
import PGridComponent from './PGridComponent';
import styles from './place.module.css';

export default function PlacePage() {
  const [selectedColor, setSelectedColor] = useState('#ff0000');
  return (
    <div className={styles.placePage}>
      <ColorPicker onChange={setSelectedColor} />

      <PGridComponent selectedColor={selectedColor} />
    </div>
  );
}
