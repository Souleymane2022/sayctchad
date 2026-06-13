import 'dotenv/config';
import { pool } from './server/db';

const r = await pool.query(`
  SELECT 
    COUNT(*) as total_members,
    COUNT(photo_url) FILTER (WHERE photo_url IS NOT NULL AND photo_url != '') as with_photo,
    COUNT(*) FILTER (WHERE photo_url IS NULL OR photo_url = '') as without_photo
  FROM members
`);

console.log('=== MEMBRES ET PHOTOS ===');
console.log('Total membres:', r.rows[0].total_members);
console.log('Avec photo:   ', r.rows[0].with_photo);
console.log('Sans photo:   ', r.rows[0].without_photo);
await pool.end();
