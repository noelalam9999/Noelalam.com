'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

const blogPosts = [
  {
    slug: 'refactoring-margin-fowler',
    title: "Refactoring — Your Coach's Guide",
    excerpt: "A chat-style guide to Martin Fowler's \"Refactoring: Improving the Design of Existing Code\" (2nd ed.) — actionable DO/DON'T points for all 12 chapters, your path to world-class refactoring.",
    date: 'February 18, 2026',
    readTime: '20 min read',
    category: 'Engineering'
  },
  {
    slug: 'how-to-get-a-job-in-tech-remote',
    title: 'How to get a job in a Tech Field Remote',
    excerpt: 'A comprehensive guide for technical professionals, managers, and beginners on landing remote tech jobs. Learn about resume optimization, interview preparation, and strategic job searching.',
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
