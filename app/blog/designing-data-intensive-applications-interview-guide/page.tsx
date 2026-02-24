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
    id: 'data-models',
    label: 'Data Models & Trade-offs',
    subtitle: 'How you choose and combine data models for agents.',
    focusChapters: 'Grounded in chapter 2: Data Models and Query Languages.',
    qas: [
      {
        question:
          'Walk me through how you would choose between a relational schema, a document model, or a key-value store for an agent system.',
        strongSignal:
          'Talks about access patterns, query flexibility, schema evolution, and consistency needs. Mentions that relational is great for ad-hoc queries and joins; documents work well when data is read as a whole and schema varies; key-value is ideal for simple lookups and caching. Explicitly calls out that you can mix models (polyglot persistence).',
        weakSignal:
          'Picks one technology by popularity ("we just use MongoDB/Postgres for everything") without relating it to read/write patterns or evolution.',
        example:
          'For a customer-support agent: relational DB for core customer/contracts; document store for semi-structured conversation logs; key-value cache (like Redis) for hot session state and rate limits.'
      },
      {
        question: 'How do you think about schema design when events and state evolve over time?',
        strongSignal:
          'Mentions schema-on-write vs schema-on-read, forwards/backwards compatibility, default values, and versioning fields. Understands that changing events is cheaper than rewriting all historical data. Talks about avoiding destructive renames and instead adding new fields.',
        weakSignal:
          'Thinks of schema as static and assumes they can "just migrate everything" whenever they change a field, even for large event histories.',
        example:
          'When adding a new "priority" field to task events, they keep old events valid by treating missing priority as "normal" at read time instead of rewriting billions of records.'
      },
      {
        question:
          'In an event-driven system, where do you store the source of truth: normalized tables, documents, or event logs?',
        strongSignal:
          'Recognizes that the answer depends on domain: sometimes the log is the source of truth (event sourcing), sometimes there is a canonical state store built from events, and often both exist. Mentions the difference between write-optimized logs and read-optimized materialized views.',
        weakSignal:
          'Treats one storage model as universally "the source of truth" without acknowledging trade-offs between logs and derived state.',
        example:
          'In an order-processing system, they keep an immutable event log of order lifecycle events and build a derived "orders" projection in a database that the agents query for current status.'
      }
    ]
  },
  {
    id: 'streams-basics',
    label: 'Streams, Queues & Coordination',
    subtitle: 'How agents coordinate using events and logs.',
    focusChapters: 'Based on chapters 11–12: Stream Processing and Event-Driven Architectures.',
    qas: [
      {
        question:
          'Describe how you would design a queue- or log-based system so multiple agents can coordinate safely on the same work items.',
        strongSignal:
          'Differentiates between message queues (work distribution) and logs (subscription). Talks about consumer groups, at-least-once vs at-most-once semantics, idempotent handlers, and partitioning keys. Mentions how ordering within a key is preserved but not globally.',
        weakSignal:
          'Says "we just put messages on a queue" without discussing delivery guarantees, duplicates, or ordering implications.',
        example:
          'A payment-processing system where a consumer group of "payment agents" reads from a "payments" topic partitioned by account ID, ensuring all events for one account go to the same consumer, while idempotent updates handle retries and duplicates.'
      },
      {
        question:
          'What does idempotency mean in a stream-processing or agent system, and how have you implemented it?',
        strongSignal:
          'Defines idempotency clearly (same operation can be applied multiple times without changing the result beyond the first). Describes concrete patterns: deduplication keys, version numbers, conditional updates, or storing processed offsets/IDs.',
        weakSignal:
          'Equates idempotency with "we try to avoid duplicates" or "we run exactly-once," without explaining mechanisms.',
        example:
          'A shipment agent writes a row keyed by (order_id, shipment_step). If the same event is processed twice, the UPS tracking status is updated with the same value and no duplicate side effects occur.'
      },
      {
        question:
          'How would you design a saga (or workflow) where several agents must coordinate a long-running, multi-step process?',
        strongSignal:
          'Mentions sagas or process managers, local transactions per service, and compensating actions instead of distributed 2PC. Understands that each step publishes an event which triggers the next agent, and failure leads to compensating events.',
        weakSignal:
          'Insists on a global transaction across all services or "we just retry until it works" without any notion of compensations.',
        example:
          'In a travel booking flow, the orchestrator reserves a flight, then a hotel, then a car. If the car reservation fails, it emits compensating events to cancel hotel and flight reservations instead of trying to roll back via a big distributed transaction.'
      }
    ]
  },
  {
    id: 'state-and-consistency',
    label: 'State, Consistency & Recovery',
    subtitle: 'How agents manage state across events and failures.',
    focusChapters: 'Inspired by chapters 11–12: Stream Processing and State Management.',
    qas: [
      {
        question:
          'How do you keep an agent’s local state in sync with an event stream without losing data or double-counting?',
        strongSignal:
          'Explains the idea of consuming from a log and maintaining a local materialized view. Mentions offsets/checkpoints, replay, and handling reprocessing after failure. Talks about deterministic processing and avoiding non-idempotent side effects during replay.',
        weakSignal:
          'Treats local caches as purely in-memory with no notion of checkpoints or replay, assuming they can always "just restart" without data implications.',
        example:
          'A recommendation agent reads user activity events, maintains its own RocksDB/KV store keyed by user, periodically writes its current offset to a durable store, and on restart replays from that offset to catch up.'
      },
      {
        question:
          'Explain eventual consistency in the context of event-driven agents. When is it acceptable, and when is it not?',
        strongSignal:
          'Differentiates between user-facing invariants that must hold synchronously vs things that can converge asynchronously. Mentions designing UIs and workflows that tolerate slightly stale data, and using read-your-writes or fences when needed.',
        weakSignal:
          'Either rejects eventual consistency entirely or treats it as "we don’t care about consistency," without explaining user impact or domain boundaries.',
        example:
          'An order appears as "Processing" immediately after placement (local write), while inventory and analytics lag by a few seconds. But payment capture and receipt generation are designed so the user never sees a paid order rolled back to unpaid.'
      },
      {
        question:
          'How would you debug a bug where two agents both acted on the same event in a conflicting way?',
        strongSignal:
          'Talks about inspecting the log, correlating by event ID or trace ID, and analyzing processing order and retries. Mentions adding idempotency keys, sequence numbers, or using a single owner per partition to prevent concurrent conflicting updates.',
        weakSignal:
          'Focuses purely on agent code without acknowledging the role of multiple consumers, partitioning, or duplicates in the underlying stream.',
        example:
          'They discover that two consumer groups were mistakenly configured for the same "billing" topic; they consolidate to one group and enforce per-account partitioning, plus guard updates with version checks.'
      }
    ]
  },
  {
    id: 'designing-agent-systems',
    label: 'End-to-end Agent System Design',
    subtitle: 'Putting models, streams, and state together.',
    focusChapters: 'Combines chapter 2 with 11–12 into a cohesive design.',
    qas: [
      {
        question:
          'Design an event-driven system where multiple agents collaborate to process user requests end-to-end. Describe the main topics/queues, data models, and state stores.',
        strongSignal:
          'Gives a coherent design: clear topics (commands, events), partitions, and ownership. Explains which services emit which events, where durable state lives, and how agents react. Mentions back-pressure and monitoring at least briefly.',
        weakSignal:
          'Draws a high-level box diagram but cannot say what events look like, how they are keyed, or where state is stored and recovered from.',
        example:
          'For a food-delivery platform: a "orders" command topic, an "order-events" log (created, accepted, prepared, delivered), separate agents for pricing, assignment, and notification, each with its own state store and reacting to the shared event log.'
      },
      {
        question:
          'What are the main failure modes you worry about in such a system, and how do you mitigate them?',
        strongSignal:
          'Mentions lost messages, duplicate processing, out-of-order events within different keys, slow consumers causing lag, and schema incompatibility. Talks about monitoring consumer lag, DLQs, retries with backoff, idempotent handlers, and contract testing for event schemas.',
        weakSignal:
          'Only talks about generic server crashes or says "we rely on the cloud provider" without specific patterns tied to streaming and events.',
        example:
          'They describe adding dashboards for consumer lag per topic, setting up alarms on DLQ rate, and introducing a schema registry to prevent incompatible event changes from being deployed.'
      },
      {
        question:
          'If you had to retrofit an existing CRUD-style service so that agents could react to changes via events, how would you approach it?',
        strongSignal:
          'Proposes change data capture (CDC) from the existing database or emitting domain events from the service on state changes. Emphasizes starting by modeling meaningful domain events rather than low-level row changes.',
        weakSignal:
          'Suggests agents polling the database tables frequently with no mention of change data capture, events, or impact on the primary DB.',
        example:
          'They add CDC (e.g., Debezium) to the orders DB and transform raw row changes into higher-level "OrderPlaced" / "OrderShipped" events on a Kafka topic that agents subscribe to.'
      }
    ]
  }
];

export default function DdiaInterviewGuide() {
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
              Designing Data-Intensive Applications — Interview Guide
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
              An interview guide inspired by Martin Kleppmann&apos;s &ldquo;Designing Data-Intensive
              Applications&rdquo;, with a focus on agents and data flows. Use it to probe whether someone really
              understands how agents coordinate via queues/events and manage state over time.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
              <h2 className="text-xl font-bold text-white mb-3">How to Use This Guide</h2>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>
                  <span className="text-white font-semibold">For interviewers:</span> Pick 1–2 questions from each
                  section. Listen for concrete systems the candidate has built, not just book summaries.
                </li>
                <li>
                  <span className="text-white font-semibold">For candidates:</span> Treat each question as a prompt to
                  tell a story about a real system (even if small), tying it back to DDIA concepts.
                </li>
                <li>
                  <span className="text-white font-semibold">Focus chapters:</span> 2 (data models) and 11–12 (stream
                  processing and event-driven workflows).
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

