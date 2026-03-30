// Script pour compter les membres avec photos
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

// Load .env manually
const envContent = readFileSync('.env', 'utf-8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^=]+)="?([^"\r]*)"?/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const sql = neon(process.env.DATABASE_URL);

const result = await sql`
  SELECT 
    COUNT(*) as total_members,
    COUNT(*) FILTER (WHERE photo_url IS NOT NULL AND photo_url != '') as with_photo,
    COUNT(*) FILTER (WHERE photo_url IS NULL OR photo_url = '') as without_photo
  FROM members
`;

console.log('=== MEMBRES ET PHOTOS ===');
console.log('Total membres:', result[0].total_members);
console.log('Avec photo:   ', result[0].with_photo);
console.log('Sans photo:   ', result[0].without_photo);
