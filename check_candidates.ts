import { sql } from './server/db';
async function main() {
  const res = await sql`SELECT first_name, last_name, photo_url, role, status FROM election_candidates WHERE lower(first_name) LIKE '%mounir%' OR lower(first_name) LIKE '%adeline%' OR lower(first_name) LIKE '%allamine%' OR lower(first_name) LIKE '%jérémie%'`;
  console.log(JSON.stringify(res, null, 2));
}
main();
