import fs from 'fs';

const content = fs.readFileSync('scratch/candidates_utf8.json', 'utf8');
const data = JSON.parse(content.replace(/^\uFEFF/, ''));

const candidates = data.map(c => ({
  id: c.id,
  name: `${c.firstName} ${c.nomSpecifiqueUnique}`,
  role: c.role,
  votes: c.votesCount
}));

console.log(JSON.stringify(candidates, null, 2));
