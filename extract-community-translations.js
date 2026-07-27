// Extracts window.__cdTrans blocks from community HTML files into public/community-translations/
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'communities');
const OUT_DIR = path.join(__dirname, 'public', 'community-translations');

fs.mkdirSync(OUT_DIR, { recursive: true });

const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.html'));
let count = 0;

for (const file of files) {
  const slug = file.replace('.html', '');
  const html = fs.readFileSync(path.join(SRC_DIR, file), 'utf8');

  const start = html.indexOf('window.__cdTrans = {');
  if (start === -1) {
    console.warn(`  SKIP ${slug} — no __cdTrans found`);
    continue;
  }

  // Find the closing }; that terminates the block
  // Walk forward from start tracking brace depth
  let depth = 0;
  let end = -1;
  for (let i = start; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') {
      depth--;
      if (depth === 0) {
        // include the semicolon if present
        end = html[i + 1] === ';' ? i + 2 : i + 1;
        break;
      }
    }
  }

  if (end === -1) {
    console.warn(`  SKIP ${slug} — could not find end of __cdTrans`);
    continue;
  }

  const block = html.slice(start, end).trim();
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.js`), block + '\n');
  console.log(`  OK  ${slug}.js`);
  count++;
}

console.log(`\nExtracted ${count} / ${files.length} community translation files.`);
