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
    id: 'functions',
    label: 'Functions',
    subtitle: 'Small, focused, and readable.',
    focusChapters: 'Ch. 3 — Functions.',
    qas: [
      {
        question: 'What makes a function "clean" in Uncle Bob\'s sense? Give concrete criteria.',
        strongSignal:
          'Mentions small size (few lines), doing one thing, descriptive names that reveal intent, few arguments (ideally 0–2), no side effects, and minimal nesting. Can explain why long parameter lists or flag arguments hurt readability.',
        weakSignal:
          'Says "short and clear" without specifics, or focuses only on naming and ignores size, arguments, or side effects.',
        example:
          'They refactored a 40-line function that validated and persisted an order into three: validateOrder(), buildOrderEntity(), saveOrder(). Each has a single responsibility and a name that says what it does.'
      },
      {
        question: 'How do you argue for refactoring a long function when the business says "it works"?',
        strongSignal:
          'Ties readability to future cost: bugs hide in long functions, changes are riskier, and onboarding is slower. Offers to do refactoring in small steps with tests, and to measure defect rate or time-to-change before/after if needed.',
        weakSignal:
          'Says "clean code is better" without connecting to business outcomes or offering a safe, incremental path.',
        example:
          'They say: "This 200-line function is where we\'ve had three production bugs this quarter. If we split it and add tests, we can change one part without retesting the whole flow—and the next feature will take half the time."'
      },
      {
        question: 'When is it acceptable to have a function with more than two or three parameters?',
        strongSignal:
          'Prefers parameter objects or builder-style APIs when many values are needed. Acknowledges rare cases (e.g., low-level APIs, DSLs) but still looks for ways to group or name parameters to reduce cognitive load.',
        weakSignal:
          'Defends long parameter lists as "necessary" without considering objects or alternative APIs.',
        example:
          'Instead of createUser(name, email, role, region, tier), they introduce a UserRegistrationRequest or use a builder so call sites read clearly and new optional fields don\'t explode the signature.'
      }
    ]
  },
  {
    id: 'comments',
    label: 'Comments',
    subtitle: 'When they help and when they lie.',
    focusChapters: 'Ch. 4 — Comments.',
    qas: [
      {
        question: 'Uncle Bob says "the best comment is no comment." When do you still write comments, and when do you avoid them?',
        strongSignal:
          'Explains that code should be self-explanatory via names and structure; comments that restate the code are noise. Good comments: legal/licensing, clarifying intent or non-obvious constraints, warning of consequences, TODOs with context. Bad: commented-out code, misleading or outdated comments.',
        weakSignal:
          'Either avoids all comments or defends commenting everything without distinguishing good from bad.',
        example:
          'They removed a comment like "// loop through users" and made the loop variable and function name express it. They kept a comment like "// Must run after migration X; schema assumes new column" because the "why" isn\'t visible in the code.'
      },
      {
        question: 'How do you handle outdated or misleading comments when refactoring?',
        strongSignal:
          'Treats comments as part of the refactor: update or delete them. If the comment was documenting a quirk, they try to encode that in the code (name, assertion, or type) so the comment can be removed. Never leaves a comment that no longer matches behavior.',
        weakSignal:
          'Refactors code and forgets comments, or leaves "we should fix this later" without action.',
        example:
          'They found a comment "// Returns null if not found" but the function now throws. They updated the signature/docs and removed the comment, and added a test that documents the throw.'
      }
    ]
  },
  {
    id: 'formatting',
    label: 'Formatting',
    subtitle: 'Vertical and horizontal readability.',
    focusChapters: 'Ch. 5 — Formatting.',
    qas: [
      {
        question: 'What role does formatting play in readability, beyond "looking nice"?',
        strongSignal:
          'Describes formatting as conveying structure: related code grouped vertically, blank lines separating concepts, density reflecting importance. Mentions consistent indentation, line length limits, and alignment that helps scan (e.g., similar names aligned). Connects to team conventions and tooling (linters, formatters).',
        weakSignal:
          'Treats formatting as cosmetic or personal preference with no link to scanning and understanding.',
        example:
          'They put all related setup at the top of a test, a blank line, then the act step, then the assert—so anyone can quickly see the three parts. They use the same pattern in production for "load → transform → save" blocks.'
      },
      {
        question: 'How do you make the case for consistent formatting (e.g., Prettier, ESLint) on a team?',
        strongSignal:
          'Frames it as reducing noise in code review (no "fix formatting" bikeshedding), making diffs meaningful, and onboarding faster because one style is learned. Mentions auto-format on save so it\'s a non-issue in daily work.',
        weakSignal:
          'Says "we should be consistent" without addressing review cost, diffs, or tooling.',
        example:
          'They say: "We spent 20 minutes last week arguing over line length. With Prettier, that debate disappears and we focus on logic. New hires run format once and the codebase looks familiar."'
      }
    ]
  },
  {
    id: 'objects-and-data',
    label: 'Objects and Data Structures',
    subtitle: 'Abstraction, boundaries, and the Law of Demeter.',
    focusChapters: 'Ch. 6 — Objects and Data Structures.',
    qas: [
      {
        question: 'What is the difference between an object (behavior-rich) and a data structure (data-rich), and why does it matter?',
        strongSignal:
          'Objects hide data behind behavior; you ask them to do things. Data structures expose data and have little or no behavior. Mixing both leads to confusion. Choosing one style per abstraction helps: either add behavior and hide data, or expose data and keep logic elsewhere (e.g., DTOs + services).',
        weakSignal:
          'Uses "object" and "data structure" interchangeably or can\'t explain the design consequence.',
        example:
          'They describe a User entity with methods like canApprove() and mergeProfile() (object) vs a UserDto with plain fields for API serialization (data structure). They don\'t put business logic in the DTO or expose internal collections from the entity.'
      },
      {
        question: 'Explain the Law of Demeter and how you apply it when refactoring.',
        strongSignal:
          'Describes it as "don\'t talk to strangers": a method should only use its own members, arguments, or objects it creates—not chain through returned objects (e.g., a.getB().getC()). Suggests refactoring by introducing a method on the owner that does the work, or by restructuring so the caller doesn\'t need to reach through.',
        weakSignal:
          'Has heard the name but can\'t state the rule or give a refactoring example.',
        example:
          'They replaced order.getCustomer().getAddress().getZip() with order.getCustomerZip() (or a similar facade on Order), so call sites don\'t depend on the internal structure of Customer and Address.'
      },
      {
        question: 'When would you expose raw data (e.g., getters for all fields) vs hide implementation behind behavior?',
        strongSignal:
          'Data structures (DTOs, configs, records) are fine to expose when the type is stable and there\'s no invariant to protect. Domain objects and aggregates benefit from hiding data and exposing only operations that preserve invariants. Context matters: API boundaries often use DTOs; core domain uses objects.',
        weakSignal:
          'Always exposes getters or always hides everything, with no nuance about context.',
        example:
          'They use a read-only view (e.g., getItems() returns a copy or immutable list) for a shopping cart so external code can\'t mutate it, but a simple struct for a request DTO where there are no invariants.'
      }
    ]
  },
  {
    id: 'unit-tests',
    label: 'Unit Tests',
    subtitle: 'Clean tests and how they drive design.',
    focusChapters: 'Ch. 9 — Unit Tests.',
    qas: [
      {
        question: 'What does "clean test" mean in Clean Code, and how does it differ from "any test that passes"?',
        strongSignal:
          'Clean tests are readable: they tell a story (setup, action, assertion), use descriptive names, and avoid duplication and mystery. FIRST: Fast, Independent, Repeatable, Self-validating, Timely. Test code is as important as production code and should be refactored.',
        weakSignal:
          'Equates clean with "green" or doesn\'t mention readability, structure, or FIRST.',
        example:
          'They show a test named givenExpiredSubscription_whenUserAccessesPremiumContent_thenRedirectsToUpgrade() with clear Given/When/Then sections and no magic numbers—so the test documents behavior and stays easy to change.'
      },
      {
        question: 'How do tests drive or improve design, in your experience?',
        strongSignal:
          'Explains that tests are the first client of the API: if tests are hard to write (lots of setup, unclear names), the design is probably wrong. Tests force smaller, focused units and dependency injection. Refactoring tests when behavior is clear improves both test and production structure.',
        weakSignal:
          'Sees tests only as a safety net and doesn\'t connect test design to production design.',
        example:
          'They wanted to test "apply discount" but had to construct an entire Order with 10 fields. They introduced a DiscountContext and a builder, which also made production code clearer and reuse easier.'
      },
      {
        question: 'How do you balance test coverage with keeping tests maintainable and fast?',
        strongSignal:
          'Prioritizes tests that protect critical behavior and refactoring; avoids testing implementation details. Keeps unit tests fast (no real DB/network in the hot loop), uses test doubles at boundaries, and reserves a small set of integration tests. Trims or rewrites tests that become brittle or slow.',
        weakSignal:
          'Chases 100% coverage or ignores maintainability and speed, leading to slow, flaky, or redundant tests.',
        example:
          'They test business rules with in-memory fakes and a handful of API contract tests against a test DB. They deleted 200 lines of tests that only asserted internal call order and replaced them with a few behavior-focused tests.'
      }
    ]
  }
];

export default function CleanCodeRobertMartinInterviewGuide() {
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
              Clean Code — Interview Guide
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
              An interview guide inspired by Robert C. Martin&apos;s &ldquo;Clean Code&rdquo;. Use it to probe how
              someone thinks about functions, comments, formatting, objects vs data structures, and how unit tests
              support refactoring and drive design—with concrete language you can use in interviews.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
              <h2 className="text-xl font-bold text-white mb-3">How to Use This Guide</h2>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>
                  <span className="text-white font-semibold">For interviewers:</span> Pick 1–2 questions per section and
                  ask for concrete examples—refactorings they did, code they wrote, and trade-offs they made.
                </li>
                <li>
                  <span className="text-white font-semibold">For candidates:</span> Tie answers to real code you’ve
                  written or reviewed. Use terms like &quot;one thing,&quot; &quot;Law of Demeter,&quot; &quot;FIRST,&quot; and &quot;clean test&quot; with
                  specific stories.
                </li>
                <li>
                  <span className="text-white font-semibold">Focus chapters:</span> 3–6 (functions, comments,
                  formatting, objects and data structures) and 9 (unit tests). Interview payoff: refactoring and
                  readability arguments; how tests drive design.
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
