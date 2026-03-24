process.env.VERCEL = "1";
import handler from './api/index.js';
import http from 'http';

const server = http.createServer((req, res) => {
  handler(req, res).catch(err => {
    console.error('Fatal crash inside handler:', err);
    res.statusCode = 500;
    res.end('Crash');
  });
});

server.listen(4000, () => {
  console.log('Test server ready on 4000');
  http.get('http://localhost:4000/api/opportunities', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('Response:', res.statusCode, data));
    setTimeout(() => process.exit(0), 1000);
  });
});
