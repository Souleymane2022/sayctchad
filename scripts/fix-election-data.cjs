const { neon } = require("@neondatabase/serverless");
// DATABASE_URL provided via environment variable

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function fixData() {
  console.log("Checking for candidates with NULL video or program links...");
  
  const placeholders = {
    videoUrl: "https://chat.whatsapp.com/CB0pBpYzYyBIw2zZB3A8Kj",
    programUrl: "https://sayctchad.org/rejoindre",
  };

  try {
    // raw SQL for simplicity since it's a one-off fix
    const result_video = await sql`
      UPDATE election_candidates 
      SET video_url = ${placeholders.videoUrl} 
      WHERE video_url IS NULL
    `;
    console.log("Fixed video_url for existing rows.");

    const result_program = await sql`
      UPDATE election_candidates 
      SET program_url = ${placeholders.programUrl} 
      WHERE program_url IS NULL
    `;
    console.log("Fixed program_url for existing rows.");

    console.log("Data fixed successfully!");
  } catch (error) {
    console.error("Error during data fix:", error);
    process.exit(1);
  }
}

fixData().then(() => process.exit(0));
