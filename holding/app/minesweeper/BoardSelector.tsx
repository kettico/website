'use client';
import { useEffect, useState } from 'react';
import { MSBoard } from '@/types/Minesweeper';
import BoardCard from './BoardCard';
import styles from './minesweeper.module.css';

export default function BoardSelector({
  setBoardID,
}: {
  setBoardID: (id: number) => void;
}) {
  const [boards, setBoards] = useState<MSBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newName, setNewName] = useState('');

  async function fetchBoards() {
    try {
      setLoading(true);
      const res = await fetch('/api/minesweeper');
      const data = await res.json();
      setBoards(data);
    } catch (err) {
      setError('Failed to load boards');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateBoard(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch('/api/minesweeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });

      if (!res.ok) throw new Error('Failed to create board');

      setNewName('');
      fetchBoards(); // refresh list
    } catch {
      setError('Failed to create board');
    }
  }

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div className={styles.boardSelector}>
      <h1 className={styles.pageTitle}> Board Selector </h1>
      {loading ? (
        <p>Loading rooms...</p>
      ) : (
        <div>
          {Object.values(boards).map((board) => (
            <BoardCard key={board.id} Board={board} setBoardID={setBoardID} />
          ))}
        </div>
      )}

      {error && <p className={styles.statusText}>{error}</p>}

      <div>
        <form onSubmit={handleCreateBoard} className={styles.formContainer}>
          <label className={styles.formLabel}>New Board Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className={styles.formInput}
            placeholder="Enter board name"
          />
          <button
            type="submit"
            className={styles.formButton}
            disabled={!newName.trim()}
          >
            Create Board
          </button>
        </form>
      </div>
    </div>
  );
}
