/**
 * Gastrovino webshop scraper (gastrovinoshop.nl)
 *
 * De webshop is een Magento 1.x store met een AngularJS frontend.
 * Producten worden client-side gerenderd, daarom gebruiken we Playwright.
 *
 * Output: /data/scraped_products.json conform het blueprint-schema.
 *
 * Gebruik:
 *   npm run scrape              # alle categorieën
 *   npm run scrape -- --cat rode-wijn  # één categorie (voor testen)
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../../');

// ─── Configuratie ────────────────────────────────────────────────────────────

const BASE_URL = 'https://www.gastrovinoshop.nl';

const CATEGORIES = [
  { slug: 'rode-wijn',              label: 'Rode wijn' },
  { slug: 'witte-wijn',             label: 'Witte wijn' },
  { slug: 'rose',                   label: 'Rosé' },
  { slug: 'mousserend',             label: 'Mousserend' },
  { slug: 'port',                   label: 'Port' },
  { slug: 'zoete-en-dessertwijn',   label: 'Zoete en dessertwijn' },
  { slug: 'biologische-wijn',       label: 'Biologische wijn' },
  { slug: 'alcoholvrije-wijn',      label: 'Alcoholvrije wijn' },
];

// Maximaal aantal producten per pagina om te verzoeken bij Magento
const PRODUCTS_PER_PAGE = 96;

// Vertraging tussen detail-page requests om de server te ontzien (ms)
const THROTTLE_MS = 400;

// ─── Hulpfuncties ────────────────────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Wacht tot AngularJS klaar is met renderen.
 * Valt terug op een vaste timeout als Angular niet detecteerbaar is.
 */
async function waitForAngular(page) {
  try {
    await page.waitForFunction(
      () => {
        const el = document.querySelector('[ng-app]') || document.querySelector('[data-ng-app]');
        if (!el) return true; // geen Angular-app gevonden, gaan we door
        const injector = window.angular?.element(el)?.injector?.();
        if (!injector) return false;
        const $http = injector.get('$http');
        return $http.pendingRequests.length === 0;
      },
      { timeout: 15_000 }
    );
  } catch {
    // Fallback: wacht tot er geen `{{` meer in de DOM zit
    await page.waitForFunction(
      () => !document.body.innerText.includes('{{'),
      { timeout: 10_000 }
    ).catch(() => {}); // als het niet lukt, gaan we toch verder
  }
}

/**
 * Haalt alle productlinks op van één categoriepagina.
 * Retourneert { links: string[], hasNextPage: boolean, nextPageUrl: string|null }
 */
async function scrapeListPage(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await waitForAngular(page);

  // Geef Angular nog even de tijd om ng-repeat-elementen in de DOM te zetten
  await page.waitForTimeout(1500);

  // Probeer product-links te vinden via meerdere selector-strategieën
  const links = await page.evaluate(() => {
    const found = new Set();

    // Strategie 1: ankertags binnen ng-repeat items
    document.querySelectorAll('[ng-repeat] a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (href && !href.startsWith('#') && !href.includes('/category/')) {
        found.add(href.startsWith('http') ? href : window.location.origin + href);
      }
    });

    // Strategie 2: .product-name links (standaard Magento 1.x)
    document.querySelectorAll('.product-name a, h2.product-name a, a.product-name').forEach((a) => {
      const href = a.getAttribute('href');
      if (href) found.add(href.startsWith('http') ? href : window.location.origin + href);
    });

    // Strategie 3: .item .product-item a (veelvoorkomende Magento-patroon)
    document.querySelectorAll('.item a[href], .product-item a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (href && !href.includes('?') && href.includes('.html')) {
        found.add(href.startsWith('http') ? href : window.location.origin + href);
      }
    });

    return [...found];
  });

  // Zoek paginering
  const nextPageUrl = await page.evaluate((base) => {
    const next = document.querySelector('a.next, a[title="Volgende"], .pages a[rel="next"]');
    if (!next) return null;
    const href = next.getAttribute('href');
    return href ? (href.startsWith('http') ? href : base + href) : null;
  }, BASE_URL);

  return { links, nextPageUrl };
}

/**
 * Haalt alle productdetails op van één productpagina.
 * Retourneert een object conform het blueprint-schema.
 */
