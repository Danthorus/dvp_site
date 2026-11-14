// This file has been created (totally or partially) with the assistance of artificial intelligence tools.
// All content has been generated under the direct supervision of a named individual,
// and under the AI.Backbone Orchestrator Compliance framework

import { test, expect } from '@playwright/test';
import { readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = JSON.parse(await readFile(path.join(root, 'content.json'), 'utf8'));
const chapterId = page => page.key === 'index' ? 'accueil' : page.key;
const socialIntro = source.pages[0].nodes.find(n => n.text.startsWith('Suivez-nous sur les réseaux'));
const chapterNodes = item => item.nodes.filter(n => !n.text.startsWith('Suivez-nous sur les réseaux'));

for (const original of source.pages) {
  test(`${original.key} : contenu intégral, photos et responsive`, async ({ page }, testInfo) => {
    const errors = [];
    const external = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (new URL(request.url()).hostname !== '127.0.0.1') external.push(request.resourceType());
    });
    const response = await page.goto(`/#${chapterId(original)}`);
    expect(response.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('[data-chapter]')).toHaveCount(8);
    const mainMenu = page.getByRole('navigation', { name: 'Navigation principale' });
    await expect(mainMenu.getByRole('link')).toHaveText(source.pages.map(p => p.label));
    const chapter = page.locator(`[data-chapter="${original.key}"]`);
    const actual = await chapter.locator('[data-source-node]').evaluateAll(nodes => nodes.map(n => ({
      id: n.dataset.sourceNode,
      text: n.textContent.replace(/\s+/g, ' ').trim(),
    })));
    expect(actual).toEqual(chapterNodes(original).map(n => ({ id: n.id, text: n.text })));
    for (const n of chapterNodes(original)) await expect(chapter.locator(`[data-source-node="${n.id}"]`)).toBeVisible();
    const renderedPhotos = await chapter.locator('img[data-original]').evaluateAll(images => images.map(i => i.dataset.original));
    for (const photo of [...original.images, ...original.banners]) expect(renderedPhotos).toContain(photo.originalUrl);
    for (const img of await chapter.locator('img[src]').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate(element => element.complete && element.naturalWidth > 0), {
        message: `Photo non chargée : ${await img.getAttribute('src')}`,
      }).toBe(true);
    }
    if (original.key === 'index') {
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: testInfo.outputPath('accueil-desktop.png'), animations: 'disabled' });
    } else if (['une-pension-au-naturel-pour-les-chevaux', 'prestations-tarifs'].includes(original.key)) {
      await chapter.locator('.page-hero').scrollIntoViewIfNeeded();
      await page.screenshot({ path: testInfo.outputPath('chapitre-desktop.png'), animations: 'disabled' });
      if (original.key === 'une-pension-au-naturel-pour-les-chevaux') {
        await chapter.locator('.editorial').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
        await page.screenshot({ path: testInfo.outputPath('lecture-desktop.png'), animations: 'disabled' });
      }
    }
    for (const width of [312, 320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 950 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Débordement à ${width}px`).toBe(true);
      if (width > 1000) {
        for (const link of await mainMenu.getByRole('link').all()) await expect(link).toBeVisible();
      }
    }
    expect(errors).toEqual([]);
    expect(external).toEqual([]);
  });
}

test('les originaux téléchargés sont conservés sans altération', async () => {
  const unique = new Map(source.pages.flatMap(p => [...p.images, ...p.banners, p.logo]).map(p => [p.local, p]));
  for (const item of unique.values()) {
    const bytes = await readFile(path.join(root, item.local));
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(item.sha256);
  }
});

test('réseaux sociaux : une seule occurrence en haut, avec icônes desktop et mobile', async ({ page }) => {
  await page.goto('/');
  const header = page.getByRole('banner');
  const socials = header.getByRole('group', { name: 'Réseaux sociaux' });
  await expect(page.getByText(/^Suivez-nous sur les réseaux\s*:$/)).toHaveCount(1);
  await expect(socials.locator(`[data-source-node="${socialIntro.id}"]`)).toHaveText(socialIntro.text);
  for (const social of source.pages[0].social) {
    const link = page.getByRole('link', { name: social.label, exact: true });
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAttribute('href', social.href);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
  for (const width of [1440, 768, 390, 312]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(socials).toBeVisible();
    const groupBox = await socials.boundingBox();
    const headerBox = await header.boundingBox();
    expect(groupBox.x).toBeGreaterThanOrEqual(0);
    expect(groupBox.x + groupBox.width).toBeLessThanOrEqual(width);
    expect(groupBox.y + groupBox.height).toBeLessThanOrEqual(headerBox.height);
    for (const link of await socials.getByRole('link').all()) {
      await expect(link.locator('svg')).toBeVisible();
      const box = await link.boundingBox();
      expect(box.width).toBeGreaterThanOrEqual(24);
      expect(box.height).toBeGreaterThanOrEqual(24);
    }
  }
});

test('tarifs : un seul lien Renseignements après toutes les prestations', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#prestations-tarifs');
  const chapter = page.locator('[data-chapter="prestations-tarifs"]');
  const cards = chapter.locator('.price-card');
  await expect(cards).toHaveCount(9);
  await expect(cards.getByRole('link')).toHaveCount(0);
  const contactLink = chapter.getByRole('link', { name: 'Renseignements', exact: true });
  await expect(contactLink).toHaveCount(1);
  await expect(contactLink).toHaveAttribute('href', '#renseignements');
  await contactLink.scrollIntoViewIfNeeded();
  const lastCard = await cards.last().boundingBox();
  const linkBox = await contactLink.boundingBox();
  expect(linkBox.y).toBeGreaterThanOrEqual(lastCard.y + lastCard.height);
  await page.screenshot({ path: testInfo.outputPath('fin-tarifs-desktop.png'), animations: 'disabled' });
  await contactLink.click();
  await expect(page).toHaveURL(/#renseignements$/);
  await expect(page.locator('#renseignements')).toBeFocused();
});

test('menu mobile : huit ancres, focus contenu et fermeture clavier', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('.hero-crest img').evaluate(img => img.decode());
  await page.screenshot({ path: testInfo.outputPath('accueil-mobile.png'), animations: 'disabled' });
  const button = page.getByRole('button', { name: 'Ouvrir le menu' });
  await button.click();
  const menu = page.getByRole('dialog', { name: 'Toutes les pages' });
  await expect(menu).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  const nav = menu.getByRole('navigation', { name: 'Toutes les pages' });
  await expect(nav.getByRole('link')).toHaveCount(8);
  await expect(nav.getByRole('link')).toHaveText(source.pages.map(p => p.label));
  for (const item of source.pages) await expect(nav.getByRole('link', { name: item.label, exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('menu-mobile.png'), animations: 'disabled' });
  await page.keyboard.press('Shift+Tab');
  expect(await menu.evaluate(dialog => dialog.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(menu).not.toBeVisible();
  await expect(button).toBeFocused();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await button.click();
  await nav.getByRole('link', { name: 'Prestations/Tarifs' }).click();
  await expect(page).toHaveURL(/#prestations-tarifs$/);
  await expect(menu).not.toBeVisible();
  await expect(page.locator('#prestations-tarifs')).toBeFocused();
  await expect.poll(() => page.locator('#prestations-tarifs').evaluate(section => {
    const top = section.getBoundingClientRect().top;
    return top >= document.querySelector('.site-header').offsetHeight && top < document.querySelector('.site-header').offsetHeight + 40;
  })).toBe(true);
});

test('photos : galerie limitée au chapitre, originaux et restitution du focus', async ({ page }) => {
  await page.goto('/#une-experience-authentique-et-sportive-pour-les-cavaliers');
  const chapter = page.locator('[data-chapter="une-experience-authentique-et-sportive-pour-les-cavaliers"]');
  const first = chapter.locator('[data-lightbox]').first();
  const original = await first.getAttribute('href');
  await first.click();
  const dialog = page.getByRole('dialog', { name: 'Photo agrandie' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('figure img')).toHaveAttribute('src', new URL(original, page.url()).href);
  await expect(dialog.locator('figcaption')).toContainText('1 / 5');
  await page.keyboard.press('ArrowRight');
  await expect(dialog.locator('figcaption')).toContainText('2 / 5');
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
  await expect(dialog.locator('figcaption')).toContainText('5 / 5');
  await expect(dialog.locator('figure img')).toHaveAttribute('src', new URL(await chapter.locator('[data-lightbox]').last().getAttribute('href'), page.url()).href);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(first).toBeFocused();
});

test('contact : validation, brouillon encodé et aucun envoi silencieux', async ({ page }) => {
  const requests = [];
  page.on('request', request => { if (request.method() === 'POST') requests.push(request.url()); });
  await page.goto('/#renseignements');
  const submit = page.getByRole('button', { name: 'Envoyer le formulaire' });
  await submit.click();
  await expect(page.locator('.form-result')).toBeHidden();
  await page.getByLabel('Nom *', { exact: true }).fill('Cavalier test');
  await page.getByLabel('Adresse e-mail *', { exact: true }).fill('user@example.com');
  await page.getByLabel('Message *', { exact: true }).fill('Bonjour, une visite & un essai ?\nMerci !');
  await submit.click();
  await expect(page.getByRole('status')).toContainText('Aucun message n’a été envoyé.');
  const draft = page.getByRole('link', { name: 'Ouvrir mon application de messagerie' });
  const url = new URL(await draft.getAttribute('href'));
  expect(url.protocol).toBe('mailto:');
  expect(url.searchParams.get('body')).toContain('Bonjour, une visite & un essai ?\nMerci !');
  expect(url.searchParams.get('body')).toContain('user@example.com');
  await expect(draft).toBeFocused();
  await page.getByLabel('Message *', { exact: true }).fill('Demande modifiée');
  await expect(page.locator('.form-result')).toBeHidden();
  expect(requests).toEqual([]);
});

test('les huit chapitres restent lisibles et accessibles sans JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4179/');
  await expect(page.locator('h1')).toBeVisible();
  for (const original of source.pages) {
    await expect(page.locator(`[data-chapter="${original.key}"] [data-source-node]`)).toHaveCount(chapterNodes(original).length);
  }
  const nav = page.getByRole('navigation', { name: 'Navigation de pied de page' });
  await expect(nav.getByRole('link')).toHaveText(source.pages.map(p => p.label));
  await nav.getByRole('link', { name: 'L’élevage', exact: true }).click();
  await expect(page).toHaveURL(/#l-elevage$/);
  expect(await page.locator('#l-elevage').evaluate(section => section.getBoundingClientRect().top)).toBeLessThan(250);
  await context.close();
});

test('mouvement réduit, changement de préférence et ressources HTTP', async ({ page, request }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.locator('html').evaluate(html => getComputedStyle(html).scrollBehavior)).toBe('auto');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');
  await expect(page.getByRole('button', { name: 'Animations réduites selon vos préférences' })).toBeDisabled();
  expect(await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length)).toBe(0);
  await page.locator('.intro-copy').scrollIntoViewIfNeeded();
  expect(await page.locator('.intro-copy').evaluate(element => element.getAnimations().length)).toBe(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.getByRole('button', { name: 'Mettre les animations en pause' })).toBeEnabled();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'active');
  expect((await request.get('/page-absente.html')).status()).toBe(404);
  expect((await request.get('/content.json')).status()).toBe(403);
});

test('HTML autonome et anciennes adresses vers les bons chapitres', async ({ page }) => {
  await page.goto(pathToFileURL(path.join(root, 'index.html')).href);
  await expect(page.locator('h1')).toContainText('Offrez-vous la légende');
  await page.getByRole('navigation', { name: 'Navigation principale' }).getByRole('link', { name: 'Prestations/Tarifs' }).click();
  await expect(page).toHaveURL(/^file:.*index\.html#prestations-tarifs$/);
  await expect(page.locator('.price-card')).toHaveCount(9);
  await page.goto(pathToFileURL(path.join(root, 'l-elevage.html')).href);
  await expect(page).toHaveURL(/^file:.*index\.html#l-elevage$/);
  for (const original of source.pages.slice(1)) {
    await page.goto(`/${original.key}.html`);
    await expect(page).toHaveURL(new RegExp(`/index\\.html#${chapterId(original)}$`));
    await expect(page.locator(`[data-chapter="${original.key}"]`)).toBeVisible();
  }
});

