import { Message } from "@/types/Message";
import styles from "./room.module.css";

export default function MessageCard({ msg }: { msg: Message }) {
  const { sender, content, timestamp } = msg;

  return (
    <div className={styles.messageCard}>
      <div className={styles.messageSender}>{sender}</div>
      <div className={styles.messageContent}>{content}</div>
      {timestamp && (
        <div className={styles.messageTimestamp}>
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}