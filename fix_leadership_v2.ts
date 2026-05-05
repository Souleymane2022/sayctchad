import { sql } from './server/db';

async function main() {
  try {
    const existing = await sql`SELECT id FROM election_candidates WHERE lower(first_name) LIKE '%souleymane%'`;
    if (existing.length > 0) {
      console.log("Updating existing Souleymane...");
      await sql`UPDATE election_candidates SET status = 'approved', role = 'Leader National', votes_count = 846, photo_url = '/national-leader.jpg' WHERE id = ${existing[0].id}`;
    } else {
      console.log("Inserting new Souleymane...");
      await sql`
        INSERT INTO election_candidates (id, first_name, last_name, email, role, status, votes_count, photo_url)
        VALUES (gen_random_uuid(), 'Souleymane Mahamat', 'Saleh', 'souleymane@sayctchad.org', 'Leader National', 'approved', 846, '/national-leader.jpg')
      `;
    }
    console.log("Success!");
  } catch (err) {
    console.error("Failed:", err);
  }
}

main();
