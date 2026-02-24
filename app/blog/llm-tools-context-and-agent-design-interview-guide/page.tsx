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
    id: 'chat-vs-tools',
    label: 'Chat Completions vs Tool Calling',
    subtitle: 'When to let the model reply vs call tools/functions.',
    focusDocs:
      'OpenAI Chat Completions / Responses API, Anthropic Tools, Azure OpenAI chat + functions documentation.',
    qas: [
      {
        question:
          'How do you decide whether a user request should be answered directly by the model or routed through a tool/function?',
        strongSignal:
          'Explains that tools are for actions (side‑effects, fresh data, secure lookups) and raw chat is for reasoning and language. Mentions using model instructions to prefer tools when a request matches tool capabilities, and letting the model answer directly for purely informational or conversational queries.',
        weakSignal:
          'Treats tool calling as an implementation detail and says "the model decides" without describing any design of when/why tools exist or how prompts nudge tool use.',
        example:
          'In a calendar agent, "Explain time blocking" is answered in chat only, but "Book a 30‑min meeting with Sara next week" triggers a `create_event` tool with structured arguments; both behaviors are made explicit in the system prompt and tool descriptions.'
      },
      {
        question:
          'Compare how OpenAI, Anthropic/Claude, and Azure OpenAI expose tools or function calling. What differences matter in practice?',
        strongSignal:
          'Knows that all three expose JSON‑schema‑like tool definitions but differ in naming (tools/functions), calling conventions, and deployment (Azure resources, Anthropic tool_choice, etc.). Focuses on practical differences: streaming vs non‑streaming, max tools per turn, error handling, and how messages are structured in each.',
        weakSignal:
          'Answers at a vague level ("they all support function calling") with no mention of schemas, tool choice options, or how those shape system design.',
        example:
          'They note that in OpenAI you define tools under `tools` with `type: function`, while Anthropic uses a `tools` array with `input_schema`, and Azure OpenAI largely mirrors OpenAI’s schema but is configured via Azure resources and API versions.'
      },
      {
        question:
          'What failure modes have you seen in tool‑calling systems and how did you mitigate them?',
        strongSignal:
          'Mentions argument mismatches, hallucinated tool names, infinite tool loops, partial failures from downstream APIs. Describes guardrails such as strict JSON schemas, server‑side validation, limiting recursive calls, and surfacing tool errors back to the model for graceful user messaging.',
        weakSignal:
          'Says "we rely on the model to send good arguments" and does not validate or log tool calls, or has no story for retries and fallbacks.',
        example:
          'They wrap all tool handlers with validation and logging; if the model sends malformed JSON, the server responds with a synthetic tool error message and asks the model to fix its arguments instead of silently failing.'
      }
    ]
  },
  {
    id: 'message-roles',
    label: 'System vs User vs Tool Messages',
    subtitle: 'Shaping behavior with message types across providers.',
    focusDocs:
      'OpenAI message roles (system/user/assistant/tool), Anthropic system/instructions, Azure OpenAI chat formats.',
    qas: [
      {
        question:
          'How do you use system messages differently from user messages when designing an LLM agent?',
        strongSignal:
          'Treats system messages as stable, high‑level policy and persona (what the agent is allowed to do, priorities, tone) and user messages as task‑specific requests. Mentions keeping system prompts concise but explicit about safety, tool use, and formatting, and avoiding leaking policy into user content.',
        weakSignal:
          'Puts all instructions in user messages or says "system is just where we put a big prompt," with no concept of separation of concerns or stability across turns.',
        example:
          'System: "You are a hiring assistant that drafts structured interview questions. Use tools for calendar or HR data; never modify data without explicit confirmation." User: "Create a loop of questions for a staff engineer candidate focused on streaming systems."'
      },
      {
        question:
          'What are tool (or function) messages in the chat history, and why do they matter?',
        strongSignal:
          'Explains that tool messages carry the results of tool calls back into the model’s context, usually with a special role (`tool` / `function`) and name. Understands that including them allows the model to ground its next response in real data and maintain a coherent chain of thought.',
        weakSignal:
          'Thinks tools execute "out of band" and does not realize the model sees tool outputs as part of the conversation history.',
        example:
          'After a `get_user_profile` tool call, they append a tool message like `{ role: "tool", name: "get_user_profile", content: "{...}" }` so the model can say "I see you prefer morning meetings; shall I schedule this at 9am?"'
      },
      {
        question:
          'How do you adapt your prompting strategy across OpenAI, Anthropic, and Azure OpenAI given differences in message roles?',
        strongSignal:
          'Mentions that OpenAI supports multiple system messages and explicit tool messages, Anthropic emphasizes a single system/instruction block and conversational turns, and Azure mostly mirrors OpenAI but adds resource/DEPLOYMENT nuances. Talks about normalizing an internal representation and then mapping to provider‑specific formats.',
        weakSignal:
          'Assumes all providers have identical message semantics and doesn’t consider how instructions might be merged or reordered by the backend.',
        example:
          'They implement an internal `ConversationTurn` model and adapters: for OpenAI they emit separate system + user + tool roles; for Anthropic they consolidate policies into the `system` field and send tool outputs as messages in the conversation array as required.'
      }
    ]
  },
  {
    id: 'tool-design',
    label: 'Designing Good Tools / Functions',
    subtitle: 'Schemas, idempotence, and UX of APIs exposed to models.',
    focusDocs:
      'OpenAI function/tool schemas, Anthropic tools, Azure OpenAI functions; provider best‑practice guides.',
    qas: [
      {
        question:
          'What makes a good tool/function definition for an LLM? Describe your approach to input/output schemas.',
        strongSignal:
          'Advocates for small, focused tools with clear names and descriptions. Uses JSON Schema for types, enums, required fields, and constraints. Describes outputs that are structured enough for follow‑up calls, not just free text, and avoids overloading one tool with many optional fields.',
        weakSignal:
          'Creates one giant "doEverything" function with many optional parameters, vague descriptions, and untyped strings everywhere.',
        example:
          'Instead of a single `manage_calendar` tool, they define `create_event`, `update_event_time`, and `cancel_event`, each with concise, well‑typed arguments; the model picks one based on user intent.'
      },
      {
        question:
          'How do you design tools so they are safe and idempotent when called repeatedly or with imperfect arguments?',
        strongSignal:
          'Explains idempotency keys, upserts, and "check‑before‑act" patterns. Uses read‑only tools where possible, separates side‑effecting tools from queries, and ensures retries do not create duplicate payments/emails/etc.',
        weakSignal:
          'Assumes tools will only ever be called once per intent and has no protection against retries or duplicate events.',
        example:
          'A `send_invoice` tool accepts an `invoice_id` and checks if it has already been sent before sending; if called twice with the same ID, it returns the existing status instead of emailing twice.'
      },
      {
        question:
          'How many tools would you expose to a given agent, and how do you prevent overwhelming the model?',
        strongSignal:
          'Talks about grouping tools by capability, avoiding dozens of near‑duplicate tools, and sometimes introducing a routing agent that picks a sub‑agent/tool set. Mentions that long tool lists can confuse models and increase latency.',
        weakSignal:
          'Says "we just expose all our microservices as tools" without any consideration of discoverability or cognitive load for the model.',
        example:
          'They use a top‑level "support router" agent with 4–5 routing tools (billing, orders, technical) rather than 50 low‑level tools; the specialized agents behind each route get a much smaller tool surface.'
      }
    ]
  },
  {
    id: 'context-strategies',
    label: 'Context Windows, Chunking & Retrieval',
    subtitle: 'Feeding the model the right information at the right time.',
    focusDocs:
      'OpenAI context window docs, RAG guides, and similar guidance from Anthropic and Azure OpenAI.',
    qas: [
      {
        question:
          'When context is larger than the model’s window, how do you decide what to include for a given request?',
        strongSignal:
          'Mentions retrieval‑augmented generation (RAG): encode documents, retrieve top‑k by semantic similarity and filters, then optionally re‑rank. Talks about query rewriting, focusing on the user’s task, and avoiding dumping entire knowledge bases into context.',
        weakSignal:
          'Says "we just truncate older messages" or "we give the model everything we have" without a retrieval or selection strategy.',
        example:
          'In an API‑docs assistant, they embed each endpoint section and retrieve only the 3–5 most relevant chunks based on the user question and API version, then supplement with a short conversation summary.'
      },
      {
        question:
          'Describe your chunking strategy for long documents. What trade‑offs have you encountered?',
        strongSignal:
          'Discusses overlapping windows, by‑section vs fixed‑token chunking, preserving headings, and avoiding splitting code or tables in the middle. Understands that too small chunks lose context; too large reduce retrieval precision and waste tokens.',
        weakSignal:
          'Has no explicit chunking strategy or always uses arbitrary fixed sizes (e.g., 512 tokens) without considering document structure.',
        example:
          'They chunk technical docs by headings with a small token overlap, then store both chunk content and metadata like `service: "billing"`, which later helps filter retrieval to the correct subsystem.'
      },
      {
        question:
          'How do you handle conversation history and long‑running agent workflows within a fixed context window?',
        strongSignal:
          'Mentions summarization of older turns, state extraction into a compact "memory" object, and selective replay of only the last few exchanges plus relevant facts. May reference external state stores instead of stuffing everything back into the prompt.',
        weakSignal:
          'Relies solely on concatenating the raw transcript until it hits the token limit, then abruptly drops older messages with no summarization.',
        example:
          'A coding assistant periodically summarizes earlier discussion into a brief "session state" (current file, libraries, goals) stored server‑side and re‑injects that summary instead of the full transcript as conversations grow.'
      }
    ]
  }
];

export default function LlmToolsContextInterviewGuide() {
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
              LLM Tools, Context & Agent Design — Interview Guide
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
              An interview guide for building with OpenAI, Anthropic/Claude, and Azure OpenAI. Use it to probe whether
              someone understands chat vs tool calls, message roles, tool design, and context‑window strategies in
              real‑world agent systems.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
              <h2 className="text-xl font-bold text-white mb-3">How to Use This Guide</h2>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>
                  <span className="text-white font-semibold">For interviewers:</span> Select a few questions from each
                  section and listen for concrete implementations (APIs, schemas, prompts), not just buzzwords.
                </li>
                <li>
                  <span className="text-white font-semibold">For candidates:</span> Anchor your answers in specific
                  systems you&apos;ve built or deeply studied, tying them back to provider docs and best practices.
                </li>
                <li>
                  <span className="text-white font-semibold">Focus areas:</span> chat vs tool calling, system/user/tool
                  messages, tool schemas and idempotence, and context‑window / RAG patterns.
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

