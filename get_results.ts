import { neon } from '@neondatabase/serverless';

const sqlUrl = "postgresql://neondb_owner:npg_HVyYWQ2GbgA9@ep-lively-sky-air3s27a-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(sqlUrl);

async function main() {
  const c = await sql`SELECT first_name, last_name, role, votes_count FROM election_candidates WHERE status = 'approved' ORDER BY role, votes_count DESC`;
  console.log(JSON.stringify(c, null, 2));
}

main().catch(console.error);
