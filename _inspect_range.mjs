import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('https://www.rangedevelopmentsgroup.com/', { waitUntil: 'networkidle2', timeout: 45000 });
await new Promise(r => setTimeout(r, 3000));

// Get full section HTML
const data = await page.evaluate(() => {
  const sec = document.querySelector('.section-4-v2-b');
  if (!sec) return { error: 'not found' };

  // Get computed styles for key elements
  const scroll = sec.querySelector('.scroll');
  const firstImg = sec.querySelector('.img-container');
  const scrollStyles = scroll ? window.getComputedStyle(scroll) : {};
  const firstImgStyles = firstImg ? window.getComputedStyle(firstImg) : {};

  // Find the list/nav side
  const allChildren = Array.from(sec.children).map(c => ({
    tag: c.tagName,
    className: c.className,
    id: c.id,
    childCount: c.children.length,
    innerHTML: c.innerHTML.substring(0, 800)
  }));

  // Find any sticky elements
  const stickyEls = Array.from(sec.querySelectorAll('*')).filter(el => {
    const s = window.getComputedStyle(el);
    return s.position === 'sticky' || s.position === 'fixed';
  }).map(el => ({ tag: el.tagName, className: el.className, id: el.id }));

  // Get full outerHTML limited
  return {
    sectionClass: sec.className,
    outerHTML: sec.outerHTML.substring(0, 6000),
    children: allChildren,
    stickyEls,
    scrollDisplay: scrollStyles.display,
    scrollPosition: scrollStyles.position,
    firstImgWidth: firstImgStyles.width,
    firstImgHeight: firstImgStyles.height,
    firstImgPosition: firstImgStyles.position,
  };
});

console.log(JSON.stringify(data, null, 2));
await browser.close();
