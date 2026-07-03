import { Router } from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

function loadJson(filename) {
  const filePath = join(__dirname, '../../../client/src/data', filename);
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

router.get('/', (_req, res) => {
  res.json(loadJson('projects.json'));
});

export default router;
