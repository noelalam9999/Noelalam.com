'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function TddAndPerfPracticeGuide() {
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
              TDD + Performance Practice — Step-by-Step Guide
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
          <div className="text-gray-300 leading-relaxed space-y-8">
            <p className="text-xl text-gray-400">
              A hands-on practice to sharpen TDD and performance skills on both React and Node. You&apos;ll write tests
              first, introduce a performance problem on purpose, measure it, fix it, then do the same on a small API
              with load testing and simple optimizations. At the end you&apos;ll have a clear story for interviews:
              &ldquo;First I wrote a failing test for X, then I implemented Y, here&apos;s how I measured before and
              after, and here&apos;s the tradeoff I made.&rdquo;
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-3">What You&apos;ll Do</h2>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>
                  <strong className="text-white">React:</strong> Pick one component → write Jest + RTL tests before
                  refactoring (TDD-ish) → introduce a perf problem → measure with React Profiler → fix with
                  memoization / state lifting.
                </li>
                <li>
                  <strong className="text-white">Node:</strong> Small API (GET/POST items) → write tests → load test
                  (k6, Artillery, or autocannon) → profile bottlenecks → try connection pooling, caching, or bulk
                  operations.
                </li>
                <li>
                  <strong className="text-white">Interview story:</strong> Practice the line: failing test → implement
                  → measure → optimize → tradeoff.
                </li>
              </ul>
            </div>

            {/* --- REACT --- */}
            <section id="react-setup">
              <h2 className="text-2xl font-bold text-white mb-3">Part 1: React — TDD-ish + Performance</h2>

              <h3 className="text-xl font-semibold text-white mt-6 mb-2">Step 1 — Pick a component</h3>
              <p>
                Choose one existing React component from any app (even a tutorial): a todo list, a product card, a form,
                or a small dashboard widget. You need something that renders a list or does a bit of logic so you can
                add tests and later a performance problem.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-2">Step 2 — Write Jest + RTL tests first (TDD-ish)</h3>
              <p>
                Before changing behavior or refactoring, add tests that describe what the component does today:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Render: it shows the right labels, list items, or empty state.</li>
                <li>User actions: typing in a field, clicking add/remove, toggling completion — and the UI updates.</li>
                <li>Edge cases: empty list, long list, or a single item.</li>
              </ul>
              <p className="mt-3">
                Use React Testing Library: <code>render</code>, <code>screen</code>, <code>userEvent</code>,{' '}
                <code>waitFor</code> / <code>findBy*</code>. Prefer <code>getByRole</code> and <code>getByLabelText</code>{' '}
                over brittle class or ID selectors. Get all tests passing. If the component is hard to test, that&apos;s
                a signal to introduce a seam (e.g. pass a callback or a small data fetcher) so you can test in
                isolation.
              </p>
              <p className="mt-3">
                <strong>Interview angle:</strong> &ldquo;First I wrote a failing test for [e.g. &apos;shows an empty
                state when there are no items&apos;], then I made it pass by [implementing or confirming the
                behavior].&rdquo;
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-2">Step 3 — Introduce a performance problem on purpose</h3>
              <p>Add one of these so you can measure and fix it:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <strong>Expensive computation:</strong> In the component (or a child), add a function that runs on
                  every render — e.g. sort/filter a large list, or a fake &ldquo;heavy&rdquo; calculation (e.g. a loop
                  that does work). Don&apos;t memoize it yet.
                </li>
                <li>
                  <strong>N+1 re-renders:</strong> Put state high in the tree (e.g. in a parent) so that typing in one
                  input or toggling one item causes the whole list (or many siblings) to re-render. You can add a{' '}
                  <code>console.log</code> in a list item to see it fire on every keystroke.
                </li>
              </ul>
              <p className="mt-3">
                Keep your tests green. If they start failing, fix the tests or the component so behavior is unchanged;
                you only changed &ldquo;how much work&rdquo; is done per render.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-2">Step 4 — Measure with React Profiler</h3>
              <p>
                Open React DevTools → Profiler. Record a session while you perform the expensive action (e.g. type in
                the input, scroll the list, toggle items). Look at:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Which components re-render and how often.</li>
                <li>Commit duration and which subtree is slow.</li>
              </ul>
              <p className="mt-3">
                Note the &ldquo;before&rdquo; picture: e.g. &ldquo;List item re-rendered 50 times for one keystroke&rdquo;
                or &ldquo;Expensive sort ran on every render.&rdquo; Take a screenshot or write down numbers if that helps
                you remember.
              </p>
              <p className="mt-3">
                <strong>Interview angle:</strong> &ldquo;I used the React Profiler and saw that [X] was re-rendering
                on every [action]; that&apos;s how I knew where to optimize.&rdquo;
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-2">Step 5 — Fix with memoization or state lifting (down)</h3>
              <p>Apply one or two targeted fixes:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <strong>Expensive computation:</strong> Move it into <code>useMemo</code> (or <code>useCallback</code>{' '}
                  if it&apos;s a handler) with the right dependencies. Or extract it to a child that only re-renders
                  when its props change and wrap that child with <code>React.memo</code>.
                </li>
                <li>
                  <strong>N+1 re-renders:</strong> Lift state down so that only the part of the tree that needs it
                  re-renders (e.g. move the input&apos;s state into a small wrapper component). Optionally wrap list
                  items in <code>React.memo</code> and pass stable callbacks (e.g. with <code>useCallback</code>) so
                  siblings don&apos;t all re-render.
                </li>
              </ul>
              <p className="mt-3">
                Run the Profiler again and confirm fewer re-renders or lower commit time. Keep all tests green.
              </p>
              <p className="mt-3">
                <strong>Interview angle:</strong> &ldquo;I fixed it by [memoizing the computation / lifting state down
                / memoizing list items]. After the change, the Profiler showed [fewer re-renders or faster commits],
                and I accepted the tradeoff of [e.g. slightly more complex code / an extra dependency array to
                maintain].&rdquo;
              </p>
            </section>

            {/* --- NODE --- */}
            <section id="node-setup">
              <h2 className="text-2xl font-bold text-white mb-3">Part 2: Node API — Tests + Load Testing + Optimizations</h2>

              <h3 className="text-xl font-semibold text-white mt-6 mb-2">Step 1 — Small API module</h3>
              <p>
                Create a minimal API (Express, Fastify, or similar) with two routes: <code>GET /items</code> (list
                items) and <code>POST /items</code> (create one). Use an in-memory store or a real DB (e.g. SQLite,
                Postgres) so you have something to optimize later. Keep request/response shapes simple (e.g. JSON with{' '}
                <code>id</code>, <code>name</code>, <code>createdAt</code>).
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-2">Step 2 — Write tests for the API</h3>
              <p>
                Add tests (Jest, Vitest, or Node&apos;s test runner) that call the API (e.g. with <code>supertest</code>):
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><code>GET /items</code> returns 200 and an array (empty or with items).</li>
                <li><code>POST /items</code> with a body creates an item and returns 201 with the created resource.</li>
                <li>After POST, GET includes the new item (if you use a shared store).</li>
              </ul>
              <p className="mt-3">
                Get these passing. This is your safety net for the next steps.
              </p>
              <p className="mt-3">
                <strong>Interview angle:</strong> &ldquo;First I wrote a failing test for [e.g. &apos;POST /items
                returns 201 and the created item&apos;], then I implemented the route and made it pass.&rdquo;
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-2">Step 3 — Load test and find bottlenecks</h3>
              <p>
                Add load testing with one of:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>k6:</strong> script with <code>http.get</code> / <code>http.post</code>, ramp up VUs, measure RPS and latency.</li>
                <li><strong>Artillery:</strong> YAML or scripted scenario, similar metrics.</li>
                <li><strong>autocannon:</strong> <code>npx autocannon -c 10 -d 5 http://localhost:3000/items</code> for a quick check.</li>
              </ul>
              <p className="mt-3">
                Run the load test and note baseline: requests per second, p95/p99 latency, any errors. Then profile the
                Node process (e.g. <code>node --inspect</code> + Chrome DevTools CPU profile, or a quick
                flamegraph tool). Identify the bottleneck: CPU (e.g. JSON serialization, heavy logic), or I/O (DB
                queries, no connection pool, N+1 queries).
              </p>
              <p className="mt-3">
                <strong>Interview angle:</strong> &ldquo;I ran [k6/Artillery/autocannon] and saw [X] RPS and [Y] ms
                p95. Profiling showed [e.g. DB queries / CPU in handler], so I focused there.&rdquo;
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-2">Step 4 — Simple optimizations</h3>
              <p>Apply one or two of these, then re-run load tests and compare:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <strong>Connection pooling:</strong> If you use a DB, ensure the app uses a pool (e.g. one pool per
                  process) instead of opening a new connection per request. Re-measure RPS and latency.
                </li>
                <li>
                  <strong>Caching:</strong> For <code>GET /items</code>, add a short in-memory cache (e.g. TTL 1–5
                  seconds) or cache the result of an expensive query. Measure again; watch for stale data and decide if
                  that&apos;s acceptable.
                </li>
                <li>
                  <strong>Bulk operations:</strong> If the bottleneck is many small DB writes, add a <code>POST
                  /items/bulk</code> that accepts an array and does one batch insert. Compare throughput and latency
                  for creating N items one-by-one vs one bulk call.
                </li>
              </ul>
              <p className="mt-3">
                Keep your API tests green. Document before/after numbers (e.g. &ldquo;Before: 200 RPS, p95 80ms. After
                pooling + cache: 1200 RPS, p95 12ms. Tradeoff: cache can be stale for up to 5s.&rdquo;).
              </p>
              <p className="mt-3">
                <strong>Interview angle:</strong> &ldquo;I added [connection pooling / caching / bulk endpoint], measured
                again with [tool], and saw [improvement]. The tradeoff I accepted was [stale cache / more complex
                API].&rdquo;
              </p>
            </section>

            {/* --- INTERVIEW STORY --- */}
            <section id="interview-story">
              <h2 className="text-2xl font-bold text-white mb-3">Part 3: The Interview Story Template</h2>
              <p>
                Practice saying this out loud so it feels natural:
              </p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-4 space-y-4">
                <p className="text-gray-300">
                  <strong className="text-white">React:</strong> &ldquo;I took a [todo list / product card] component
                  and wrote Jest + RTL tests first for [specific behavior]. Then I introduced a performance issue
                  [expensive computation / N+1 re-renders] and used the React Profiler to see [what was slow]. I
                  fixed it with [memoization / state lifting], re-ran the Profiler, and saw [improvement]. The
                  tradeoff was [e.g. one more useMemo dependency to keep in sync].&rdquo;
                </p>
                <p className="text-gray-300">
                  <strong className="text-white">Node:</strong> &ldquo;I built a small GET/POST items API and wrote
                  tests with [supertest]. I load-tested with [k6/Artillery/autocannon] and profiled the process;
                  the bottleneck was [DB / CPU]. I added [connection pooling / caching / bulk endpoint], re-ran the
                  load test, and got [before → after numbers]. The tradeoff was [e.g. eventual consistency for
                  cached GET].&rdquo;
                </p>
              </div>
              <p className="mt-4">
                If you do this practice once on a real (even tiny) codebase, you&apos;ll have concrete details to
                share in an interview — tests you wrote, numbers you saw, and tradeoffs you chose — instead of
                generic answers.
              </p>
            </section>

            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl p-6 mt-8">
              <h3 className="text-lg font-bold text-white mb-2">Quick checklist</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>☐ React: one component with Jest + RTL tests written first</li>
                <li>☐ React: one perf problem introduced (expensive compute or N+1 renders)</li>
                <li>☐ React: Profiler used to measure before/after; fix with memo or state lifting</li>
                <li>☐ Node: GET /items and POST /items with tests (e.g. supertest)</li>
                <li>☐ Node: load test (k6 / Artillery / autocannon) and profile</li>
                <li>☐ Node: one or two optimizations (pooling, cache, or bulk) with before/after numbers</li>
                <li>☐ Practice the interview story out loud</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </article>
    </main>
  );
}
