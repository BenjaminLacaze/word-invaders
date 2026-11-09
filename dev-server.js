/**
 * Servidor de desarrollo ligero compatible con la estructura de Vite.
 * Sirve los archivos de `public/` en la raíz `/` y el código fuente de `/src/`,
 * permitiendo ejecutar el juego sin depender de herramientas globales externas.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5173;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav'
};

const AUDIO_EXTENSIONS = ['.mp3', '.ogg', '.wav'];

const server = http.createServer((req, res) => {
  const safeUrl = decodeURIComponent(req.url.split('?')[0]);
  const relativePath = safeUrl === '/' ? '/index.html' : safeUrl;

  // 1. Buscar primero en la carpeta `public/` (igual que hace Vite)
  let filePath = path.join(__dirname, 'public', relativePath);

  // Si es una petición de audio y el usuario guardó el archivo como .wav o .ogg en vez de .mp3,
  // buscar automáticamente cualquiera de las extensiones compatibles.
  if (!fs.existsSync(filePath) && relativePath.startsWith('/assets/audio/')) {
    const ext = path.extname(filePath);
    const baseWithoutExt = filePath.slice(0, -ext.length);
    for (const candidateExt of AUDIO_EXTENSIONS) {
      const candidatePath = baseWithoutExt + candidateExt;
      if (fs.existsSync(candidatePath)) {
        filePath = candidatePath;
        break;
      }
    }
  }

  // 2. Si no está en `public/`, buscar en la raíz del proyecto (`index.html`, `src/...`)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, relativePath);
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`404 No encontrado: ${relativePath}`);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Error interno del servidor');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    res.end(content);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n==================================================`);
  console.log(`  WORD INVADERS ejecutándose en:`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
