import { Room } from "@/types/Room";
import Link from "next/link";
import React from "react";
import styles from "./chat.module.css";

export default function RoomCard({ Room }: { Room: Room }) {
  const { id, name } = Room;

  return (
    <Link href={`/chat/${id}`} style={{ textDecoration: 'none' }}>
      <div
        className={styles.RC_card}
        
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
        }}
      >
        <h2 style={{ margin: 0, color: '#333' }}>
          [{id}]: {name}
        </h2>
      </div>
    </Link>
  );
}