test('menu supérieur : navigation continue, ancres uniques et rubrique active', async ({ page }) => {
  const documents = [];
  page.on('request', request => { if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents.push(request.url()); });
  await page.goto('/');
  const menu = page.getByRole('navigation', { name: 'Navigation principale' });
  await expect(menu.getByRole('link')).toHaveText(source.pages.map(p => p.label));
  await page.getByRole('button', { name: 'Mettre les animations en pause' }).click();
  for (const original of source.pages) {
    const link = menu.getByRole('link', { name: original.label, exact: true });
    await link.click();
    await expect(page).toHaveURL(new RegExp(`#${chapterId(original)}$`));
    await expect(link).toHaveAttribute('aria-current', 'location');
    await expect(menu.locator('[aria-current]')).toHaveCount(1);
    const box = await link.boundingBox();
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThan(250);
  }
  expect(documents).toHaveLength(1);
  const missingAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.map(a => a.hash.slice(1)).filter(id => !document.getElementById(id)));
  expect(missingAnchors).toEqual([]);
  const duplicateIds = await page.locator('[id]').evaluateAll(elements => {
    const ids = elements.map(e => e.id);
    return ids.filter((id, i) => ids.indexOf(id) !== i);
  });
  expect(duplicateIds).toEqual([]);
  const localLinks = await page.locator('a[href]').evaluateAll(links => links.map(a => a.getAttribute('href')).filter(href => !/^(https?:|mailto:|tel:|#)/.test(href)));
  for (const link of new Set(localLinks)) await access(path.join(root, link));
});

test('guide minimaliste : bord gauche, intitulés au focus et suivi de lecture', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const guide = page.getByRole('navigation', { name: 'Repères de lecture' });
  await expect(guide.getByRole('link')).toHaveCount(8);
  await expect(page.getByText('Au fil de ce chapitre', { exact: true })).toHaveCount(0);
  const pension = guide.getByRole('link', { name: source.pages[1].label, exact: true });
  await expect(pension.locator('.guide-label')).toBeHidden();
  await page.keyboard.press('Tab');
  await pension.focus();
  await expect(pension.locator('.guide-label')).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#une-pension-au-naturel-pour-les-chevaux$/);
  await expect(pension).toHaveAttribute('aria-current', 'location');
  await page.locator('#l-elevage').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await expect(guide.getByRole('link', { name: 'L’élevage', exact: true })).toHaveAttribute('aria-current', 'location');
  await expect(guide.locator('[aria-current]')).toHaveCount(1);
  for (const width of [1440, 390, 312]) {
    await page.setViewportSize({ width, height: 844 });
    const box = await guide.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(36);
    expect(box.y).toBeGreaterThan(await page.locator('.site-header').evaluate(element => element.offsetHeight));
    expect(box.y + box.height).toBeLessThan(844);
    expect(await guide.evaluate(element => getComputedStyle(element).position)).toBe('fixed');
  }
});

test('textes explicatifs : lecture agrandie sur ordinateur et mobile', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const copy = page.locator('.hero-description, .intro-copy > p, .article-section p, .article-section li, .price-details, .sale-copy p, .contact-details p');
  for (const [width, minimum] of [[1440, 18], [390, 16], [312, 16]]) {
    await page.setViewportSize({ width, height: 844 });
    const sizes = await copy.evaluateAll(elements => elements.map(element => parseFloat(getComputedStyle(element).fontSize)));
    expect(sizes.length).toBeGreaterThan(0);
    expect(Math.min(...sizes), `Taille de lecture à ${width}px`).toBeGreaterThanOrEqual(minimum);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 390) {
      await page.locator('[data-chapter="une-pension-au-naturel-pour-les-chevaux"] .editorial').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.screenshot({ path: testInfo.outputPath('lecture-mobile.png'), animations: 'disabled' });
    }
  }
});

