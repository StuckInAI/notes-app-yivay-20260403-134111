'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { Note } from './NotesApp';

interface NoteEditorProps {
  note: Note | null;
  savedHint: boolean;
  onSave: (id: string, title: string, body: string) => void;
  onDelete: (id: string) => void;
  onNewNote: () => void;
}

export default function NoteEditor({ note, savedHint, onSave, onDelete, onNewNote }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title ?? '');
  const [body, setBody] = useState(note?.body ?? '');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(note?.title ?? '');
    setBody(note?.body ?? '');
    if (note && !note.title) {
      titleRef.current?.focus();
    }
  }, [note]);

  if (!note) {
    return (
      <div className="editor-panel editor-panel-empty">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        <p>Select a note or create a new one</p>
        <button className="btn btn-primary" onClick={onNewNote}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Note
        </button>
      </div>
    );
  }

  const isDirty = title !== (note.title ?? '') || body !== (note.body ?? '');

  const handleSave = () => {
    onSave(note.id, title, body);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="editor-panel" onKeyDown={handleKeyDown}>
      <input
        ref={titleRef}
        className="editor-title-input"
        type="text"
        placeholder="Note title..."
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        className="editor-body-input"
        placeholder="Start writing your note here..."
        value={body}
        onChange={e => setBody(e.target.value)}
      />
      <div className="editor-actions">
        {savedHint && !isDirty && (
          <span className="editor-saved-hint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Saved
          </span>
        )}
        <button
          className="btn btn-danger"
          onClick={() => onDelete(note.id)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
          Delete
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={!isDirty}
          title="Save (Ctrl+S)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Save
        </button>
      </div>
    </div>
  );
}
