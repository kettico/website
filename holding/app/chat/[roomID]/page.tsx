'use client';
import { useParams, useRouter } from 'next/navigation';
import MessageCard from './MessageCard';
import NewMessageForm from './NewMessageForm';
import { useEffect, useState } from 'react';
import { Message } from "@/types/Message";
import styles from './room.module.css';

export default function RoomPage() {
  const { roomID } = useParams();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function handleNewMessage(msg: Message) {
    setMessages(prev => [... prev, msg]);
  }

  async function fetchMessages() {
    try {
      setLoading(true);
      const res = await fetch(`/api/chat/${roomID}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000); // every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);


  return (
    <div className={styles.roomPage}>
      <button onClick={() => router.back()} className={styles.backButton}>
        ← Leave Room
      </button>

      <h1 className={styles.roomTitle}>💬 Room {roomID}</h1>

      {loading ? (
        <p className={styles.loading}>Loading messages...</p>
      ) : (
        <div className={styles.messageList}>
          {messages.map(msg => (
            <MessageCard key={msg.id} msg={msg}/>
          ))}
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <NewMessageForm roomID={roomID as string} onMessageSent={handleNewMessage} />
    </div>
  );
}