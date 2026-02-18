'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

type Chapter = {
  number: number;
  title: string;
  coachNote: string;
  dos: string[];
  donts: string[];
};

const chapters: Chapter[] = [
  {
    number: 1,
    title: 'Refactoring — A First Example',
    coachNote:
      'This chapter walks through a real refactoring session so you can feel the rhythm. Don\'t skip it — the example teaches you the mindset.',
    dos: [
      'Start every refactoring with tests. Before you change a single line, ensure you have a solid, self-checking test suite for that code.',
      'Make small changes and test after each one. Compile → test → commit. This tight feedback loop is the core of safe refactoring.',
      'Refactor first when adding a feature. If the code isn\'t structured to accept the change easily, refactor first, then add the feature.',
      'Extract functions that reveal intent. If you have to figure out what a chunk does, extract it and name it after what it does.',
      'Remove temporary variables before extraction. They complicate extractions; use Replace Temp with Query when you can.',
      'Commit after each successful refactor. So you can always revert to a working state if things go wrong.',
      'Don\'t worry about trivial performance costs. Recomputing a value or looping twice is usually negligible; clarity comes first.',
    ],
    donts: [
      'Don\'t copy-and-paste to add variations. (e.g. HTML vs plain statement). Duplication is a menace for long-lived code.',
      'Don\'t refactor without tests. You\'re flying blind — the book calls this "cowboy refactoring."',
      'Don\'t take large steps. If you can\'t see a bug immediately, revert and take smaller steps.',
    ],
  },
  {
    number: 2,
    title: 'Principles in Refactoring',
    coachNote:
      'Here you learn what refactoring really means and when it\'s appropriate. The definition matters.',
    dos: [
      'Keep behavior unchanged when refactoring. Refactoring changes structure, not behavior. If behavior changes, it\'s a bug or a feature.',
      'Refactor when you need to add a feature or fix a bug. That\'s when messy code hurts the most. Don\'t refactor for its own sake on stable, rarely-touched code.',
      'Use the "Rule of Three." First time: write it. Second time: wince. Third time: refactor. Let the duplication reveal itself before acting.',
      'Separate refactoring commits from feature commits. Makes code review and rollback much easier.',
      'Improve design in small steps. Each refactoring is tiny; together they compound.',
      'Define "done" for refactoring. Stop when the design is good enough for the change at hand — don\'t over-engineer.',
    ],
    donts: [
      'Don\'t mix refactoring with behavior changes. One commit = refactor only, or feature only. Never both.',
      'Don\'t refactor code you\'re not about to change. YAGNI applies — you might never need that flexibility.',
      'Don\'t let "no time" become an excuse. Crunch often comes from messy code; refactoring saves time in the long run.',
      'Don\'t skip the definition. "Refactoring" = behavior-preserving transformation. If you say you\'re refactoring but behavior changes, you\'re doing something else.',
    ],
  },
  {
    number: 3,
    title: 'Bad Smells in Code',
    coachNote:
      '"If it stinks, change it." This chapter gives you the vocabulary to spot problems.',
    dos: [
      'Learn the smell names: Long Function, Long Parameter List, Duplicated Code, Feature Envy, Data Clumps, Primitive Obsession, Switch Statements, etc.',
      'Treat smells as hints, not rules. They suggest where to look; you decide whether and how to act.',
      'Fix smells in the area you\'re working. When you touch code, clean up the smells you encounter.',
      'Use comments as extraction hints. A comment often suggests a function name.',
      'Watch for Feature Envy. When a function is more interested in another module\'s data than its own, consider moving behavior.',
      'Use Data Clumps. If the same group of data appears together often, consider a parameter object or a new abstraction.',
      'Replace Switch Statements with polymorphism or lookup tables when they grow.',
    ],
    donts: [
      'Don\'t try to fix every smell at once. Prioritize by impact and by what you\'re changing.',
      'Don\'t assume all "smells" are bad. Sometimes a long function is fine; sometimes duplication is intentional. Use judgment.',
      'Don\'t ignore Message Chains. `a.getB().getC().getD()` suggests poor encapsulation — consider hiding internals.',
    ],
  },
  {
    number: 4,
    title: 'Building Tests',
    coachNote:
      'Tests are not optional for refactoring. This chapter teaches you how to get them.',
    dos: [
      'Make tests self-checking. They should pass/fail without manual inspection. No hand-checking output.',
      'Respond to a bug by writing a failing test first. Reproduce the bug in a test, then fix it. The test stays as a regression guard.',
      'Use a testing framework (Jest, pytest, etc.) so you can run tests with a single command.',
      'Focus on "Would a defect be caught?" Subjective but useful — if a change would break behavior, a test should fail.',
      'Refactor tests too. Tests are code; keep them clear and maintainable.',
      'Use characterization tests for legacy code. Capture current behavior, then refactor with confidence.',
    ],
    donts: [
      'Don\'t rely on test coverage alone. Coverage shows what\'s executed, not how well it\'s tested.',
      'Don\'t skip tests because "there\'s no time." You\'ll spend more time debugging later.',
      'Don\'t over-test. If you spend more time changing tests than code, you may have too many brittle tests. But under-testing is far more common.',
      'Don\'t test through the UI if you can avoid it. Unit tests are faster and more precise for refactoring support.',
    ],
  },
  {
    number: 5,
    title: 'Introducing the Catalog',
    coachNote:
      'The catalog is a reference. Use it when you know what smell you\'re addressing but need the mechanics.',
    dos: [
      'Learn the catalog format: Name, Sketch, Motivation, Mechanics, Examples. Use it as a checklist.',
      'Take small steps. The mechanics describe the safest path; take smaller steps if you hit trouble.',
      'Revert to last green if a test fails. Don\'t debug a big change — back up and take smaller steps.',
      'Use the sketch and name to quickly find the refactoring you need.',
      'Read the motivation to know when NOT to apply a refactoring — every refactoring has contraindications.',
      'Treat the catalog as a vocabulary. Knowing "Extract Function" vs "Inline Function" helps you communicate and think clearly.',
    ],
    donts: [
      'Don\'t memorize every step. Reference the mechanics when needed.',
      'Don\'t assume the catalog is complete. There are refactorings not in the book; the principles still apply.',
      'Don\'t skip the "mechanics" when you\'re stuck. They often cover edge cases you missed.',
    ],
  },
  {
    number: 6,
    title: 'A First Set of Refactorings',
    coachNote:
      'Extract Function and Extract Variable are your bread and butter. Master these first.',
    dos: [
      'Extract Function when intent differs from implementation. If you have to think to understand a block, extract it and name it.',
      'Name functions by what they do, not how. `amountFor(aPerformance)` not `calculateAmountFromPlayType`.',
      'Extract Variable for complex expressions. Name the sub-expression to clarify intent.',
      'Use Inline Function when the body is as clear as the name, or when you\'re about to re-extract differently.',
      'Use Change Function Declaration to rename or add/remove parameters — do it in small steps.',
      'Combine Functions into Class when several functions operate on shared data. Combines data + behavior.',
      'Use Split Phase when a function does two distinct things (e.g. parse then render). Split into phases.',
    ],
    donts: [
      'Don\'t extract when too many locals are assigned. Use Split Variable or Replace Temp with Query first to simplify.',
      'Don\'t hesitate to extract single-line functions if the name improves readability. Size isn\'t the point — intent is.',
      'Don\'t inline polymorphic methods. If subclasses override it, you can\'t inline.',
    ],
  },
  {
    number: 7,
    title: 'Encapsulation',
    coachNote:
      'Hide your data. Encapsulation reduces coupling and makes change safer.',
    dos: [
      'Encapsulate records (plain objects) with getters/setters so you can change structure later.',
      'Encapsulate collections — don\'t expose raw arrays; return copies or wrapped accessors.',
      'Replace Primitive with Object when a primitive has behavior or multiple attributes (e.g. a "price" with currency).',
      'Use Encapsulate Variable for module-level or object data. Access only through getters/setters.',
      'Hide the representation. Callers shouldn\'t know if you store cents or dollars, or which fields exist.',
      'Replace Temp with Query to remove temporary variables that complicate extraction.',
    ],
    donts: [
      'Don\'t expose mutable collections directly. `return items` allows callers to mutate; return a copy or a read-only view.',
      'Don\'t encapsulate "for performance" without measuring. Usually the cost is negligible.',
      'Don\'t break encapsulation "just this once." One leak leads to many.',
    ],
  },
  {
    number: 8,
    title: 'Moving Features',
    coachNote:
      'Code often lives in the wrong place. Moving it is a core refactoring skill.',
    dos: [
      'Use Move Function when a function is used more by another module than its current home.',
      'Use Move Field when a field is used more by another class. Move the data and the behavior that uses it.',
      'Slide Statements to gather related code before extracting or moving.',
      'Use Move Statements into Function to pull call-site logic into the called function when it belongs there.',
      'Use Move Statements to Callers when the callee has logic that only some callers need.',
      'Split Loop when one loop does two things — makes extraction and moving easier.',
    ],
    donts: [
      'Don\'t move without updating callers. Use find-all-references and update each call site.',
      'Don\'t move in one giant step. Move, test, then move again if needed.',
      'Don\'t leave orphaned helpers — if you move a function, move or inline its close helpers too.',
    ],
  },
  {
    number: 9,
    title: 'Organizing Data',
    coachNote: 'Data structures drive complexity. Organize them well.',
    dos: [
      'Split Variable when one variable is used for two different things. Give each a clear name.',
      'Rename Variable liberally. Good names reduce cognitive load.',
      'Replace Derived Variable with Query when you\'re maintaining a value that can be computed.',
      'Encapsulate Record and Encapsulate Collection — see Chapter 7.',
      'Replace Magic Literal with Named Constant. `const TAX_RATE = 0.08` beats `0.08` in five places.',
      'Change Reference to Value for small, immutable data. Simplifies reasoning.',
    ],
    donts: [
      'Don\'t use one variable for multiple roles. Split it and name each use.',
      'Don\'t keep derived data in sync manually if a query is cheap. Duplicated state causes bugs.',
      'Don\'t expose raw data structures when encapsulation would hide future changes.',
    ],
  },
  {
    number: 10,
    title: 'Simplifying Conditional Logic',
    coachNote: 'Conditionals are where bugs hide. Simplify them.',
    dos: [
      'Decompose Conditional — extract the condition, then-branch, and else-branch into named functions.',
      'Consolidate Conditional Expression when multiple conditions lead to the same result.',
      'Replace Nested Conditional with Guard Clauses. Early returns reduce nesting and clarify flow.',
      'Replace Conditional with Polymorphism when behavior varies by type — move logic into subtypes.',
      'Introduce Null Object or Introduce Assertion to eliminate null checks when appropriate.',
      'Use Extract Function on condition branches to name complex logic.',
    ],
    donts: [
      'Don\'t nest conditionals when guard clauses would flatten the logic.',
      'Don\'t use polymorphism for simple conditionals. A switch or if/else is fine for 2–3 cases.',
      'Don\'t leave "mystery" conditions. Extract and name them so intent is clear.',
    ],
  },
  {
    number: 11,
    title: 'Refactoring APIs',
    coachNote:
      'APIs are the joints between modules. Clean APIs make everything easier.',
    dos: [
      'Separate Query from Modifier when a function both returns data and changes state. Split into two.',
      'Parameterize Function when two functions differ only by a literal — add a parameter.',
      'Remove Flag Argument when a boolean parameter switches behavior. Use explicit function names instead.',
      'Preserve Whole Object instead of passing multiple values — pass the object.',
      'Replace Parameter with Query (or inverse) based on which module should own the knowledge.',
      'Introduce Parameter Object when you have a clump of parameters that travel together.',
    ],
    donts: [
      'Don\'t combine queries and modifiers. Callers expect one or the other; mixing causes surprises.',
      'Don\'t add parameters "just in case." Add when you have a real need.',
      'Don\'t change public APIs without a deprecation path. Use wrappers or versioning for external consumers.',
    ],
  },
  {
    number: 12,
    title: 'Dealing with Inheritance',
    coachNote:
      'Inheritance is powerful and easy to misuse. Refactor it carefully.',
    dos: [
      'Pull Up Method/Field when subclasses share behavior or data. Move to superclass.',
      'Push Down Method/Field when a superclass member is only used by one subclass.',
      'Replace Type Code with Subclasses when type affects behavior. Use polymorphism.',
      'Replace Subclass with Delegate when inheritance feels wrong — composition can be clearer.',
      'Replace Superclass with Delegate to break inheritance when the relationship is forced.',
      'Use Extract Superclass when two classes share significant behavior.',
      'Collapse Hierarchy when a subclass adds nothing meaningful.',
    ],
    donts: [
      'Don\'t use inheritance for code reuse alone. Prefer composition if there\'s no clear "is-a" relationship.',
      'Don\'t leave empty subclasses — push down or collapse.',
      'Don\'t refactor inheritance without tests. The coupling is subtle; behavior can break in non-obvious ways.',
    ],
  },
];

