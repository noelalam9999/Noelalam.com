'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type ReadingProgress = {
  path: string;
  title?: string;
  scrollY: number;
  percentage: number;
  updatedAt: number;
};

const PROGRESS_KEY_PREFIX = 'readingProgress:';
const LAST_PROGRESS_KEY = 'lastReadingProgress';
const RESUME_PATH_KEY = 'resumeReadingPath';

export default function BlogReadingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!pathname?.startsWith('/blog/')) return;

    const key = `${PROGRESS_KEY_PREFIX}${pathname}`;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight || 1;
      const docHeight = document.documentElement.scrollHeight || 1;
      const percentage = Math.min(1, Math.max(0, (scrollY + viewportHeight) / docHeight));

      const payload: ReadingProgress = {
        path: pathname,
        scrollY,
        percentage,
        updatedAt: Date.now(),
      };

      try {
        window.localStorage.setItem(key, JSON.stringify(payload));
        window.localStorage.setItem(LAST_PROGRESS_KEY, JSON.stringify(payload));
      } catch {
        // ignore quota errors
      }
    };

    // Restore position if we came from the resume toast
    const maybeRestorePosition = () => {
      try {
        const resumePath = window.sessionStorage.getItem(RESUME_PATH_KEY);
        if (resumePath !== pathname) return;

        const raw = window.localStorage.getItem(key);
        if (!raw) return;

        const saved: ReadingProgress = JSON.parse(raw);
        const offset = 80; // account for nav
        const targetY = Math.max(0, saved.scrollY - offset);

        window.scrollTo({ top: targetY, behavior: 'smooth' });
      } catch {
        // ignore bad data
      } finally {
        try {
          window.sessionStorage.removeItem(RESUME_PATH_KEY);
        } catch {
          // ignore
        }
      }
    };

    const onScroll = () => {
      // Use rAF to avoid spamming writes during fast scroll
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Attempt restore shortly after mount so layout is ready
    const restoreTimeout = window.setTimeout(maybeRestorePosition, 150);

    // Initial save so we have at least a starting point
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(restoreTimeout);
    };
  }, [pathname]);

  return <>{children}</>;
}

