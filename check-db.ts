import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

async function check() {
  try {
    console.log("Checking table: contact_messages");
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'contact_messages'
    `;
    console.log(JSON.stringify(columns, null, 2));
    
    console.log("\nChecking table: members");
    const memberCols = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'members'
    `;
    console.log(JSON.stringify(memberCols, null, 2));
    
  } catch (e) {
    console.error("Error:", e);
  }
}

check();
