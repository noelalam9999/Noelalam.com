import { neon } from '@neondatabase/serverless';

// Uses DATABASE_URL from your environment (Neon connection string)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Add your Neon connection string to `.env`.');
}

export const sql = neon(connectionString);

