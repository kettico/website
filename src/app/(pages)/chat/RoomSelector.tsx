'use client';
import { useEffect, useState } from 'react';
import styles from './chat.module.css';
import { Room } from './types';

export default function RoomSelector({
  setActiveRoom,
}: {
  setActiveRoom: (room: Room) => void;
}) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchRooms() {
    try {
      const res = await fetch('/api/chat');
      if (!res.ok) throw new Error('Failed to fetch rooms');
      const data = await res.json();
      setRooms(data ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.roomSelector}>
      <h2>Available Rooms : {rooms.length}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <div className={styles.roomList}>
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} setActiveRoom={setActiveRoom} />
          ))}
        </div>
      )}
      <NewRoomForm setRooms={setRooms} />
    </div>
  );
}

function RoomCard({
  room,
  setActiveRoom,
}: {
  room: Room;
  setActiveRoom: (room: Room) => void;
}) {
  async function handleClick() {
    try {
      const res = await fetch(`/api/chat/${room.id}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch room ${room.id}: ${res.status}`);
      }
      const fullRoom = await res.json();
      setActiveRoom(fullRoom);
    } catch (err) {
      console.error('Error loading room:', err);
      // Optional: show error to user
      alert(`Failed to load room: ${(err as Error).message}`);
    }
  }
  return (
    <div className={styles.roomCard} onClick={handleClick}>
      <h3>{room.name}</h3>
    </div>
  );
}

function NewRoomForm({
  setRooms,
}: {
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}) {
  const [name, setName] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const newRoom = await res.json();
      setRooms((prev) => [...prev, newRoom]);
      setName('');
    }
  }
  return (
    <form onSubmit={handleSubmit} className={styles.newRoomForm}>
      <input
        type="text"
        placeholder="New Room Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" disabled={!name.trim()}>
        Create
      </button>
    </form>
  );
}
