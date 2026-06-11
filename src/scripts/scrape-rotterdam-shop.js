// Scraper voor de echte webshop van Gastrovino Rotterdam (IZICMS 2.0, server-side gerenderd).
// Crawlt alle categorieën onder /webshop/webshop/, volgt paginering, leest per product
// naam, prijs, beschrijvingen, specs-tabel en opties, en downloadt de originele foto's.
//
// Gebruik: node src/scripts/scrape-rotterdam-shop.js [--no-images]
// Output:  data/rotterdam_shop_products.json + public/shop/*.jpg

import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const BASE = 'https://www.gastrovinorotterdam.nl';
const SHOP_ROOT = '/webshop/webshop/';
const OUT_JSON = 'data/rotterdam_shop_products.json';
const IMG_DIR = 'public/shop';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const DOWNLOAD_IMAGES = !process.argv.includes('--no-images');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchHtml(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      if (attempt === 3) throw err;
      await sleep(1000 * attempt);
    }
  }
}

function cleanText(s) {
  return (s ?? '').replace(/\s+/g, ' ').trim();
}

// Verzamel categorie-URL's (incl. subcategorieën) vanaf de shop-root.
async function discoverCategories() {
  const seen = new Set([SHOP_ROOT]);
  const queue = [SHOP_ROOT];
  const categories = [];
  while (queue.length) {
    const cat = queue.shift();
    categories.push(cat);
    const $ = cheerio.load(await fetchHtml(BASE + cat));
    $('a[href^="/webshop/webshop/"]').each((_, el) => {
      const href = $(el).attr('href').split('?')[0];
      if (href.includes('/detail/') || !href.endsWith('/')) return;
      if (!seen.has(href)) {
        seen.add(href);
        queue.push(href);
      }
    });
    await sleep(200);
  }
  return categories.filter((c) => c !== SHOP_ROOT);
}

// Loop alle pagina's van een categorie door en geef de product-URL's terug.
async function collectProductUrls(category) {
  const urls = new Map(); // url -> categorie waarin gevonden
  for (let page = 1; page <= 50; page++) {
    const $ = cheerio.load(await fetchHtml(`${BASE}${category}?page=${page}`));
    let found = 0;
    $('.product a[href*="/detail/"]').each((_, el) => {
      const href = $(el).attr('href').split('?')[0];
      if (!urls.has(href)) {
        urls.set(href, category);
        found++;
      }
    });
    const hasNext = $('.pagination a.next').length > 0;
    await sleep(200);
    if (!hasNext || found === 0) break;
  }
  return urls;
}

async function scrapeProduct(url, category) {
  const $ = cheerio.load(await fetchHtml(BASE + url));
  const id = $('meta[itemprop="ProductID"]').attr('content')
    ?? url.match(/\/detail\/(\d+)\//)?.[1];
  const name = cleanText($('h1[itemprop="name"]').text());
  const price = parseFloat($('meta[itemprop="price"]').attr('content') ?? '0');

  const shortDescription = cleanText($('.short-description').text());
  const longDescription = cleanText(
    $('.long-description').clone().find('table').remove().end().text()
  );

  const specs = {};
  $('#product-attribute-specs-table tr').each((_, tr) => {
    const key = cleanText($(tr).find('th').text());
    const value = cleanText($(tr).find('td').text());
    if (key) specs[key] = value;
  });

  const options = [];
  $('.attribute-set').each((_, set) => {
    const label = cleanText($(set).find('label').text());
    const values = $(set).find('option').map((_, o) => cleanText($(o).text())).get();
    if (label) options.push({ label, values });
  });

  // Originele afbeeldingen: varianten met maatprefix (255x1000x0_) herleiden naar het bronbestand.
  // "Ook interessant" (.similarProducts) hoort niet bij dit product.
  const images = new Set();
  $('[src*="/data/upload/Shop/images/"], [href*="/data/upload/Shop/images/"], [data-background*="/data/upload/Shop/images/"]')
    .each((_, el) => {
      if ($(el).closest('.similarProducts').length) return;
      const src = [$(el).attr('src'), $(el).attr('href'), $(el).attr('data-background')]
        .find((v) => v && v.includes('/data/upload/Shop/images/'));
      const file = src.split('/').pop().replace(/^\d+x\d+x\d+_/, '');
      if (/\.(jpe?g|png|webp|gif)$/i.test(file)) {
        images.add(`/data/upload/Shop/images/${file}`);
      }
    });

  return {
    id: Number(id),
    name,
    slug: url.match(/\/detail\/\d+\/([^/]+)\.html/)?.[1] ?? '',
    url: BASE + url,
    category: category.replace(SHOP_ROOT, '').replace(/\/$/, ''),
    price,
    shortDescription,
    longDescription,
    specs,
    options,
    sourceImages: [...images],
    localImages: [],
  };
}

async function downloadImages(product) {
  for (const [i, src] of product.sourceImages.entries()) {
    const ext = path.extname(src).toLowerCase() || '.jpg';
    const local = `${IMG_DIR}/${product.id}-${i}${ext}`;
    try {
      const res = await fetch(BASE + src, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fs.writeFile(local, Buffer.from(await res.arrayBuffer()));
      product.localImages.push(local.replace(/^public/, ''));
    } catch (err) {
      console.warn(`  ! afbeelding mislukt ${src}: ${err.message}`);
    }
    await sleep(150);
  }
}

async function main() {
  await fs.mkdir(IMG_DIR, { recursive: true });
  await fs.mkdir('data', { recursive: true });

  console.log('Categorieën zoeken…');
  const categories = await discoverCategories();
  console.log(`  ${categories.length} categorieën:`, categories.join(', '));

  const productUrls = new Map();
  for (const cat of categories) {
    const urls = await collectProductUrls(cat);
    for (const [url, category] of urls) {
      if (!productUrls.has(url)) productUrls.set(url, category);
    }
    console.log(`  ${cat}: ${urls.size} producten`);
  }
  console.log(`Totaal ${productUrls.size} unieke producten`);

  const products = [];
  let n = 0;
  for (const [url, category] of productUrls) {
    n++;
    try {
      const product = await scrapeProduct(url, category);
      console.log(`[${n}/${productUrls.size}] ${product.name} — €${product.price} (${product.sourceImages.length} foto's)`);
      if (DOWNLOAD_IMAGES) await downloadImages(product);
      products.push(product);
    } catch (err) {
      console.error(`[${n}/${productUrls.size}] MISLUKT ${url}: ${err.message}`);
    }
    await sleep(250);
  }

  products.sort((a, b) => a.id - b.id);
  await fs.writeFile(OUT_JSON, JSON.stringify(products, null, 2));
  console.log(`\nKlaar: ${products.length} producten → ${OUT_JSON}`);
  const totalImages = products.reduce((s, p) => s + p.localImages.length, 0);
  console.log(`Foto's gedownload: ${totalImages} → ${IMG_DIR}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
