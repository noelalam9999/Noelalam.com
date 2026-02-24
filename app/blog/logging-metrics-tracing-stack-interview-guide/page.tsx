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
    id: 'logging',
    label: 'Logging: Structured Logs, Correlation IDs, Levels',
    subtitle: 'Making logs queryable and traceable across services.',
    focusDocs: 'Structured logging (JSON), correlation IDs, log levels — common in vendor docs and blogs.',
    qas: [
      {
        question: 'Why use structured (e.g. JSON) logs instead of plain text, and what fields do you always include?',
        strongSignal:
          'Explains that structured logs are machine-parseable and queryable (e.g. in Elasticsearch, CloudWatch Logs Insights, Datadog). Mentions standard fields: timestamp, level, message, and ideally request/correlation ID, service name, and context (user_id, request_id). Avoids logging PII or secrets.',
        weakSignal:
          'Prefers "human-readable" free text only, or logs huge JSON blobs with no consistent schema.',
        example:
          'They log one JSON object per event with level, msg, request_id, service, and duration_ms so they can filter by request_id in the log aggregator and see the full path of a single request across services.'
      },
      {
        question: 'What are correlation IDs (or request IDs), and how do you propagate them across services?',
        strongSignal:
          'Defines them as a unique ID per request (or trace) used to tie together logs (and traces) across services. Explains propagation: generate at edge/API gateway (or first service), pass via HTTP header (e.g. X-Request-ID, traceparent), and include in every log line and outbound call. Downstream services reuse the same ID.',
        weakSignal:
          'Has heard the term but can\'t explain propagation or why it matters for debugging cross-service flows.',
        example:
          'Their API gateway generates a request_id and sets X-Request-ID; each service reads it from the incoming request and adds it to the logging context and to outgoing HTTP calls, so one search by request_id shows the full journey in the log UI.'
      },
      {
        question: 'How do you decide what to log at each level (debug, info, warn, error)?',
        strongSignal:
          'Uses error for failures that need attention; warn for recoverable or degraded conditions; info for normal but notable events (request completed, key business events); debug for detailed troubleshooting, often disabled or sampled in production. Avoids logging at error for expected cases (e.g. 404) unless it\'s an anomaly.',
        weakSignal:
          'Logs everything at info or error, or can\'t explain when to use warn vs error.',
        example:
          'They log 5xx and unexpected exceptions at error, 4xx and retries at warn, and successful request summary (method, path, status, duration) at info; debug is used for request/response bodies only in non-prod or when sampling.'
      }
    ]
  },
  {
    id: 'metrics',
    label: 'Metrics: RED & USE',
    subtitle: 'Request latency, throughput, errors, saturation.',
    focusDocs: 'RED (requests, errors, duration) for services; USE (utilization, saturation, errors) for resources.',
    qas: [
      {
        question: 'Explain the RED method for measuring a request-serving service. What would you instrument?',
        strongSignal:
          'RED = Rate (requests per second), Errors (failed requests, e.g. 5xx or timeouts), Duration (latency, typically percentiles like p50, p95, p99). Describes instrumenting at the edge (e.g. middleware or API gateway) to count and time every request and tag by route, method, status. Prefers histograms or summary metrics for duration.',
        weakSignal:
          'Knows "latency and errors" but doesn\'t mention rate or percentiles, or confuses RED with raw counters.',
        example:
          'They expose http_requests_total (counter by route, method, status), http_request_duration_seconds (histogram by route), and derive RPS and error rate in Prometheus/Grafana; alerts use p95 latency and error rate.'
      },
      {
        question: 'When would you use the USE method instead of (or in addition to) RED?',
        strongSignal:
          'USE applies to resources (CPU, disk, network, queues): Utilization (how busy), Saturation (wait queue or backlog), Errors (failures). Use it for infrastructure and backing services (DB, cache, queue) to understand capacity and bottlenecks. RED is for the request path; USE explains why the request path might be slow (e.g. DB saturated).',
        weakSignal:
          'Uses RED and USE interchangeably or only focuses on one.',
        example:
          'They use RED for their API and USE for the Postgres pool (connection utilization, queue depth, connection errors) and Redis (memory utilization, evictions); when API latency spiked, USE on the DB showed saturation and led them to add read replicas.'
      }
    ]
  },
  {
    id: 'tracing',
    label: 'Tracing: OpenTelemetry, Spans, Service Maps',
    subtitle: 'Following a request across services and understanding dependencies.',
    focusDocs: 'OpenTelemetry (OTel) docs — spans, trace context, exporters; service maps in vendors.',
    qas: [
      {
        question: 'What is a span in distributed tracing, and what do you put in it?',
        strongSignal:
          'Defines a span as a named, timed unit of work (e.g. one service handling part of a request). Describes standard attributes: name, start/end time, span kind (client/server), trace ID and span ID, parent span ID for hierarchy, and attributes (e.g. http.method, http.status_code, db.statement). May mention events (logs) and status (ok/error).',
        weakSignal:
          'Thinks a span is "a log line" or can\'t explain parent/child or trace ID propagation.',
        example:
          'For an HTTP handler they create a server span with name "GET /orders", add attributes for method, path, and status; for the outbound call to the payments service they create a child client span "POST payments/charge" so the trace shows the full timeline.'
      },
      {
        question: 'How does OpenTelemetry help you stay vendor-neutral with tracing (and metrics/logs)?',
        strongSignal:
          'Explains that OTel provides a single API and SDK for instrumentation (spans, metrics, logs) and exports to many backends (Jaeger, Zipkin, Datadog, AWS X-Ray, etc.). You instrument once and swap the exporter. Mentions the W3C tracecontext (traceparent/tracestate) for propagation. Acknowledges that advanced features may still be vendor-specific.',
        weakSignal:
          'Only knows one vendor\'s SDK and assumes tracing is locked to that vendor.',
        example:
          'They instrumented their Node services with @opentelemetry/api and the auto-instrumentation for HTTP; they export to Jaeger in dev and to Datadog in prod by changing the exporter config, without changing application code.'
      },
      {
        question: 'What is a service map, and how do you use it in debugging?',
        strongSignal:
          'Describes a service map as a graph of services (or dependencies) with edges showing calls and sometimes latency or error rates. Used to see topology, find unexpected dependencies, and spot which downstream service is slow or failing. Complements traces (one request) with an aggregate view.',
        weakSignal:
          'Hasn\'t used service maps or confuses them with a single trace view.',
        example:
          'When p95 latency increased, they opened the service map and saw that the orders service was calling a legacy inventory service with high latency; they hadn\'t realized that dependency was on the critical path and added caching there.'
      }
    ]
  },
  {
    id: 'tools',
    label: 'Tools: Pick One and Know It',
    subtitle: 'Prometheus/Grafana, Datadog, New Relic, or AWS (CloudWatch, X-Ray).',
    focusDocs: 'Vendor docs for the stack you use — queries, dashboards, alerts, traces.',
    qas: [
      {
        question: 'Walk me through how you’d build a simple dashboard for a REST API using [Prometheus/Grafana | Datadog | New Relic | CloudWatch].',
        strongSignal:
          'Names the tool and describes concrete steps: what metrics they’d expose or use (e.g. RED), how they’d query (PromQL, Datadog query language, NRQL, or CloudWatch metric math), and what panels they’d add (RPS, error rate, latency percentiles, maybe by route). Mentions retention, variables, or alerting if relevant.',
        weakSignal:
          'Gives a generic "we have a dashboard" without naming queries, metrics, or the tool’s specific concepts.',
        example:
          'With Prometheus/Grafana they’d use rate(http_requests_total[5m]) and histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) by (route); in Datadog they’d use the APM out-of-the-box dashboard and add a custom metric for a business event.'
      },
      {
        question: 'How do you set up alerting in [your chosen stack] so alerts are actionable and not noisy?',
        strongSignal:
          'Describes alerting on SLO-like signals (e.g. error budget burn, p95 above threshold) rather than every blip. Mentions grouping, severity, runbooks, and where possible auto-remediation or routing. Acknowledges tuning over time (suppress known flakiness, add missing alerts after incidents).',
        weakSignal:
          'Alerts on raw thresholds (e.g. "any error") without aggregation or SLO context, or can\'t describe how they reduced noise.',
        example:
          'In Prometheus they alert on (rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])) > 0.01 for 5 minutes, with a runbook link; they avoid alerting on a single 5xx and use a summary so one flaky dependency doesn’t page repeatedly.'
      },
      {
        question: 'If you use AWS, how do CloudWatch Metrics/Logs and X-Ray fit into your observability story?',
        strongSignal:
          'Uses CloudWatch Logs (or Logs Insights) for centralized logs and correlation; CloudWatch Metrics for custom and AWS service metrics (e.g. Lambda duration, RDS CPU); X-Ray for tracing and service map. Explains how they correlate (e.g. trace ID in logs, or Logs Insights with X-Ray trace ID). May mention Cost Explorer or that going deep often requires third-party or more custom setup.',
        weakSignal:
          'Treats CloudWatch as "where logs go" and X-Ray as optional, without a coherent story for metrics + traces + logs.',
        example:
          'They send app logs to CloudWatch Logs with request_id; they enable X-Ray on API Gateway and Lambda and use the same request_id in the trace; in an incident they find the trace in X-Ray, get the request_id, then search logs by request_id to see full context.'
      }
    ]
  }
];

