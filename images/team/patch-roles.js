// Re-scrapes roles from individual pages, updates JSON/CSV/PDF (images already downloaded)
const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const PDFDocument = require('pdfkit');

const DIR = path.join(__dirname);

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchResponse(url, max = 6) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124' } }, (res) => {
      if ([301,302,307,308].includes(res.statusCode) && res.headers.location && max > 0) {
        res.resume();
        const next = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
        return fetchResponse(next, max - 1).then(resolve).catch(reject);
      }
      resolve(res);
    }).on('error', reject).setTimeout(30000, function(){ this.destroy(new Error('Timeout')); });
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

function extractRoleAndLicensing(html) {
  const result = { role: '', licensing: '' };
  const roleM = html.match(/class="single-agent-header-info-title"[^>]*>([^<]{2,100})<\//i);
  if (roleM) result.role = roleM[1].replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').trim();
  const licM = html.match(/Licensing[:\s]+([A-Z]+\.\d+)/i);
  if (licM) result.licensing = licM[1];
  return result;
}

function writeCSV(agents, filePath) {
  const headers = ['name','role','phone','email','bio','licensing','profile_url','website_url','local_image_file','image_url'];
  const esc = v => `"${String(v || '').replace(/"/g,'""')}"`;
  const rows = agents.map(a => [
    esc(a.name), esc(a.role), esc(a.phone), esc(a.email), esc(a.bio),
    esc(a.licensing), esc(a.profileUrl), esc(a.websiteUrl||''),
    esc(a.localImageFile||''), esc(a.imageUrl),
  ].join(','));
  fs.writeFileSync(filePath, [headers.join(','), ...rows].join('\r\n'), 'utf8');
}

async function generatePDF(agents, filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const W = doc.page.width;
    const H = doc.page.height;
    const PAD = 50;

    // Title page
    doc.rect(0, 0, W, H).fill('#1a2744');
    doc.rect(0, H * 0.38, W, 4).fill('#c4a44a');
    doc.rect(0, H * 0.38 + 8, W, 1).fill('#c4a44a');
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(34)
       .text('Palisade Realty', PAD, H * 0.40, { width: W - PAD*2, align: 'center' });
    doc.fillColor('#c4a44a').font('Helvetica').fontSize(16)
       .text('Agent Directory', PAD, H * 0.40 + 48, { width: W - PAD*2, align: 'center' });
    doc.fillColor('#aabbcc').font('Helvetica').fontSize(12)
       .text('Las Vegas & Henderson, NV', PAD, H * 0.40 + 78, { width: W - PAD*2, align: 'center' });
    doc.fillColor('#7788aa').font('Helvetica').fontSize(10)
       .text(`${agents.length} Team Members  •  www.palisaderealty.com`, PAD, H * 0.40 + 104, { width: W - PAD*2, align: 'center' });

    for (const agent of agents) {
      doc.addPage();

      doc.rect(0, 0, W, 230).fill('#f4f6fb');
      doc.rect(0, 228, W, 3).fill('#1a2744');
      doc.rect(0, 231, W, 1).fill('#c4a44a');

      const IMG_SIZE = 160;
      const imgX = PAD;
      const imgY = PAD - 10;
      const textX = imgX + IMG_SIZE + 28;
      const textWidth = W - textX - PAD;

      // Photo
      let imgOk = false;
      if (agent.localImagePath && fs.existsSync(agent.localImagePath)) {
        try {
          doc.save();
          doc.rect(imgX, imgY, IMG_SIZE, IMG_SIZE).clip();
          doc.image(agent.localImagePath, imgX, imgY, { fit: [IMG_SIZE, IMG_SIZE], align: 'center', valign: 'center' });
          doc.restore();
          doc.rect(imgX, imgY, IMG_SIZE, IMG_SIZE).lineWidth(1).strokeColor('#cccccc').stroke();
          imgOk = true;
        } catch (_) {}
      }
      if (!imgOk) {
        doc.rect(imgX, imgY, IMG_SIZE, IMG_SIZE).fill('#dde3ee');
        doc.fillColor('#99aabb').fontSize(9).text('No Photo', imgX, imgY + IMG_SIZE/2 - 5, { width: IMG_SIZE, align: 'center' });
      }

      let ty = imgY;
      doc.fillColor('#1a2744').font('Helvetica-Bold').fontSize(22)
         .text(agent.name, textX, ty, { width: textWidth });
      ty += 28;

      if (agent.role) {
        doc.fillColor('#c4a44a').font('Helvetica').fontSize(12)
           .text(agent.role, textX, ty, { width: textWidth });
        ty += 18;
      }

      ty += 10;
      doc.moveTo(textX, ty).lineTo(textX + textWidth, ty).lineWidth(0.75).strokeColor('#cccccc').stroke();
      ty += 12;

      const LWIDTH = 55;
      const vx = textX + LWIDTH + 4;
      const vw = textWidth - LWIDTH - 4;

      function row(label, value, color) {
        if (!value) return;
        doc.fillColor('#888888').font('Helvetica-Bold').fontSize(9).text(label, textX, ty, { width: LWIDTH });
        doc.fillColor(color || '#333333').font('Helvetica').fontSize(9).text(value, vx, ty, { width: vw });
        ty += 15;
      }

      row('Phone:', agent.phone);
      row('Email:', agent.email, '#1a5fb4');
      row('Profile:', agent.profileUrl, '#1a5fb4');
      if (agent.websiteUrl) row('Website:', agent.websiteUrl, '#1a5fb4');
      if (agent.licensing) row('License:', agent.licensing);

      if (agent.bio && agent.bio.trim()) {
        const bioY = Math.max(ty + 10, imgY + IMG_SIZE + 20);
        doc.moveTo(PAD, bioY - 6).lineTo(W - PAD, bioY - 6).lineWidth(0.5).strokeColor('#eeeeee').stroke();
        doc.fillColor('#444444').font('Helvetica').fontSize(10)
           .text(agent.bio.trim(), PAD, bioY, { width: W - PAD*2, lineGap: 3 });
      }

      doc.fillColor('#aaaaaa').font('Helvetica').fontSize(8)
         .text('Palisade Realty  •  palisaderealty.com', PAD, H - 35, { width: W - PAD*2, align: 'center' });
    }

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

async function main() {
  // Load existing JSON
  const jsonPath = path.join(DIR, 'agents.json');
  const agents = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Resolve local image paths
  for (const a of agents) {
    if (a.local_image) {
      a.localImageFile = a.local_image;
      a.localImagePath = path.join(DIR, a.local_image);
    }
    // normalise field names
    a.profileUrl  = a.profile_url  || a.profileUrl  || '';
    a.websiteUrl  = a.website_url  || a.websiteUrl  || '';
    a.imageUrl    = a.image_url    || a.imageUrl    || '';
  }

  console.log(`\nRe-scraping roles for ${agents.length} agents...\n`);
  for (let i = 0; i < agents.length; i++) {
    const a = agents[i];
    process.stdout.write(`  [${String(i+1).padStart(2)}/${agents.length}] ${a.name.padEnd(28)} `);
    try {
      const html = await fetchText(a.profileUrl);
      const { role, licensing } = extractRoleAndLicensing(html);
      agents[i].role      = role;
      agents[i].licensing = licensing || agents[i].licensing || '';
      console.log(`role="${role || '—'}"  lic="${licensing || a.licensing || '—'}"`);
    } catch (e) {
      console.log(`WARN: ${e.message}`);
    }
    if (i < agents.length - 1) await sleep(350);
  }

  // Update JSON
  const jsonOut = agents.map(a => ({
    name:        a.name,
    role:        a.role || '',
    phone:       a.phone,
    email:       a.email,
    bio:         a.bio || '',
    licensing:   a.licensing || '',
    profile_url: a.profileUrl,
    website_url: a.websiteUrl || '',
    local_image: a.localImageFile || '',
    image_url:   a.imageUrl,
    social_links: a.social_links || [],
  }));
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 2), 'utf8');
  console.log('\n✓ agents.json updated');

  writeCSV(agents, path.join(DIR, 'agents.csv'));
  console.log('✓ agents.csv updated');

  await generatePDF(agents, path.join(DIR, 'team-agents.pdf'));
  console.log('✓ team-agents.pdf regenerated');

  const withRole = agents.filter(a => a.role).length;
  console.log(`\nRoles filled: ${withRole}/${agents.length}`);
  if (withRole < agents.length) {
    console.log('Still missing:');
    agents.filter(a => !a.role).forEach(a => console.log(`  • ${a.name}`));
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
