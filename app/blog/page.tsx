'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

const blogPosts = [
  {
    slug: 'observability-and-sso-practice-guide',
    title: 'Observability + SSO Practice — Step-by-Step Guide',
    excerpt:
      'A hands-on practice: add structured logging, metrics, and K8s-ready health checks to a Node API, then implement OAuth/OIDC login in a tiny React app (Auth0/Okta) and walk the full SSO flow.',
    date: 'February 24, 2026',
    readTime: '18 min read',
    category: 'Engineering'
  },
  {
    slug: 'oauth2-oidc-security-interview-guide',
    title: 'OAuth 2.0, OIDC & SSO — Security Interview Guide',
    excerpt:
      'An interview guide based on “OAuth 2 in Action” and OIDC docs — OAuth roles and flows, ID vs access tokens, threats like token leakage/redirect URI attacks/PKCE, and how SSO works with Okta/Entra and a React/Node app.',
    date: 'February 24, 2026',
    readTime: '20 min read',
    category: 'Engineering'
  },
  {
    slug: 'logging-metrics-tracing-stack-interview-guide',
    title: 'Logging, Metrics & Tracing — Stack Interview Guide',
    excerpt:
      'A concrete-stack interview guide: structured logs (JSON, correlation IDs, levels), RED/USE metrics, OpenTelemetry spans and service maps, and one toolchain (Prometheus/Grafana, Datadog, New Relic, or AWS).',
    date: 'February 24, 2026',
    readTime: '18 min read',
    category: 'Engineering'
  },
  {
    slug: 'monitoring-observability-interview-guide',
    title: 'Monitoring & Observability — Interview Guide',
    excerpt:
      'An interview guide from The DevOps Handbook and Implementing SLOs — The Three Ways, telemetry and feedback loops, how monitoring ties to business metrics, and SLI/SLO/error budgets.',
    date: 'February 24, 2026',
    readTime: '18 min read',
    category: 'Engineering'
  },
  {
    slug: 'tdd-and-perf-practice-guide',
    title: 'TDD + Performance Practice — Step-by-Step Guide',
    excerpt:
      'A hands-on practice: Jest/RTL tests before refactoring, introduce a perf problem, measure with React Profiler, fix with memo/state lifting; then Node API tests, load testing (k6/Artillery/autocannon), and simple optimizations. With an interview story template.',
    date: 'February 24, 2026',
    readTime: '18 min read',
    category: 'Engineering'
  },
  {
    slug: 'web-and-react-performance-interview-guide',
    title: 'Web & React Performance — Interview Guide',
    excerpt:
      'An interview guide for web and React performance — TCP/HTTP basics, caching, React.memo/useMemo/useCallback, Suspense, code splitting, and avoiding unnecessary re-renders.',
    date: 'February 24, 2026',
    readTime: '20 min read',
    category: 'Engineering'
  },
  {
    slug: 'react-node-testing-interview-guide',
    title: 'Node & React Testing — Interview Guide',
    excerpt:
      'An interview guide for Jest, React Testing Library, and Cypress — testing hooks, async flows, API calls, state, mocking HTTP/timers, and writing reliable E2E tests.',
    date: 'February 24, 2026',
    readTime: '20 min read',
    category: 'Engineering'
  },
  {
    slug: 'clean-code-robert-martin-interview-guide',
    title: 'Clean Code — Interview Guide',
    excerpt:
      'An interview guide based on Robert C. Martin\'s "Clean Code" — functions, comments, formatting, objects vs data structures, and how unit tests drive design and refactoring.',
    date: 'February 24, 2026',
    readTime: '18 min read',
    category: 'Engineering'
  },
  {
    slug: 'tdd-kent-beck-interview-guide',
    title: 'Test-Driven Development — Interview Guide',
    excerpt:
      'An interview guide based on Kent Beck’s "Test-Driven Development: By Example" — concrete language for red–green–refactor, test seams, and incremental design.',
    date: 'February 24, 2026',
    readTime: '18 min read',
    category: 'Engineering'
  },
  {
    slug: 'weekend-llm-agent-project-guideline',
    title: 'A Weekend LLM Agent Project — Step-by-Step Guideline',
    excerpt:
      'A 2–3 evening project plan to build a Node/TypeScript + React LLM chat app with tools, memory, and a clean interview story around prompts, cost, validation, and injection safety.',
    date: 'February 24, 2026',
    readTime: '15 min read',
    category: 'Engineering'
  },
  {
    slug: 'llm-tools-context-and-agent-design-interview-guide',
    title: 'LLM Tools, Context & Agent Design — Interview Guide',
    excerpt:
      'An interview guide for OpenAI, Anthropic/Claude, and Azure OpenAI systems — chat vs tool calls, message roles, tool schemas, and context-window strategies.',
    date: 'February 24, 2026',
    readTime: '20 min read',
    category: 'Engineering'
  },
  {
    slug: 'designing-data-intensive-applications-interview-guide',
    title: 'Designing Data-Intensive Applications — Interview Guide',
    excerpt:
      'An interview guide based on Martin Kleppmann’s "Designing Data-Intensive Applications" — practical Q&A on data models, streams, and how agents coordinate via events and state.',
    date: 'February 24, 2026',
    readTime: '20 min read',
    category: 'Engineering'
  },
  {
    slug: 'designing-bots-amir-shevat-interview-guide',
    title: 'Designing Bots — Interview Guide',
    excerpt:
      'A practical interview guide based on Amir Shevat’s "Designing Bots" — real-world Q&A on turn-taking, fallbacks, clarification, and multi-turn conversational UX.',
    date: 'February 24, 2026',
    readTime: '18 min read',
    category: 'Engineering'
  },
  {
    slug: 'refactoring-margin-fowler',
    title: "Refactoring — Your Coach's Guide",
    excerpt:
      'A chat-style guide to Martin Fowler\'s "Refactoring: Improving the Design of Existing Code" (2nd ed.) — actionable DO/DON\'T points for all 12 chapters, your path to world-class refactoring.',
    date: 'February 18, 2026',
    readTime: '20 min read',
    category: 'Engineering'
  },
  {
    slug: 'how-to-get-a-job-in-tech-remote',
    title: 'How to get a job in a Tech Field Remote',
    excerpt:
      'A comprehensive guide for technical professionals, managers, and beginners on landing remote tech jobs. Learn about resume optimization, interview preparation, and strategic job searching.',
    date: 'February 10, 2026',
    readTime: '8 min read',
    category: 'Career'
  }
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-gray-400 text-lg mb-12">
            Insights on tech careers, engineering management, and industry trends.
          </p>
        </motion.div>

        <div className="space-y-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {post.category}
                    </span>
                    <span className="text-gray-400">{post.date}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">{post.readTime}</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-400 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center text-blue-400 font-medium">
                    Read more 
                    <svg 
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  );
}
