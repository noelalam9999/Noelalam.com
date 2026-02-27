import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(connectionString);

// Blog slugs from GitHub
const blogSlugs = [
  'clean-code-robert-martin-interview-guide',
  'designing-bots-amir-shevat-interview-guide',
  'designing-data-intensive-applications-interview-guide',
  'how-to-get-a-job-in-tech-remote',
  'llm-tools-context-and-agent-design-interview-guide',
  'logging-metrics-tracing-stack-interview-guide',
  'monitoring-observability-interview-guide',
  'oauth2-oidc-security-interview-guide',
  'observability-and-sso-practice-guide',
  'react-node-testing-interview-guide',
  'refactoring-margin-fowler',
  'tdd-and-perf-practice-guide',
  'tdd-kent-beck-interview-guide',
  'web-and-react-performance-interview-guide',
  'weekend-llm-agent-project-guideline',
];

type BlogMetadata = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTimeMinutes: number;
  publishedAt: string;
};

async function fetchBlogContent(slug: string): Promise<string | null> {
  const urls = [
    `https://raw.githubusercontent.com/noelalam9999/Noelalam.com/main/app/blog/${slug}/page.tsx`,
    `https://raw.githubusercontent.com/noelalam9999/Noelalam.com/main/app/blog/${slug}/${slug}.md`,
    `https://raw.githubusercontent.com/noelalam9999/Noelalam.com/main/app/blog/${slug}/Refactoring.md`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      console.log(`Failed to fetch ${url}`);
    }
  }
  return null;
}

function extractMetadataFromTSX(content: string, slug: string): BlogMetadata | null {
  // Extract title from the component
  const titleMatch = content.match(/<h1[^>]*>\s*([^<]+)\s*<\/h1>/i) ||
                     content.match(/([A-Z][^—]+)\s*—\s*Interview Guide/);
  
  // Extract excerpt from the component description
  const excerptMatch = content.match(/<p[^>]*>\s*\n?\s*([^<]+(?:<[^>]+>[^<]*<\/[^>]+>[^<]*)*?)\s*<\/p>/i);
  
  // Extract category
  const categoryMatch = content.match(/>\s*(Engineering|Career|Practice|Guide)\s*</i);
  
  // Extract read time
  const readTimeMatch = content.match(/(\d+)\s*min\s*read/i);
  
  // Extract published date
  const dateMatch = content.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d+,\s+\d{4}/i);

  if (!titleMatch) {
    console.log(`Could not extract title from ${slug}`);
    return null;
  }

  const title = titleMatch[1]?.trim() || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const excerpt = excerptMatch?.[1]?.replace(/<[^>]+>/g, '').replace(/&apos;/g, "'").replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"').trim() || `Interview guide covering key concepts from ${title}`;
  const category = categoryMatch?.[1] || 'Engineering';
  const readTimeMinutes = readTimeMatch ? parseInt(readTimeMatch[1]) : 15;
  const publishedAt = dateMatch?.[0] ? new Date(dateMatch[0]).toISOString() : new Date('2026-02-24').toISOString();

  // For content, we'll use the full TSX as markdown won't render properly
  // Instead, we'll create a simplified version
  const blogContent = `# ${title}\n\n${excerpt}\n\nThis is an interview guide covering key concepts and best practices.`;

  return {
    slug,
    title,
    excerpt,
    content: blogContent,
    category,
    readTimeMinutes,
    publishedAt,
  };
}

function extractMetadataFromMarkdown(content: string, slug: string): BlogMetadata | null {
  // Extract title (first H1)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  
  // Extract excerpt (first paragraph after title)
  const excerptMatch = content.match(/^#\s+.+$\n+>\s*\*(.+?)\*/m) ||
                       content.match(/^#\s+.+$\n+(.+?)(?:\n\n|\n---)/m);
  
  if (!titleMatch) {
    console.log(`Could not extract title from markdown ${slug}`);
    return null;
  }

  const title = titleMatch[1].trim();
  const excerpt = excerptMatch?.[1]?.trim() || `A comprehensive guide covering ${title}`;
  const category = 'Engineering';
  
  // Estimate read time based on word count (average 200 words per minute)
  const wordCount = content.split(/\s+/).length;
  const readTimeMinutes = Math.ceil(wordCount / 200);
  
  return {
    slug,
    title,
    excerpt,
    content,
    category,
    readTimeMinutes,
    publishedAt: new Date('2026-02-24').toISOString(),
  };
}

async function createTableIfNotExists() {
  console.log('Creating blogs table if it does not exist...');
  await sql`
    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      read_time_minutes INTEGER,
      published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log('Table ready.');
}

async function insertBlog(blog: BlogMetadata) {
  try {
    await sql`
      INSERT INTO blogs (slug, title, excerpt, content, category, read_time_minutes, published_at)
      VALUES (
        ${blog.slug},
        ${blog.title},
        ${blog.excerpt},
        ${blog.content},
        ${blog.category},
        ${blog.readTimeMinutes},
        ${blog.publishedAt}
      )
      ON CONFLICT (slug) 
      DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        category = EXCLUDED.category,
        read_time_minutes = EXCLUDED.read_time_minutes,
        published_at = EXCLUDED.published_at,
        updated_at = NOW()
    `;
    console.log(`✓ Inserted/Updated: ${blog.slug}`);
  } catch (error) {
    console.error(`✗ Failed to insert ${blog.slug}:`, error);
  }
}

async function main() {
  console.log('Starting blog seeding process...\n');
  
  await createTableIfNotExists();
  
  console.log(`\nFetching ${blogSlugs.length} blogs from GitHub...\n`);
  
  for (const slug of blogSlugs) {
    console.log(`Processing: ${slug}`);
    
    const content = await fetchBlogContent(slug);
    if (!content) {
      console.log(`✗ Could not fetch content for ${slug}`);
      continue;
    }
    
    let metadata: BlogMetadata | null = null;
    
    // Determine if it's TSX or Markdown
    if (content.includes('export default function')) {
      metadata = extractMetadataFromTSX(content, slug);
    } else if (content.startsWith('#') || content.includes('##')) {
      metadata = extractMetadataFromMarkdown(content, slug);
    }
    
    if (metadata) {
      await insertBlog(metadata);
    } else {
      console.log(`✗ Could not extract metadata from ${slug}`);
    }
    
    console.log('');
  }
  
  console.log('\n✓ Blog seeding complete!');
  
  // Show summary
  const result = await sql`SELECT COUNT(*) as count FROM blogs`;
  console.log(`\nTotal blogs in database: ${result[0].count}`);
}

main().catch(console.error);
