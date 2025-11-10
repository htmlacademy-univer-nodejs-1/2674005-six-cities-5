import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const PORT = 3000;
const DATA_FILE = './mocks/mock-server-data.json';

const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.url === '/' || req.url === '/mock-data') {
    try {
      const data = readFileSync(resolve(DATA_FILE), 'utf-8');
      res.writeHead(200);
      res.end(data);
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Failed to read mock data' }));
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Mock server is running on http://localhost:${PORT}`);
  console.log(`Data available at http://localhost:${PORT}/mock-data`);
});
