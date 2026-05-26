import { chromium } from "@playwright/test";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(2000);

const points = [6800, 7700, 8600, 9500];
for (const y of points) {
  await page.evaluate((sy) => window.scrollTo({ top: sy, behavior: "instant" }), y);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `tests/deep-y${y}.png`, fullPage: false });
  console.log(`y=${y}`);
}
await browser.close();
