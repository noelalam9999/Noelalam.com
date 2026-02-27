import { sql } from './db';

export type BlogContent = {
  type: 'interview-guide' | 'practice-guide' | 'coach-guide' | 'article';
  sections?: any[];
  parts?: any[];
  introduction?: string;
  instructions?: any;
  conclusion?: any;
};

export type BlogMetadata = {
  excerpt: string;
  readTime: string;
  date: string;
  title: string;
  category: string;
  slug: string;
};

export type BlogData = {
  content: BlogContent;
  metadata: BlogMetadata;
};

export type Blog = {
  id: number;
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  data: BlogData;
  createdAt: string;
  updatedAt: string;
};

export type BlogSummary = Omit<Blog, 'data'> & {
  excerpt: string;
  readTime: string;
};

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const rows = (await sql`
    SELECT
      id,
      slug,
      title,
      category,
      published_at AS "publishedAt",
      data,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM blogs
    WHERE slug = ${slug}
    LIMIT 1
  `) as Blog[];

  if (!rows || rows.length === 0) {
    return null;
  }

  return rows[0];
}

export async function getBlogsPage(
  limit: number,
  offset: number,
): Promise<BlogSummary[]> {
  const rows = (await sql`
    SELECT
      id,
      slug,
      title,
      category,
      published_at AS "publishedAt",
      data->>'metadata' AS metadata,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM blogs
    ORDER BY published_at DESC, id DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `) as any[];

  return rows.map((row) => {
    const metadata = typeof row.metadata === 'string' 
      ? JSON.parse(row.metadata) 
      : row.metadata;
    
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category,
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      excerpt: metadata.excerpt,
      readTime: metadata.readTime,
    };
  });
}

/**
 * SQL schema for Neon (Postgres) - Updated with JSONB data field
 *
 * The blogs table now uses a JSONB field to store structured content:
 *
 * CREATE TABLE IF NOT EXISTS blogs (
 *   id SERIAL PRIMARY KEY,
 *   slug TEXT NOT NULL UNIQUE,
 *   title TEXT NOT NULL,
 *   category TEXT NOT NULL,
 *   published_at DATE NOT NULL,
 *   data JSONB NOT NULL,
 *   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 * );
 *
 * The data field contains:
 * {
 *   "content": {
 *     "type": "interview-guide" | "practice-guide" | "coach-guide" | "article",
 *     "sections": [...] | "parts": [...],
 *     "introduction": "...",
 *     "instructions": {...},
 *     "conclusion": {...}
 *   },
 *   "metadata": {
 *     "excerpt": "...",
 *     "readTime": "X min read",
 *     "date": "YYYY-MM-DD",
 *     "title": "...",
 *     "category": "...",
 *     "slug": "..."
 *   }
 * }
 */

