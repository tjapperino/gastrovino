/**
 * Gastrovino Rotterdam – Lokale content scraper
 *
 * Scrapet https://www.gastrovinorotterdam.nl/ met Axios + Cheerio:
 *   - Homepage           (aankondigingen, sfeer, highlights)
 *   - Over Ons           (winkelgeschiedenis, team)
 *   - Proeverijen        (evenementen, data, prijzen)
 *   - Lunch / Catering   (zakelijke diensten)
 *   - Borrelplanken      (product-overzicht + detailpagina's)
 *   - Contact            (adres, openingstijden, telefoon)
 *
 * Output: /data/rotterdam_local_content.json
 *
 * Gebruik: node src/scripts/scrape-rotterdam-local.js
 */

import axios   from 'axios';
import * as cheerioLib from 'cheerio';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const { load } = cheerioLib;

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '../../');
const BASE_URL  = 'https://www.gastrovinorotterdam.nl';

// ─── Configuratie ─────────────────────────────────────────────────────────────

const PAGES = [
  {
    id:       'homepage',
    label:    'Homepage',
    url:      '/',
    type:     'general',
  },
  {
    id:       'over-ons',
    label:    'Over Ons',
    url:      '/webshop/over-ons/',
    type:     'general',
  },
  {
    id:       'proeverijen',
    label:    'Proeverijen & High Tea',
    url:      '/webshop/webshop/wijnproeverij--high-tea/',
    type:     'products',
  },
  {
    id:       'lunch-catering',
    label:    'Lunch op het werk / Catering',
    url:      '/webshop/lunch-op-het-werk/',
    type:     'general',
  },
  {
    id:       'borrelplanken',
    label:    'Borrelplanken',
    url:      '/webshop/webshop/borrelplanken/',
    type:     'products',
  },
  {
    id:       'contact',
    label:    'Contact',
    url:      '/contact.html',
    type:     'general',
  },
];

// Throttle between requests (ms)
const THROTTLE_MS = 500;

// ─── HTTP helper ──────────────────────────────────────────────────────────────

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept':     'text/html,application/xhtml+xml',
    'Accept-Language': 'nl-NL,nl;q=0.9',
  },
});

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Tekst opruimen ──────────────────────────────────────────────────────────

function cleanText(raw) {
  return (raw ?? '')
    .replace(/\s+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Absolute URL maken van een relatieve src
function absoluteUrl(src) {
  if (!src) return null;
  if (src.startsWith('http')) return src;
  if (src.startsWith('//')) return `https:${src}`;
  return `${BASE_URL}${src.startsWith('/') ? '' : '/'}${src}`;
}

// ─── Core page parser ─────────────────────────────────────────────────────────

function parsePage($, url) {
  // ── Meta ──
  const title       = cleanText($('title').text());
  const description = cleanText($('meta[name="description"]').attr('content') ?? $('meta[property="og:description"]').attr('content') ?? '');
  const ogTitle     = cleanText($('meta[property="og:title"]').attr('content') ?? '');
  const canonical   = $('link[rel="canonical"]').attr('href') ?? url;

  // ── Headings ──
  const headings = [];
  $('h1, h2, h3, h4').each((_, el) => {
    const text = cleanText($(el).text());
    if (text) headings.push({ tag: el.tagName.toLowerCase(), text });
  });

  // ── Paragrafen (deduplicated) ──
  const seen = new Set();
  const paragraphs = [];
  $('p, .description, .product-description, article p').each((_, el) => {
    const text = cleanText($(el).text());
    if (text.length > 20 && !seen.has(text)) {
      seen.add(text);
      paragraphs.push(text);
    }
  });

  // ── Afbeeldingen ──
  const images = [];
  $('img').each((_, el) => {
    const src = absoluteUrl($(el).attr('src') ?? $(el).attr('data-src'));
    const alt = cleanText($(el).attr('alt') ?? '');
    if (src && !src.includes('pixel') && !src.endsWith('.gif')) {
      images.push({ src, alt: alt || null });
    }
  });

  // ── Interne links ──
  const links = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') ?? '';
    const text = cleanText($(el).text());
    if (href && text && !href.startsWith('javascript') && !href.startsWith('mailto') && !href.startsWith('tel')) {
      const abs = absoluteUrl(href);
      if (abs.startsWith(BASE_URL)) {
        links.push({ href: abs, text });
      }
    }
  });

  // ── Ruwe body-tekst ──
  // Verwijder scripts, styles, nav en footer voor een schone body
  $('script, style, nav, footer, .cookie-bar, .cookie-notice').remove();
  const rawText = cleanText($('body').text());

  return { title, description, ogTitle, canonical, headings, paragraphs, images, links, rawText };
}

