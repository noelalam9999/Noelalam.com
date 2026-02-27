import { sql } from './db';

export type Blog = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTimeMinutes: number | null;
  publishedAt: string;
};

export type BlogSummary = Omit<Blog, 'content'>;

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const rows = (await sql`
    SELECT
      id,
      slug,
      title,
      excerpt,
      content,
      category,
      read_time_minutes AS "readTimeMinutes",
      published_at AS "publishedAt"
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
      excerpt,
      category,
      read_time_minutes AS "readTimeMinutes",
      published_at AS "publishedAt"
    FROM blogs
    ORDER BY published_at DESC, id DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `) as BlogSummary[];

  return rows;
}

/**
 * SQL schema for Neon (Postgres)
 *
 * Run this once in your Neon database to create the blogs table:
 *
 * CREATE TABLE IF NOT EXISTS blogs (
 *   id SERIAL PRIMARY KEY,
 *   slug TEXT NOT NULL UNIQUE,
 *   title TEXT NOT NULL,
 *   excerpt TEXT NOT NULL,
 *   content TEXT NOT NULL,
 *   category TEXT NOT NULL,
 *   read_time_minutes INTEGER,
 *   published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 *   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 * );
 *
 * You can then insert one row per blog post, copying over:
 * - slug (e.g. "llm-tools-context-and-agent-design-interview-guide")
 * - title (H1)
 * - excerpt (short description used on the list page)
 * - content (full HTML/markdown body)
 * - category ("Engineering", "Career", etc.)
 * - read_time_minutes (e.g. 18, 20)
 * - published_at (the date string currently hard-coded in the components)
 */

