// This file has been created (totally or partially) with the assistance of artificial intelligence tools.
// All content has been generated under the direct supervision of a named individual,
// and under the AI.Backbone Orchestrator Compliance framework

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const portArgument = process.argv.indexOf('--port');
const port = portArgument >= 0 ? Number(process.argv[portArgument + 1]) : 4178;
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Port invalide.');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml' };

createServer(async (request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end('Adresse invalide.');
    return;
  }
  if (pathname === '/') pathname = '/index.html';
  if (!path.extname(pathname)) pathname += '.html';
  const target = path.resolve(root, `.${pathname}`);
  const relative = path.relative(root, target);
  if (relative.startsWith('..') || path.isAbsolute(relative) || !types[path.extname(target)]) {
    response.writeHead(403).end('Accès interdit.');
    return;
  }
  try {
    const bytes = await readFile(target);
    response.writeHead(200, {
      'Content-Type': types[path.extname(target)],
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    }).end(bytes);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') response.writeHead(404).end('Page introuvable.');
    else {
      console.error('Erreur de lecture du site.', error.code);
      response.writeHead(500).end('Erreur de lecture.');
    }
  }
}).listen(port, '127.0.0.1', () => console.log(`Site prêt : http://127.0.0.1:${port}`));
