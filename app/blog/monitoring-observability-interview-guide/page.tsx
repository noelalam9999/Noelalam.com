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
    id: 'three-ways',
    label: 'The Three Ways: Flow, Feedback, Learning',
    subtitle: 'How DevOps connects delivery to outcomes.',
    focusChapters: 'The DevOps Handbook — The Three Ways.',
    qas: [
      {
        question: 'How would you explain the Three Ways (flow, feedback, learning) to someone new to DevOps?',
        strongSignal:
          'Describes Flow as optimizing the path from dev to production (small batches, automation, reducing handoffs). Feedback as fast signals back from production (monitoring, alerts, blameless postmortems). Learning as culture of experimentation, risk-taking, and continuous improvement. Connects all three to business outcomes, not just "shipping faster."',
        weakSignal:
          'Recites the names without connecting them to practices, or treats them as purely technical (CI/CD only) with no link to learning or business.',
        example:
          'They say: "We improved flow by deploying in smaller batches; that made feedback faster because we could tie incidents to specific changes. Our learning culture meant we ran postmortems without blame and turned outages into better runbooks and tests."'
      },
      {
        question: 'Why does "feedback" in the Three Ways depend on good telemetry and observability?',
        strongSignal:
          'Explains that without metrics, logs, and traces you can\'t close the loop: you don\'t know what broke, for whom, or why. Feedback loops require instrumentation (SLIs, dashboards, alerts) and the ability to ask new questions (observability) when something unexpected happens. Ties this to mean time to detect (MTTD) and mean time to restore (MTTR).',
        weakSignal:
          'Says "we need monitoring" without explaining how it enables the feedback loop or what "good" looks like.',
        example:
          'They describe adding a critical path metric (e.g. checkout success rate) and alerting when it dropped; that feedback loop let them detect a bad deploy in minutes and roll back, instead of finding out from customer support hours later.'
      }
    ]
  },
  {
    id: 'telemetry-pipelines',
    label: 'Telemetry, Feedback Loops & Deployment Pipelines',
    subtitle: 'What to measure and how to act on it.',
    focusChapters: 'The DevOps Handbook — telemetry, feedback loops, deployment pipelines.',
    qas: [
      {
        question: 'What telemetry do you consider essential for a service you own, and why?',
        strongSignal:
          'Mentions the "four golden signals" or equivalent: latency, traffic, errors, saturation. Adds business or user-facing metrics (e.g. conversion, key flows). Explains why each matters: latency and errors for reliability; traffic and saturation for capacity and scaling; business metrics to tie tech to outcomes.',
        weakSignal:
          'Lists only technical metrics (CPU, memory) with no link to user impact or business, or only high-level "uptime" without actionable signals.',
        example:
          'For a checkout service they track request latency and error rate (reliability), RPS (traffic), queue depth or DB connections (saturation), and order-completion rate (business); alerts are tuned to user-visible impact.'
      },
      {
        question: 'How do you design a deployment pipeline so that it reinforces flow and feedback?',
        strongSignal:
          'Describes automated build, test, and deploy stages; gates that block on tests or quality; and post-deploy verification (smoke tests, canary, or gradual rollout). Emphasizes that the pipeline should surface failures quickly and provide clear feedback (who, what, when) so teams can learn. May mention deployment frequency and lead time as metrics.',
        weakSignal:
          'Describes a pipeline that only "runs tests" without connecting it to deployment safety or feedback loops.',
        example:
          'They run unit and integration tests in CI; on merge, they deploy to staging and run a smoke suite; production deploy is automated with a canary and automatic rollback if error rate or latency degrades beyond a threshold—so feedback is automatic and fast.'
      }
    ]
  },
  {
    id: 'business-metrics',
    label: 'Monitoring & Business Metrics',
    subtitle: 'Why observability matters beyond "is it up?"',
    focusChapters: 'The DevOps Handbook — tying monitoring to business outcomes.',
    qas: [
      {
        question: 'How do you connect technical monitoring to business outcomes in practice?',
        strongSignal:
          'Explains choosing metrics that reflect user or business impact (e.g. "search result latency" or "payment success rate") and presenting them in a way product or leadership can use. Mentions dashboards that show both technical and business metrics, and using the same language in incidents and postmortems so non-engineers understand impact.',
        weakSignal:
          'Keeps technical and business metrics in separate silos, or can\'t name a single business metric they track.',
        example:
          'They defined "checkout success rate" as the primary SLO and tied it to revenue impact in postmortems; when the rate dropped, the alert said "Checkout success rate below 99% — estimated $X/min impact" so prioritization was clear.'
      },
      {
        question: 'What does "observability" mean to you, and how is it different from "monitoring"?',
        strongSignal:
          'Distinguishes monitoring as known questions and dashboards/alerts; observability as the ability to ask new questions and explore (e.g. with logs, traces, and high-cardinality metrics) when something unexpected happens. Mentions that good observability reduces time to understand unknown failures.',
        weakSignal:
          'Uses the terms interchangeably or defines observability only as "lots of metrics."',
        example:
          'They say: "Monitoring told us the API was slow; observability—tracing and log correlation—let us see that one specific downstream service was timing out for users in region X, which we hadn\'t thought to dashboard in advance."'
      }
    ]
  },
  {
    id: 'sli-slo-budgets',
    label: 'SLI, SLO & Error Budgets',
    subtitle: 'Defining and living within reliability targets.',
    focusChapters: 'Implementing Service Level Objectives — Alex Hidalgo.',
    qas: [
      {
        question: 'Explain the relationship between SLI, SLO, and SLA. How do you choose an SLO?',
        strongSignal:
          'Defines SLI as the measurable signal (e.g. proportion of requests under 200ms), SLO as the target (e.g. 99.9% of requests under 200ms), and SLA as the contract with consequences (e.g. credits). Explains that SLOs should be informed by user needs and historical data, and that they should be achievable but not trivial.',
        weakSignal:
          'Confuses SLI and SLO, or sets SLOs arbitrarily (e.g. "five nines because it sounds good") without user or data basis.',
        example:
          'They picked "99% of checkout requests complete within 3s" as the SLO after analyzing P95 latency and user drop-off; they chose 99% (not 99.9%) so the team had a small error budget for risky changes.'
      },
      {
        question: 'What is an error budget, and how have you used it to make decisions?',
        strongSignal:
          'Explains that the error budget is the allowed unreliability (e.g. 0.1% of requests can fail or be slow). When the budget is exhausted, focus shifts to reliability over new features; when there is budget, the team can take calculated risks (e.g. deploy more often, try optimizations). Connects to prioritization and blameless culture.',
        weakSignal:
          'Defines it as "how many errors we can have" without connecting it to release or feature decisions.',
        example:
          'They had 20% of their monthly error budget left; the team chose to ship a performance experiment that might briefly increase latency, with a rollback plan. When the budget was nearly exhausted later, they paused feature work and focused on stability and debt.'
      }
    ]
  },
  {
    id: 'alerting-philosophy',
    label: 'Alerting Philosophy',
    subtitle: 'Fewer, better alerts that drive action.',
    focusChapters: 'Implementing SLOs — alerting and on-call.',
    qas: [
      {
        question: 'What makes an alert "good" in your view, and what makes it noisy or useless?',
        strongSignal:
          'Good: actionable (someone can do something), tied to user impact or SLO, and has clear severity and runbook. Bad: alerting on symptoms that don\'t require action, or on every transient blip. Mentions tuning to reduce fatigue (e.g. alert on error budget burn rate, not single failures) and grouping or suppressing known flakiness.',
        weakSignal:
          'Thinks more alerts are better, or can\'t distinguish between "something broke" and "someone should act."',
        example:
          'They replaced 10 "CPU high" / "memory high" alerts with one SLO-based alert: "Error budget burn rate will exhaust budget in 4 hours if trend continues." On-call could then decide whether to page immediately or investigate in the morning.'
      },
      {
        question: 'How do you balance "alert on everything that might be wrong" vs "only alert when users are hurt"?',
        strongSignal:
          'Prefers alerting on user-facing or SLO-impacting signals first; uses lower-severity or dashboard-only signals for internal degradation. Accepts that some failures will be discovered after the fact (e.g. via dashboards or reports) rather than by page. Emphasizes iteration: start with critical alerts, add or relax based on missed incidents and fatigue.',
        weakSignal:
          'Either pages on every anomaly (causing alert fatigue) or only alerts when the service is completely down (missing partial degradation).',
        example:
          'They alert on checkout SLO breach and on a sustained increase in 5xx rate; they do not page on single failed requests or brief latency spikes, but they do track those on a dashboard for trend analysis.'
      }
    ]
  }
];

