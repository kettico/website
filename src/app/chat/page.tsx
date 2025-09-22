'use client';
import { Room } from "@/types/Room";
import { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import NewRoomForm from "./NewRoomForm";
import styles from "./chat.module.css"

export default function ChatPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchRooms() {
    try {
      setLoading(true);
      const res = await fetch('/api/chat');
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title} > 🗂️ Available Chat Rooms </h1>

      {loading ? (
        <p className={styles.loading}>Loading rooms...</p>
      ) : (
        <div>
          {rooms.map(room => (
            <RoomCard key={room.id} Room={room} />
          ))}
        </div>
      )}

      {error && (
        <p className={styles.error}>{error}</p>
      )}

      <NewRoomForm onRoomCreated={fetchRooms} />
    </div>
  );
}