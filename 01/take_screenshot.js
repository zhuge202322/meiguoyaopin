const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:8001/onboard/index.html', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'd:/kehu/meiguoyaopin/01/test_screenshot.png' });
  console.log('Screenshot saved to test_screenshot.png');
  await browser.close();
})();
