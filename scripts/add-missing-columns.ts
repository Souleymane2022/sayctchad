import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Manually load .env variables
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  console.log("Loading environment variables from .env...");
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith("#")) {
      const indexOfEqual = trimmedLine.indexOf("=");
      if (indexOfEqual !== -1) {
        const key = trimmedLine.substring(0, indexOfEqual).trim();
        const value = trimmedLine.substring(indexOfEqual + 1).trim()
          .replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    }
  });
}

const alterSQL = `
ALTER TABLE election_candidates ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE election_candidates ADD COLUMN IF NOT EXISTS facebook_url text;
ALTER TABLE election_candidates ADD COLUMN IF NOT EXISTS twitter_url text;
ALTER TABLE election_candidates ADD COLUMN IF NOT EXISTS program_url text;
ALTER TABLE election_candidates ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE election_candidates ADD COLUMN IF NOT EXISTS photo_url text;
ALTER TABLE election_candidates ADD COLUMN IF NOT EXISTS cv_url text;
ALTER TABLE election_candidates ADD COLUMN IF NOT EXISTS motivation_url text;
`;

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not defined in .env");
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  console.log("Connecting to database...");
  try {
    await client.connect();
    console.log("Connected! Adding missing columns...");
    await client.query(alterSQL);
    console.log("✅ Columns added successfully!");
    
    // Verify
    const result = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'election_candidates' 
      ORDER BY ordinal_position
    `);
    console.log("Current columns:", result.rows.map((r: any) => r.column_name).join(", "));
  } catch (err) {
    console.error("Failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
