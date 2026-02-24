'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function WeekendLlmAgentProjectGuideline() {
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
              A Weekend LLM Agent Project — Step-by-Step Guideline
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>February 24, 2026</span>
              <span>•</span>
              <span>15 min read</span>
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
              This is a 2–3 evening project guideline for building a small but real LLM-powered agent: a Node/TypeScript
              backend with tools and memory, plus a React chat UI. The goal is not just to ship something that works,
              but to have a clean story to tell in interviews about how you handle prompts, cost, validation, and
              safety.
            </p>

            <section id="goal">
              <h2 className="text-2xl font-bold text-white mb-3">Project Goal</h2>
              <p>
                Build a small app where a user chats with an LLM through a web UI. The backend:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Exposes a simple REST or GraphQL endpoint that calls an LLM (OpenAI, Claude, Azure, etc.).</li>
                <li>Supports tool use — for example, <code>getWeather(city)</code> or <code>createTask(title)</code>.</li>
                <li>Implements basic memory: last N messages plus a short rolling summary.</li>
                <li>Feeds everything into a React chat UI that renders messages and tool results.</li>
              </ul>
              <p className="mt-3">
                When you&apos;re done, you can explain the design choices behind prompts, cost/latency, tool validation,
                and prompt injection safety.
              </p>
            </section>

            <section id="evening-1">
              <h2 className="text-2xl font-bold text-white mb-3">Evening 1 — Backend Skeleton, LLM Call, Tools</h2>
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">1. Stack and scaffolding</h3>
              <p>Pick the quickest stack for you; a solid default is:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Node + TypeScript + Express (or Fastify).</li>
                <li>An official SDK for your model provider (OpenAI, Anthropic, Azure OpenAI).</li>
                <li><code>dotenv</code> for API keys; <code>ts-node-dev</code> for local dev.</li>
              </ul>
              <p>
                Create a single endpoint like <code>POST /api/chat</code> that accepts{' '}
                <code>{`{ sessionId, userMessage }`}</code> and returns the assistant&apos;s reply and any tool activity.
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">2. Message and tool model</h3>
              <p>
                Define a small internal message model you can share between backend and frontend, for example:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Roles:</strong> <code>system</code>, <code>user</code>, <code>assistant</code>,{' '}
                  <code>tool</code>.
                </li>
                <li>
                  <strong>ChatMessage:</strong> <code>{`{ id, role, content, name? }`}</code>.
                </li>
                <li>
                  <strong>Tools:</strong> start small — e.g. <code>getWeather(city)</code> and{' '}
                  <code>createTask(title)</code>, with implementations that just return deterministic JSON.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">3. First LLM call with tool support</h3>
              <p>
                Construct your prompt as an array of messages. At minimum include a system message and the latest user
                input:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>System message:</strong> defines persona, allowed tools, tone, and safety boundaries.
                </li>
                <li>
                  <strong>User message:</strong> the incoming <code>userMessage</code>.
                </li>
                <li>
                  <strong>Optional history:</strong> we&apos;ll add memory and summary later.
                </li>
              </ul>
              <p>
                Call the model with this message array and a tool definition list. In your first version you can handle
                a single tool call: if the model returns a tool invocation, execute your mock tool, append a{' '}
                <code>tool</code> message with the result, and call the model again to get a natural language answer.
              </p>
            </section>

            <section id="evening-2">
              <h2 className="text-2xl font-bold text-white mb-3">Evening 2 — Memory, Validation, and React Chat UI</h2>
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">1. Basic memory + rolling summary</h3>
              <p>Introduce a per-session memory store in your backend:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Keep the last N messages (e.g. 10–20 turns) per <code>sessionId</code>.</li>
                <li>
                  When the conversation gets long, ask the model to produce a short summary and store it as a separate
                  field.
                </li>
                <li>
                  On each new request, build context from: system prompt → summary (if present) → recent messages → new
                  user message.
                </li>
              </ul>
              <p>
                This gives you something concrete to talk about when asked how you manage limited context windows and
                long-running conversations.
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">2. Tool input/output validation</h3>
              <p>
                Before a tool touches any real data, validate its inputs. A simple, interview-friendly choice is{' '}
                <code>zod</code>:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Define one schema per tool: <code>GetWeatherSchema</code>, <code>CreateTaskSchema</code>, etc.</li>
                <li>Parse the model&apos;s arguments with <code>safeParse</code>; reject bad input gracefully.</li>
                <li>
                  Wrap tool code in <code>try/catch</code>, and send any error back to the model as a{' '}
                  <code>tool</code> message so it can explain the failure to the user.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">3. React chat UI</h3>
              <p>
                Build a minimal but pleasant chat UI; you can use Vite or Next.js, whichever you ship fastest with:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>A single <code>Chat</code> page or component with a scrollable message list and an input box.</li>
                <li>Local <code>sessionId</code> stored in <code>localStorage</code> to tie the browser to a session.</li>
                <li>
                  Rendering for <code>user</code>, <code>assistant</code>, and <code>tool</code> messages — tool
                  responses can show as small info cards (e.g. &quot;Weather in Paris: 20°C and clear&quot;).
                </li>
                <li>
                  A simple <code>fetch</code> call to <code>/api/chat</code> when the user submits a message, wiring the
                  response back into your message list.
                </li>
              </ul>
            </section>

            <section id="evening-3">
              <h2 className="text-2xl font-bold text-white mb-3">Evening 3 — Cost, Latency, and Safety</h2>
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">1. Cost and latency controls</h3>
              <p>Put a simple cost and latency story in place:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Set <strong>max tokens</strong> and tune <strong>temperature</strong> in your model calls; log
                  response times and token counts.
                </li>
                <li>
                  Consider streaming responses to improve perceived latency, even if you don&apos;t have time for
                  perfect UI polish.
                </li>
                <li>
                  If you want a stretch goal, add a simple cache for purely informational questions (no tools, no
                  side-effects) keyed by the user query.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">2. Prompt injection and tool safety</h3>
              <p>
                You don&apos;t need a full-blown security system for a weekend project, but you <em>do</em> want to
                demonstrate that you understand the risks:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Keep system instructions on the server; never let the user edit or override them from the client.
                </li>
                <li>
                  Treat all user input as untrusted. Don&apos;t splice it into the system message; keep it in{' '}
                  <code>user</code> messages only.
                </li>
                <li>
                  Whitelist which tools the agent can call and validate every tool invocation. No arbitrary code
                  execution, no dynamic function names.
                </li>
                <li>
                  Use the system prompt to remind the model that user messages may try to change its instructions and it
                  should obey the system message first.
                </li>
              </ul>
            </section>

            <section id="interview-story">
              <h2 className="text-2xl font-bold text-white mb-3">Turning This Into an Interview Story</h2>
              <p>
                Once the project works, spend 20–30 minutes preparing how you&apos;d explain it in an interview. Focus
                on four themes:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  <strong>Prompt structure:</strong> how you combine system instructions, rolling summary, recent
                  history, tools, and user input into each model call.
                </li>
                <li>
                  <strong>Cost and latency:</strong> your choices around model, max tokens, context trimming, and
                  streaming.
                </li>
                <li>
                  <strong>Tool design and validation:</strong> how you defined small, typed tools and validated inputs
                  and outputs before doing anything risky.
                </li>
                <li>
                  <strong>Safety and injection:</strong> how you separated system vs user messages, whitelisted tools,
                  and thought about untrusted input.
                </li>
              </ol>
              <p className="mt-3">
                The point of this project isn&apos;t that it&apos;s big; it&apos;s that every piece is something you can
                point to and explain. After a couple of evenings, you have not just code, but a crisp narrative about
                how you build and reason about LLM-powered agents.
              </p>
            </section>
          </div>
        </motion.div>
      </article>
    </main>
  );
}