export default function RefactoringBlogPost() {
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
              Refactoring — Your Coach&apos;s Guide
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>February 18, 2026</span>
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
              A chat-style guide to Martin Fowler&apos;s &ldquo;Refactoring: Improving the Design of Existing Code&rdquo; (2nd ed.) — your path to world-class refactoring.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
              <h2 className="text-xl font-bold text-white mb-3">How to Use This Guide</h2>
              <p className="text-gray-400">
                <strong className="text-white">Status toggles</strong> at the top of each chapter: change{' '}
                <span className="text-yellow-400">Not Read</span> → <span className="text-green-400">Read</span> and{' '}
                <span className="text-yellow-400">Not Implemented</span> → <span className="text-green-400">Implemented</span> as you progress.
              </p>
              <p className="text-gray-400 mt-3">
                <strong className="text-white">My Notes</strong> — Write your experience when you try each practice. What worked? What was tricky? What would you do differently?
              </p>
            </div>

            <div className="space-y-10">
              {chapters.map((chapter, i) => (
                <motion.div
                  key={chapter.number}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.04 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h2 className="text-2xl font-bold text-white">
                      Chapter {chapter.number}: {chapter.title}
                    </h2>
                    <div className="flex gap-2 shrink-0 mt-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 whitespace-nowrap">
                        Not Read
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 whitespace-nowrap">
                        Not Implemented
                      </span>
                    </div>
                  </div>

                  <p className="text-blue-300 italic text-sm mb-5">
                    Coach says: {chapter.coachNote}
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                      <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-3">DO</h3>
                      <ol className="space-y-2">
                        {chapter.dos.map((point, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-gray-300">
                            <span className="text-green-500 shrink-0 font-bold">{idx + 1}.</span>
                            <span dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3">DON&apos;T</h3>
                      <ol className="space-y-2">
                        {chapter.donts.map((point, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-gray-300">
                            <span className="text-red-500 shrink-0 font-bold">{chapter.dos.length + idx + 1}.</span>
                            <span dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="mt-4 bg-white/3 border border-white/10 rounded-lg p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">My Notes</p>
                    <p className="text-gray-600 text-sm italic">
                      (Your experience when implementing these points)
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl p-8 mt-4">
              <h2 className="text-2xl font-bold text-white mb-3">Final Coach Note</h2>
              <p className="text-gray-300">
                Refactoring is a skill you build over time. Start with small steps, lean on tests, and use the catalog when you&apos;re stuck. The best refactorers aren&apos;t the ones who know every refactoring — they&apos;re the ones who take small steps, test often, and aren&apos;t afraid to revert.
              </p>
              <p className="text-blue-400 italic mt-4">— Your refactoring coach</p>
            </div>
          </div>
        </motion.div>
      </article>
    </main>
  );
}
