import { Room, Message } from '@/app/(pages)/chat/types';
import styles from './chat.module.css';
import { useEffect, useState } from 'react';

export default function RoomComponent({ roomID }: { roomID: number }) {
  const [room, setRoom] = useState<Room>({ id: -1, name: 'default' });
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchMessages() {
    try {
      const res = await fetch(`/api/chat/${roomID}`);
      const room = await res.json();

      setMessages(room.messages ?? []);
      setRoom({ id: room.id, name: room.name });
    } catch (err) {
      setError(`Failed to fetch messages: ${(err as Error).message}`);
      setMessages([]); // ensure it's always an array
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages(); // initial fetch

    const interval = setInterval(fetchMessages, 5000); // poll for other users' updates
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.room}>
      <h1>
        Room[{room.id}]: {room.name}
      </h1>
      <div>
        {messages.map((msg) => (
          <MessageComponent key={msg.id} message={msg} />
        ))}
      </div>
      <NewMessageForm roomID={room.id} setMessages={setMessages} />
    </div>
  );
}

function MessageComponent({ message }: { message: Message }) {
  const { sender, content } = message;

  return (
    <div className={styles.message}>
      <h6>{sender}</h6>
      <p>{content}</p>
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

  async function createMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch(`/api/chat/${roomID}`, {
      method: 'POST',
      body: JSON.stringify({ content: message }),
      headers: { 'Content-Type': 'application/json' },
    });

    const newMessage: Message = await res.json();
    setMessage('');
    setMessages((prev) => [...prev, newMessage]);
  }

  return (
    <form onSubmit={createMessage} className={styles.newMessageForm}>
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" disabled={!message.trim()}>
        Post
      </button>
    </form>
  );
}
