import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Notes App',
  description: 'A simple notes app with save, edit, and search features'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
