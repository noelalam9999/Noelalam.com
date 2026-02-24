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
    id: 'conversation-basics',
    label: 'Conversation Design & Flows',
    subtitle: 'How you structure bot conversations, not just intents.',
    focusChapters: 'Based on chapters 2–4 of "Designing Bots".',
    qas: [
      {
        question: 'When you design a bot conversation from scratch, what do you start with?',
        strongSignal:
          'Starts from user goals and use cases, then maps happy-path flows before edge cases. Mentions defining bot personality, channels, and constraints (e.g., messaging vs voice). Talks about sketching sample dialogues, not just listing intents.',
        weakSignal:
          'Starts from the database schema, APIs, or "we list all intents in Dialogflow" without ever mentioning users, flows, or example conversations.',
        example:
          'For a food-delivery bot, they’d first list top jobs-to-be-done ("reorder last meal", "track delivery"), then write sample chats for each, including greetings and confirmations, before touching tools or NLU.'
      },
      {
        question: 'How do you keep a bot from feeling like a form shoved into chat?',
        strongSignal:
          'Mentions progressive disclosure, collecting information in natural turns, reusing known context, and allowing users to answer multiple slots at once. References quick-reply buttons or structured controls where appropriate.',
        weakSignal:
          'Says "we just ask the fields one-by-one" or treats chat as a linear form with no flexibility or shortcuts.',
        example:
          'In a travel bot, instead of asking "Origin?", then "Destination?", then "Date?" in strict order, the bot accepts "NYC to Berlin next Friday" in one message and parses all three, then only clarifies what’s missing.'
      },
      {
        question: 'How do you design turn-taking so the bot doesn’t over-talk or under-talk?',
        strongSignal:
          'Talks about short, scannable messages; splitting long content; using follow-up questions; avoiding multi-paragraph dumps. Mentions adapting verbosity over time or letting users opt into "more details".',
        weakSignal:
          'Either celebrates "personality" walls of text or says "we just send everything in one message" with no consideration for pacing.',
        example:
          'A banking support bot answers "Your account balance is $1,248. Would you like a breakdown by account?" and only if the user says yes does it send a second message with itemized details.'
      }
    ]
  },
  {
    id: 'errors-fallbacks',
    label: 'Error Handling & Fallbacks',
    subtitle: 'What happens when the bot doesn’t understand.',
    focusChapters: 'Grounded in chapters 2–4 on flows and error handling.',
    qas: [
      {
        question: 'Describe your fallback strategy when the bot doesn’t understand a message.',
        strongSignal:
          'Differentiates between NLU errors, unsupported tasks, and system errors. Talks about graded fallbacks (e.g., rephrase → suggest options → hand off to human or alternate channel). Emphasizes preserving context.',
        weakSignal:
          'Says "we just reply: I didn’t understand" or "we log the error" with no recovery path or user-centric strategy.',
        example:
          'In a customer-support bot: first miss triggers "I might have misread that—are you asking about billing, shipping, or something else?" with quick replies; second miss offers human handoff or a help link.'
      },
      {
        question: 'How do you log and learn from failed conversations?',
        strongSignal:
          'Mentions capturing transcripts with intent/confidence labels, clustering failures, and feeding them back into training data or flow redesign. Distinguishes between tech issues and UX issues.',
        weakSignal:
          'Relies purely on raw intent accuracy metrics or says "we look at NLU accuracy" without ever mentioning reviewing real conversations.',
        example:
          'They periodically review conversations where users typed "agent" or "representative" in frustration, then introduce clearer escalation options earlier in the flow and new intents for frequent unmet needs.'
      },
      {
        question: 'Give an example of a good clarification question versus a bad one.',
        strongSignal:
          'Explains that clarifications should be specific, constrained, and easy to answer. Mentions using buttons, examples, or restating what the bot understood.',
        weakSignal:
          'Clarifications are generic ("Can you clarify?") or simply repeat the same failed question verbatim.',
        example:
          'Instead of repeating "What date are you traveling?", the bot says "Are you traveling today, tomorrow, or pick another date?" with three quick replies and a date picker.'
      }
    ]
  },
  {
    id: 'multi-turn',
    label: 'Multi-turn & Context',
    subtitle: 'Keeping track of conversations over time.',
    focusChapters: 'Inspired by chapters 7–8 on advanced interactions and integrations.',
    qas: [
      {
        question: 'How do you design a multi-turn flow that spans several steps without confusing users?',
        strongSignal:
          'Talks about clear progress cues, recapping choices, and allowing backtracking or corrections. Mentions storing intermediate state and handling interruptions.',
        weakSignal:
          'Describes a long, brittle script that assumes users will answer perfectly in order with no interruptions.',
        example:
          'In a loan-application bot, the bot shows "Step 2 of 4: Income details", recaps key inputs so far, and supports messages like "actually change my employer" mid-flow without resetting the entire process.'
      },
      {
        question: 'How should a well-designed bot handle interruptions or topic changes mid-flow?',
        strongSignal:
          'Describes stacking or pausing the current task, answering the side question, then offering to resume. Mentions policies for when to discard vs persist partial state.',
        weakSignal:
          'Either disallows interruptions ("please finish this first") or silently drops the previous context without warning.',
        example:
          'During a checkout flow, if the user asks "What’s your refund policy?", the bot answers briefly, then says "Want to continue checking out your headphones order?" with a yes/no choice.'
      },
      {
        question: 'What does good use of memory look like in a bot, and where can it go wrong?',
        strongSignal:
          'Mentions remembering stable preferences (language, usual order) with explicit consent and giving users control to reset. Warns against creepy or surprising recalls of sensitive data.',
        weakSignal:
          'Either stores everything indefinitely "just in case" or refuses to remember anything, forcing users to repeat themselves.',
        example:
          'A ride-hailing bot remembers your home and work locations after asking once, but when reusing them it says "Book from your saved Home to Work?" and offers "Change address" in the same message.'
      }
    ]
  },
  {
    id: 'integrations',
    label: 'Integrations & Real-world Constraints',
    subtitle: 'Connecting bots to systems, teams, and channels.',
    focusChapters: 'Aligned with chapters 7–8 on integrations and deployment.',
    qas: [
      {
        question: 'Tell me about a time an integration limitation changed your conversation design.',
        strongSignal:
          'Describes adapting flows to API latency, missing fields, or permission constraints. Talks about optimistic UI, progress messages, or collecting extra information to compensate.',
        weakSignal:
          'Treats backends as perfect and instant; never mentions timeouts, partial failures, or degraded modes.',
        example:
          'In a logistics bot with a slow tracking API, they added "I’m checking your package status, this can take a few seconds…" followed by a loading state and a graceful "I couldn’t reach the courier, want me to notify you when it updates?" path.'
      },
      {
        question: 'How do you coordinate between bots and human agents in a support workflow?',
        strongSignal:
          'Explains clear handoff triggers, transferring context (user info, last messages), and setting expectations about wait times. Mentions routing rules and giving humans tools to see bot history.',
        weakSignal:
          'Says "we have a transfer to human button" but can’t explain what information is passed or how agents pick up the conversation.',
        example:
          'A telecom bot escalates after two low-confidence attempts or when the user types "speak to a human", passes along account ID and intent summary, and the agent sees a compact view of the last 10 bot turns in their console.'
      },
      {
        question: 'What metrics do you track to evaluate a bot’s UX quality (not just NLU accuracy)?',
        strongSignal:
          'Mentions task completion rate, containment vs handoff, time-to-resolution, drop-off points, and user satisfaction (e.g., thumbs up/down). Connects metrics back to redesigning flows.',
        weakSignal:
          'Focuses only on intent accuracy or number of users, with no behavioral or satisfaction measures.',
        example:
          'After noticing a spike in drop-offs at the payment step, they redesigned confirmation copy and added Apple Pay support, then saw completion rate move from 62% to 78%.'
      }
    ]
  }
];

export default function DesigningBotsInterviewGuide() {
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
              Designing Bots — Interview Guide
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
              A practical interview guide inspired by Amir Shevat&apos;s &ldquo;Designing Bots: Creating Conversational
              Experiences&rdquo;. Use this to probe real experience with conversation design, turn-taking, fallbacks,
              clarification questions, multi-turn flows, and integrations.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
              <h2 className="text-xl font-bold text-white mb-3">How to Use This Guide</h2>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>
                  <span className="text-white font-semibold">For interviewers:</span> Pick a few questions from each
                  section and listen for strong vs weak signals in the answers.
                </li>
                <li>
                  <span className="text-white font-semibold">For candidates:</span> Use the examples to ground your own
                  stories from real projects instead of repeating the book.
                </li>
                <li>
                  <span className="text-white font-semibold">Focus chapters:</span> 2–4 (conversation design, flows,
                  error handling) and 7–8 (multi-turn interactions, integrations).
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

