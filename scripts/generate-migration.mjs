// Script to fetch all products from 9ballshop.com Shopify API and generate SQL migration
// This does a full replacement: deletes all existing products and inserts all 150 from Shopify
import fs from 'fs';

const API_URL = 'https://9ballshop.com/products.json?limit=250';

function stripHtml(html) {
  if (!html) return '';
  let text = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/td>/gi, ' ')
    .replace(/<\/th>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\t/g, ' ');

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const cleanLines = lines.filter(line => {
    if (line === 'More Information') return false;
    if (/^(Product Type|Glove Hand|Glove Fingers|Color|Joint Type|Cue Style|Cue Construction|Wrap Type|Grip Diameter|Shaft Length|Butt Length|Cue Tip)\s/.test(line)) return false;
    return true;
  });

  return cleanLines.join(' ').replace(/\s+/g, ' ').trim();
}

function escapeSQL(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

function categorize(title, slug) {
  const t = (title + ' ' + slug).toLowerCase();

  // Gloves first (very clear)
  if (t.includes('glove') || t.includes('ganti') || t.includes('γαντι') || t.includes('γάντι')) return 'Gloves';

  // Cases - check before cues since case slugs may contain "steka"
  if (t.includes('cue case') || t.includes('thiki') || t.includes('θηκη') || t.includes('θήκη') || t.includes('bag.01') || t.includes('bag-01')) return 'Cases';

  // Balls - check before tables since some ball products have "mm" sizes
  if (t.includes('ball') || t.includes('μπάλ') || t.includes('μπαλ') || t.includes('57.2mm') || t.includes('57,2') || t.includes('38mm') || t.includes('training cue ball')) return 'Balls';

  // Shafts
  if (t.includes('shaft') || t.includes('φλες') || t.includes('φλέ') || t.includes('fles-gia')) return 'Shafts';

  // Tables - check for "pool table" or Greek equivalents, but NOT cloth/balls
  if ((t.includes('pool table') || t.includes('τραπέζι') || t.includes('τραπεζι')) && !t.includes('cloth') && !t.includes('τσόχα') && !t.includes('τσοχα')) return 'Tables';
  // Greek "ΜΠΙΛΙΑΡΔΟ" at start of title means it's a table (not "μπιλιαρδου" which is genitive used everywhere)
  if (/^μπιλιάρδο\s/i.test(title.toLowerCase()) || /^μπιλιαρδο\s/i.test(title.toLowerCase())) return 'Tables';
  // Specific table product patterns
  if (t.includes('dominator') || t.includes('hurricane') || t.includes('terminator') || t.includes('rasson') || t.includes('chevillotte') || t.includes('sakkas')) {
    // These brands only make tables
    if (!t.includes('cloth') && !t.includes('τσόχα') && !t.includes('τσοχα') && !t.includes('ball')) return 'Tables';
  }

  // Cloth/Felt
  if (t.includes('cloth') || t.includes('τσόχα') || t.includes('τσοχα') || t.includes('europool') || t.includes('simonis')) return 'Accessories';

  // Chalk
  if (t.includes('chalk') || t.includes('τεμπεσείρι') || t.includes('tempeseiri') || t.includes('τεμπεσειρι')) return 'Accessories';

  // Tips
  if (t.includes(' tip') || t.includes('πετσί') || t.includes('πετσάκ') || t.includes('petsi') || t.includes('petsakei') || t.includes('πετσι')) return 'Accessories';

  // Extensions
  if (t.includes('extension') || t.includes('προέκταση') || t.includes('προεκτασ') || t.includes('proektash')) return 'Accessories';

  // Cleaners
  if (t.includes('cleaner') || t.includes('restorer') || t.includes('burnisher') || t.includes('καθαριστ') || t.includes('τριβείο') || t.includes('katharistiko')) return 'Accessories';

  // Cues - last since many products have "cue" in their slug
  if (t.includes('cue') || t.includes('στεκα') || t.includes('στέκα') || t.includes('steka') || t.includes('pool cue')) return 'Cues';

  return 'Accessories';
}

function extractBrand(title) {
  const brands = [
    'Predator', 'Aramith', 'Kamui', 'Taom', 'Mezz', 'Buffalo',
    'Cuetec', 'Rasson', 'Chevillotte', 'Sakkas', 'Dominator', 'Iwan Simonis',
    'Europool', 'Dynaspheres', 'Fury', 'Champion', 'Bear', 'Adam', 'George Balabushka',
    'Moori', 'Elk Master', 'Silver Cup', 'Brunswick', 'How Hard', 'KMD', 'IOC', 'BCE',
    'Dybior', 'SUM', 'Universal', 'Master', 'Cue Silk'
  ];
  for (const brand of brands) {
    if (title.toLowerCase().includes(brand.toLowerCase())) return brand;
  }
  if (title.startsWith('RASSON')) return 'Rasson';
  if (title.startsWith('BUFFALO')) return 'Buffalo';
  if (title.startsWith('IWAN')) return 'Iwan Simonis';
  return '9BallShop';
}

// Products to mark as featured (popular/premium items)
const featuredSlugs = new Set([
  'predator-black-p3-pool-cue-with-no-wrap',
  'predator-throne3-1-pool-cue',
  'predator-sp2-metallic-green-2-pool-cue',
  'predator-limited-edition-sang-lee-series-2-4-pool-cue-leather-wrap',
  'mezz-hybrid-pro-ii-5-16x14',
  'predator-second-skin-billiard-glove-purple-pink',
  'super-aramith-pro-57-2-mm',
  'predator-second-skin-billiard-glove-blue-teal',
]);

async function main() {
  console.log('Fetching products from 9ballshop.com...');
  const res = await fetch(API_URL);
  const data = await res.json();
  const products = data.products;
  console.log(`Found ${products.length} products`);

  let sql = '-- Migration: Full product catalog import from 9ballshop.com\n';
  sql += '-- Generated on ' + new Date().toISOString() + '\n';
  sql += '-- Replaces all existing products with 150 products from 9ballshop.com Shopify store\n\n';
  sql += '-- Clear existing products\n';
  sql += 'DELETE FROM Product;\n\n';

  for (const product of products) {
    let title = product.title || '';
    const slug = product.handle || '';
    const price = parseFloat(product.variants?.[0]?.price || '0');
    const bodyHtml = product.body_html || '';
    let description = stripHtml(bodyHtml).slice(0, 500);

    // Fix corrupted titles (product #1 has HTML table content as title)
    if (title.includes('Product Type') || title.includes('\t')) {
      // Try to get a clean title from the slug
      title = slug
        .replace(/-copy(-\d+)?$/, '')
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }

    // If description is empty or too short/useless, generate from title
    if (!description || description.length < 10) {
      description = title;
    }

    const category = categorize(title, slug);
    const brand = extractBrand(title);
    const images = product.images?.map(img => img.src) || [];
    const imagesJson = JSON.stringify(images);
    const featured = featuredSlugs.has(slug) ? 1 : 0;

    sql += `INSERT INTO Product (name, slug, description, price, currency, category, brand, images, inStock, featured, createdAt) VALUES ('${escapeSQL(title)}', '${escapeSQL(slug)}', '${escapeSQL(description)}', ${price}, 'EUR', '${escapeSQL(category)}', '${escapeSQL(brand)}', '${escapeSQL(imagesJson)}', 1, ${featured}, datetime('now'));\n`;
  }

  console.log(`Generated DELETE + ${products.length} INSERTs`);

  const migrationPath = 'prisma/migrations/0004_import_all_products.sql';
  fs.mkdirSync('prisma/migrations', { recursive: true });
  fs.writeFileSync(migrationPath, sql);
  console.log(`Migration written to ${migrationPath}`);
}

main().catch(console.error);
