'use client';
import { useEffect, useState } from 'react';
import styles from './AuthForm.module.css';

export default function AuthForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUsername = localStorage.getItem('auth_username');

    if (token && storedUsername && token === `token-${storedUsername}`) {
      setUsername(storedUsername);
      setIsAuthenticated(true);
    }
  }, []);

  async function POSTLogin() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error('Failed to login');

      const data = await res.json();
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_username', username);
      setIsAuthenticated(true);
    } catch {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  }

  function Logout() {
    setUsername('');
    setPassword('');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_username');
    setIsAuthenticated(false);
  }

  return (
    <div className={styles.authContainer}>
      {isAuthenticated ? (
        <div className={styles.authWelcome}>
          <p className={styles.authMessage}>Hello, {username}!</p>
          <button className={styles.authButton} onClick={Logout}>
            Logout
          </button>
        </div>
      ) : (
        <form
          className={styles.authForm}
          onSubmit={(e) => {
            e.preventDefault();
            POSTLogin();
          }}
        >
          <div className={styles.inputRow}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.formInput}
              placeholder="Username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.formInput}
              placeholder="Password"
            />
          </div>

          <div className={styles.buttonRow}>
            <button
              type="submit"
              className={styles.authButton}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button
              type="button"
              className={styles.authButton}
              onClick={() => alert('Signup not implemented')}
            >
              Signup
            </button>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}
        </form>
      )}
    </div>
  );
}
