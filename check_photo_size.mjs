import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env', 'utf-8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^=]+)="?([^"\r]*)"?/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const sql = neon(process.env.DATABASE_URL);

// Check the size of photo_url data
const result = await sql`
  SELECT 
    COUNT(*) as with_photo,
    AVG(LENGTH(photo_url)) as avg_size_chars,
    MAX(LENGTH(photo_url)) as max_size_chars,
    MIN(LENGTH(photo_url)) as min_size_chars,
    SUBSTRING(photo_url, 1, 50) as sample_url
  FROM members 
  WHERE photo_url IS NOT NULL AND photo_url != ''
`;

console.log('=== ANALYSE DES PHOTOS ===');
console.log('Nombre avec photo:', result[0].with_photo);
console.log('Taille moyenne (chars):', Math.round(result[0].avg_size_chars));
console.log('Taille max (chars):', result[0].max_size_chars);
console.log('Taille min (chars):', result[0].min_size_chars);
console.log('Exemple URL:', result[0].sample_url);

const avgKB = result[0].avg_size_chars / 1024;
const totalMB = (result[0].avg_size_chars * result[0].with_photo) / 1024 / 1024;
console.log('\n=== ESTIMATION CHARGE API ===');
console.log(`Taille moyenne par photo: ~${avgKB.toFixed(1)} KB`);
console.log(`Total estimé pour ${result[0].with_photo} membres: ~${totalMB.toFixed(1)} MB`);

// Check if it's base64 or URL
const sample = await sql`
  SELECT photo_url FROM members 
  WHERE photo_url IS NOT NULL AND photo_url != ''
  LIMIT 1
`;
const photoStart = sample[0]?.photo_url?.substring(0, 30) || '';
console.log('\nType de stockage:', photoStart.startsWith('data:') ? '❌ BASE64 (très lourd !)' : '✅ URL externe');
