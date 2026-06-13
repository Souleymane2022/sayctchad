import { DatabaseStorage } from "../server/storage";

async function checkCandidates() {
  const storage = new DatabaseStorage();
  const candidates = await storage.getApprovedCandidates();
  console.log(JSON.stringify(candidates, null, 2));
}

checkCandidates().catch(console.error);
