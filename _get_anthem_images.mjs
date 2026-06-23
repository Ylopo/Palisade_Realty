import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'images', 'anthem-country-club');
mkdirSync(OUT, { recursive: true });

const IMGS = [
  {
    url: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/8adf802d-4fcd-4b8b-b79b-2c4c3268e321/anthem-country-club-golf-course-henderson-nv.jpg',
    file: 'golf-course.jpg',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/f037777b-061c-4e85-9271-6c66bc085975/anthem-country-club-entrance-henderson-nv.jpg',
    file: 'entrance.jpg',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/50f7fcde-b73c-47f7-a58f-4cb5d439a26f/anthem-country-club-sign-henderson-nv.jpg',
    file: 'sign.jpg',
  },
];

for (const img of IMGS) {
  try {
    const res = await fetch(img.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(join(OUT, img.file), buf);
    console.log(`Saved ${img.file} (${buf.length} bytes)`);
  } catch (e) {
    console.log(`Error ${img.file}: ${e.message}`);
  }
}
console.log('Done.');
