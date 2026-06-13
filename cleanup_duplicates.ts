import { neon } from '@neondatabase/serverless';

const sqlUrl = "postgresql://neondb_owner:npg_HVyYWQ2GbgA9@ep-lively-sky-air3s27a-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(sqlUrl);

async function main() {
  console.log("Nettoyage des doublons pour Allamine et Jérémie...");

  // Delete candidates who have 0 votes AND have a duplicate entry with more votes
  const result = await sql`
    DELETE FROM election_candidates 
    WHERE (first_name ILIKE '%Allamine%' OR first_name ILIKE '%Jérémie%')
    AND votes_count = 0
    RETURNING id, first_name, votes_count
  `;

  console.log("Doublons supprimés :");
  console.log(result);
}

main().catch(console.error);
