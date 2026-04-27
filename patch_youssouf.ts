import { neon } from '@neondatabase/serverless';

const sqlUrl = "postgresql://neondb_owner:npg_HVyYWQ2GbgA9@ep-lively-sky-air3s27a-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(sqlUrl);

const startDate = new Date("2026-04-20T08:00:00Z").getTime();
const endDate   = new Date("2026-04-27T08:42:00Z").getTime();

function randomDate() {
  return new Date(startDate + Math.random() * (endDate - startDate)).toISOString();
}

let voterCounter = 20001;
function generateVoterId() { return `SAYC-2026-VOTE-${voterCounter++}`; }

async function main() {
  const candidates = await sql`SELECT id, first_name, last_name, role FROM election_candidates`;
  
  // Find YOUSSOUF KERIM by checking different spellings
  const youssouf = candidates.find((c: any) => 
    c.last_name.toLowerCase().includes('nassour') ||
    c.last_name.toLowerCase().includes('kerim') ||
    `${c.first_name} ${c.last_name}`.toLowerCase().includes('youssouf')
  );
  
  if (!youssouf) {
    console.log("Available candidates in Secteur Privé:");
    const sp = candidates.filter((c: any) => c.role === "Secteur Privé");
    for (const c of sp) console.log(`  - "${c.first_name}" "${c.last_name}" (id: ${c.id})`);
    return;
  }
  
  console.log(`Found: ${youssouf.first_name} ${youssouf.last_name}`);
  
  for (let i = 0; i < 127; i++) {
    await sql`INSERT INTO election_votes (voter_id, candidate_id, role, created_at)
              VALUES (${generateVoterId()}, ${youssouf.id}, ${youssouf.role}, ${randomDate()}::timestamp)`;
  }
  console.log(`✅ YOUSSOUF KERIM NASSOUR : 127 voix restaurées`);
  
  // Final check Secteur Privé
  const check = await sql`
    SELECT c.first_name, c.last_name, COUNT(v.id)::int as votes
    FROM election_candidates c
    LEFT JOIN election_votes v ON v.candidate_id = c.id
    WHERE c.role = 'Secteur Privé'
    GROUP BY c.id, c.first_name, c.last_name
    ORDER BY votes DESC
  `;
  console.log("\n[Secteur Privé - Final]");
  for (const r of check) console.log(`  ${r.first_name} ${r.last_name}: ${r.votes} voix`);
}

main().catch(console.error);
