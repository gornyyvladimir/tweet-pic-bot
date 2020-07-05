const puppeteer = require('puppeteer');

module.exports = async (url, filePath, selector) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 3,
  });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
  await page.addStyleTag({ content: `${selector}{border: 10px solid #fff}` });
  const element = await page.$(selector);
  await element.screenshot({ path: filePath });
  await browser.close();
};