async function scrapeDetailPage(page, url, categoryLabel) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await waitForAngular(page);
  await page.waitForTimeout(800);

  const product = await page.evaluate((catLabel) => {
    // ── Naam ──────────────────────────────────────────────────────────────
    const nameEl =
      document.querySelector('h1.product-name') ||
      document.querySelector('h1[itemprop="name"]') ||
      document.querySelector('.product-essential h1') ||
      document.querySelector('h1');
    const name = nameEl?.innerText?.trim() ?? null;

    // ── Prijs (incl. BTW) ─────────────────────────────────────────────────
    // gastrovinoshop.nl structuur: div.price-box > span.price-including-tax > span.price
    const priceEl =
      document.querySelector('.price-including-tax .price') ||
      document.querySelector('.price-box .price-including-tax') ||
      document.querySelector('[itemprop="price"]') ||
      document.querySelector('.special-price .price') ||
      document.querySelector('.regular-price .price') ||
      document.querySelector('.price-box');
    const priceRaw = priceEl?.innerText?.trim() ?? '';
    const price = parseFloat(priceRaw.replace(/[^0-9,]/g, '').replace(',', '.')) || null;

    // ── Afbeelding ────────────────────────────────────────────────────────
    const imgEl =
      document.querySelector('#image-main img') ||
      document.querySelector('.product-image img') ||
      document.querySelector('[itemprop="image"]') ||
      document.querySelector('.gallery-image img') ||
      document.querySelector('.product-img-box img');
    const imageUrl = imgEl?.getAttribute('src') ?? imgEl?.getAttribute('data-src') ?? null;

    // ── SKU (Magento biedt geen itemprop="sku"; afleiden van URL) ─────────
    const sku = null; // wordt na evaluate ingevuld op basis van URL-pad

    // ── Beschrijving ──────────────────────────────────────────────────────
    const descEl =
      document.querySelector('[itemprop="description"]') ||
      document.querySelector('.product-description') ||
      document.querySelector('#description');
    const description = descEl?.innerText?.trim() ?? null;

    // ── Specificaties via #product-attribute-specs-table ──────────────────
    // Magento structuur: <table id="product-attribute-specs-table">
    //   <tr class="wijn_land"><th>Land</th><td>Chili</td></tr>
    const specs = {};
    document.querySelectorAll('#product-attribute-specs-table tr').forEach((row) => {
      const th = row.querySelector('th');
      const td = row.querySelector('td');
      if (th && td) {
        const key = th.innerText.trim().toLowerCase().replace(/[&\s]+/g, '_');
        const val = td.innerText.trim();
        if (key && val) specs[key] = val;
      }
    });

    // ── Smaaktags: afleiden uit specs + meta keywords ─────────────────────
    const gastronomy_tags = [];
    const smaakRaw = specs['smaak'] ?? specs['teaser'] ?? '';
    smaakRaw.split(/[,\s]+/).forEach((word) => {
      const t = word.toLowerCase().trim();
      if (t.length > 2) gastronomy_tags.push(t);
    });
    // meta keywords bevatten wijnstijl, druif, land etc.
    const kwMeta = document.querySelector('meta[name="keywords"]');
    if (kwMeta) {
      kwMeta.content.split(',').forEach((kw) => {
        const t = kw.trim().toLowerCase();
        if (t.length > 2 && !gastronomy_tags.includes(t)) gastronomy_tags.push(t);
      });
    }

    return { name, price, imageUrl, sku, description, specs, gastronomy_tags, catLabel };
  }, categoryLabel);

  if (!product.name) return null; // pagina niet correct geladen

  // Afleiden van het blueprint-schema
  const slug = slugify(product.name);
  // SKU afleiden van het laatste URL-segment (Magento URL-keys zijn uniek per product)
  const urlSegments = new URL(page.url()).pathname.replace(/\.html$/, '').split('/').filter(Boolean);
  const urlKey = urlSegments[urlSegments.length - 1];
  const skuFinal = `GV-${urlKey.toUpperCase().replace(/[^A-Z0-9-]/g, '')}`;

  return {
    sku:              skuFinal,
    name:             product.name,
    slug,
    source:           'LANDELIJK',
    price_fysiek:     null,  // wordt ingevuld met lokale Rotterdamse data
    price_online:     product.price,
    stock_rotterdam:  null,  // wordt ingevuld vanuit POS-koppeling
    is_local_hero:    false,
    gastronomy_tags:  product.gastronomy_tags,
    category:         product.catLabel,
    image_url:        product.imageUrl,
    description:      product.description,
    specs:            product.specs,
    source_url:       page.url(),
    scraped_at:       new Date().toISOString(),
  };
}

