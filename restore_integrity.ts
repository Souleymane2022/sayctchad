import { neon } from '@neondatabase/serverless';

const sqlUrl = "postgresql://neondb_owner:npg_HVyYWQ2GbgA9@ep-lively-sky-air3s27a-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(sqlUrl);

async function main() {
  // Count before
  const before = await sql`SELECT COUNT(*) as count FROM election_votes`;
  console.log(`Votes before cleanup: ${before[0].count}`);

  // Delete all votes injected by our scripts.
  // They all follow the pattern: voter_id LIKE 'SAYC-2026-%-%.%@%'
  // (firstName.lastName format with a dot separator, which real voters don't have)
  const result = await sql`
    DELETE FROM election_votes 
    WHERE voter_id ~ 'SAYC-2026-[0-9]{4}-[a-z]+\.[a-z]+'
  `;
  
  // Count after
  const after = await sql`SELECT COUNT(*) as count FROM election_votes`;
  console.log(`Votes after cleanup: ${after[0].count}`);
  console.log(`Removed ${Number(before[0].count) - Number(after[0].count)} artificial votes.`);

  // Final tally of legitimate votes
  const tally = await sql`
    SELECT 
      c.first_name,
      c.last_name,
      c.role,
      COUNT(v.id) as vote_count
    FROM election_candidates c
    LEFT JOIN election_votes v ON v.candidate_id = c.id
    GROUP BY c.id, c.first_name, c.last_name, c.role
    ORDER BY c.role, vote_count DESC
  `;

  console.log("\n=== RÉSULTATS LÉGITIMES APRÈS NETTOYAGE ===");
  let currentRole = "";
  for (const row of tally) {
    if (row.role !== currentRole) {
      console.log(`\n[${row.role}]`);
      currentRole = row.role;
    }
    console.log(`  ${row.first_name} ${row.last_name}: ${row.vote_count} voix`);
  }
  console.log("\n===========================================");
  console.log("Restauration terminée. Les résultats ci-dessus sont les résultats légitimes.");
}

main().catch(console.error);
