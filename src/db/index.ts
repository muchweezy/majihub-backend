// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/neon-http';
// import { neon } from '@neondatabase/serverless';
//
// if (!process.env.DATABASE_URL) {
//   throw new Error('DATABASE_URL is not defined in .env file');
// }
//
// const sql = neon(process.env.DATABASE_URL);
// export const db = drizzle(sql);
//
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from './schema';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pool, { schema });