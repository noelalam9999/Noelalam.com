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
    id: 'red-green-refactor',
    label: 'Red–Green–Refactor in Practice',
    subtitle: 'The classic TDD loop from the Money example.',
    focusChapters: 'Part I — Money example: chapters 1–11.',
    qas: [
      {
        question: 'How do you explain the red–green–refactor loop to a junior engineer?',
        strongSignal:
          'Clearly separates three phases: write a failing test that expresses intent (red), write the simplest code to make it pass (green), then improve the design with small refactorings while keeping tests green. Emphasizes very small steps and not skipping refactor.',
        weakSignal:
          'Describes TDD as "writing tests first" without mentioning the tight loop, or treats refactoring as optional “cleanup if there’s time.”',
        example:
          'In the Money example, they start with a failing test for $5 × 2 = $10, hard-code the result to go green, then refactor towards a real multiplication implementation only once the test passes.'
      },
      {
        question:
          'Give a concrete example of a test you would write first, and how you’d move from red to green to refactor.',
        strongSignal:
          'Picks a small behavior (e.g., adding two amounts of money, or applying a discount) and writes a specific assertion. Describes an intentionally naive implementation for green, then one or two targeted refactorings (extracting duplication, introducing a type) guided by the tests.',
        weakSignal:
          'Talks abstractly about “unit tests” or jumps straight to a full implementation without any interim naive step.',
        example:
          'For a discount calculator, they first add a test that 10% off 100 equals 90, then implement `return 90;` to get green, then refactor to `return price - price * rate;` once the structure is clearer and more tests exist.'
      },
      {
        question:
          'How do you decide what the “next test” should be when you’re working TDD style?',
        strongSignal:
          'Mentions driving from the next smallest, most valuable behavior: edge cases, new branches, or refactoring pressure from duplication. References Kent Beck’s idea of “list of tests” and picking the one that teaches you the most while still being small.',
        weakSignal:
          'Chooses huge, integrated scenarios as next tests or says “I just write whatever tests I remember” with no sense of ordering.',
        example:
          'In the Money example, once multiplication works, they add tests for equality and currency handling instead of jumping straight to cross-currency conversions with exchange rates.'
      }
    ]
  },
  {
    id: 'design-via-tests',
    label: 'Designing APIs and Objects via Tests',
    subtitle: 'Letting tests shape the Money domain model.',
    focusChapters:
      'Part I — Money example: equality, currency, and expressions.',
    qas: [
      {
        question:
          'How do your tests influence the public API of your objects or modules?',
        strongSignal:
          'Explains that tests are the first client of the API: you feel friction when the design is awkward. Talks about changing method names, argument lists, or responsibilities when tests are hard to write or read. Ties this back to Money, where the need for operations led to introducing `Expression` and `Bank`.',
        weakSignal:
          'Sees tests as a separate afterthought, only verifying what’s already implemented, never driving changes to the design.',
        example:
          'They describe starting with `Money.times(2)` in the test, realizing later that mixing currencies in tests is messy, and then introducing a `Bank.reduce(Expression, toCurrency)` API that emerged from what tests wanted to say.'
      },
      {
        question:
          'Describe a time tests led you to introduce a new abstraction (like `Expression` or `Bank` in the book).',
        strongSignal:
          'Can tell a story where repeated patterns in tests or difficult setups pointed at a missing concept. Mentions extracting a type or service to simplify test code and production code together.',
        weakSignal:
          'Only mentions abstractions invented in advance during design sessions, not discovered through testing pressure.',
        example:
          'After writing several tests that all had to manually convert between currencies, they introduced a `Bank` abstraction responsible for rates and conversion, simplifying both test fixtures and production code.'
      },
      {
        question:
          'What does “triangulation” mean in TDD, and when do you use it?',
        strongSignal:
          'Explains that triangulation is adding more than one example to force a general solution instead of overfitting to a single case. Uses it when unsure about the right abstraction or formula.',
        weakSignal:
          'Has never heard the term, or misuses it as “trying multiple implementations” with no connection to tests.',
        example:
          'They first test $5 × 2 = $10 and implement a naive multiply. They then add $5 × 3 = $15, and only after the second test do they extract a general multiplication formula, replacing hard-coded results.'
      }
    ]
  },
  {
    id: 'test-seams',
    label: 'Test Seams and Isolation',
    subtitle: 'Where to insert tests and how to keep them fast.',
    focusChapters:
      'Part I and II — small steps, decoupling, and test infrastructure.',
    qas: [
      {
        question:
          'What is a “seam” in the context of testing, and how do you create them in your code?',
        strongSignal:
          'Defines a seam as a place where you can change behavior without editing code, often by injection or indirection. Describes using interfaces, dependency injection, or factories to swap collaborators for tests.',
        weakSignal:
          'Thinks seams are just “lines between modules” and does not connect them to substitutability in tests.',
        example:
          'They talk about introducing a `Clock` interface so tests can inject a fake time source instead of relying on the system clock, letting them test time-sensitive logic deterministically.'
      },
      {
        question:
          'How do you keep TDD fast when your code touches slow dependencies (DBs, networks, file systems)?',
        strongSignal:
          'Mentions using seams around slow I/O, layering (domain logic separate from infrastructure), and fake implementations in unit tests. Reserves end-to-end tests for a smaller suite.',
        weakSignal:
          'Runs all tests through real databases or external APIs and considers slow tests to be “just the cost of testing.”',
        example:
          'In a billing system, they test invoice calculations purely in memory using a fake repository, and only run a few integration tests with the real DB as a smoke test.'
      },
      {
        question:
          'In the xUnit example, what lessons do you take about designing test infrastructure itself?',
        strongSignal:
          'Highlights patterns like setup/teardown hooks, reuse via inheritance/composition, and testing the test framework with its own features. Appreciates that even test code benefits from small steps and refactoring.',
        weakSignal:
          'Treats test frameworks as black boxes and has never thought about the design of test infrastructure.',
        example:
          'They mention how building an xUnit-like framework reveals needs for test discovery, fixtures, and reporting, and how that experience carries over when customizing test harnesses at work.'
      }
    ]
  },
  {
    id: 'incremental-design',
    label: 'Incremental Design and Confidence',
    subtitle: 'How TDD changes the way you design and refactor.',
    focusChapters:
      'Part I & II — emergent design, small steps, and confidence loops.',
    qas: [
      {
        question:
          'How does TDD change your approach to designing a system compared to designing everything up front?',
        strongSignal:
          'Emphasizes emergent design: starting from concrete examples, letting abstractions appear when tests get messy, and refactoring as behavior is covered. Mentions that TDD gives confidence to change design because tests protect behavior.',
        weakSignal:
          'Frames TDD as just a quality gate on a design they already decided, with no impact on how that design emerges.',
        example:
          'They describe starting with a simple in-memory implementation for a repository in tests, then later introducing a database implementation behind the same interface once tests show the behavior is stable.'
      },
      {
        question:
          'Describe a time tests gave you the courage to do a risky refactor. What did that look like?',
        strongSignal:
          'Provides a concrete story where a safe green state allowed them to perform a non-trivial refactor (e.g., splitting a class, changing an algorithm) with quick feedback. Highlights frequent test runs and small steps.',
        weakSignal:
          'Talks in vague terms about “feeling safer with tests” but cannot give a specific example of using them during a big change.',
        example:
          'They mention replacing a brittle inheritance hierarchy with composition while leaning on a suite of characterization tests that stayed green at each incremental step.'
      },
      {
        question:
          'When would you not use TDD, or at least relax it, and why?',
        strongSignal:
          'Acknowledges trade-offs: TDD is best when behavior is reasonably clear and stable. For UI spikes, heavy exploration, or uncertain prototypes, they may start without strict TDD but add tests as behavior stabilizes. Still values tests, just not dogmatically.',
        weakSignal:
          'Either insists TDD is always the answer or dismisses it entirely for being “too slow,” with no nuance.',
        example:
          'They might sketch a throwaway UI or exploratory script first, then once core invariants are clear (e.g., pricing rules), wrap that logic in test-driven modules.'
      }
    ]
  }
];

export default function TddKentBeckInterviewGuide() {
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
              Test-Driven Development — Interview Guide
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>February 24, 2026</span>
              <span>•</span>
              <span>18 min read</span>
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
              An interview guide inspired by Kent Beck&apos;s &ldquo;Test-Driven Development: By Example&rdquo;.
              Use it to probe whether someone has actually practiced TDD, can describe red–green–refactor in concrete
              terms, and understands test seams and incremental design beyond slogans.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
              <h2 className="text-xl font-bold text-white mb-3">How to Use This Guide</h2>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>
                  <span className="text-white font-semibold">For interviewers:</span> Pick a few questions from each
                  section and push for concrete stories — tests, code changes, and outcomes — not just definitions.
                </li>
                <li>
                  <span className="text-white font-semibold">For candidates:</span> Map each question to something you
                  actually built. It&apos;s okay if the project was small; focus on the loop and your design decisions.
                </li>
                <li>
                  <span className="text-white font-semibold">Focus parts:</span> Part I (Money example) for the TDD loop
                  and incremental design; Part II (xUnit) for test infrastructure thinking and seams.
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

