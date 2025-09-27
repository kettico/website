'use client';
import { useState } from 'react';
import styles from './chat.module.css';
import { Message, Room } from './types';

export default function ChatRoom({
  room,
  goBack,
}: {
  room: Room;
  goBack: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>(room?.messages ?? []);

  if (!room) {
    return <p>ChatRoom: Input Room is NULL</p>;
  }

  return (
    <div className={styles.chatRoom}>
      <div className={styles.chatRoomHeader}>
        <button onClick={goBack} className={styles.backButton}>
          Go Back
        </button>
        <h3 className={styles.title}>
          {room.name}: {messages.length}
        </h3>
      </div>

      <div className={styles.messageContainer}>
        {messages.map((msg: Message) => (
          <MessageCard key={msg.id} message={msg} />
        ))}
      </div>
      <NewMessageForm roomID={room.id} setMessages={setMessages} />
    </div>
  );
}

function MessageCard({ message }: { message: Message }) {
  return (
    <div className={styles.messageCard}>
      <h4>{message.sender}</h4>
      <p>{message.content}</p>
      <small>{new Date(message.createdAt).toLocaleTimeString()}</small>
    </div>
  );
}

function NewMessageForm({
  roomID,
  setMessages,
}: {
  roomID: number;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`/api/chat/${roomID}`, {
        method: 'POST',
        body: JSON.stringify({
          sender: 'You', // TODO: replace with real sender
          content: message,
          createdAt: new Date().toISOString(),
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const newMessage: Message = await res.json();

      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
    } catch (err) {
      setError(`Failed to send: ${(err as Error).message}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.newMessageForm}>
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" disabled={!message.trim()}>
        Send
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