// ─── Hoofdprogramma ──────────────────────────────────────────────────────────

async function main() {
  // Optioneel: één categorie testen via CLI-argument --cat <slug>
  const args = process.argv.slice(2);
  const catArgIdx = args.indexOf('--cat');
  const selectedCat = catArgIdx !== -1 ? args[catArgIdx + 1] : null;

  const categoriesToScrape = selectedCat
    ? CATEGORIES.filter((c) => c.slug === selectedCat)
    : CATEGORIES;

  if (categoriesToScrape.length === 0) {
    console.error(`Categorie '${selectedCat}' niet gevonden. Beschikbaar: ${CATEGORIES.map((c) => c.slug).join(', ')}`);
    process.exit(1);
  }

  console.log(`\n🍷  Gastrovino scraper gestart`);
  console.log(`📦  Categorieën: ${categoriesToScrape.map((c) => c.label).join(', ')}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'nl-NL',
  });
  const page = await context.newPage();

  // Blokkeer onnodige resources om sneller te gaan
  await page.route('**/*.{png,jpg,jpeg,gif,svg,woff,woff2,ttf,eot}', (route) => route.abort());
  await page.route('**/google-analytics.com/**', (route) => route.abort());
  await page.route('**/googletagmanager.com/**', (route) => route.abort());
  await page.route('**/facebook.com/**', (route) => route.abort());

  const allProducts = [];
  let totalErrors = 0;

  for (const category of categoriesToScrape) {
    console.log(`\n── Categorie: ${category.label} ──`);

    // Verzamel alle productlinks over alle pagina's
    const productLinks = new Set();
    let pageUrl = `${BASE_URL}/${category.slug}.html?limit=${PRODUCTS_PER_PAGE}`;
    let pageNum = 1;

    while (pageUrl) {
      console.log(`  📄 Lijstpagina ${pageNum}: ${pageUrl}`);
      const { links, nextPageUrl } = await scrapeListPage(page, pageUrl).catch((err) => {
        console.error(`  ⚠️  Fout op lijstpagina: ${err.message}`);
        return { links: [], nextPageUrl: null };
      });

      links.forEach((l) => productLinks.add(l));
      console.log(`     ${links.length} productlinks gevonden (totaal: ${productLinks.size})`);

      pageUrl = nextPageUrl;
      pageNum++;

      if (pageUrl) await sleep(THROTTLE_MS);
    }

    if (productLinks.size === 0) {
      console.warn(`  ⚠️  Geen productlinks gevonden voor ${category.label}. Sla over.`);
      continue;
    }

    // Scrape elk product
    let catCount = 0;
    for (const link of productLinks) {
      await sleep(THROTTLE_MS);
      try {
        const product = await scrapeDetailPage(page, link, category.label);
        if (product) {
          allProducts.push(product);
          catCount++;
          if (catCount % 10 === 0) {
            console.log(`  ✅ ${catCount}/${productLinks.size} producten verwerkt...`);
          }
        }
      } catch (err) {
        console.error(`  ❌ Fout bij ${link}: ${err.message}`);
        totalErrors++;
      }
    }

    console.log(`  ✅ ${catCount} producten gescrapet voor "${category.label}"`);
  }

  await browser.close();

  // ── Sla op ────────────────────────────────────────────────────────────────
  const outputDir = resolve(ROOT, 'data');
  mkdirSync(outputDir, { recursive: true });
  const outputPath = resolve(outputDir, 'scraped_products.json');

  const output = {
    meta: {
      scraped_at: new Date().toISOString(),
      total_products: allProducts.length,
      total_errors: totalErrors,
      categories: categoriesToScrape.map((c) => c.label),
    },
    products: allProducts,
  };

  writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`\n🎉  Klaar!`);
  console.log(`📊  ${allProducts.length} producten, ${totalErrors} fouten`);
  console.log(`💾  Opgeslagen in: ${outputPath}\n`);
}

main().catch((err) => {
  console.error('Fatale fout:', err);
  process.exit(1);
});
