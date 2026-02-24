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
  focusDocs: string;
  qas: QA[];
};

const sections: Section[] = [
  {
    id: 'jest-rtl-hooks-async',
    label: 'Jest + React Testing Library: Hooks & Async UI',
    subtitle: 'Testing stateful components, hooks, and async flows.',
    focusDocs:
      'Jest docs (timers, mocks), React Testing Library docs (render, screen, user-event, waitFor).',
    qas: [
      {
        question:
          'How do you test a custom React hook that fetches data asynchronously?',
        strongSignal:
          'Describes wrapping the hook with a test component or using a helper like renderHook (if available), mocking the HTTP layer, and asserting on loading/success/error states. Uses async utilities like waitFor or findBy* instead of arbitrary timeouts.',
        weakSignal:
          'Relies on setTimeout in the test or calls the hook directly without a React test harness, or doesn’t mock HTTP at all.',
        example:
          'For useUser(userId), they render a test component that calls the hook, mock the fetch with msw or jest mock, assert that “Loading…” shows first, then after waitFor the user name appears in the DOM.'
      },
      {
        question:
          'When testing components with React Testing Library, what do you focus assertions on?',
        strongSignal:
          'Focuses on behavior and what the user sees: text content, roles, labels, enabled/disabled state, not implementation details like internal state or specific hook calls. Uses queries like getByRole/getByLabelText instead of brittle selectors.',
        weakSignal:
          'Asserts on internal state, component instance methods, or class names instead of user-visible behavior.',
        example:
          'In a login form, they assert that the “Log in” button is disabled until both fields are filled, and that an error message appears when the server returns 401, without checking useState values.'
      },
      {
        question:
          'How do you handle async assertions in Jest + React Testing Library?',
        strongSignal:
          'Uses async utilities like waitFor, findBy*, or user-event which already await DOM updates. Avoids fixed delays with setTimeout. Knows that React updates are batched and that assertions should be retried until a condition passes or times out.',
        weakSignal:
          'Sprinkles arbitrary setTimeout calls or done callbacks without understanding waitFor/findBy retry semantics.',
        example:
          'They write await waitFor(() => expect(screen.getByText(/saved/i)).toBeInTheDocument()); after clicking “Save” instead of sleep(1000).'
      }
    ]
  },
  {
    id: 'mocking-http-timers',
    label: 'Mocking HTTP and Timers',
    subtitle: 'Isolating tests from the network and time.',
    focusDocs:
      'msw or jest.mock() for HTTP, Jest fake timers (jest.useFakeTimers/advanceTimersByTime).',
    qas: [
      {
        question:
          'How do you mock HTTP calls in Node/React tests, and why might you choose msw over basic jest.mock()?',
        strongSignal:
          'Explains that msw mocks at the network layer, so the app code stays unchanged and fetch/axios calls behave realistically. Contrasts with jest.mock() of individual modules, which can be brittle. Mentions testing different responses (success/error/timeout).',
        weakSignal:
          'Only knows global jest.mock("axios") without being able to explain trade-offs or how to exercise multiple response scenarios.',
        example:
          'They use msw to intercept GET /api/user and return different fixtures per test, keeping the component’s fetch logic unchanged and closer to production.'
      },
      {
        question:
          'When and how do you use Jest fake timers in testing async behavior?',
        strongSignal:
          'Uses jest.useFakeTimers() for time-based behavior like debouncing, polling, or timeouts. Calls advanceTimersByTime or runAllTimers to simulate time passage. Knows to clean up (restore real timers) and be careful with promises + timers.',
        weakSignal:
          'Avoids fake timers and relies on real time, or uses fake timers without understanding how it interacts with promises and microtasks.',
        example:
          'They test a debounced search input by typing, advancing timers by 300ms, and asserting that the API function was called once with the final value.'
      }
    ]
  },
  {
    id: 'snapshots-vs-behavior',
    label: 'Snapshots vs Behavior-Focused Tests',
    subtitle: 'Choosing the right assertion style.',
    focusDocs:
      'Jest snapshot testing docs, RTL guidance on avoiding over-snapshotting.',
    qas: [
      {
        question:
          'When would you use snapshot tests in a React app, and when would you avoid them?',
        strongSignal:
          'Uses snapshots sparingly for stable, presentation-focused components (icons, pure layout) or as a guard for accidental visual changes. Avoids large, fragile snapshots for complex interactive components; prefers behavior-focused assertions instead.',
        weakSignal:
          'Snapshots “everything” and treats snapshots as primary verification even for logic-heavy components, causing noisy diffs and brittle tests.',
        example:
          'They snapshot a simple Button variant library, but for a wizard component they assert specific text, enabled/disabled states, and navigation behavior instead of snapshotting the entire tree.'
      },
      {
        question:
          'How do you refactor a test suite that is over-reliant on snapshots?',
        strongSignal:
          'Describes replacing snapshots with explicit assertions on what matters: specific text, roles, attributes, and side effects. Keeps a few small snapshots only where they add value. Uses this as a chance to clarify test intent.',
        weakSignal:
          'Keeps all snapshots “because they might catch regressions someday” and doesn’t distinguish between signal and noise.',
        example:
          'They take a 500-line snapshot of a dashboard and replace it with tests that assert key KPIs, filters, and error messages, plus a tiny snapshot for a shared Card component.'
      }
    ]
  },
  {
    id: 'cypress-basics',
    label: 'Cypress E2E: Core Flows',
    subtitle: 'Login, navigation, and basic end-to-end checks.',
    focusDocs:
      'Cypress docs for writing E2E tests, selectors, cy.intercept, and default retry behavior.',
    qas: [
      {
        question:
          'What kinds of flows do you cover with Cypress E2E tests, and what do you leave to unit/integration tests?',
        strongSignal:
          'Uses Cypress for a thin set of business-critical user journeys (login, checkout, core navigation) and leaves detailed logic/unit behavior to Jest/RTL. Emphasizes cost of E2E (slow, brittle) and keeping the suite small but meaningful.',
        weakSignal:
          'Tries to test all behavior E2E, leading to a huge, slow suite, or uses Cypress only as a smoke test without clear coverage strategy.',
        example:
          'They have 3–5 Cypress specs: login, basic navigation, placing an order, and viewing history; everything like validation details and complex calculations is covered in fast unit tests.'
      },
      {
        question:
          'How do you choose selectors in Cypress, and why?',
        strongSignal:
          'Prefers stable selectors like data-testid/data-cy or accessible roles/text where appropriate, avoiding brittle CSS or DOM-structure-dependent selectors. Understands that refactors shouldn’t constantly break tests.',
        weakSignal:
          'Uses deeply nested CSS selectors or indexes (e.g., :nth-child(3)) that break on small layout changes.',
        example:
          'They select cy.get("[data-cy=login-button]") or cy.findByRole("button", { name: /log in/i }) instead of .page > div > button:nth-child(2).'
      }
    ]
  },
  {
    id: 'cypress-async-flaky',
    label: 'Async UI & Flakiness in Cypress',
    subtitle: 'Retries, cy.intercept, and waiting strategies.',
    focusDocs:
      'Cypress docs on automatic retries, assertions, cy.intercept, and best practices for avoiding flakiness.',
    qas: [
      {
        question:
          'How does Cypress handle retries and waiting for elements, and how does that affect how you write tests?',
        strongSignal:
          'Knows that Cypress automatically retries commands and assertions until they succeed or time out. Writes expectations that eventually become true instead of manually adding waits. Avoids cy.wait with arbitrary times.',
        weakSignal:
          'Sprinkles cy.wait(1000) everywhere and doesn’t rely on Cypress’s built-in retry behavior.',
        example:
          'They write cy.contains("Welcome, Alice") and let Cypress retry until the greeting appears after login, instead of sleeping for a fixed delay.'
      },
      {
        question:
          'How and why do you use cy.intercept in E2E tests?',
        strongSignal:
          'Uses cy.intercept to stub network calls for reliability, speed, and deterministic responses, especially for external services. Can explain when to stub vs hit real backends (e.g., for contract tests). Uses aliases and waits on intercepts for synchronization.',
        weakSignal:
          'Hits real APIs in all tests, making the suite flaky and slow, or uses cy.intercept only as a last resort without a strategy.',
        example:
          'They intercept GET /api/cart and return a fixture for most tests, but keep one nightly job that hits a real staging backend to detect integration issues.'
      },
      {
        question:
          'Give an example of a flaky Cypress test you fixed. What was the root cause and the solution?',
        strongSignal:
          'Can describe a real bug where a test sometimes failed due to async behavior, network, or timing (e.g., relying on .click().should("have.text") in the same chain). Fixed it by better waiting (assertions that retry, intercepts), stabilizing selectors, or adjusting app behavior.',
        weakSignal:
          'Only says “we increased timeouts” or “we rerun failed tests” without addressing root causes.',
        example:
          'They had a test that clicked “Submit” and immediately asserted on a success message. It was flaky until they waited on cy.intercept for the POST /submit call and then asserted on the UI after the server response.'
      }
    ]
  }
];

export default function ReactNodeTestingInterviewGuide() {
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
              Node & React Testing — Interview Guide
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
              An interview guide for Node/React testing with Jest, React Testing Library, and Cypress. Use it to probe
              whether someone can test hooks, async flows, API calls, state management, and build reliable E2E tests
              without flakiness or over-reliance on snapshots.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
              <h2 className="text-xl font-bold text-white mb-3">How to Use This Guide</h2>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>
                  <span className="text-white font-semibold">For interviewers:</span> Pick a few questions from each
                  section and listen for specific tools, APIs, and war stories (flaky tests they fixed, hooks they
                  tested), not just “we use Jest.” 
                </li>
                <li>
                  <span className="text-white font-semibold">For candidates:</span> Tie your answers to real tests and
                  bugs. Mention concrete utilities like waitFor, msw, jest.useFakeTimers, cy.intercept, and explain how
                  they shaped your design.
                </li>
                <li>
                  <span className="text-white font-semibold">Focus topics:</span> Jest + RTL for hooks/async/API/state,
                  mocking HTTP and timers, snapshots vs behavior-focused tests, and Cypress E2E for core flows with
                  async UI.
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
                      {section.focusDocs}
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

