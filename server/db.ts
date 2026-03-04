import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

// Low-level client for raw SQL or simple usage if needed
export const sql = neon(process.env.DATABASE_URL);

// Drizzle instance using HTTP driver
export const db = drizzle(sql, { schema });

// Export a dummy pool or nothing for now to see if we can get it to run
// Routes.ts uses 'pool' for session store, we will need to handle that.
export const pool = null as any; 