// ─── Product parser (voor proeverijen & borrelplanken) ────────────────────────
// Shoppagina.nl structuur: div.span3.product (of span4)
//   span.name  → productnaam
//   span.desc  → korte beschrijving
//   span.price → prijs (€ 15,00)
//   a[data-background] → thumbnail-afbeelding URL (NIET via img.src!)
//   a.detail of a[href*="detail"] → productpagina URL

function parseProducts($) {
  const products = [];

  $('div.span3.product, div.span4.product, div.span2.product').each((_, el) => {
    const $el = $(el);

    const name     = cleanText($el.find('span.name').text());
    const desc     = cleanText($el.find('span.desc').text());
    const priceRaw = cleanText($el.find('span.price').first().text());
    const price    = parseFloat(priceRaw.replace(/[^0-9,]/g, '').replace(',', '.')) || null;

    // Afbeelding via data-background (lazy-load patroon van Shoppagina.nl)
    const imgBg    = $el.find('a[data-background]').attr('data-background');
    const imgSrc   = absoluteUrl(imgBg ?? $el.find('img').first().attr('src') ?? $el.find('img').first().attr('data-src'));

    // Detail-URL
    const detailHref = $el.find('a.detail, a[href*="/detail/"]').first().attr('href');

    if (name && name.length > 1) {
      products.push({
        name,
        price,
        price_display: priceRaw || null,
        description:   desc || null,
        url:           detailHref ? absoluteUrl(detailHref) : null,
        image_url:     imgSrc    || null,
      });
    }
  });

  return products;
}

// ─── Contactgegevens extraheren ───────────────────────────────────────────────
// Shoppagina.nl contact-layout: tabel met td's voor label/waarde,
// en p-tags voor adres.

function parseContact($) {
  // E-mail en telefoon zitten in tabel-cellen naast een label-cel
  const tdTexts = [];
  $('td').each((_, el) => tdTexts.push($(el).text().trim()));

  const emailIdx = tdTexts.findIndex(t => t.toLowerCase() === 'e-mail:');
  const email    = emailIdx >= 0 ? tdTexts[emailIdx + 1] ?? null : null;

  const phoneIdx = tdTexts.findIndex(t => /telefoon|tel\.|phone/i.test(t));
  // Telefoon staat soms in td zonder label — zoek direct op patroon
  const bodyText = $('body').text();
  const phoneMatch = bodyText.match(/0\d{2}[-\s]?\d{7}|0\d{9}|010[-\s]\d{7}/);
  const phone    = (phoneIdx >= 0 ? tdTexts[phoneIdx + 1] : null) ?? phoneMatch?.[0]?.trim() ?? null;

  // Adres: Shoppagina.nl zet het adres in een <p> tag
  // <br> tags produceren geen ruimte in .text() — vervang ze eerst
  let adres = null;
  $('p').each((_, el) => {
    const html = $(el).html()?.replace(/<br\s*\/?>/gi, ' ') ?? '';
    const t = cleanText(cheerioLib.load(html)('body').text());
    if (/Binnenweg|Rotterdam|\d{4}\s?[A-Z]{2}/.test(t) && t.length < 120) {
      // Zet spatie tussen huisnummer-letter en postcode-cijfers (bv. 335A3021 → 335A 3021)
      adres = t.replace(/([A-Za-z])(\d{4}\s?[A-Z]{2})/g, '$1 $2');
    }
  });

  // IBAN (staat op lunch/catering pagina)
  const ibanMatch = bodyText.match(/NL\d{2}[A-Z]{4}\d{10}/i);
  const iban = ibanMatch?.[0]?.trim() ?? null;

  // Openingstijden — vrije tekst zoeken
  const openMatch = bodyText.match(
    /(?:ma(?:andag)?|di(?:nsdag)?|wo(?:ensdag)?|do(?:nderdag)?|vr(?:ijdag)?|za(?:terdag)?|zo(?:ndag)?)[^\n.]{5,80}/gi
  );
  const openingstijden = openMatch
    ? [...new Set(openMatch.map(s => cleanText(s)).filter(s => /\d/.test(s)))]
    : [];

  return { phone, email, adres, iban, openingstijden };
}

