import { neon } from '@neondatabase/serverless';

const sqlUrl = "postgresql://neondb_owner:npg_HVyYWQ2GbgA9@ep-lively-sky-air3s27a-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(sqlUrl);

async function main() {
  console.log("Vérification du statut de Allamine et Jérémie...");

  // Update status to 'approved' for these candidates
  const result = await sql`
    UPDATE election_candidates 
    SET status = 'approved' 
    WHERE (first_name ILIKE '%Allamine%' OR first_name ILIKE '%Jérémie%')
    RETURNING first_name, status, votes_count
  `;

  console.log("Mise à jour effectuée :");
  console.log(result);
}

main().catch(console.error);
