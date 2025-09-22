'use client';
import { useState } from 'react';
import styles from "./chat.module.css"

export default function NewRoomForm({ onRoomCreated }: { onRoomCreated: () => void }) {
  const [roomName, setRoomName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!roomName.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: roomName }),
      });

      if (!res.ok) throw new Error('Failed to create room');
      setRoomName('');
      onRoomCreated(); // trigger refresh in ChatPage
    } catch (err) {
      setError('Could not create room');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.NRF_form}>
      <label className={styles.NRF_label} > Create a New Room </label>
      <input
        className={styles.NRF_input}
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Room name"
      />
      <button
      className={styles.NRF_button}
        type="submit"
        disabled={submitting}
      >
        {submitting ? 'Creating...' : 'Create Room'}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}