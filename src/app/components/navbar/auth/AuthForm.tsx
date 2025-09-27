'use client';
import { useState } from 'react';
import styles from './AuthForm.module.css';

export default function AuthForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(false);

  async function handleLogin() {
    console.log('Start handleLogin');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (data.message) {
      setToken(true);
    }
    setMessage(data.message || data.error);
  }

  async function handleRegister() {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (data.message) {
      setToken(true);
    }
    setMessage(data.message || data.error);
  }

  async function handleLogout() {
    setToken(false);
    setUsername('');
    setPassword('');
    setMessage('Logged out');
  }

  return (
    <div className={styles.authContainer}>
      {message && <p>{message}</p>}
      {token ? (
        <div>
          <p> Hello {username} </p>
          <button onClick={handleLogout}> Logout </button>
        </div>
      ) : (
        <div className={styles.authForm}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <button onClick={handleLogin}> Login </button>
            <button onClick={handleRegister}> Register </button>
          </div>
        </div>
      )}
    </div>
  );
}
