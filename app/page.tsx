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

  useEffect(() => {
    // Handle hash navigation after loading completes
    if (!isLoading && window.location.hash) {
      const hash = window.location.hash.substring(1); // Remove the # symbol
      const element = document.getElementById(hash);
      if (element) {
        // Wait a bit for animations to complete
        setTimeout(() => {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [isLoading]);

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
