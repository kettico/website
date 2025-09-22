import React from 'react';
import styles from './minesweeper.module.css';
import { MSBoard } from '@/types/Minesweeper';

export default function BoardCard({
  Board,
  setBoardID,
}: {
  Board: MSBoard;
  setBoardID: (id: number) => void;
}) {
  const { id, name } = Board;

  return (
    <button className={styles.boardCard} onClick={() => setBoardID(Board.id)}>
      [{id}]: {name}
    </button>
  );
}