// ─── Aankondigingen / events scraper ─────────────────────────────────────────

function parseAnnouncements($) {
  const events = [];

  // Zoek naar datumpatronen gekoppeld aan tekst
  const datePatterns = [
    /(?:maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag)?\s*\d{1,2}\s+(?:januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december)\s+\d{4}/gi,
    /\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/g,
  ];

  const fullText = $('body').text();
  datePatterns.forEach(pattern => {
    const matches = fullText.matchAll(pattern);
    for (const match of matches) {
      const dateStr = match[0].trim();
      // Pak de context rondom de datum (150 chars)
      const idx     = match.index;
      const context = cleanText(fullText.substring(Math.max(0, idx - 50), idx + 150));
      if (context.length > 10) {
        events.push({ datum: dateStr, context });
      }
    }
  });

  // Verwijder duplicaten
  const seen = new Set();
  return events.filter(e => {
    const key = e.datum + e.context.substring(0, 40);
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
}

// ─── Hoofd scrape-functie per pagina ─────────────────────────────────────────

async function scrapePage(pageConfig) {
  const fullUrl = `${BASE_URL}${pageConfig.url}`;
  console.log(`  📄 ${pageConfig.label}: ${fullUrl}`);

  let html;
  try {
    const res = await http.get(pageConfig.url);
    html = res.data;
  } catch (err) {
    console.error(`     ⚠️  Fout: ${err.message}`);
    return { ...pageConfig, error: err.message, scraped_at: new Date().toISOString() };
  }

  const $ = load(html);

  const base     = parsePage($, fullUrl);
  const contact  = pageConfig.id === 'contact' ? parseContact($) : null;
  const events   = parseAnnouncements($);
  const products = pageConfig.type === 'products' ? parseProducts($) : [];

  const result = {
    ...pageConfig,
    page_url:    fullUrl,
    scraped_at:  new Date().toISOString(),
    meta: {
      title:       base.title,
      description: base.description,
      og_title:    base.ogTitle,
      canonical:   base.canonical,
    },
    headings:    base.headings,
    paragraphs:  base.paragraphs,
    images:      base.images,
    links:       base.links,
    events:      events.length > 0 ? events : undefined,
    products:    products.length > 0 ? products : undefined,
    contact:     contact ?? undefined,
    raw_text:    base.rawText.substring(0, 3000), // eerste 3k tekens
  };

  const counts = [
    `${base.headings.length} koppen`,
    `${base.paragraphs.length} paragrafen`,
    `${base.images.length} afbeeldingen`,
    products.length > 0 ? `${products.length} producten` : null,
    events.length > 0 ? `${events.length} events` : null,
  ].filter(Boolean).join(', ');

  console.log(`     ✅ ${counts}`);
  return result;
}

// ─── Borrelplank detail scraper ───────────────────────────────────────────────

async function scrapeBorrelplankDetails(borrelplankLinks) {
  const details = [];
  for (const link of borrelplankLinks.slice(0, 5)) { // max 5 detail-pagina's
    await sleep(THROTTLE_MS);
    try {
      const res = await http.get(link.href.replace(BASE_URL, ''));
      const $   = load(res.data);
      const base = parsePage($, link.href);

      // Specifieke product-velden voor Shoppagina.nl
      const priceRaw = cleanText($('.product-price, .price, [class*="price"]').first().text());
      const price    = parseFloat(priceRaw.replace(/[^0-9,]/g, '').replace(',', '.')) || null;
      const mainImg  = absoluteUrl($('.product-image img, .main-image img, .product-detail img').first().attr('src'));

      details.push({
        url:        link.href,
        name:       link.text,
        price,
        price_display: priceRaw || null,
        meta:       base.meta,
        paragraphs: base.paragraphs,
        images:     mainImg ? [{ src: mainImg, alt: link.text }] : base.images.slice(0, 3),
        scraped_at: new Date().toISOString(),
      });
      console.log(`     📦 Detail: ${link.text} – €${price ?? '?'}`);
    } catch (err) {
      console.error(`     ⚠️  Detail-fout ${link.href}: ${err.message}`);
    }
  }
  return details;
}

// ─── Hoofdprogramma ──────────────────────────────────────────────────────────

async function main() {
  console.log('\n🏪  Gastrovino Rotterdam – lokale content scraper\n');

  const results = [];

  for (const page of PAGES) {
    const data = await scrapePage(page);
    results.push(data);
    await sleep(THROTTLE_MS);
  }

  // Borrelplank detail-pagina's
  const borrelplankPage = results.find(r => r.id === 'borrelplanken');
  // Links halen we nu uit de product-data zelf (betrouwbaarder dan de link-parser)
  const borrelLinks = (borrelplankPage?.products ?? [])
    .filter(p => p.url)
    .map(p => ({ href: p.url, text: p.name }));

  if (borrelLinks.length > 0) {
    console.log(`\n  📦 Borrelplank detail-pagina's scrapen (${Math.min(borrelLinks.length, 5)} stuks)...`);
    const details = await scrapeBorrelplankDetails(borrelLinks);
    if (borrelplankPage) borrelplankPage.product_details = details;
  }

  // ── Output samenstellen ──
  const output = {
    meta: {
      source:      BASE_URL,
      scraped_at:  new Date().toISOString(),
      total_pages: results.length,
      pages:       results.map(r => ({ id: r.id, label: r.label, url: r.page_url })),
    },
    pages: results,
  };

  // ── Opslaan ──
  const outDir  = resolve(ROOT, 'data');
  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, 'rotterdam_local_content.json');
  writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf-8');

  // ── Samenvatting ──
  console.log('\n─── Samenvatting ─────────────────────────────────────────────');
  results.forEach(r => {
    if (r.error) {
      console.log(`  ❌ ${r.label}: ${r.error}`);
    } else {
      const items = [
        r.meta?.title ? `"${r.meta.title.substring(0, 50)}"` : '',
        `${r.paragraphs?.length ?? 0} paragrafen`,
        `${r.images?.length ?? 0} afb.`,
        r.products?.length  ? `${r.products.length} producten` : '',
        r.events?.length    ? `${r.events.length} events`     : '',
      ].filter(Boolean);
      console.log(`  ✅ ${r.label}: ${items.join(' | ')}`);
    }
  });

  console.log(`\n💾  Opgeslagen in: ${outPath}`);

  // ── Content-preview ──
  console.log('\n─── Content preview ──────────────────────────────────────────');
  const overOns = results.find(r => r.id === 'over-ons');
  if (overOns?.paragraphs?.length) {
    console.log('\n📖 Over Ons tekst:');
    overOns.paragraphs.slice(0, 3).forEach(p => console.log(`  "${p}"`));
  }
  const proeverijen = results.find(r => r.id === 'proeverijen');
  if (proeverijen?.products?.length) {
    console.log('\n🍷 Proeverijen:');
    proeverijen.products.slice(0, 3).forEach(p =>
      console.log(`  • ${p.name} – ${p.price_display ?? '?'}`)
    );
  }
  const borrelplank = results.find(r => r.id === 'borrelplanken');
  if (borrelplank?.products?.length) {
    console.log('\n🍽️  Borrelplanken:');
    borrelplank.products.forEach(p =>
      console.log(`  • ${p.name} – €${p.price ?? '?'}`)
    );
  }
  const homepage = results.find(r => r.id === 'homepage');
  if (homepage?.events?.length) {
    console.log('\n📅 Gevonden aankondigingen:');
    homepage.events.slice(0, 3).forEach(e =>
      console.log(`  • ${e.datum}: ${e.context.substring(0, 80)}...`)
    );
  }

  console.log('\n🎉  Klaar!\n');
}

main().catch(err => {
  console.error('Fatale fout:', err);
  process.exit(1);
});
