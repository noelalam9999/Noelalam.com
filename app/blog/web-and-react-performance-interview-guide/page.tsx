'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

type QA = {
  question: string;
  strongSignal: string;
  weakSignal?: string;
  example: string;
};

type Section = {
  id: string;
  label: string;
  subtitle: string;
  focusChapters: string;
  qas: QA[];
};

const sections: Section[] = [
  {
    id: 'network-basics',
    label: 'TCP, HTTP/2/3 & Latency vs Bandwidth',
    subtitle: 'How the wire shapes front-end performance.',
    focusChapters:
      'High Performance Browser Networking — TCP basics, HTTP/2/3, latency vs bandwidth.',
    qas: [
      {
        question:
          'In practical terms, what’s the difference between optimizing for latency vs bandwidth on the web?',
        strongSignal:
          'Explains that latency is the time to first byte/round-trip; bandwidth is how much data per second you can send once the pipe is full. Front-end perf is often latency-bound (handshakes, request waterfalls). Talks about reducing round-trips (bundling, server push/HTTP/2 multiplexing, preconnect) vs shrinking payloads (compression, image optimization).',
        weakSignal:
          'Uses the terms interchangeably or only talks about “faster internet” without relating it to round-trips and bytes.',
        example:
          'They mention that moving from multiple JS files with separate connections to HTTP/2 multiplexed requests reduced time-to-interactive more than just compressing those files further, because they cut down on connection overhead.'
      },
      {
        question:
          'How do HTTP/2 and HTTP/3 change how you think about bundling and requests compared to HTTP/1.1?',
        strongSignal:
          'Mentions that HTTP/2 multiplexes many requests over a single connection, reducing head-of-line blocking at the HTTP layer, so excessive bundling is less necessary. HTTP/3 (QUIC) moves to UDP and improves recovery from packet loss. Still recognizes that too many tiny requests and bad prioritization can hurt.',
        weakSignal:
          'Thinks HTTP/2/3 magically fix performance and that bundling and caching no longer matter.',
        example:
          'They split a monolithic JS bundle into a few feature bundles loaded on demand, relying on HTTP/2 multiplexing instead of a single giant bundle, and observed better initial load for users who never hit some features.'
      }
    ]
  },
  {
    id: 'caching-frontend',
    label: 'Caching & Front-end Implications',
    subtitle: 'Getting the most from browser caches and CDNs.',
    focusChapters:
      'High Performance Browser Networking — caching, HTTP caching headers, and front-end perf.',
    qas: [
      {
        question:
          'How do you design your asset caching strategy for a React SPA?',
        strongSignal:
          'Discusses content hashing (filename-based cache busting), long max-age for static assets, and cache-control strategies (immutable for bundles, shorter for HTML). Mentions service workers or App Shell patterns optionally. Understands trade-offs when deploying frequently.',
        weakSignal:
          'Either disables caching during development and never revisits it, or sets all responses to “no-cache” out of fear of stale assets.',
        example:
          'They configure Webpack/Vite to output app.[hash].js with Cache-Control: max-age=1y,immutable, while index.html has a short TTL and references the new hash, so users quickly pick up new versions without re-downloading unchanged assets.'
      },
      {
        question:
          'What front-end changes have you made in the past that had the biggest impact on perceived performance?',
        strongSignal:
          'Provides concrete examples: image optimization (sizes, formats, lazy loading), critical CSS inlining, removing render-blocking scripts, deferring non-critical JS, or reducing above-the-fold bundle size. Ties changes back to metrics like LCP, TTI, or Time to First Byte.',
        weakSignal:
          'Speaks in generalities (“we minified JS”) without any measurement or user-visible impact.',
        example:
          'They replaced a large hero image with a responsive, lazy-loaded version and saw LCP improve by several hundred milliseconds on mobile, confirmed in Lighthouse/Chrome DevTools.'
      }
    ]
  },
  {
    id: 'react-memoization',
    label: 'React.memo, useMemo, useCallback',
    subtitle: 'Avoiding unnecessary work inside React.',
    focusChapters:
      'React docs — Performance: memoization hooks and when to use them.',
    qas: [
      {
        question:
          'When is it appropriate to use React.memo on a component, and when can it hurt you?',
        strongSignal:
          'Understands that React.memo is useful when props change infrequently and the component is expensive to render. Mentions that memo adds comparison overhead and can hurt if props change often or if shallow comparisons are expensive. Emphasizes measuring and targeting hot paths.',
        weakSignal:
          'Wants to wrap “everything in React.memo” without considering prop churn, or thinks memoization is free.',
        example:
          'They memoized a complex list item component used hundreds of times, based on stable props, and saw a noticeable improvement in scroll performance; they avoided memoizing simple buttons that frequently receive new inline handlers.'
      },
      {
        question:
          'Explain the difference between useMemo and useCallback. How have you used them to fix a real performance issue?',
        strongSignal:
          'Describes useMemo for caching derived values and useCallback for stable function references. Mentions use cases like avoiding expensive recalculations or preventing child re-renders due to changing props. Stresses that they’re optimization tools, not default patterns.',
        weakSignal:
          'Confuses the two hooks or wraps everything in useMemo/useCallback out of habit.',
        example:
          'They had a table where each row re-rendered because an inline onClick was recreated on every parent render; switching to useCallback for the handler stabilized the prop and cut down unnecessary re-renders of memoized row components.'
      }
    ]
  },
  {
    id: 'suspense-splitting',
    label: 'Suspense, Code Splitting & Lazy Loading',
    subtitle: 'Loading only what you need, when you need it.',
    focusChapters:
      'React docs — React.lazy, Suspense, route-based code splitting.',
    qas: [
      {
        question:
          'How would you introduce code splitting into a React app that currently ships a single large bundle?',
        strongSignal:
          'Mentions starting with route-based splitting via React.lazy and Suspense, then possibly component-level splits for heavy, rarely used components. Considers loading states and fallback UI. Acknowledges trade-offs (more small chunks vs initial bundle).',
        weakSignal:
          'Suggests splitting arbitrarily without a plan for loading states or measurement, or thinks code splitting automatically solves all performance issues.',
        example:
          'They moved the admin dashboard and charts into lazy-loaded routes with Suspense fallbacks, cutting initial JS payload for regular users while keeping the admin experience acceptable.'
      },
      {
        question:
          'How does Suspense help with perceived performance, and what are the caveats?',
        strongSignal:
          'Explains that Suspense coordinates loading states, letting you show consistent fallbacks while data or code loads. Mentions that it requires adopting Suspense-friendly data APIs (or wrappers) and being careful about too many nested boundaries. Notes that it changes the mental model of loading in React.',
        weakSignal:
          'Only knows Suspense as “something for lazy loading” without understanding boundaries or data fetching integration.',
        example:
          'They wrap a user profile in a Suspense boundary with a skeleton, so the rest of the page can render immediately while the profile data and component load, instead of blocking the whole page on the slowest piece.'
      }
    ]
  },
  {
    id: 'rerenders-lists',
    label: 'Avoiding Unnecessary Re-renders',
    subtitle: 'Keys, list rendering, and state placement.',
    focusChapters:
      'React docs — performance, reconciliation, and list keys.',
    qas: [
      {
        question:
          'How do you debug and fix unnecessary re-renders in a React component tree?',
        strongSignal:
          'Uses React DevTools (Profiler, “Highlight updates”) or logging to see what re-renders. Looks at props/state changes, memoization boundaries, and state placement. Avoids global state changes that force the entire tree to update; lifts or localizes state appropriately.',
        weakSignal:
          'Guesses at performance issues without measuring, or only adds memo hooks blindly without understanding why components rerender.',
        example:
          'They noticed a header re-rendering on every keystroke in a search field; moving the search state down and memoizing the header stopped those unnecessary renders.'
      },
      {
        question:
          'What are the implications of using array indexes as keys in React lists for performance and correctness?',
        strongSignal:
          'Explains that index keys can cause React to reuse DOM nodes incorrectly when list order changes, leading to visual glitches and stale state. Prefers stable, unique keys derived from data. Acknowledges that index keys may be acceptable for static, never-reordered lists.',
        weakSignal:
          'Uses indexes as keys everywhere and is unaware of the issues beyond a generic “React warns about keys.”',
        example:
          'They saw a bug where checkbox states followed items after re-sorting a list with index keys; switching to stable IDs as keys fixed both correctness and avoided confusing re-renders.'
      }
    ]
  }
];

