// This file has been created (totally or partially) with the assistance of artificial intelligence tools.
// All content has been generated under the direct supervision of a named individual,
// and under the AI.Backbone Orchestrator Compliance framework

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const { pages } = JSON.parse(await readFile(path.join(root, 'content.json'), 'utf8'));
const disclaimer = `<!--
This file has been created (totally or partially) with the assistance of artificial intelligence tools.
All content has been generated under the direct supervision of a named individual,
and under the AI.Backbone Orchestrator Compliance framework
-->`;
const escape = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.5"/></svg>';
const ornament = '<span class="ornament" aria-hidden="true">◇</span>';
const socialIcons = {
  Facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor"/><path d="M13 22v-9h3l.5-3H13V8.5c0-1 .4-1.5 1.5-1.5H17V4h-3c-3 0-5 1.8-5 4.5V10H7v3h2v9z" fill="var(--night)"/></svg>',
  Instagram: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
};
const sectionId = item => item.key === 'index' ? 'accueil' : item.key;
const href = item => `#${sectionId(item)}`;
const home = pages[0];
const contact = pages.at(-1);
const heroPhoto = home.banners[0];
const forestPhoto = pages[2].images[0];
const node = (item, tag = item.tag, className = '', html = item.html) =>
  `<${tag} data-source-node="${item.id}"${className ? ` class="${className}"` : ''}>${html.replace(/^(\s*<br\s*\/?>)+/i, '')}</${tag}>`;
const bodyNodes = item => item.nodes.filter(n => !n.text.startsWith('Suivez-nous sur les réseaux'));
const socialNode = item => item.nodes.find(n => n.text.startsWith('Suivez-nous sur les réseaux'));

function image(item, label, className = '') {
  return `<a class="photo ${className}" href="${escape(item.local)}" data-lightbox aria-label="Agrandir : ${escape(item.alt || label)}">
    <img src="${escape(item.local)}" alt="${escape(item.alt || label)}" data-original="${escape(item.originalUrl)}" loading="lazy" decoding="async">
    <span class="photo-zoom" aria-hidden="true">+</span>
  </a>`;
}

function crest(className = '') {
  return `<span class="crest ${className}"><img src="${home.logo.local}" alt="" decoding="async"></span>`;
}

function socialLinks() {
  return home.social.map(s => {
    const icon = socialIcons[s.label];
    if (!icon) throw new Error(`Icône de réseau social manquante : ${s.label}`);
    return `<a href="${escape(s.href)}" aria-label="${escape(s.label)}" target="_blank" rel="noopener noreferrer">${icon}</a>`;
  }).join('');
}

function header() {
  return `<a class="skip-link" href="#contenu">Passer au contenu principal</a>
  <header class="site-header">
    <div class="header-top">
      <a class="brand" href="#accueil" aria-label="Domaine du Val Pendragon — Accueil">${crest()}<span>Domaine du<strong>Val Pendragon</strong></span></a>
      <div class="header-social" role="group" aria-label="Réseaux sociaux">${node(socialNode(home), 'p')}<div class="social-links">${socialLinks()}</div></div>
      <div class="header-actions">
        <span class="site-location">Muel <span aria-hidden="true">·</span> Forêt de Brocéliande</span>
        <button class="motion-toggle" type="button" aria-label="Mettre les animations en pause" aria-pressed="false"><span aria-hidden="true">◇</span><span>Animations</span></button>
        <button class="menu-toggle" type="button" aria-label="Ouvrir le menu" aria-haspopup="dialog" aria-controls="navigation" aria-expanded="false"><span>Menu</span><i aria-hidden="true"></i></button>
      </div>
    </div>
    <nav class="desktop-nav" aria-label="Navigation principale">
      ${pages.map((item, index) => `<a href="${href(item)}" data-chapter-link${index === 0 ? ' aria-current="location"' : ''}><span>${escape(item.label)}</span></a>`).join('')}
    </nav>
    <div class="reading-progress" aria-hidden="true"><span></span></div>
  </header>
  <dialog id="navigation" class="navigation-panel" aria-label="Toutes les pages">
    <div class="panel-top"><span class="eyebrow">Domaine du Val Pendragon</span><button type="button" data-close-menu class="close-button" aria-label="Fermer le menu">×</button></div>
    <nav aria-label="Toutes les pages">${pages.map((item, index) => `<a href="${href(item)}" aria-label="${escape(item.label)}" data-chapter-link${index === 0 ? ' aria-current="location"' : ''}><span>${escape(item.label)}</span>${arrow}</a>`).join('')}</nav>
  </dialog>`;
}

