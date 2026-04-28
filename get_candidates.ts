import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => client.query('SELECT id, name, role, "imageUrl", "votesCount" FROM election_candidates ORDER BY role, "votesCount" DESC'))
  .then(r => {
    console.log(JSON.stringify(r.rows, null, 2));
    client.end();
  })
  .catch(e => {
    console.error(e.message);
    client.end();
  });
