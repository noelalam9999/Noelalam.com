import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(connectionString);

async function main() {
  console.log('Fetching all blogs from database...\n');
  
  const blogs = await sql`
    SELECT 
      id,
      slug,
      title,
      category,
      read_time_minutes,
      published_at,
      created_at
    FROM blogs
    ORDER BY published_at DESC, id DESC
  `;
  
  console.log(`Found ${blogs.length} blogs:\n`);
  
  blogs.forEach((blog: any, index: number) => {
    console.log(`${index + 1}. ${blog.title}`);
    console.log(`   Slug: ${blog.slug}`);
    console.log(`   Category: ${blog.category}`);
    console.log(`   Read time: ${blog.read_time_minutes} min`);
    console.log(`   Published: ${new Date(blog.published_at).toLocaleDateString()}`);
    console.log('');
  });
}

main().catch(console.error);
