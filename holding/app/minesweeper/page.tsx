'use client';

import { useEffect, useState } from 'react';
import Board from './Board';
import BoardSelector from './BoardSelector';
import styles from './minesweeper.module.css';

export default function MinesweeperPage() {
  const [boardID, setBoardID] = useState(-1);

  useEffect(() => {});

  return (
    <div>
      <h1 className={styles.pageTitle}> This is the minesweeper page </h1>

      {boardID == -1 ? (
        <BoardSelector setBoardID={setBoardID} />
      ) : (
        <Board BoardID={boardID} setBoardID={setBoardID} />
      )}
    </div>
  );
}
