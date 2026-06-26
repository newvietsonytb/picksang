import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load env vars
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DUPR_EMAIL = process.env.DUPR_EMAIL;
const DUPR_PASSWORD = process.env.DUPR_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !DUPR_EMAIL || !DUPR_PASSWORD) {
  console.error("Missing required environment variables!");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log("Starting Puppeteer...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set generic viewport and user agent to avoid bot detection
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
    console.log("Navigating to DUPR Login...");
    await page.goto('https://dashboard.dupr.com/login', { waitUntil: 'networkidle2' });

    // Wait for email input
    console.log("Entering credentials...");
    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', DUPR_EMAIL, { delay: 50 });
    await page.type('input[name="password"]', DUPR_PASSWORD, { delay: 50 });
    
    // Click login button
    await page.click('button[type="submit"]');

    console.log("Waiting for dashboard to load...");
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => console.log("Navigation timeout, proceeding anyway"));
    await delay(3000); 

    console.log("Waiting to capture Auth Headers...");
    let retries = 0;
    while (!authHeaders && retries < 15) {
      await delay(1000);
      retries++;
    }

    if (!authHeaders) {
      console.error("Failed to capture Auth Headers. Exiting.");
      process.exit(1);
    }
    console.log("Auth Headers captured successfully.");

    console.log("Fetching players from Supabase...");
    const { data: players, error } = await supabase
      .from('players')
      .select('*')
      .not('dupr_id', 'is', null);
      
    if (error) throw error;
    
    console.log(`Found ${players.length} players with DUPR ID.`);

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      console.log(`[${i+1}/${players.length}] Fetching DUPR for ${player.full_name} (${player.dupr_id})...`);
      
      const duprData = await page.evaluate(async (duprId, headersObj) => {
        try {
          // ensure we only send necessary headers to avoid browser security restrictions
          const safeHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
            'Authorization': headersObj['authorization']
          };
          if (headersObj['x-dupr-version']) safeHeaders['x-dupr-version'] = headersObj['x-dupr-version'];
          if (headersObj['dupr-version']) safeHeaders['dupr-version'] = headersObj['dupr-version'];

          const res = await fetch('https://api.dupr.gg/player/v1.0/search', {
            method: 'POST',
            headers: safeHeaders,
            body: JSON.stringify({
              limit: 10,
              offset: 0,
              query: duprId,
              exclude: [],
              includeUnclaimedPlayers: true,
              filter: {
                lat: null,
                lng: null,
                radiusInMeters: null,
                rating: { maxRating: null, minRating: null },
                locationText: ""
              }
            })
          });
          return await res.json();
        } catch (e) {
          return { error: e.message };
        }
      }, player.dupr_id, authHeaders);

      if (duprData && duprData.status === 'SUCCESS' && duprData.result && duprData.result.hits.length > 0) {
        const hit = duprData.result.hits[0];
        const doublesRating = hit.ratings?.doubles;
        
        if (doublesRating && doublesRating !== 'NR') {
          const ratingNum = parseFloat(doublesRating);
          
          if (!isNaN(ratingNum)) {
            console.log(`  -> New Rating: ${ratingNum}`);
            
            const { error: updateErr } = await supabase
              .from('players')
              .update({ current_dupr: ratingNum })
              .eq('id', player.id);
              
            if (updateErr) console.error(`  -> Failed to update:`, updateErr.message);
          } else {
            console.log(`  -> Invalid rating format: ${doublesRating}`);
          }
        } else {
          console.log(`  -> Player is Unrated (NR)`);
        }
      } else {
        console.log(`  -> Failed to fetch or no hits:`, duprData);
      }

      if (i < players.length - 1) {
        const sleepTime = 15000 + Math.random() * 10000; // 15s to 25s
        console.log(`  Waiting ${(sleepTime/1000).toFixed(1)}s...`);
        await delay(sleepTime);
      }
    }

    console.log("Successfully completed DUPR sync!");

  } catch (err) {
    console.error("Error during execution:", err);
  } finally {
    await browser.close();
  }
}

run();
