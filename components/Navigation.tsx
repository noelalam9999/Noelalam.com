'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      
      // Update active section based on scroll position
      const sections = ['experience', 'projects', 'testimonials'];
      const scrollPosition = window.scrollY + 200;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navigateToPage = (path: string) => {
    window.location.href = path;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div
          className={`flex items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 ${
            isScrolled
              ? 'bg-black/70 backdrop-blur-md border-white/10 shadow-lg shadow-black/20'
              : 'bg-black/30 backdrop-blur-md border-white/5'
          }`}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-base sm:text-lg font-semibold tracking-wide bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            NOEL ALAM
          </motion.button>
          
          <div className="hidden md:flex items-center gap-2">
            {['experience', 'projects', 'testimonials'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`relative rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-all ${
                  activeSection === section
                    ? 'text-white bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
                {activeSection === section && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute inset-x-2 -bottom-0.5 h-px bg-gradient-to-r from-blue-400 to-purple-400"
                  />
                )}
              </button>
            ))}
            <button
              onClick={() => navigateToPage('/blog')}
              className="relative rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-all text-gray-300 hover:text-white hover:bg-white/5"
            >
              Blog
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 py-4 px-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10"
          >
            <div className="flex flex-col gap-2">
              {['experience', 'projects', 'testimonials'].map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    scrollToSection(section);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left rounded-lg px-3 py-2 text-sm font-medium uppercase tracking-wider text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
              <button
                onClick={() => {
                  navigateToPage('/blog');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left rounded-lg px-3 py-2 text-sm font-medium uppercase tracking-wider text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Blog
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
