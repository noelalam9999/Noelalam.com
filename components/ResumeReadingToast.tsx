'use client';

import { useEffect, useState } from 'react';

type ReadingProgress = {
  path: string;
  title?: string;
  scrollY: number;
  percentage: number;
  updatedAt: number;
};

const STORAGE_KEY = 'lastReadingProgress';
const RESUME_PATH_KEY = 'resumeReadingPath';

export default function ResumeReadingToast() {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed: ReadingProgress = JSON.parse(raw);
      if (!parsed?.path) return;

      const currentPath = window.location.pathname;
      const isSamePath = currentPath === parsed.path;

      // Only show if not essentially finished and we're not already at the stored spot
      if (parsed.percentage >= 0.99) return;

      // If we're already on that page and roughly at same scroll, skip the toast
      if (isSamePath && Math.abs(window.scrollY - parsed.scrollY) < 100) {
        return;
      }

      setProgress(parsed);
      setIsVisible(true);
    } catch {
      // Ignore invalid JSON
    }
  }, []);

  if (!isVisible || !progress) return null;

  const handleContinue = () => {
    if (typeof window === 'undefined') return;

    try {
      window.sessionStorage.setItem(RESUME_PATH_KEY, progress.path);
    } catch {
      // ignore
    }

    setIsVisible(false);
    window.location.href = progress.path;
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const percentageLabel = `${Math.round(progress.percentage * 100)}% read`;

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex justify-center pointer-events-none">
      <div className="mt-20 max-w-xl w-full px-4 pointer-events-auto">
        <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur-lg shadow-xl shadow-black/40 px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3">
          <div className="hidden sm:block">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-sm font-semibold">
              ↻
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-300 mb-0.5">
              Continue Reading
            </p>
            <p className="text-sm text-gray-100 truncate">
              {progress.title ?? 'Your last blog'}{' '}
              <span className="text-gray-400">({percentageLabel})</span>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleContinue}
              className="inline-flex items-center justify-center rounded-full bg-blue-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-400 transition-colors"
            >
              Yes, continue
            </button>
            <button
              onClick={handleDismiss}
              className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
            >
              No thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

