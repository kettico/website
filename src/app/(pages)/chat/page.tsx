'use client';
import { useState } from 'react';
import ChatRoom from './ChatRoom';
import RoomSelector from './RoomSelector';
import styles from './chat.module.css';
import { Room } from './types';

export default function ChatPage() {
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);

  return (
    <div className={styles.chatPage}>
      {activeRoom ? (
        <ChatRoom room={activeRoom} goBack={() => setActiveRoom(null)} />
      ) : (
        <RoomSelector setActiveRoom={setActiveRoom} />
      )}
    </div>
  );
}
