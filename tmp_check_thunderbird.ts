import { storage } from "./server/storage";

async function checkData() {
  const apps = await storage.getAllThunderbirdApplications();
  console.log(`Total applications: ${apps.length}`);
  const approved = apps.filter(a => a.status === 'approved');
  console.log(`Approved: ${approved.length}`);
  
  const male = apps.filter(a => a.gender === 'Masculin' || a.gender === 'Male').length;
  const female = apps.filter(a => a.gender === 'Féminin' || a.gender === 'Female').length;
  console.log(`Stats (All): Male: ${male}, Female: ${female}`);
  
  if (apps.length > 0) {
    console.log("Sample app data:", JSON.stringify(apps[0], null, 2));
  }
}

checkData().catch(console.error);
