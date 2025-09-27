'use client';
import Link from 'next/link';
import styles from './Navbar.module.css';
import AuthForm from './auth/AuthForm';

export default function Navbar({
  collapsed,
  toggle,
}: {
  collapsed: boolean;
  toggle: () => void;
}) {
  return (
    <div
      className={styles.component}
      style={{
        width: collapsed ? '60px' : '200px',
        transition: 'width 0.3s ease',
      }}
    >
      <button onClick={toggle} className={styles.toggleButton}>
        {collapsed ? '→' : '←'}
      </button>
      {!collapsed && (
        <div className={styles.navContent}>
          <div className={styles.navLinks}>
            <Link className={styles.link} href="/">
              Home
            </Link>
            <Link className={styles.link} href="/chat">
              Chat
            </Link>
            <Link className={styles.link} href="/place">
              Place
            </Link>
            <Link className={styles.link} href="/minesweeper">
              Minesweeper
            </Link>
          </div>
          <AuthForm />
        </div>
      )}
    </div>
  );
}