function readingGuide() {
  return `<nav class="reading-guide" aria-label="Repères de lecture">${pages.map((item, index) => `<a href="${href(item)}" aria-label="${escape(item.label)}" data-chapter-link${index === 0 ? ' aria-current="location"' : ''}><span class="guide-label" aria-hidden="true">${escape(item.label)}</span></a>`).join('')}</nav>`;
}

function footer() {
  return `<footer class="site-footer section-wrap">
    <div class="footer-top"><a class="footer-brand" href="#accueil">${crest()}<span>Domaine du<br><em>Val Pendragon</em></span></a><span class="footer-motto">Au cœur de Brocéliande</span><a class="footer-contact" href="${href(contact)}">Accueil sur rendez-vous ${arrow}</a></div>
    <div class="footer-middle"><nav aria-label="Navigation de pied de page">${pages.map(p => `<a href="${href(p)}">${escape(p.label)}</a>`).join('')}</nav></div>
    <div class="footer-bottom"><span>${escape(home.copyright)}</span><a href="#accueil">Retour en haut ↑</a></div>
  </footer>`;
}

function lightbox() {
  return `<dialog class="lightbox" id="lightbox" aria-label="Photo agrandie">
    <button class="lightbox-close close-button" type="button" data-close-lightbox aria-label="Fermer la photo">×</button>
    <button class="lightbox-prev" type="button" aria-label="Photo précédente">←</button>
    <figure><img alt=""><figcaption aria-live="polite"></figcaption></figure>
    <button class="lightbox-next" type="button" aria-label="Photo suivante">→</button>
  </dialog>`;
}

function homePage() {
  const nodes = bodyNodes(home);
  const title = nodes[1].html.replace('Offrez-vous la légende', '<span>Offrez-vous</span> <em>la légende</em>').replace('au Domaine du Val Pendragon!', '<span class="hero-name">au Domaine du Val Pendragon!</span>');
  return `<section class="home-hero" aria-label="${escape(nodes[1].text)}">
    <div class="hero-frame" aria-hidden="true"></div>
    <span class="hero-side-note" aria-hidden="true">Un domaine. Une histoire. Une légende.</span>
    <div class="hero-content">${node(nodes[0], 'p', 'eyebrow hero-eyebrow')}${crest('hero-crest')}
      ${node({ ...nodes[1], html: title }, 'h1', 'home-title')}
      <div class="heraldic-divider" aria-hidden="true">${ornament}</div>
      ${node(nodes[2], 'p', 'hero-description')}
      <a class="button" href="#le-domaine">Entrer dans le domaine</a>
    </div>
    <div class="hero-bottom"><span>Muel · Brocéliande</span><a href="#le-domaine" aria-label="Découvrir le domaine"><span class="scroll-line" aria-hidden="true"></span>Faire défiler</a><span>23 hectares de nature</span></div>
  </section>
  <div class="home-intro section-wrap" id="le-domaine">
    <div class="intro-copy"><span class="eyebrow">Le domaine · Brocéliande</span>${node(nodes[3], 'p', 'intro-lead')}${nodes.slice(4).map(n => node(n)).join('')}<a class="text-link" href="${href(pages[1])}">${pages[1].label}${arrow}</a></div>
    ${image(heroPhoto, 'Les chevaux dans les prairies du Domaine du Val Pendragon', 'intro-photo')}
  </div>`;
}

