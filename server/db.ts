import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../shared/schema";

// Fallback for Vercel diagnostics so it doesn't crash on import
if (!process.env.DATABASE_URL) {
  console.error("CRITICAL ERROR: DATABASE_URL is missing in this environment!");
}

const safeDbUrl = process.env.DATABASE_URL || "postgresql://dummy:dummy@ep-lively-sky-air3s27a-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

// Low-level client for raw SQL or simple usage if needed
export const sql = neon(safeDbUrl);

// Drizzle instance using HTTP driver
export const db = drizzle(sql, { schema });


// Export a dummy pool or nothing for now to see if we can get it to run
// Routes.ts uses 'pool' for session store, we will need to handle that.
export const pool = null as any; 
