/*
  Script: Generate or fetch menu item images, upload to Supabase Storage, and update src/data/menu.ts
  Usage:
    SUPABASE_URL=... SUPABASE_ANON_KEY=... SUPABASE_BUCKET=public-assets node --loader tsx scripts/generate_and_upload_menu_images.ts
  Or via npm:
    npm run images:upload
*/

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
};

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'public-assets';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Simple deterministic placeholder generator using picsum.photos as a source
function imageSourceFor(item: MenuItem): string {
  const hash = crypto.createHash('md5').update(item.id + item.name).digest('hex').slice(0, 8);
  // size 800x600 jpeg
  return `https://picsum.photos/seed/${hash}/800/600.jpg`;
}

async function downloadBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const arr = await res.arrayBuffer();
  return Buffer.from(arr);
}

async function uploadToSupabase(buffer: Buffer, key: string): Promise<string> {
  const { data, error } = await supabase.storage.from(SUPABASE_BUCKET).upload(key, buffer, {
    contentType: 'image/jpeg',
    upsert: true,
  });
  if (error) throw error;
  const { data: publicUrl } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(key);
  return publicUrl.publicUrl;
}

async function run() {
  const menuPath = path.resolve(process.cwd(), 'src/data/menu.ts');
  const content = await fs.readFile(menuPath, 'utf8');

  // Parse menuItems array by crude regex to avoid TypeScript execution
  const startIdx = content.indexOf('export const menuItems');
  if (startIdx < 0) throw new Error('menuItems not found');

  // For simplicity, require that each menu item has an id and optional image property
  // We'll inject image: '<url>' for items missing image.
  const updated = await replaceImages(content);
  await fs.writeFile(menuPath, updated, 'utf8');
  console.log('Updated src/data/menu.ts with image URLs');
}

async function replaceImages(source: string): Promise<string> {
  // Match objects within the menuItems array
  const arrayMatch = source.match(/export const menuItems:\s*MenuItem\[]\s*=\s*\[(\s|\S)*?\];/);
  if (!arrayMatch) return source;
  let arrayBlock = arrayMatch[0];

  // Replace each item block
  arrayBlock = await replacePerItem(arrayBlock);

  return source.replace(arrayMatch[0], arrayBlock);
}

async function replacePerItem(block: string): Promise<string> {
  // Roughly split items by top-level commas/newlines between objects
  // Use a regex that captures objects starting with { and ending with }
  const itemRegex = /\{[\s\S]*?\}\s*(,|\])/g;
  const matches = Array.from(block.matchAll(itemRegex));
  let result = block;

  for (const m of matches) {
    const itemObj = m[0];
    if (/image:\s*['"]/i.test(itemObj)) continue; // already has image
    const idMatch = itemObj.match(/id:\s*['"]([^'"]+)['"]/);
    const nameMatch = itemObj.match(/name:\s*['"]([^'"]+)['"]/);
    const categoryMatch = itemObj.match(/category:\s*['"]([^'"]+)['"]/);
    if (!idMatch || !nameMatch) continue;
    const item: MenuItem = {
      id: idMatch[1],
      name: nameMatch[1],
      price: 0,
      category: categoryMatch?.[1] || 'unknown',
    };
    const srcUrl = imageSourceFor(item);
    const buffer = await downloadBuffer(srcUrl);
    const key = `menu/${item.category}/${item.id}.jpg`;
    const publicUrl = await uploadToSupabase(buffer, key);

    // Inject image field before closing brace
    const withImage = itemObj.replace(/\}\s*(,|\])/, `,\n    image: '${publicUrl}'\n  }$1`);
    result = result.replace(itemObj, withImage);
    console.log(`Uploaded image for ${item.name}: ${publicUrl}`);
  }

  return result;
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});


