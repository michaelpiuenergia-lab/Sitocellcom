import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// Salta animazioni reducendole, ma non disabilitando completamente perché
// vogliamo lo stato finale (post-flash)
await page.emulateMedia({ reducedMotion: "reduce" });

await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(2000);

// Screenshot hero @ top
await page.screenshot({ path: "tests/home-1-hero.png", fullPage: false });
console.log("1/6 hero saved");

// scroll alla brand marquee + immersive pin start
await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
await page.waitForTimeout(800);
await page.screenshot({ path: "tests/home-2-marquee-pin.png", fullPage: false });
console.log("2/6 marquee+pin saved");

// dentro immersive pin
await page.evaluate(() => window.scrollTo({ top: 2400, behavior: "instant" }));
await page.waitForTimeout(800);
await page.screenshot({ path: "tests/home-3-pin-mid.png", fullPage: false });
console.log("3/6 pin mid saved");

// lifecycle showcase
await page.evaluate(() => window.scrollTo({ top: 4200, behavior: "instant" }));
await page.waitForTimeout(800);
await page.screenshot({ path: "tests/home-4-lifecycle.png", fullPage: false });
console.log("4/6 lifecycle saved");

// stats + why bento
await page.evaluate(() => window.scrollTo({ top: 5400, behavior: "instant" }));
await page.waitForTimeout(800);
await page.screenshot({ path: "tests/home-5-stats-bento.png", fullPage: false });
console.log("5/6 stats+bento saved");

// service cards + b2b + footer
await page.evaluate(() => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" });
});
await page.waitForTimeout(800);
await page.screenshot({ path: "tests/home-6-bottom.png", fullPage: false });
console.log("6/6 bottom saved");

// height totale
const h = await page.evaluate(() => document.body.scrollHeight);
console.log(`\nPage total height: ${h}px`);

await browser.close();
