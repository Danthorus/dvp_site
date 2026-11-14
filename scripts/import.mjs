// This file has been created (totally or partially) with the assistance of artificial intelligence tools.
// All content has been generated under the direct supervision of a named individual,
// and under the AI.Backbone Orchestrator Compliance framework

import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://domaine-du-val-pendragon.webador.fr';
const allowedHosts = new Set([new URL(origin).hostname, 'primary.jwwb.nl']);

async function download(url) {
  if (!allowedHosts.has(new URL(url).hostname)) throw new Error('Domaine source non autorisé.');
  const response = await fetch(url, { signal: AbortSignal.timeout(45_000), redirect: 'error' });
  if (!response.ok) throw new Error(`Récupération impossible : HTTP ${response.status}`);
  return response;
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const homeHtml = await (await download(`${origin}/`)).text();
  const navigation = await page.evaluate((html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return [...doc.querySelectorAll('nav.menu #jw-menu > li > a')].map(a => ({
      path: a.getAttribute('href'),
      label: a.textContent.replace(/\s+/g, ' ').trim(),
    }));
  }, homeHtml);
  if (navigation.length !== 8) throw new Error('Le nombre de pages source a changé : vérifier le périmètre.');

  const pages = [];
  for (const [index, item] of navigation.entries()) {
    const html = index === 0 ? homeHtml : await (await download(`${origin}${item.path}`)).text();
    const content = await page.evaluate(({ html, index }) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const main = doc.querySelector('main .jw-strip-root');
      if (!main) throw new Error('Contenu principal source introuvable.');
      const normalize = value => value.replace(/\s+/g, ' ').trim();
      const permitted = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'STRONG', 'B', 'EM', 'I', 'BR', 'A', 'SPAN']);
      function clean(element) {
        for (const child of [...element.children]) {
          if (!permitted.has(child.tagName)) throw new Error(`Balise source inattendue : ${child.tagName}`);
          clean(child);
          for (const attribute of [...child.attributes]) {
            if (!(child.tagName === 'A' && attribute.name === 'href')) child.removeAttribute(attribute.name);
          }
          if (child.tagName === 'A' && !/^(https:\/\/|mailto:|tel:|\/|#)/.test(child.getAttribute('href') || '')) {
            throw new Error('Lien source non autorisé.');
          }
          if (child.tagName === 'SPAN') child.replaceWith(...child.childNodes);
        }
      }
      const nodes = [];
      for (const block of main.querySelectorAll('.jw-element-imagetext-text')) {
        const clone = block.cloneNode(true);
        clean(clone);
        for (const element of clone.children) {
          const text = normalize(element.textContent);
          if (!text) continue;
          nodes.push({ id: `page-${index}-${nodes.length}`, tag: element.tagName.toLowerCase(), html: element.innerHTML, text });
        }
      }
      const images = [...main.querySelectorAll('.jw-image img, .jw-image-text img')].map(img => ({
        url: img.getAttribute('src') || img.getAttribute('data-src'),
        alt: img.getAttribute('alt') || '',
      }));
      const banners = [...doc.querySelectorAll('.jw-slideshow-slide-content')].map(element => ({
        url: element.style.backgroundImage.match(/url\(["']?(.*?)["']?\)$/)?.[1],
        alt: '',
      }));
      const logo = doc.querySelector('#jw-header-image, .jw-mobile-logo');
      const logoUrl = logo?.getAttribute('src') || logo?.getAttribute('srcset')?.split(',')[0].trim().split(' ')[0];
      const social = [...main.querySelectorAll('.jw-element-social-follow-profile')].map(a => ({
        label: normalize(a.querySelector('.sr-only').textContent),
        href: a.getAttribute('href'),
      }));
      const form = main.querySelector('form');
      return {
        nodes, images, banners, logo: { url: logoUrl, alt: 'Domaine du Val Pendragon' }, social,
        copyright: normalize(doc.querySelector('.jw-footer-text-content').textContent),
        form: form ? {
          fields: [...form.querySelectorAll('.jw-element-form-group')].filter(group => {
            const input = group.querySelector('input, textarea');
            return input && !group.classList.contains('hidden');
          }).map(group => ({
            label: normalize(group.querySelector('label').textContent),
            type: group.querySelector('textarea') ? 'textarea' : group.querySelector('input').type,
          })),
          submit: normalize(form.querySelector('button[type="submit"]').textContent),
        } : null,
      };
    }, { html, index });
    pages.push({ ...item, key: item.path === '/' ? 'index' : item.path.slice(1), ...content });
  }

  await mkdir(path.join(root, 'assets', 'photos'), { recursive: true });
  const assets = new Map();
  for (const item of pages.flatMap(p => [...p.images, ...p.banners, p.logo])) {
    if (!item.url) throw new Error('Une image source ne possède pas d’URL.');
    const original = new URL(item.url);
    original.search = '';
    const url = original.href;
    if (!assets.has(url)) {
      const bytes = Buffer.from(await (await download(url)).arrayBuffer());
      const filename = path.basename(original.pathname);
      const local = `assets/photos/${filename}`;
      await writeFile(path.join(root, local), bytes);
      assets.set(url, { local, sha256: createHash('sha256').update(bytes).digest('hex') });
    }
    Object.assign(item, assets.get(url), { originalUrl: url });
  }
  await writeFile(path.join(root, 'content.json'), `${JSON.stringify({
    source: origin,
    capturedAt: new Date().toISOString(),
    pages,
  }, null, 2)}\n`);
  console.log(`${pages.length} pages et ${assets.size} images originales récupérées localement.`);
  console.warn('WARN : photos binaires originales conservées sans modification ; attribution IA dans le README, pas dans les images.');
} finally {
  await browser.close();
}
