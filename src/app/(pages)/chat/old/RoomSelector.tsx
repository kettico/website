'use client';

import { useEffect, useState } from 'react';
import { Room } from './types';
import styles from './chat.module.css';

export default function RoomSelector({
  setRoomID,
}: {
  setRoomID: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchRooms() {
    try {
      const res = await fetch('/api/chat');
      const rooms = await res.json();

      // json.rooms should be an array; fallback to empty array
      setRooms(rooms ?? []);
    } catch (err) {
      setError(`Failed to fetch rooms: ${(err as Error).message}`);
      setRooms([]); // ensure it's always an array
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms(); // initial fetch

    const interval = setInterval(fetchRooms, 5000); // poll for other users' updates
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.roomSelector}>
      {loading ? (
        <p>Loading rooms...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} setRoomID={setRoomID} />
          ))}
        </div>
      )}
      <NewRoomForm setRooms={setRooms} />
    </div>
  );
}

function RoomCard({
  room,
  setRoomID,
}: {
  room: Room;
  setRoomID: (id: number) => void;
}) {
  return (
    <div
      className={styles.roomCard}
      onClick={() => {
        setRoomID(room.id);
      }}
    >
      <h1>
        [{room.id}] {room.name}
      </h1>
    </div>
  );
}

function NewRoomForm({
  setRooms,
}: {
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}) {
  const [name, setName] = useState('');

  async function CreateRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // <- prevent page reload

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: { 'Content-Type': 'application/json' },
    });

    const newRoom = await res.json();
    setName(''); // reset input
    setRooms((prev) => [...prev, newRoom]);
  }

  return (
    <form onSubmit={CreateRoom} className={styles.newRoomForm}>
      <input
        type="text"
        placeholder="Room name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" disabled={!name.trim()}>
        Create Room
      </button>
    </form>
  );
}