export default function MonitoringObservabilityInterviewGuide() {
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
              Monitoring & Observability — Interview Guide
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
              An interview guide inspired by &ldquo;The DevOps Handbook&rdquo; (Gene Kim et al.) and &ldquo;Implementing
              Service Level Objectives&rdquo; (Alex Hidalgo). Use it to probe how someone thinks about the Three Ways,
              telemetry and feedback loops, how monitoring ties to business metrics, why observability matters, and
              SLI/SLO/error budgets and alerting philosophy.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
              <h2 className="text-xl font-bold text-white mb-3">How to Use This Guide</h2>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>
                  <span className="text-white font-semibold">For interviewers:</span> Pick 1–2 questions per section.
                  Listen for concrete practices—what they measured, how they set SLOs, how they reduced alert fatigue—not
                  just definitions.
                </li>
                <li>
                  <span className="text-white font-semibold">For candidates:</span> Tie answers to real systems:
                  dashboards you built, SLOs you defined or defended, incidents where observability (or lack of it)
                  made a difference.
                </li>
                <li>
                  <span className="text-white font-semibold">Focus:</span> The Three Ways (flow, feedback, learning);
                  telemetry and deployment pipelines; monitoring vs business metrics; observability; SLI/SLO/error
                  budgets; alerting philosophy. Interview payoff: how monitoring ties to business outcomes and why
                  observability matters.
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
