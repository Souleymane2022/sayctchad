import * as dotenv from "dotenv";
dotenv.config();

import { storage } from "./server/storage";

async function approveFirst50() {
  const apps = await storage.getAllThunderbirdApplications();
  const pending = apps.filter(a => a.status === 'pending');
  console.log(`Found ${pending.length} pending applications.`);
  
  const toApprove = pending.slice(0, 50);
  console.log(`Approving ${toApprove.length} applications...`);
  
  for (const app of toApprove) {
    await storage.updateThunderbirdApplicationStatus(app.id, 'approved');
  }
  
  console.log("Approval complete.");
}

approveFirst50().catch(console.error);
