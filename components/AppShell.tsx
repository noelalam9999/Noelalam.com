'use client';

import { useEffect } from 'react';
import ResumeReadingToast from './ResumeReadingToast';

export default function AppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const register = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((error) => {
          console.error('Service worker registration failed:', error);
        });
    };

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
    }
  }, []);

  return (
    <>
      <ResumeReadingToast />
      {children}
    </>
  );
}

