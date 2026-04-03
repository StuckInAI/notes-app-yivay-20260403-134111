'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NotesList from './NotesList';
import NoteEditor from './NoteEditor';
import SearchBar from './SearchBar';

export interface Note {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
  createdAt: number;
}

const STORAGE_KEY = 'notes_app_data';

function loadNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Note[];
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [savedHint, setSavedHint] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadNotes();
    setNotes(loaded);
    if (loaded.length > 0) {
      setSelectedId(loaded[0].id);
    }
    setHydrated(true);
  }, []);

  const persistNotes = useCallback((updated: Note[]) => {
    setNotes(updated);
    saveNotes(updated);
  }, []);

  const handleNewNote = useCallback(() => {
    const now = Date.now();
    const newNote: Note = {
      id: generateId(),
      title: '',
      body: '',
      updatedAt: now,
      createdAt: now
    };
    const updated = [newNote, ...notes];
    persistNotes(updated);
    setSelectedId(newNote.id);
    setSavedHint(false);
  }, [notes, persistNotes]);

  const handleSelectNote = useCallback((id: string) => {
    setSelectedId(id);
    setSavedHint(false);
  }, []);

  const handleSaveNote = useCallback((id: string, title: string, body: string) => {
    const updated = notes.map(n =>
      n.id === id ? { ...n, title, body, updatedAt: Date.now() } : n
    );
    // Sort by updatedAt desc
    updated.sort((a, b) => b.updatedAt - a.updatedAt);
    persistNotes(updated);
    setSavedHint(true);
    setTimeout(() => setSavedHint(false), 2000);
  }, [notes, persistNotes]);

  const handleDeleteNote = useCallback((id: string) => {
    const updated = notes.filter(n => n.id !== id);
    persistNotes(updated);
    if (selectedId === id) {
      setSelectedId(updated.length > 0 ? updated[0].id : null);
    }
    setSavedHint(false);
  }, [notes, persistNotes, selectedId]);

  const filteredNotes = search.trim()
    ? notes.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.body.toLowerCase().includes(search.toLowerCase())
      )
    : notes;

  const selectedNote = notes.find(n => n.id === selectedId) ?? null;

  if (!hydrated) {
    return (
      <div className="app-container">
        <div className="app-header">
          <h1>📝 Notes</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>📝 Notes</h1>
        <p>Save, edit, and search your notes</p>
      </div>
      <SearchBar value={search} onChange={setSearch} />
      <div className="main-layout">
        <NotesList
          notes={filteredNotes}
          selectedId={selectedId}
          search={search}
          onSelect={handleSelectNote}
          onDelete={handleDeleteNote}
          onNewNote={handleNewNote}
        />
        <NoteEditor
          key={selectedNote?.id ?? 'empty'}
          note={selectedNote}
          savedHint={savedHint}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
          onNewNote={handleNewNote}
        />
      </div>
    </div>
  );
}
