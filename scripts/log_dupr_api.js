import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

  let authHeaders = null;
  await page.setRequestInterception(true);
  page.on('request', request => {
    const headers = request.headers();
    if (request.url().includes('api.dupr.gg') && headers['authorization'] && headers['authorization'].length > 20) {
      authHeaders = headers;
    }
    request.continue();
  });

  try {
    console.log("Navigating to login...");
    await page.goto('https://dashboard.dupr.com/login', { waitUntil: 'networkidle2' });

    console.log("Entering credentials...");
    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', process.env.DUPR_EMAIL, { delay: 50 });
    await page.type('input[name="password"]', process.env.DUPR_PASSWORD, { delay: 50 });
    await page.click('button[type="submit"]');

    console.log("Waiting for dashboard...");
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 3000)); 

    let retries = 0;
    while (!authHeaders && retries < 15) {
      await new Promise(r => setTimeout(r, 1000));
      retries++;
    }

    if (!authHeaders) {
      console.error("No auth headers");
      process.exit(1);
    }

    console.log("Fetching profile...");
    const profileData = await page.evaluate(async (headersObj) => {
      try {
        const safeHeaders = {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
          'Authorization': headersObj['authorization']
        };
        const res = await fetch('https://api.dupr.gg/user/v1.0/profile', {
          method: 'GET',
          headers: safeHeaders
        });
        return await res.json();
      } catch (e) {
        return { error: e.message };
      }
    }, authHeaders);

    console.log(JSON.stringify(profileData, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}
run();
