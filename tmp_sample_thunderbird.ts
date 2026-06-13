import { storage } from "./server/storage";

async function checkData() {
  const apps = await storage.getAllThunderbirdApplications();
  console.log(`Total: ${apps.length}`);
  
  const genders = new Set();
  const statuses = new Set();
  
  apps.forEach(a => {
    genders.add(a.gender);
    statuses.add(a.status);
  });
  
  console.log("Genders found:", Array.from(genders));
  console.log("Statuses found:", Array.from(statuses));
  
  if (apps.length > 0) {
    const sample = apps.slice(0, 3).map(a => ({ name: a.fullName, gender: a.gender, status: a.status }));
    console.log("Samples:", JSON.stringify(sample, null, 2));
  }
}

checkData().catch(console.error);