function pageHero(current, nodes, useTagline = true) {
  const isContact = current === contact;
  const sourceImage = current.images[0] || heroPhoto;
  const tagline = useTagline && nodes[1]?.tag === 'p' && nodes[1].html.startsWith('<strong>') ? nodes[1] : null;
  return {
    used: tagline ? 2 : 1,
    html: `<div class="chapter-divider section-wrap" aria-hidden="true"><span></span><i>◇</i><span></span></div>
    <div class="page-hero section-wrap${isContact ? ' contact-hero' : ''}">
      <div class="page-hero-copy"><span class="eyebrow">Domaine du Val Pendragon</span>
        ${node(nodes[0], 'h2', 'page-title')}${tagline ? node(tagline, 'p', 'page-tagline') : ''}
        ${isContact ? node(nodes[1], 'p', 'appointment-label') : ''}
      </div>
      ${image(sourceImage, current.label, 'page-hero-photo')}
    </div>`,
  };
}

function chapters(nodes) {
  const sections = [];
  for (const n of nodes) {
    if (/^h[2-6]$/.test(n.tag)) sections.push({ heading: n, nodes: [] });
    else {
      if (!sections.length) sections.push({ heading: null, nodes: [] });
      sections.at(-1).nodes.push(n);
    }
  }
  return sections;
}

function editorial(current) {
  const nodes = bodyNodes(current);
  const hero = pageHero(current, nodes, current.key !== 'qui-sommes-nous');
  const groups = chapters(nodes.slice(hero.used));
  const extras = current.images.slice(1);
  return `${hero.html}<div class="editorial section-wrap" id="${sectionId(current)}-details">
    <div class="article-body">${groups.map((group, i) => `<section class="article-section"${group.heading ? ` id="${group.heading.id}"` : ''}>
      ${group.heading ? node(group.heading, 'h3') : ''}
      ${group.nodes.map(n => node(n)).join('')}
      ${extras[i] ? image(extras[i], `${current.label} — photo ${i + 2}`, 'article-photo') : ''}
    </section>`).join('')}
    ${extras.slice(groups.length).length ? `<div class="gallery-grid">${extras.slice(groups.length).map((p, i) => image(p, `${current.label} — photo ${groups.length + i + 2}`)).join('')}</div>` : ''}
    </div></div>`;
}

function pricing(current) {
  const nodes = bodyNodes(current);
  const hero = pageHero(current, nodes);
  return `${hero.html}<section class="pricing-grid section-wrap" id="${sectionId(current)}-details" aria-label="Prestations et tarifs">
    ${chapters(nodes.slice(hero.used)).map(group => `<article class="price-card">
      ${node(group.heading, 'h3')}
      ${group.nodes.map((n, i) => node(n, n.tag, i === 0 ? 'price' : 'price-details')).join('')}
    </article>`).join('')}</section>
    <div class="pricing-contact section-wrap"><a class="button" href="${href(contact)}">${contact.label}${arrow}</a></div>`;
}

function sale(current) {
  const nodes = bodyNodes(current);
  const hero = pageHero(current, nodes, false);
  return `${hero.html}<div class="sale-section section-wrap" id="${sectionId(current)}-details">
    <div class="sale-photo">${image(current.images[0], 'Origin Val Pendragon dans sa prairie')}</div>
    <div class="sale-copy">${nodes.slice(1).map((n, index) => node(n, /^h/.test(n.tag) ? 'h3' : 'p', index === 0 ? 'eyebrow' : index === 1 ? 'horse-name' : index === nodes.length - 2 ? 'horse-price' : '')).join('')}<a class="button" href="${href(contact)}">${contact.label}${arrow}</a></div>
    </div><div class="panorama section-wrap">${image(current.banners[0], 'Les grandes prairies du Domaine du Val Pendragon')}</div>`;
}

