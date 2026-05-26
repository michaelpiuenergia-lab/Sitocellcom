/**
 * Smoke test debug — screenshot multipli a diverse scroll positions
 * per verificare visibilità del Phone3D a 0%, 30%, 50%, 75%, 100%
 * dello scroll dentro la sezione ImmersivePin.
 */
import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

const logs = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.text().includes("[Phone3D]")) {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  }
});

await page.goto("http://localhost:3001/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(2000);

// La sezione ImmersivePin è alta 300vh = 2700px (viewport 900),
// inizia dopo Hero+BrandMarquee (~1000px) → end at ~3700px.
// Scroll positions: 0%, 25%, 50%, 75%, 100% della sezione.
const sectionStart = 1100;
const sectionH = 2700;

for (const pct of [0, 25, 50, 75, 100]) {
  const y = sectionStart + (sectionH * pct) / 100;
  await page.evaluate((scrollY) => window.scrollTo({ top: scrollY, behavior: "instant" }), y);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `tests/smoke-${pct}.png`, fullPage: false });
  console.log(`Screenshot @ scroll ${pct}% (y=${y}) saved`);
}

console.log("\n=== LOGS ===");
logs.forEach((l) => console.log(l));

await browser.close();
