const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const PDFDocument = require('pdfkit');

const OUTPUT_DIR = path.join(__dirname);

// ─── Agent data from team page ───────────────────────────────────────────────
const AGENTS_RAW = [
  { name: 'Frank Rinaldi',          phone: '(702) 605-0759', email: 'frank@crhometeam.com',           profileUrl: 'https://www.palisaderealty.com/team/frank-rinaldi',          imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1769122311738-6IOYSU6N2XCK90O7LVCC/83230156_172430979_img_6820.jpg?format=500w' },
  { name: 'Ryan Crighton',          phone: '(702) 217-1048', email: 'ryan@crhometeam.com',            profileUrl: 'https://www.palisaderealty.com/team/ryan-crighton',          imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1765322326986-8JNC746E8QTI0UV5QPR5/83230156_172430981_ryan_crighton_.png?format=500w' },
  { name: 'Danny Rinaldi',          phone: '(702) 605-0759', email: 'danny@crhometeam.com',           profileUrl: 'https://www.palisaderealty.com/team/danny-rinaldi',          imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1767138332517-J8NQP7WFZ4IHAQWN3ZXC/83230156_172430979_danny_rinaldi_headshot.png?format=500w' },
  { name: 'Aymeric Monello-Fuentes', phone: '(702) 747-6985', email: 'aymeric@crhometeam.com',        profileUrl: 'https://www.palisaderealty.com/team/aymeric-monello-fuentes',  imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1766196406961-VQASN0XUO8WKZP6P6HTT/pro-square.jpg?format=500w' },
  { name: 'Bailey Padilla',         phone: '(725) 525-6496', email: 'bailey@crhometeam.com',          profileUrl: 'https://www.palisaderealty.com/team/bailey-padilla',          imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1776791291544-9566V0JBGH64WT1FPF5G/83230156_172430979_img_8878.jpg?format=500w' },
  { name: 'Bobbie McPherson',       phone: '(480) 469-6184', email: 'bobbie@crhometeam.com',          profileUrl: 'https://www.palisaderealty.com/team/bobbie-mcpherson',        imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1765914236034-5JKYMYFXX03DFTEQGOZP/83230156_172430979_headshot3.png?format=500w' },
  { name: 'Brayden Keith',          phone: '(702) 765-0147', email: 'brayden@crhometeam.com',         profileUrl: 'https://www.palisaderealty.com/team/brayden-keith',           imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1766009321080-LOOMQ8EQXWVPQTNUS0GJ/83230156_172430979_brayden_keith_headshot.jpg?format=500w' },
  { name: 'Chris Brown',            phone: '(702) 445-1330', email: 'chrisbrown22@gmail.com',         profileUrl: 'https://www.palisaderealty.com/team/chris-brown',            imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1682451620887-8BXNVK2KVNVPQGN9J9KF/ChrisBrown_83230158_unnamed.jpeg?format=500w' },
  { name: 'Christian Cortes',       phone: '(702) 743-1302', email: 'christian@crhometeam.com',       profileUrl: 'https://www.palisaderealty.com/team/christian-cortes',        imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1768248829082-2XZVQE5FXRHDZCK4AWS9/83230156_172430979_christian_cortes_headshot.png?format=500w' },
  { name: 'Dakota Hanson-Rudkins',  phone: '(702) 994-7451', email: 'dakota@crhometeam.com',          profileUrl: 'https://www.palisaderealty.com/team/dakota-hanson-rudkins',   imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1767140819164-A11ZFEQGNP7QOWC2O2B1/83230156_172430979_dakota_hansonrudkins_headshot.jpg?format=500w' },
  { name: 'Dewey Burns',            phone: '(725) 577-4244', email: '',                               profileUrl: 'https://www.palisaderealty.com/team/dewey-burns',            imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1765315328349-XSXFK52M0GZBAQQ2BB6N/efdbc18c-902f-44f5-9727-de3d1f7e5f8b.png?format=500w', websiteUrl: 'http://dewey.palisaderealty.com/' },
  { name: 'Emmanuel Sanchez',       phone: '(725) 255-3235', email: 'emmanuel@crhometeam.com',        profileUrl: 'https://www.palisaderealty.com/team/emmanuel-sanchez',        imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1767131890454-JV631TPJBZLML64VM8W0/83230156_172430979_emmanuel_sanchez_headshot.jpg?format=500w' },
  { name: 'Gram Burt',              phone: '(702) 779-0210', email: 'gram@crhometeam.com',            profileUrl: 'https://www.palisaderealty.com/team/gram-burt',              imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1765321450745-N0515WPCQ1XC2JADGSUH/83230156_172430979_gram_burt_headshot.jpg?format=500w' },
  { name: 'Jackie Bowers',          phone: '(210) 639-7308', email: 'jackie@crhometeam.com',          profileUrl: 'https://www.palisaderealty.com/team/jackie-bowers',           imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1780097177730-KJKQVXXY40SF69OZC1LE/Jackie+Bowers.png?format=500w' },
  { name: 'Jonathan Masci',         phone: '(717) 386-2913', email: 'jonathan@crhometeam.com',        profileUrl: 'https://www.palisaderealty.com/team/jonathan-masci',          imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1765319114981-T7IQI1KGH6M4SBSLU180/83230156_172430979_jonathan_masci.jpg?format=500w' },
  { name: 'Lin-Veronica Light',     phone: '(702) 767-9703', email: 'lin@crhometeam.com',             profileUrl: 'https://www.palisaderealty.com/team/lin-veronica-light',     imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1765319420298-9NASAFRRRKOZNT2Q9PEL/83230156_172430979_linveronica_light.jpg?format=500w' },
  { name: 'Lydia Bell',             phone: '(702) 745-2508', email: 'lydia@crhometeam.com',           profileUrl: 'https://www.palisaderealty.com/team/lydia-bell',             imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1778602858732-KJLONI81VL5S4SM81JRQ/83230156_172430979_lydia_bell_agent_headshot_extended_bg.png?format=500w' },
  { name: 'Michael Czmil',          phone: '(702) 720-3505', email: 'MikeCzmil@Gmail.com',            profileUrl: 'https://www.palisaderealty.com/team/michael-czmil',           imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1765315201394-X8EUI31VB95Q7B83J3MF/d99f9c4d-205b-43ef-a045-6b359eb3fe1b.jpg?format=500w' },
  { name: 'Michelle Rinaldi',       phone: '(917) 783-7408', email: 'michelle@crhometeam.com',        profileUrl: 'https://www.palisaderealty.com/team/michelle-rinaldi',        imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1765324174060-YFVRJVQV39KMMQFMSZ7G/83230156_172430981_michelle_rinaldi_headshot.jpeg?format=500w' },
  { name: 'Paul Oh',                phone: '(702) 539-2290', email: 'paul@crhometeam.com',            profileUrl: 'https://www.palisaderealty.com/team/paul-oh',                imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1768340867628-IYHDLCS23KNSH14W6J27/83230156_172430979_paul_oh_headshot+%281%29.png?format=500w' },
  { name: 'Pete Kalkas',            phone: '(702) 328-5623', email: 'kalkasrealestate@gmail.com',     profileUrl: 'https://www.palisaderealty.com/team/pete-kalkas',            imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1682451880038-XOR0USEXH2MJBOP1AIH0/PeteKalkas_83230158_Photo.JPG?format=500w' },
  { name: 'Rebecca Williams',       phone: '(702) 623-6520', email: 'rebecca@crhometeam.com',         profileUrl: 'https://www.palisaderealty.com/team/rebecca-williams',        imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1776191384347-K545RLO1KC9Z8A0TVGH1/83230156_172430979_0814b36690e44ff29bd5d8a09736f10a_2.png?format=500w' },
  { name: 'Reyna Christen',         phone: '(702) 389-6463', email: 'reyna@crhometeam.com',           profileUrl: 'https://www.palisaderealty.com/team/reyna-christen',          imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1774922226275-TNVT7YI8XRDZD8FNUXYH/83230156_172430979_reyna_christian_agent_headshot2.jpg?format=500w' },
  { name: 'Robert Barnes',          phone: '(702) 479-6847', email: 'robert@crhometeam.com',          profileUrl: 'https://www.palisaderealty.com/team/robert-barnes',           imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1765315104159-Z0J6FHMIRUW05XSPUYY8/4636a43d-fe51-47b8-ad3c-5cf61b553188.jpg?format=500w' },
  { name: 'Scott Reading',          phone: '(702) 325-6530', email: 'scott@crhometeam.com',           profileUrl: 'https://www.palisaderealty.com/team/scott-reading',           imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1742807007555-4GIXYI3FTM6FH1FEOPQQ/83230156_172430979_9c8530591713465dbc0225e1249cfa9a.jpeg?format=500w' },
  { name: 'Stefan Crighton',        phone: '(702) 478-0516', email: 'stefan@rothwellgornt.com',       profileUrl: 'https://www.palisaderealty.com/team/stefan-crighton',         imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1777510560555-AZFBK8XCOI3JES0QKSEP/83230156_172430979_stefan_crighton_agent_headshot.png?format=500w' },
  { name: 'Victor Kipp',            phone: '(845) 453-4957', email: 'victor@crhometeam.com',          profileUrl: 'https://www.palisaderealty.com/team/victor-kipp',            imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1696039304373-GN5UDWMC2MGEIISL5A8W/Vic+Pic+1.jpg?format=500w' },
  { name: 'Victoria Rose',          phone: '(702) 541-4381', email: 'victoria@crhometeam.com',        profileUrl: 'https://www.palisaderealty.com/team/victoria-rose',           imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1747227024659-A6A0SZLDNRR2WJF99GL8/83230156_172430979_victoria_pic+%281%29-Picsart-AiImageEnhancer.jpg?format=500w' },
  { name: 'Zolt Szorenyi',          phone: '(702) 321-4006', email: 'zolt@crhometeam.com',            profileUrl: 'https://www.palisaderealty.com/team/zolt-szorenyi',           imageUrl: 'https://images.squarespace-cdn.com/content/v1/6407816c4c01523c73b3e9f6/1780429048510-RGZBX42O1VPW8ACG8GW3/Zolt+Szorenyi.jpg?format=500w' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toSlug(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchResponse(url, maxRedirects = 6) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,image/webp,*/*',
      },
    }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location && maxRedirects > 0) {
        res.resume();
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        return fetchResponse(next, maxRedirects - 1).then(resolve).catch(reject);
      }
      resolve(res);
    });
    req.setTimeout(30000, () => req.destroy(new Error('Timeout')));
    req.on('error', reject);
  });
}

async function fetchText(url) {
  const res = await fetchResponse(url);
  return new Promise((resolve, reject) => {
    const chunks = [];
    res.on('data', c => chunks.push(c));
    res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    res.on('error', reject);
  });
}

async function downloadImage(url, destNoExt) {
  const res = await fetchResponse(url);
  const ct = res.headers['content-type'] || '';
  let ext;
  if      (ct.includes('png'))  ext = '.png';
  else if (ct.includes('webp')) ext = '.webp';
  else                           ext = '.jpg';

  const dest = destNoExt + ext;
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => file.close(() => resolve({ dest, ext })));
    file.on('error', err => { try { fs.unlinkSync(dest); } catch(_){} reject(err); });
    res.on('error', reject);
  });
}

// Squarespace team page: role is in class="single-agent-header-info-title"
function extractRoleAndLicensing(html) {
  const result = { role: '', licensing: '' };

  // Role — exact class used by this Squarespace template
  const roleM = html.match(/class="single-agent-header-info-title"[^>]*>([^<]{2,100})<\//i);
  if (roleM) result.role = roleM[1].replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').trim();

  // Licensing
  const licM = html.match(/Licensing[:\s]+([A-Z]+\.\d+)/i);
  if (licM) result.licensing = licM[1];

  return result;
}

// ─── CSV writer ───────────────────────────────────────────────────────────────
function writeCSV(agents, filePath) {
  const headers = ['name','role','phone','email','bio','profile_url','website_url','local_image_file','image_url'];
  const esc = v => `"${String(v || '').replace(/"/g,'""')}"`;
  const rows = agents.map(a => [
    esc(a.name),
    esc(a.role),
    esc(a.phone),
    esc(a.email),
    esc(a.bio),
    esc(a.profileUrl),
    esc(a.websiteUrl || ''),
    esc(a.localImageFile || ''),
    esc(a.imageUrl),
  ].join(','));
  fs.writeFileSync(filePath, [headers.join(','), ...rows].join('\r\n'), 'utf8');
}

// ─── PDF generator ────────────────────────────────────────────────────────────
async function generatePDF(agents, filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const W = doc.page.width;   // 595.28
    const H = doc.page.height;  // 841.89
    const PAD = 50;

    // ── TITLE PAGE ──────────────────────────────────────────────────────────
    doc.rect(0, 0, W, H).fill('#1a2744');

    doc.rect(0, H * 0.38, W, 4).fill('#c4a44a');
    doc.rect(0, H * 0.38 + 8, W, 1).fill('#c4a44a');

    doc.fillColor('#ffffff')
       .font('Helvetica-Bold').fontSize(34)
       .text('Palisade Realty', PAD, H * 0.40, { width: W - PAD*2, align: 'center' });

    doc.fillColor('#c4a44a')
       .font('Helvetica').fontSize(16)
       .text('Agent Directory', PAD, H * 0.40 + 48, { width: W - PAD*2, align: 'center' });

    doc.fillColor('#aabbcc')
       .font('Helvetica').fontSize(12)
       .text('Las Vegas & Henderson, NV', PAD, H * 0.40 + 78, { width: W - PAD*2, align: 'center' });

    doc.fillColor('#7788aa')
       .font('Helvetica').fontSize(10)
       .text(`${agents.length} Team Members  •  www.palisaderealty.com`, PAD, H * 0.40 + 104, { width: W - PAD*2, align: 'center' });

    // ── AGENT PAGES ─────────────────────────────────────────────────────────
    for (const agent of agents) {
      doc.addPage();

      // Header stripe
      doc.rect(0, 0, W, 230).fill('#f4f6fb');
      doc.rect(0, 228, W, 3).fill('#1a2744');
      doc.rect(0, 231, W, 1).fill('#c4a44a');

      const IMG_SIZE  = 160;
      const imgX      = PAD;
      const imgY      = PAD - 10;
      const textX     = imgX + IMG_SIZE + 28;
      const textWidth = W - textX - PAD;

      // ── Photo ────────────────────────────────────────────────────────────
      let imgOk = false;
      if (agent.localImagePath && fs.existsSync(agent.localImagePath)) {
        try {
          // draw a clip square so image is always a neat square
          doc.save();
          doc.rect(imgX, imgY, IMG_SIZE, IMG_SIZE).clip();
          doc.image(agent.localImagePath, imgX, imgY, { fit: [IMG_SIZE, IMG_SIZE], align: 'center', valign: 'center' });
          doc.restore();

          // subtle border
          doc.rect(imgX, imgY, IMG_SIZE, IMG_SIZE).lineWidth(1).strokeColor('#cccccc').stroke();
          imgOk = true;
        } catch (_) { /* fall through */ }
      }
      if (!imgOk) {
        doc.rect(imgX, imgY, IMG_SIZE, IMG_SIZE).fill('#dde3ee');
        doc.fillColor('#99aabb').fontSize(9)
           .text('No Photo', imgX, imgY + IMG_SIZE / 2 - 5, { width: IMG_SIZE, align: 'center' });
      }

      // ── Name ─────────────────────────────────────────────────────────────
      let ty = imgY;
      doc.fillColor('#1a2744').font('Helvetica-Bold').fontSize(22)
         .text(agent.name, textX, ty, { width: textWidth });
      ty += 28;

      // ── Role ─────────────────────────────────────────────────────────────
      if (agent.role) {
        doc.fillColor('#c4a44a').font('Helvetica').fontSize(12)
           .text(agent.role, textX, ty, { width: textWidth });
        ty += 18;
      }

      ty += 10;
      doc.moveTo(textX, ty).lineTo(textX + textWidth, ty).lineWidth(0.75).strokeColor('#cccccc').stroke();
      ty += 12;

      // ── Contact fields ────────────────────────────────────────────────────
      const LWIDTH = 55;
      const vx     = textX + LWIDTH + 4;
      const vw     = textWidth - LWIDTH - 4;

      function contactRow(label, value, color) {
        if (!value) return;
        doc.fillColor('#888888').font('Helvetica-Bold').fontSize(9)
           .text(label, textX, ty, { width: LWIDTH });
        doc.fillColor(color || '#333333').font('Helvetica').fontSize(9)
           .text(value, vx, ty, { width: vw });
        ty += 15;
      }

      contactRow('Phone:', agent.phone);
      contactRow('Email:', agent.email, '#1a5fb4');
      contactRow('Profile:', agent.profileUrl, '#1a5fb4');
      if (agent.websiteUrl) contactRow('Website:', agent.websiteUrl, '#1a5fb4');
      if (agent.licensing) contactRow('License:', agent.licensing);

      // ── Bio ───────────────────────────────────────────────────────────────
      if (agent.bio && agent.bio.trim()) {
        const bioY = Math.max(ty + 10, imgY + IMG_SIZE + 20);
        doc.moveTo(PAD, bioY - 6).lineTo(W - PAD, bioY - 6).lineWidth(0.5).strokeColor('#eeeeee').stroke();
        doc.fillColor('#444444').font('Helvetica').fontSize(10)
           .text(agent.bio.trim(), PAD, bioY, { width: W - PAD * 2, lineGap: 3 });
      }

      // ── Footer ────────────────────────────────────────────────────────────
      doc.fillColor('#aaaaaa').font('Helvetica').fontSize(8)
         .text('Palisade Realty  •  palisaderealty.com', PAD, H - 35, { width: W - PAD * 2, align: 'center' });
    }

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n=== Palisade Realty Scraper ===\n');

  const agents = AGENTS_RAW.map(a => ({ ...a, role: '', bio: '', licensing: '', localImageFile: '', localImagePath: '' }));

  // ── Phase 1: scrape individual profile pages for role/licensing ────────────
  console.log(`Phase 1/4 — Fetching ${agents.length} profile pages for role data...\n`);
  for (let i = 0; i < agents.length; i++) {
    const a = agents[i];
    process.stdout.write(`  [${String(i+1).padStart(2)}/${agents.length}] ${a.name.padEnd(28)} `);
    try {
      const html = await fetchText(a.profileUrl);
      const { role, licensing } = extractRoleAndLicensing(html);
      agents[i].role      = role;
      agents[i].licensing = licensing;
      console.log(`role="${role || '—'}"  lic="${licensing || '—'}"`);
    } catch (e) {
      console.log(`WARN: ${e.message}`);
    }
    if (i < agents.length - 1) await sleep(400);
  }

  // ── Phase 2: download images ───────────────────────────────────────────────
  console.log(`\nPhase 2/4 — Downloading ${agents.length} images...\n`);
  const imgFails = [];
  for (let i = 0; i < agents.length; i++) {
    const a = agents[i];
    const slug     = toSlug(a.name);
    const destBase = path.join(OUTPUT_DIR, slug);
    process.stdout.write(`  [${String(i+1).padStart(2)}/${agents.length}] ${a.name.padEnd(28)} `);
    try {
      const { dest, ext } = await downloadImage(a.imageUrl, destBase);
      agents[i].localImageFile = slug + ext;
      agents[i].localImagePath = dest;
      console.log(`→ ${slug + ext}`);
    } catch (e) {
      imgFails.push({ name: a.name, err: e.message });
      console.log(`FAILED: ${e.message}`);
    }
    if (i < agents.length - 1) await sleep(200);
  }

  // ── Phase 3: write JSON & CSV ──────────────────────────────────────────────
  console.log('\nPhase 3/4 — Writing data files...');

  const jsonData = agents.map(a => ({
    name:           a.name,
    role:           a.role,
    phone:          a.phone,
    email:          a.email,
    bio:            a.bio,
    licensing:      a.licensing,
    profile_url:    a.profileUrl,
    website_url:    a.websiteUrl || '',
    local_image:    a.localImageFile,
    image_url:      a.imageUrl,
    social_links:   [],
  }));

  const jsonPath = path.join(OUTPUT_DIR, 'agents.json');
  const csvPath  = path.join(OUTPUT_DIR, 'agents.csv');
  const pdfPath  = path.join(OUTPUT_DIR, 'team-agents.pdf');

  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf8');
  console.log(`  ✓ agents.json`);
  writeCSV(agents, csvPath);
  console.log(`  ✓ agents.csv`);

  // ── Phase 4: generate PDF ──────────────────────────────────────────────────
  console.log('\nPhase 4/4 — Generating PDF...');
  await generatePDF(agents, pdfPath);
  console.log(`  ✓ team-agents.pdf`);

  // ── Summary ────────────────────────────────────────────────────────────────
  const imgOk    = agents.length - imgFails.length;
  const roleFilled = agents.filter(a => a.role).length;

  console.log('\n' + '='.repeat(50));
  console.log('SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total agents scraped : ${agents.length}`);
  console.log(`Images downloaded    : ${imgOk} / ${agents.length}`);
  console.log(`Roles extracted      : ${roleFilled} / ${agents.length}`);

  if (imgFails.length) {
    console.log('\nFailed image downloads:');
    imgFails.forEach(f => console.log(`  • ${f.name}: ${f.err}`));
  }

  const noRole = agents.filter(a => !a.role);
  if (noRole.length) {
    console.log('\nAgents without role (site may not list one):');
    noRole.forEach(a => console.log(`  • ${a.name}`));
  }

  console.log('\nGenerated files:');
  console.log(`  ${jsonPath}`);
  console.log(`  ${csvPath}`);
  console.log(`  ${pdfPath}`);
  console.log(`  + ${imgOk} image files in ${OUTPUT_DIR}`);
  console.log('');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
