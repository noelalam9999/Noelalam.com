import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { getBlogBySlug } from '@/lib/blogs';
import BlogContent from '@/components/blog/BlogContent';

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function BlogPostPage({ params }: PageProps) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  const publishedDate = new Date(blog.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      <article className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <div className="mb-12">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Blog
          </Link>

          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm mb-4">
            {blog.category}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{publishedDate}</span>
            {blog.data.metadata.readTime && (
              <>
                <span>•</span>
                <span>{blog.data.metadata.readTime}</span>
              </>
            )}
          </div>

          {blog.data.metadata.excerpt && (
            <p className="text-lg text-gray-400 mt-4 leading-relaxed">
              {blog.data.metadata.excerpt}
            </p>
          )}
        </div>

        <BlogContent content={blog.data.content} />
      </article>
    </main>
  );
}