function contactPage(current) {
  const nodes = bodyNodes(current);
  const hero = pageHero(current, nodes, false);
  const formHeading = nodes.find(n => n.text === 'Formulaire de contact:');
  const emailNode = nodes.find(n => n.html.includes('mailto:'));
  const emailMatch = emailNode.html.match(/href="mailto:([^"]+)"/);
  if (!emailMatch) throw new Error('Adresse de contact source introuvable.');
  const groups = chapters(nodes.slice(2).filter(n => n !== formHeading));
  return `${hero.html}<div class="contact-section section-wrap" id="${sectionId(current)}-details">
    <div class="contact-details">${groups.map((group, i) => `<section>${node(group.heading, 'h3')}${group.nodes.map(n => {
      if (n.text.startsWith('Tel:')) {
        const number = n.text.slice(4).trim().replace(/\s/g, '');
        return node(n, 'p', '', `<a href="tel:${number}">${n.html}</a>`);
      }
      return node(n);
    }).join('')}${i === 0 ? '<a class="text-link" href="https://www.google.com/maps/search/?api=1&amp;query=Domaine+du+Val+Pendragon+Muel" target="_blank" rel="noopener noreferrer">Ouvrir l’itinéraire ↗</a>' : ''}</section>`).join('')}</div>
    <div class="contact-form-wrap">${node(formHeading, 'h3')}
      <form class="contact-form" data-recipient="${escape(emailMatch[1])}">
        ${current.form.fields.map((field, i) => `<div class="form-field"><label for="contact-${i}">${escape(field.label)}</label>${field.type === 'textarea' ? `<textarea id="contact-${i}" name="message" rows="6" required maxlength="5000"></textarea>` : `<input id="contact-${i}" name="${i === 0 ? 'name' : 'email'}" type="${field.type}" autocomplete="${i === 0 ? 'name' : 'email'}" required maxlength="${i === 0 ? 120 : 254}">`}</div>`).join('')}
        <p class="form-note" id="form-help">Ce formulaire prépare un e-mail dans votre application de messagerie. Aucun message n’est envoyé automatiquement.</p>
        <button class="button" type="submit" aria-describedby="form-help">${escape(current.form.submit)}${arrow}</button>
        <div class="form-result" hidden role="status"><p>Aucun message n’a été envoyé. Ouvrez votre messagerie pour vérifier et envoyer votre demande.</p><a class="text-link" data-mail-draft>Ouvrir mon application de messagerie ${arrow}</a></div>
        <noscript><p>Pour nous écrire, utilisez le lien Mail ci-contre ou le formulaire du site d’origine.</p></noscript>
      </form>
      <a class="original-form" href="https://domaine-du-val-pendragon.webador.fr/renseignements" target="_blank" rel="noopener noreferrer">Utiliser le formulaire du site d’origine ↗</a>
    </div>
  </div>`;
}

const content = pages.map((current, index) => {
  const chapter = index === 0 ? homePage()
    : current === contact ? contactPage(current)
      : current.key === 'prestations-tarifs' ? pricing(current)
        : current.key === 'a-vendre' ? sale(current)
          : editorial(current);
  return `<section id="${sectionId(current)}" class="chapter chapter-${current.key}" data-chapter="${current.key}" tabindex="-1" aria-label="${escape(current.label)}">
    ${chapter}
  </section>`;
}).join('\n');

const title = 'Domaine du Val Pendragon — Au cœur de Brocéliande';
const description = home.nodes[2].text;
await writeFile(path.join(root, 'index.html'), `<!doctype html>
${disclaimer}
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0b1512">
  <meta name="description" content="${escape(description)}">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="fr_FR">
  <title>${escape(title)}</title>
  <link rel="icon" href="${home.logo.local}" type="image/png">
  <link rel="preload" href="${forestPhoto.local}" as="image">
  <link rel="stylesheet" href="assets/style.css">
  <script src="assets/site.js" defer></script>
</head>
<body id="haut">
  <div class="forest-backdrop" aria-hidden="true"></div>
  <div class="ambient-mist" aria-hidden="true"></div>
  ${header()}
  ${readingGuide()}
  <main id="contenu">${content}</main>
  ${footer()}
  ${lightbox()}
</body>
</html>
`);

for (const current of pages.slice(1)) {
  const target = `index.html${href(current)}`;
  await writeFile(path.join(root, `${current.key}.html`), `<!doctype html>
${disclaimer}
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=${target}"><title>${escape(current.label)} — Domaine du Val Pendragon</title></head>
<body><p><a href="${target}">${escape(current.label)} — Rejoindre ce chapitre</a></p></body></html>
`);
}
console.log('Une page HTML complète, huit chapitres et sept anciennes adresses compatibles. Aucun contenu chargé dynamiquement.');
