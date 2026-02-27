'use client';

import { useState, useEffect } from 'react';

type SectionNotesProps = {
  sectionId: string;
  blogSlug: string;
};

export default function SectionNotes({ sectionId, blogSlug }: SectionNotesProps) {
  const [note, setNote] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const storageKey = `blog-note-${blogSlug}-${sectionId}`;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedNote = window.localStorage.getItem(storageKey);
      if (savedNote) {
        setNote(savedNote);
      }
    } catch {
      // Ignore storage errors
    }
  }, [storageKey]);

  const handleSave = () => {
    if (typeof window === 'undefined') return;

    try {
      if (note.trim()) {
        window.localStorage.setItem(storageKey, note);
      } else {
        window.localStorage.removeItem(storageKey);
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch {
      // Ignore storage errors
    }
  };

  const handleClear = () => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.removeItem(storageKey);
      setNote('');
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div className="mt-4 border-t border-gray-800 pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span className="font-medium">
          {note ? 'Your notes' : 'Add notes'}
        </span>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add your notes here..."
            className="w-full min-h-[100px] bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-y"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {isSaved ? 'Saved!' : 'Save'}
            </button>
            {note && (
              <button
                onClick={handleClear}
                className="px-4 py-1.5 text-gray-400 hover:text-gray-300 text-sm transition-colors"
              >
                Clear
              </button>
            )}
            {isSaved && (
              <span className="text-xs text-green-400 ml-2">
                ✓ Saved locally
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
