import puppeteer from 'puppeteer-core';
const exe = String.raw`C:\Program Files\Google\Chrome\Application\chrome.exe`;
const browser = await puppeteer.launch({executablePath: exe, args:['--no-sandbox','--disable-setuid-sandbox']});
const page = await browser.newPage();
await page.setViewport({width:1440, height:900, deviceScaleFactor:1});
await page.goto('http://localhost:3000/homepage.html', {waitUntil:'networkidle2', timeout:30000});
await new Promise(r=>setTimeout(r,1500));
const clip = await page.evaluate(()=>{
  const el = document.querySelector('#testimonials');
  const r = el.getBoundingClientRect();
  return {x:r.left, y:r.top+window.scrollY, width:r.width, height:r.height};
});
console.log('clip', JSON.stringify(clip));
await page.screenshot({path:'./temporary screenshots/screenshot-1-t-crop.png', clip});
await browser.close();
console.log('saved');
