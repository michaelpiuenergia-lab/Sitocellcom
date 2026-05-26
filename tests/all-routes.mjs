import { chromium } from "@playwright/test";

const routes = [
  { url: "/", file: "01-home" },
  { url: "/prodotti", file: "02-prodotti" },
  { url: "/prodotti/telefoni", file: "03-telefoni" },
  { url: "/prodotti/ricambi", file: "04-ricambi" },
  { url: "/prodotti/accessori", file: "05-accessori" },
  { url: "/riparazioni", file: "06-riparazioni" },
  { url: "/riparazioni/richiedi", file: "07-richiedi" },
  { url: "/rivendi", file: "08-rivendi" },
  { url: "/chi-siamo", file: "09-chi-siamo" },
  { url: "/negozi", file: "10-negozi" },
  { url: "/corsi", file: "11-corsi" },
  { url: "/b2b/login", file: "12-b2b-login" },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.emulateMedia({ reducedMotion: "reduce" });

for (const { url, file } of routes) {
  try {
    await page.goto(`http://localhost:3000${url}`, {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `tests/route-${file}.png`, fullPage: false });
    console.log(`OK ${url}`);
  } catch (e) {
    console.log(`FAIL ${url} → ${e.message}`);
  }
}

await browser.close();
