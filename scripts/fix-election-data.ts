import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { electionCandidates } from "../shared/schema";
import { isNull, or } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle(sql);

async function fixData() {
  console.log("Checking for candidates with NULL video or program links...");
  
  const placeholders = {
    videoUrl: "https://chat.whatsapp.com/CB0pBpYzYyBIw2zZB3A8Kj", // Default to WhatsApp as a non-breaking link
    programUrl: "https://sayctchad.org/rejoindre", // Default to Join as a non-breaking link
  };

  try {
    const affected = await db.select()
      .from(electionCandidates)
      .where(or(isNull(electionCandidates.videoUrl), isNull(electionCandidates.programUrl)));

    console.log(`Found ${affected.length} candidates with missing links.`);

    if (affected.length > 0) {
      for (const candidate of affected) {
        console.log(`Fixing candidate: ${candidate.firstName} ${candidate.nomSpecifiqueUnique}`);
        await db.update(electionCandidates)
          .set({
            videoUrl: candidate.videoUrl || placeholders.videoUrl,
            programUrl: candidate.programUrl || placeholders.programUrl,
          })
          .where(sql`id = ${candidate.id}`);
      }
      console.log("Data fixed successfully!");
    } else {
      console.log("No candidates found with NULL links.");
    }
  } catch (error) {
    console.error("Error during data fix:", error);
    process.exit(1);
  }
}

fixData().then(() => process.exit(0));
