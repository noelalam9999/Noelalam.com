'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Loader from '@/components/Loader';
import Navigation from '@/components/Navigation';
import IntroVideo from '@/components/IntroVideo';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Testimonials from '@/components/Testimonials';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Preload critical resources
    const preloadResources = async () => {
      // Simulate resource loading
      await new Promise(resolve => setTimeout(resolve, 2000));
    };
    
    preloadResources();
  }, []);

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {isLoading && (
          <Loader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      
      {!isLoading && (
        <>
          <Navigation />
          <IntroVideo />
          <Experience />
          <Projects />
          <Testimonials />
        </>
      )}
    </main>
  );
}
