'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { BlogSummary } from '@/lib/blogs';

type BlogListProps = {
  initialBlogs: BlogSummary[];
  initialNextCursor: number | null;
  pageSize: number;
};

export default function BlogList({
  initialBlogs,
  initialNextCursor,
  pageSize,
}: BlogListProps) {
  const [blogs, setBlogs] = useState<BlogSummary[]>(initialBlogs);
  const [nextCursor, setNextCursor] = useState<number | null>(
    initialNextCursor,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!nextCursor) return;
    if (!sentinelRef.current) return;

    const sentinel = sentinelRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading) {
          void loadMore();
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.unobserve(sentinel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextCursor, isLoading]);

  async function loadMore() {
    if (!nextCursor || isLoading) return;
    setIsLoading(true);
    setHasError(false);

    try {
      const params = new URLSearchParams({
        cursor: String(nextCursor),
        limit: String(pageSize),
      });

      const res = await fetch(`/api/blogs?${params.toString()}`);

      if (!res.ok) {
        throw new Error('Failed to load more blogs');
      }

      const data: {
        blogs: BlogSummary[];
        nextCursor: number | null;
      } = await res.json();

      setBlogs((prev) => [...prev, ...(data.blogs ?? [])]);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error(error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {blogs.map((post, index) => {
        const publishedDate = new Date(post.publishedAt).toLocaleDateString(
          'en-US',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          },
        );

        const readTimeLabel = post.readTime || undefined;

        return (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
          >
            <Link href={`/blog/${post.slug}`}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {post.category}
                  </span>
                  <span className="text-gray-400">{publishedDate}</span>
                  {readTimeLabel ? (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400">{readTimeLabel}</span>
                    </>
                  ) : null}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.article>
        );
      })}

      <div ref={sentinelRef} />

      {isLoading && (
        <p className="text-center text-gray-400 text-sm">Loading more…</p>
      )}

      {hasError && (
        <p className="text-center text-red-400 text-sm">
          Something went wrong while loading more posts. Please try again.
        </p>
      )}

      {!nextCursor && !isLoading && blogs.length > 0 && (
        <p className="text-center text-gray-500 text-xs mt-4">
          You&apos;ve reached the end.
        </p>
      )}
    </div>
  );
}

