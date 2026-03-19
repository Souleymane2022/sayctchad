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

async function run() {
  const sqlPath = path.resolve(__dirname, "../migrations/0001_add_elections_and_thunderbird.sql");
  if (!fs.existsSync(sqlPath)) {
    console.error("Migration file not found at:", sqlPath);
    process.exit(1);
  }
  
  const sqlContent = fs.readFileSync(sqlPath, "utf-8");
  
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not defined in .env");
    process.exit(1);
  }

  // Use the standard Postgres client (tcp) which is compatible with the pooler URL
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for Neon
    }
  });

  console.log("Connecting to database via Postgres protocol (port 5432)...");
  try {
    await client.connect();
    console.log("Connected! Applying migration...");
    
    // Execute the SQL content
    await client.query(sqlContent);
    
    console.log("Migration applied successfully!");
    console.log("The Elections and Thunderbird tables have been created.");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
