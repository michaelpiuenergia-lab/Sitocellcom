import { chromium } from "@playwright/test";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto("http://localhost:3000/riparazioni", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(1500);

const h = await page.evaluate(() => document.body.scrollHeight);
console.log(`height=${h}`);

const steps = [0, 900, 1800, 2700, 3600, 4500, 5400, h - 900].filter((y, i, a) => y >= 0 && a.indexOf(y) === i);
for (const y of steps) {
  await page.evaluate((sy) => window.scrollTo({ top: sy, behavior: "instant" }), y);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `tests/rip-y${y}.png`, fullPage: false });
  console.log(`y=${y}`);
}
await browser.close();