export default function LoggingMetricsTracingStackInterviewGuide() {
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
              Logging, Metrics & Tracing — Stack Interview Guide
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
              A concrete-stack interview guide for the three pillars of observability: logging, metrics, and tracing.
              Use it to probe whether someone can design structured logs, explain RED/USE metrics, use OpenTelemetry
              and spans, and work confidently with at least one toolchain—Prometheus/Grafana, Datadog, New Relic, or
              AWS (CloudWatch, X-Ray).
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
              <h2 className="text-xl font-bold text-white mb-3">How to Use This Guide</h2>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>
                  <span className="text-white font-semibold">For interviewers:</span> Pick questions from each pillar
                  (logs, metrics, tracing) and one from tools. Prefer the tool the candidate claims (e.g. “we use
                  Datadog”) and go deeper there.
                </li>
                <li>
                  <span className="text-white font-semibold">For candidates:</span> Know one stack in depth (how you
                  query, build dashboards, set alerts, and correlate logs/traces). For the rest, know the concepts
                  (RED, USE, spans, correlation IDs) so you can map them to any vendor.
                </li>
                <li>
                  <span className="text-white font-semibold">Focus:</span> Structured logs (JSON, correlation IDs,
                  levels); RED/USE metrics; OpenTelemetry basics, spans, service maps; one of Prometheus/Grafana,
                  Datadog, New Relic, or AWS CloudWatch/X-Ray.
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
