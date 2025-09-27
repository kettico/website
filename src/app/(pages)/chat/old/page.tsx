'use client';
import { useState } from 'react';
import RoomSelector from './RoomSelector';
import RoomComponent from './RoomComponent';
import { Room } from './types';
import styles from './chat.module.css';

export default function ChatPage() {
  const [roomID, setRoomID] = useState(-1);

  return (
    <div className={styles.chatPage}>
      {roomID != -1 ? (
        <RoomComponent roomID={roomID} />
      ) : (
        <RoomSelector setRoomID={setRoomID} />
      )}
    </div>
  );
}
