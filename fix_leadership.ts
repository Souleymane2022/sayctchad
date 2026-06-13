import { neon } from '@neondatabase/serverless';
const sql = neon('postgresql://neondb_owner:npg_HVyYWQ2GbgA9@ep-lively-sky-air3s27a-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

async function main() {
  // 1. Check if Souleymane is already there (redundancy check)
  const existing = await sql`SELECT id FROM election_candidates WHERE lower(first_name) LIKE '%souleymane%'`;
  if (existing.length > 0) {
    console.log("Souleymane already exists in candidates table. Updating...");
    await sql`UPDATE election_candidates SET status = 'approved', role = 'Leader National', votes_count = 846, photo_url = '/national-leader.jpg' WHERE id = ${existing[0].id}`;
  } else {
    console.log("Inserting Souleymane into candidates table...");
    await sql`
      INSERT INTO election_candidates (id, first_name, last_name, email, role, status, votes_count, photo_url)
      VALUES (gen_random_uuid(), 'Souleymane Mahamat', 'Saleh', 'souleymane@sayctchad.org', 'Leader National', 'approved', 846, '/national-leader.jpg')
    `;
  }
  console.log("Done.");
}

main().catch(console.error);
