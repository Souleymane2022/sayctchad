import { neon } from '@neondatabase/serverless';
const sql = neon('postgresql://neondb_owner:npg_HVyYWQ2GbgA9@ep-lively-sky-air3s27a-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
async function main() {
  const result = await sql`SELECT * FROM members WHERE lower(first_name) LIKE '%souleymane%'`;
  console.log(JSON.stringify(result, null, 2));
}
main().catch(console.error);
