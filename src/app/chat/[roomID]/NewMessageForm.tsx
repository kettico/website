'use client';
import { useState } from 'react';
import styles from './room.module.css';
import { Message } from '@/types/Message';

export default function NewMessageForm({ 
  roomID, 
  onMessageSent 
}: { 
  roomID: string;
  onMessageSent: (msg: Message) => void;
}) {
  const [sender, setSender] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sender.trim() || !content.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/chat/${roomID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, content }),
      });

      if (!res.ok) throw new Error('Failed to send message');
      const newMsg = await res.json();
      setSender('');
      setContent('');
      onMessageSent(newMsg);
    } catch (err) {
      setError('Could not send message');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.messageForm}>
      <label className={styles.messageLabel}>Send a Message</label>

      <input
        type="text"
        value={sender}
        onChange={(e) => setSender(e.target.value)}
        placeholder="Your name"
        className={styles.messageInput}
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message..."
        rows={3}
        className={styles.messageTextarea}
      />

      <button type="submit" disabled={submitting} className={styles.messageButton}>
        {submitting ? 'Sending...' : 'Send'}
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}