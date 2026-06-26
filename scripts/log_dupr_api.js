import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (req.url().includes('api.dupr.gg') || req.url().includes('mydupr.com')) {
      if (req.method() === 'POST' || req.method() === 'GET') {
        console.log(`\n=== API CALL: ${req.method()} ${req.url()} ===`);
        if (req.postData()) {
          console.log('BODY:', req.postData());
        }
      }
    }
    req.continue();
  });

  console.log("Navigating to login...");
  await page.goto('https://dashboard.dupr.com/login', { waitUntil: 'networkidle2' });
  try {
    await page.waitForSelector('button.cc-allow', { timeout: 2000 });
    await page.click('button.cc-allow');
  } catch (e) {}
  
  console.log("Entering credentials...");
  await page.waitForSelector('input[name="email"]');
  await page.type('input[name="email"]', process.env.DUPR_EMAIL);
  await page.type('input[name="password"]', process.env.DUPR_PASSWORD);
  await page.click('button[type="submit"]');

  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(()=>console.log("nav timeout"));
  console.log("Logged in");
  
  await new Promise(r => setTimeout(r, 5000));
  console.log("Performing search...");
  try {
    const inputs = await page.$$('input');
    for(let input of inputs) {
      await input.type('6K0XQG');
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 1000));
    }
  } catch(e) {
    console.log("Search error:", e.message);
  }
  
  await new Promise(r => setTimeout(r, 10000));
  console.log("Closing browser...");
  await browser.close();
}
run();
