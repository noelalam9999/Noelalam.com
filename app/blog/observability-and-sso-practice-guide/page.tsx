'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function ObservabilityAndSsoPracticeGuide() {
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
              Observability + SSO Practice — Step-by-Step Guide
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
              A hands-on practice to connect observability and security to real code. You&apos;ll instrument a simple
              Node API with structured logging, metrics, and Kubernetes-friendly health checks, then wire a tiny React
              app to an OAuth/OIDC IdP (Auth0/Okta/Entra) and walk the SSO flow end to end.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-3">What You&apos;ll Do</h2>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>
                  <strong className="text-white">Node API:</strong> Add structured logging with request IDs, export
                  basic metrics (latency histogram, request and error counts), hit them with a small load test, and add
                  health/readiness checks compatible with Kubernetes.
                </li>
                <li>
                  <strong className="text-white">React + SSO:</strong> Implement OAuth/OIDC login using a provider
                  sample (Auth0/Okta/Entra), then walk the flow: browser → IdP → callback → token storage → API call
                  with bearer token.
                </li>
                <li>
                  <strong className="text-white">Interview story:</strong> Be ready to explain both observability and
                  SSO flows in concrete, step-by-step language.
                </li>
              </ul>
            </div>

            {/* --- PART 1: NODE API --- */}
            <section id="node-observability">
              <h2 className="text-2xl font-bold text-white mb-3">Part 1: Node API — Logging, Metrics, Health Checks</h2>

              <h3 className="text-xl font-semibold text-white mt-6 mb-2">Step 1 — Start from a tiny API</h3>
              <p>
                Use Express or Fastify with one or two endpoints, e.g. <code>GET /items</code> and <code>POST
                /items</code> backed by an in-memory array. Keep it simple; the goal is instrumentation, not domain
                complexity.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-2">Step 2 — Add structured logging with request IDs</h3>
              <p>
                Pick a logger (e.g. <code>pino</code>, <code>winston</code>, or <code>console.log(JSON.stringify(...))</code>{' '}
                for practice). Add middleware that:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Generates a <code>requestId</code> (UUID) if one isn&apos;t present in the headers.</li>
                <li>
                  Attaches the <code>requestId</code> to the request object (or a per-request logger context) so every
                  log line for that request includes it.
                </li>
                <li>Logs a structured &quot;request started&quot; and &quot;request completed&quot; event.</li>
              </ul>
              <p className="mt-3">
                Example log fields: <code>{`{ level, msg, service, requestId, method, path, status, durationMs }`}</code>.
                Make sure all logs are single-line JSON.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-2">Step 3 — Export basic metrics</h3>
              <p>
                Use a metrics library (e.g. <code>prom-client</code> for Prometheus-style metrics). Instrument:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <strong>Request count:</strong> counter labeled by <code>method</code> and <code>route</code> (and
                  maybe <code>status</code>).
                </li>
                <li>
                  <strong>Error count:</strong> separate counter for 5xx responses or failed handlers.
                </li>
                <li>
                  <strong>Latency histogram:</strong> bucketed duration for requests (e.g. <code>http_request_duration_seconds</code>).
                </li>
              </ul>
              <p className="mt-3">
                Expose a <code>GET /metrics</code> endpoint that returns metrics in your chosen format. Hit it locally
                and confirm counters/histograms update when you call your API.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-2">Step 4 — Health and readiness checks</h3>
              <p>
                Add two new endpoints for Kubernetes-style probes:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <code>GET /healthz</code> (liveness): returns 200 if the process is running; minimal logic (maybe a
                  simple in-process check).
                </li>
                <li>
                  <code>GET /readyz</code> (readiness): checks dependencies (e.g. DB/queue) and returns 200 only if the
                  app is ready to serve traffic; otherwise 503.
                </li>
              </ul>
              <p className="mt-3">
                If you have a DB, attempt a quick, cheap query or use a connection pool status; otherwise simulate a
                dependency check. In your Kubernetes manifests, you&apos;d wire liveness and readiness probes to these
                paths.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-2">Step 5 — Small load test</h3>
              <p>
                Use <code>autocannon</code>, <code>k6</code>, or <code>Artillery</code> to send some load to your API,
                e.g.:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <code>npx autocannon -c 10 -d 10 http://localhost:3000/items</code>
                </li>
              </ul>
              <p className="mt-3">
                While the test runs, watch your logs (grouped by <code>requestId</code>) and <code>/metrics</code>{' '}
                output. Confirm that request counts, error counts, and latency buckets change as expected. This gives
                you a concrete story for how you&apos;d observe the service under load.
              </p>
            </section>

            {/* --- PART 2: REACT + SSO --- */}
            <section id="react-sso">
              <h2 className="text-2xl font-bold text-white mb-3">Part 2: React + OAuth/OIDC SSO</h2>

              <h3 className="text-xl font-semibold text-white mt-6 mb-2">Step 1 — Start from a provider sample</h3>
              <p>
                Pick one IdP and grab their minimal React sample app (Auth0, Okta, Entra/Azure AD, or Auth0/Next.js
                sample). Configure:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>A test tenant / application in the IdP.</li>
                <li>Client ID, domain/issuer, and redirect URI (e.g. <code>http://localhost:3000/callback</code>).</li>
                <li>Allowed callback/logout URLs set correctly in the IdP console.</li>
              </ul>
              <p className="mt-3">
                Make sure you can run <code>npm start</code> and click a &quot;Login&quot; button that redirects you to
                the IdP and back.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-2">Step 2 — Walk the browser → IdP → callback flow</h3>
              <p>
                Open browser devtools (Network tab) and follow one login attempt. Note the key steps:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  React sends you to the IdP&apos;s <code>/authorize</code> endpoint with <code>client_id</code>,{' '}
                  <code>redirect_uri</code>, <code>scope</code>, <code>response_type=code</code>, <code>state</code>, and
                  PKCE <code>code_challenge</code>.
                </li>
                <li>
                  IdP authenticates the user (login form, MFA, etc.), then redirects back to your{' '}
                  <code>redirect_uri</code> with an auth <code>code</code> (and <code>state</code>).
                </li>
                <li>
                  The React app or its helper library exchanges the <code>code</code> + <code>code_verifier</code> for
                  tokens via the IdP&apos;s <code>/token</code> endpoint.
                </li>
              </ul>
              <p className="mt-3">
                Write down that sequence in your own words; you&apos;ll reuse it in interviews.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-2">Step 3 — Token storage and session</h3>
              <p>
                Look at how the sample stores tokens and session state. Common options:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  In-memory React state plus a refresh mechanism (more secure, lost on reload without a BFF).
                </li>
                <li>
                  Local/session storage (easy but XSS risk; fine for a demo but know the tradeoffs).
                </li>
                <li>
                  HttpOnly cookies via a backend/BFF (recommended for real apps; React never sees the access token).
                </li>
              </ul>
              <p className="mt-3">
                For this practice, keep the sample&apos;s default, but be ready to explain how you&apos;d use a BFF +
                same-site cookies in production.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-2">Step 4 — Call your Node API with a bearer token</h3>
              <p>
                Wire the React app to your Node API from Part 1. After login:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Get an access token from the SDK (or via your BFF).</li>
                <li>
                  Add an <code>Authorization: Bearer &lt;access_token&gt;</code> header when calling{' '}
                  <code>GET /items</code> or <code>POST /items</code>.
                </li>
                <li>
                  On the Node side, add a small middleware that validates the token (or at least decodes it in a demo)
                  and logs <code>sub</code>/<code>user</code> along with the <code>requestId</code>.
                </li>
              </ul>
              <p className="mt-3">
                Watch your structured logs as you make authenticated requests; you should see <code>requestId</code> and
                user identity tied together, plus metrics incrementing under load.
              </p>
            </section>

            {/* --- INTERVIEW STORY --- */}
            <section id="interview-story">
              <h2 className="text-2xl font-bold text-white mb-3">Part 3: Turning It into an Interview Story</h2>
              <p>
                Practice explaining both halves in 1–2 minutes each. For example:
              </p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-4 space-y-4">
                <p className="text-gray-300">
                  <strong className="text-white">Node/observability:</strong> &ldquo;I took a simple Node/Express API
                  and added structured logging with a <code>requestId</code> per request, plus Prometheus-style metrics
                  for request count, errors, and latency. I exposed <code>/metrics</code>, <code>/healthz</code>, and{' '}
                  <code>/readyz</code> so it works well in Kubernetes. I used [autocannon/k6] to generate load and
                  watched logs and metrics to see how the service behaved under stress.&rdquo;
                </p>
                <p className="text-gray-300">
                  <strong className="text-white">React/SSO:</strong> &ldquo;On the frontend I used an Auth0/Okta sample
                  to implement OAuth 2.0 Authorization Code + PKCE in a React app. The browser redirects to the IdP,
                  the user logs in, the app receives a code on the callback and exchanges it for tokens, then calls the
                  Node API with an <code>Authorization: Bearer</code> token. The API validates or trusts the IdP and
                  ties the user identity to logs and metrics.&rdquo;
                </p>
              </div>
              <p className="mt-4">
                Doing this once end to end gives you concrete details—headers, endpoints, metrics, logs—that you can
                bring into any interview when talking about observability and SSO.
              </p>
            </section>
          </div>
        </motion.div>
      </article>
    </main>
  );
}

