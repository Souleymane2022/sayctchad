import { neon } from '@neondatabase/serverless';

const sqlUrl = "postgresql://neondb_owner:npg_HVyYWQ2GbgA9@ep-lively-sky-air3s27a-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(sqlUrl);

async function check() {
  const votes = await sql`SELECT role, COUNT(*)::int as count FROM election_votes GROUP BY role`;
  console.log('--- DB VOTE COUNTS PER ROLE ---');
  console.log(votes);

  const candidates = await sql`
    SELECT first_name, last_name, role, votes_count 
    FROM election_candidates 
    WHERE votes_count > 0 
    ORDER BY role, votes_count DESC
  `;
  console.log('\n--- DETAILED CANDIDATE TALLY ---');
  let currentRole = "";
  for (const c of candidates) {
    if (c.role !== currentRole) {
      console.log(`\n[${c.role}]`);
      currentRole = c.role;
    }
    console.log(`  ${c.first_name} ${c.last_name}: ${c.votes_count} voix`);
  }
}

check().catch(console.error);
