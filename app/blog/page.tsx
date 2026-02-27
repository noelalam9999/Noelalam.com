import Navigation from '@/components/Navigation';
import BlogList from '@/components/BlogList';
import { getBlogsPage } from '@/lib/blogs';

const PAGE_SIZE = 10;

export default async function BlogPage() {
  const initialBlogs = await getBlogsPage(PAGE_SIZE, 0);
  const initialNextCursor =
    initialBlogs.length === PAGE_SIZE ? PAGE_SIZE : null;

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-gray-400 text-lg mb-12">
            Insights on tech careers, engineering management, and industry
            trends.
          </p>
        </div>

        <BlogList
          initialBlogs={initialBlogs}
          initialNextCursor={initialNextCursor}
          pageSize={PAGE_SIZE}
        />
      </div>
    </main>
  );
}

