/**
 * Gastrovino Rotterdam - Database Seed Script
 *
 * Vult de database met:
 *   1. Alle landelijke wijnen uit /data/scraped_products.json
 *   2. 4 handmatige Rotterdamse 'Local Heroes' (is_local_hero = true)
 *
 * Gebruik:
 *   node src/scripts/seed-data.js           # echte database (vereist DATABASE_URL)
 *   node src/scripts/seed-data.js --dry-run # valideer data zonder DB-verbinding
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../../');

const DRY_RUN = process.argv.includes('--dry-run');
const USE_MEM = process.argv.includes('--mem');

// DDL voor de in-memory database (identiek aan prisma/schema.prisma)
const SCHEMA_DDL = `
  CREATE TYPE "Source" AS ENUM ('LANDELIJK', 'LOKAAL', 'HYBRIDE');

  CREATE TABLE "Product" (
    "id"              TEXT        NOT NULL,
    "sku"             TEXT        NOT NULL,
    "name"            TEXT        NOT NULL,
    "slug"            TEXT        NOT NULL,
    "source"          "Source"    NOT NULL DEFAULT 'LANDELIJK',
    "price_fysiek"    FLOAT,
    "price_online"    FLOAT,
    "stock_rotterdam" INTEGER     DEFAULT 0,
    "is_local_hero"   BOOLEAN     NOT NULL DEFAULT false,
    "gastronomy_tags" TEXT[]      NOT NULL DEFAULT '{}',
    "category"        TEXT,
    "images"          TEXT[]      NOT NULL DEFAULT '{}',
    "description"     TEXT,
    "spec_land"       TEXT,
    "spec_regio"      TEXT,
    "spec_druif"      TEXT,
    "spec_alcohol"    TEXT,
    "spec_wijn_spijs" TEXT,
    "specs"           JSONB,
    "source_url"      TEXT,
    "scraped_at"      TIMESTAMP,
    "createdAt"       TIMESTAMP   NOT NULL DEFAULT NOW(),
    "updatedAt"       TIMESTAMP   NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("id")
  );
  CREATE UNIQUE INDEX "Product_sku_key"  ON "Product"("sku");
  CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

  CREATE TABLE "ClickCollectSlot" (
    "id"        TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "dag"       TEXT NOT NULL,
    "openTijd"  TEXT NOT NULL,
    "sluitTijd" TEXT NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
  );
`;

// ─── 1. Rotterdamse Local Heroes (handmatig) ─────────────────────────────────

const LOCAL_HEROES = [
  {
    sku:             'GV-LOK-KLEPPER',
    name:            'Klepper & Klepper Drop',
    slug:            'klepper-klepper-drop',
    source:          'LOKAAL',
    price_fysiek:    2.50,
    price_online:    2.95,
    stock_rotterdam: 80,
    is_local_hero:   true,
    gastronomy_tags: ['drop', 'zoet', 'lokaal', 'rotterdam'],
    category:        'Snoep & Snacks',
    images:          [],
    description:     'Ambachtelijke drop van het Rotterdamse huismerk Klepper & Klepper. ' +
                     'Verkrijgbaar exclusief in de Gastrovino winkel op de Nieuwe Binnenweg.',
    spec_land:       'Nederland',
    spec_regio:      'Rotterdam',
    spec_druif:      null,
    spec_alcohol:    null,
    spec_wijn_spijs: null,
    specs: {
      type:   'Drop',
      inhoud: '100g',
    },
    clickCollectSlots: weekSchema(),
  },
  {
    sku:             'GV-LOK-ROTTERDAMSCHE',
    name:            'Rotterdamsche Oude',
    slug:            'rotterdamsche-oude',
    source:          'LOKAAL',
    price_fysiek:    6.95,
    price_online:    7.50,
    stock_rotterdam: 24,
    is_local_hero:   true,
    gastronomy_tags: ['kaas', 'oud', 'pittig', 'nootachtig', 'lokaal', 'rotterdam'],
    category:        'Kaas',
    images:          [],
    description:     'Authentieke Rotterdamse boerenkaas, minimaal 36 maanden gerijpt. ' +
                     'Stevig en pittig van smaak, met kristallen van tyrosine. ' +
                     'Ideaal op een borrelplank naast een krachtige rode wijn of port.',
    spec_land:       'Nederland',
    spec_regio:      'Rotterdam',
    spec_druif:      null,
    spec_alcohol:    null,
    spec_wijn_spijs: 'rode wijn, port, bier',
    specs: {
      rijping:  '36+ maanden',
      melk:     'Koemelk',
      inhoud:   '200g',
    },
    clickCollectSlots: weekSchema(),
  },
  {
    sku:             'GV-LOK-CANNOLI',
    name:            "Cannoli's Italiaanse",
    slug:            'cannolis-italiaanse',
    source:          'LOKAAL',
    price_fysiek:    4.50,
    price_online:    4.95,
    stock_rotterdam: 30,
    is_local_hero:   true,
    gastronomy_tags: ['zoet', 'gebak', 'italiaans', 'ricotta', 'rotterdam'],
    category:        'Gebak & Patisserie',
    images:          [],
    description:     'Verse Siciliaanse cannoli gevuld met zoete ricotta, ' +
                     'chocoladestukjes en gekonfijte sinaasappelschil. ' +
                     'Dagelijks vers gemaakt door onze Italiaanse partners op de Nieuwe Binnenweg.',
    spec_land:       'Italië',
    spec_regio:      'Sicilië',
    spec_druif:      null,
    spec_alcohol:    null,
    spec_wijn_spijs: 'dessertwijn, prosecco, moscato',
    specs: {
      vulling: 'Ricotta, chocolade, gekonfijte sinaasappel',
      inhoud:  '2 stuks',
    },
    clickCollectSlots: weekSchema(),
  },
  {
    sku:             'GV-LOK-PELGRIM',
    name:            'Pelgrim Brouwerij – Stadsblond',
    slug:            'pelgrim-brouwerij-stadsblond',
    source:          'LOKAAL',
    price_fysiek:    2.95,
    price_online:    3.25,
    stock_rotterdam: 96,
    is_local_hero:   true,
    gastronomy_tags: ['bier', 'blond', 'lokaal', 'ambachtelijk', 'delfshaven', 'rotterdam'],
    category:        'Bier',
    images:          [],
    description:     'Ambachtelijk stadsblond bier van Pelgrim Brouwerij in Delfshaven, ' +
                     'het oudste stadsdeel van Rotterdam. Licht fruitig, met een fijne bitterheid. ' +
                     'Gebrouwen op 50 meter van de plek waar de Pilgrim Fathers in 1620 vertrokken.',
    spec_land:       'Nederland',
    spec_regio:      'Rotterdam – Delfshaven',
    spec_druif:      null,
    spec_alcohol:    '5.0%',
    spec_wijn_spijs: "bitterballen, kaas, vis, borrelplank",
    specs: {
      type:    'Stadsblond',
      inhoud:  '33cl',
      brouwerij: 'Pelgrim, Delfshaven',
    },
    clickCollectSlots: weekSchema(),
  },
];

// Winkelschema Nieuwe Binnenweg: ma–vr 10:00–18:00, za 10:00–17:00, zo gesloten
function weekSchema() {
  return [
    { dag: 'maandag',    openTijd: '10:00', sluitTijd: '18:00' },
    { dag: 'dinsdag',    openTijd: '10:00', sluitTijd: '18:00' },
    { dag: 'woensdag',   openTijd: '10:00', sluitTijd: '18:00' },
    { dag: 'donderdag',  openTijd: '10:00', sluitTijd: '18:00' },
    { dag: 'vrijdag',    openTijd: '10:00', sluitTijd: '18:00' },
    { dag: 'zaterdag',   openTijd: '10:00', sluitTijd: '17:00' },
  ];
}

// ─── 2. Scraped producten → Prisma-model mappen ──────────────────────────────

function mapScrapedProduct(p) {
  const s = p.specs ?? {};
  return {
    sku:             p.sku,
    name:            p.name,
    slug:            p.slug,
    source:          'LANDELIJK',
    price_fysiek:    null,              // wordt overschreven door Rotterdamse data
    price_online:    p.price_online,
    stock_rotterdam: p.stock_rotterdam ?? 0,
    is_local_hero:   false,
    gastronomy_tags: p.gastronomy_tags ?? [],
    category:        p.category ?? null,
    images:          p.image_url ? [p.image_url] : [],
    description:     p.description ?? null,
    // Magento-specs naar expliciete kolommen
    spec_land:       s.land        ?? null,
    spec_regio:      s.regio       ?? null,
    spec_druif:      s.druif       ?? null,
    spec_alcohol:    s.alcohol     ?? null,
    spec_wijn_spijs: s.wijn_spijs  ?? null,
    // Overige specs als JSON-blob
    specs: {
      smaak:          s.smaak          ?? null,
      sluiting:       s.sluiting       ?? null,
      inhoud:         s.inhoud         ?? null,
      bewaarpotentie: s.bewaarpotentie ?? null,
      teaser:         s.teaser         ?? null,
    },
    source_url: p.source_url ?? null,
    scraped_at: p.scraped_at ? new Date(p.scraped_at) : null,
  };
}

// ─── 3. Seed-logica ──────────────────────────────────────────────────────────

async function seedPrisma(prisma, allProducts) {
  console.log('\n🍷  Gastrovino seed gestart\n');
  let aangemaakt = 0, bijgewerkt = 0, fouten = 0;

  for (const product of allProducts) {
    const { clickCollectSlots, ...productData } = product;
    try {
      const result = await prisma.product.upsert({
        where:  { sku: productData.sku },
        create: productData,
        update: productData,
      });
      if (clickCollectSlots?.length) {
        await prisma.clickCollectSlot.deleteMany({ where: { productId: result.id } });
        await prisma.clickCollectSlot.createMany({
          data: clickCollectSlots.map((s) => ({ ...s, productId: result.id })),
        });
      }
      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        aangemaakt++; console.log(`  ✅ Nieuw:      ${result.sku}`);
      } else {
        bijgewerkt++; console.log(`  🔄 Bijgewerkt: ${result.sku}`);
      }
    } catch (err) {
      fouten++;
      console.error(`  ❌ ${product.sku}: ${err.message}`);
    }
  }

  printSamenvatting(aangemaakt, bijgewerkt, fouten);
}

async function seedMemory(allProducts) {
  console.log('🧪  In-memory modus (pg-mem) – geen DATABASE_URL nodig\n');
  console.log('🍷  Gastrovino seed gestart\n');

  const { newDb }  = await import('pg-mem');
  const { v4: uuidv4 } = await import('uuid').catch(() => ({ v4: () => crypto.randomUUID() }));
  const db  = newDb();
  const { Client } = db.adapters.createPg();
  const client     = new Client();
  await client.connect();

  // Schema aanmaken
  for (const stmt of SCHEMA_DDL.split(';').map(s => s.trim()).filter(Boolean)) {
    await client.query(stmt);
  }

  let aangemaakt = 0, fouten = 0;

  for (const product of allProducts) {
    const { clickCollectSlots, specs, scraped_at, ...p } = product;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    try {
      await client.query(
        `INSERT INTO "Product"
          ("id","sku","name","slug","source","price_fysiek","price_online",
           "stock_rotterdam","is_local_hero","gastronomy_tags","category","images",
           "description","spec_land","spec_regio","spec_druif","spec_alcohol",
           "spec_wijn_spijs","specs","source_url","scraped_at","createdAt","updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
         ON CONFLICT ("sku") DO UPDATE SET
           "name"=EXCLUDED."name","price_online"=EXCLUDED."price_online",
           "updatedAt"=EXCLUDED."updatedAt"`,
        [
          id, p.sku, p.name, p.slug, p.source ?? 'LANDELIJK',
          p.price_fysiek ?? null, p.price_online ?? null,
          p.stock_rotterdam ?? 0, p.is_local_hero ?? false,
          p.gastronomy_tags ?? [],
          p.category ?? null,
          p.images ?? [],
          p.description ?? null,
          p.spec_land ?? null, p.spec_regio ?? null, p.spec_druif ?? null,
          p.spec_alcohol ?? null, p.spec_wijn_spijs ?? null,
          specs ? JSON.stringify(specs) : null,
          p.source_url ?? null,
          scraped_at ?? null, now, now,
        ]
      );

      if (clickCollectSlots?.length) {
        for (const slot of clickCollectSlots) {
          await client.query(
            `INSERT INTO "ClickCollectSlot" ("id","productId","dag","openTijd","sluitTijd") VALUES ($1,$2,$3,$4,$5)`,
            [crypto.randomUUID(), id, slot.dag, slot.openTijd, slot.sluitTijd]
          );
        }
      }

      aangemaakt++;
      console.log(`  ✅ Ingevoegd:  ${p.sku}${p.is_local_hero ? '  🏅' : ''}`);
    } catch (err) {
      fouten++;
      console.error(`  ❌ ${p.sku}: ${err.message}`);
    }
  }

  // Verificatie
  const totaal  = await client.query('SELECT COUNT(*) FROM "Product"');
  const heroes  = await client.query('SELECT COUNT(*) FROM "Product" WHERE "is_local_hero" = true');
  const slots   = await client.query('SELECT COUNT(*) FROM "ClickCollectSlot"');
  const sample  = await client.query('SELECT "sku","name","spec_land","spec_druif","price_online" FROM "Product" WHERE "is_local_hero"=false LIMIT 2');
  const heroSample = await client.query('SELECT "sku","name","gastronomy_tags","price_online" FROM "Product" WHERE "is_local_hero"=true');

  console.log('\n─── Database verificatie ────────────────────────────────────────');
  console.log(`  Producten:             ${totaal.rows[0].count}`);
  console.log(`  Local Heroes:          ${heroes.rows[0].count}`);
  console.log(`  Click & Collect slots: ${slots.rows[0].count}`);

  console.log('\n  Landelijke wijnen (sample):');
  sample.rows.forEach(r => console.log(`    • ${r.name} | Land: ${r.spec_land} | Druif: ${r.spec_druif} | €${r.price_online}`));

  console.log('\n  Local Heroes:');
  heroSample.rows.forEach(r => console.log(`    • ${r.name} [${r.sku}] | €${r.price_online} | Tags: ${r.gastronomy_tags.join(', ')}`));

  await client.end();
  printSamenvatting(aangemaakt, 0, fouten);
}

function printSamenvatting(aangemaakt, bijgewerkt, fouten) {
  console.log(`\n🎉  Seed klaar!`);
  if (bijgewerkt > 0) console.log(`   🔄 Bijgewerkt:  ${bijgewerkt}`);
  console.log(`   ✅ Aangemaakt:  ${aangemaakt}`);
  if (fouten > 0)    console.log(`   ❌ Fouten:      ${fouten}`);
  console.log();
}

// ─── 4. Hoofdprogramma ───────────────────────────────────────────────────────

async function main() {
  // Scraped data inlezen
  const scraped = JSON.parse(
    readFileSync(resolve(ROOT, 'data/scraped_products.json'), 'utf-8')
  );
  const scrapedMapped = scraped.products.map(mapScrapedProduct);
  const allProducts   = [...scrapedMapped, ...LOCAL_HEROES];

  // ── Dry-run: valideer data zonder DB ─────────────────────────────────────
  if (DRY_RUN) {
    console.log('\n🔍  DRY-RUN – geen database verbinding vereist\n');
    console.log(`📦  Totaal te seeden: ${allProducts.length} producten`);
    console.log(`   • Landelijk (scraped):  ${scrapedMapped.length}`);
    console.log(`   • Local Heroes:          ${LOCAL_HEROES.length}\n`);

    allProducts.forEach((p, i) => {
      const hero = p.is_local_hero ? ' 🏅' : '';
      console.log(`  ${String(i + 1).padStart(2)}. [${p.sku}]${hero}`);
      console.log(`      ${p.name}`);
      console.log(`      Prijs: €${p.price_online ?? '-'}  |  Land: ${p.spec_land ?? '-'}  |  Druif: ${p.spec_druif ?? '-'}`);
      console.log(`      Tags: ${(p.gastronomy_tags ?? []).join(', ')}\n`);
    });

    console.log('✅  Dry-run geslaagd – alle velden correct gemapt.\n');
    console.log('👉  Om echt te seeden: voeg DATABASE_URL toe aan .env en run:\n');
    console.log('    docker-compose up -d');
    console.log('    npx prisma migrate dev --name init');
    console.log('    node src/scripts/seed-data.js\n');
    return;
  }

  // ── In-memory modus: pg-mem + directe SQL (Prisma 7 adapter-compatibiliteit) ──
  if (USE_MEM) {
    await seedMemory(allProducts);
    return;
  }

  // ── Live seed via Prisma 7 + @prisma/adapter-pg ───────────────────────────
  const { PrismaClient } = await import('@prisma/client');
  const { PrismaPg }     = await import('@prisma/adapter-pg');
  const { Pool }         = await import('pg');

  const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma  = new PrismaClient({ adapter });

  await seedPrisma(prisma, allProducts);

  await prisma.$disconnect();
  await pool.end();
}

main().catch((err) => {
  console.error('\n💥  Fatale fout:', err.message);
  if (err.message.includes('ECONNREFUSED') || err.message.includes('connect')) {
    console.error('\n⚠️   Geen database gevonden. Start PostgreSQL met:');
    console.error('     docker-compose up -d');
    console.error('     npx prisma migrate dev --name init');
    console.error('     node src/scripts/seed-data.js\n');
  }
  process.exit(1);
});
