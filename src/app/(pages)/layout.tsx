'use client';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '../components/navbar/Navbar';
import { useState } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div style={{ display: 'flex', height: '100vh' }}>
          <Navbar
            collapsed={collapsed}
            toggle={() => setCollapsed(!collapsed)}
          />
          <main
            style={{
              flex: 1,
              padding: '2rem',
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