test('fond photographique réellement fixe pendant le défilement, desktop et mobile', async ({ page }) => {
  await page.goto('/');
  const background = page.locator('.forest-backdrop');
  expect(await background.evaluate(element => getComputedStyle(element).backgroundImage)).toContain('fccbb2f1');
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    const before = await background.boundingBox();
    const chapterTop = await page.locator('#une-pension-au-naturel-pour-les-chevaux').evaluate(e => e.getBoundingClientRect().top);
    await page.evaluate(() => scrollTo({ top: 1500, behavior: 'instant' }));
    expect(await background.boundingBox()).toEqual(before);
    expect(await background.evaluate(element => getComputedStyle(element).position)).toBe('fixed');
    expect(await page.locator('#une-pension-au-naturel-pour-les-chevaux').evaluate(e => e.getBoundingClientRect().top)).toBe(chapterTop - 1500);
  }
});

test('brume animée, pause globale et apparitions douces', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const mist = page.locator('.ambient-mist');
  const firstFrame = await mist.evaluate(element => getComputedStyle(element).transform);
  await expect.poll(() => mist.evaluate(element => getComputedStyle(element).transform)).not.toBe(firstFrame);
  await page.getByRole('button', { name: 'Mettre les animations en pause' }).click();
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length)).toBe(0);
  await expect(page.locator('h1')).toBeVisible();
  await page.getByRole('button', { name: 'Reprendre les animations' }).click();
  const intro = page.locator('.intro-copy');
  await intro.scrollIntoViewIfNeeded();
  await expect.poll(() => intro.evaluate(element => element.getAnimations().length)).toBeGreaterThan(0);
  expect(await intro.evaluate(element => getComputedStyle(element).transform)).not.toBe('none');
  await expect.poll(() => intro.evaluate(element => element.getAnimations().length)).toBe(0);
  expect(await intro.evaluate(element => getComputedStyle(element).opacity)).toBe('1');
});
