'use client';

import React from 'react';
import type { Note } from './NotesApp';

interface NotesListProps {
  notes: Note[];
  selectedId: string | null;
  search: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewNote: () => void;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="highlight">{part}</mark> : part
  );
}

export default function NotesList({
  notes,
  selectedId,
  search,
  onSelect,
  onDelete,
  onNewNote
}: NotesListProps) {
  return (
    <div className="notes-list">
      <div className="notes-list-header">
        <h2>Notes</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="notes-count">{notes.length}</span>
          <button className="new-note-btn" onClick={onNewNote} title="New note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New
          </button>
        </div>
      </div>
      {notes.length === 0 ? (
        <div className="notes-empty">
          {search ? 'No notes match your search.' : 'No notes yet. Create one!'}
        </div>
      ) : (
        notes.map(note => (
          <div
            key={note.id}
            className={`note-item${selectedId === note.id ? ' active' : ''}`}
            onClick={() => onSelect(note.id)}
          >
            <div className="note-item-title">
              {highlightText(note.title || 'Untitled', search)}
            </div>
            <div className="note-item-preview">
              {highlightText(note.body ? note.body.slice(0, 80) : 'No content', search)}
            </div>
            <div className="note-item-date">{formatDate(note.updatedAt)}</div>
            <button
              className="note-item-delete"
              title="Delete note"
              onClick={e => {
                e.stopPropagation();
                onDelete(note.id);
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
            </button>
          </div>
        ))
      )}
    </div>
  );
}
