import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;
const DATA_FILE = resolve(__dirname, './mocks/mock-server-data.json');

const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.url === '/' || req.url === '/mock-data') {
    try {
      const data = readFileSync(DATA_FILE, 'utf-8');
      res.writeHead(200);
      res.end(data);
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Failed to read mock data', details: error.message }));
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log(`Data available at http://localhost:${PORT}/mock-data`);
});