export default function WebAndReactPerformanceInterviewGuide() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      <article className="max-w-3xl mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>

          <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm mb-4">
              Engineering
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
              Web & React Performance — Interview Guide
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>February 24, 2026</span>
              <span>•</span>
              <span>20 min read</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <div className="text-gray-300 leading-relaxed space-y-6">
            <p className="text-xl text-gray-400 mb-4">
              An interview guide for browser and React performance, inspired by Ilya Grigorik&apos;s &ldquo;High
              Performance Browser Networking&rdquo; and the official React performance docs. Use it to probe whether
              someone understands network fundamentals, caching, and how to use React&apos;s performance tools in
              real-world apps.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
              <h2 className="text-xl font-bold text-white mb-3">How to Use This Guide</h2>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>
                  <span className="text-white font-semibold">For interviewers:</span> Pick a few questions from the
                  network side and a few from the React side. Listen for metrics, tools, and concrete refactors, not
                  just “we used useMemo.” 
                </li>
                <li>
                  <span className="text-white font-semibold">For candidates:</span> Use project stories: what was slow,
                  how you measured it, what you changed (network, caching, React memoization, code splitting), and what
                  improved.
                </li>
                <li>
                  <span className="text-white font-semibold">Focus topics:</span> TCP/HTTP/2/3 basics, latency vs
                  bandwidth, caching strategies, React.memo/useMemo/useCallback, Suspense & code splitting, and avoiding
                  unnecessary re-renders (keys, state placement, list rendering).
                </li>
              </ul>
            </div>

            <div className="space-y-10">
              {sections.map((section, i) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{section.label}</h2>
                      <p className="text-sm text-blue-300 mt-1">{section.subtitle}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 whitespace-nowrap">
                      {section.focusChapters}
                    </span>
                  </div>

                  <div className="space-y-6 mt-4">
                    {section.qas.map((qa, idx) => (
                      <div
                        key={qa.question}
                        className="bg-black/20 border border-white/10 rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-sm text-gray-500 mt-1">{idx + 1}.</span>
                          <h3 className="text-lg font-semibold text-white">{qa.question}</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-green-500/5 border border-green-500/20 rounded-md p-3">
                            <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">
                              Strong answer signals
                            </p>
                            <p className="text-sm text-gray-300">{qa.strongSignal}</p>
                          </div>

                          {qa.weakSignal && (
                            <div className="bg-red-500/5 border border-red-500/20 rounded-md p-3">
                              <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                                Weak answer signals
                              </p>
                              <p className="text-sm text-gray-300">{qa.weakSignal}</p>
                            </div>
                          )}
                        </div>

                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-md p-3">
                          <p className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">
                            Real-life example pattern
                          </p>
                          <p className="text-sm text-gray-300">{qa.example}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              ))}
            </div>
          </div>
        </motion.div>
      </article>
    </main>
  );
}

