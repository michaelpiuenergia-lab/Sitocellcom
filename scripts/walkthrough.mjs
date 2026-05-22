import { chromium } from "playwright";
import { mkdirSync } from "fs";

mkdirSync("walkthrough", { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const routes = [
  { url: "/", name: "01-home" },
  { url: "/", name: "02-home-scrolled", scrollY: 1200 },
  { url: "/prodotti", name: "03-catalogo-landing" },
  { url: "/prodotti/telefoni", name: "04-telefoni" },
  { url: "/prodotti/ricambi", name: "05-ricambi" },
  { url: "/prodotti/accessori", name: "06-accessori" },
  { url: "/riparazioni", name: "07-riparazioni" },
  { url: "/negozi", name: "08-negozi" },
  { url: "/chi-siamo", name: "09-chi-siamo" },
];

const results = [];

for (const r of routes) {
  const fullUrl = `http://localhost:3000${r.url}`;
  console.log(`→ ${fullUrl}`);
  const errors = [];
  const consoleMsgs = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") {
      consoleMsgs.push(`${m.type()}: ${m.text().slice(0, 200)}`);
    }
  });

  try {
    await page.goto(fullUrl, { waitUntil: "networkidle", timeout: 30000 });
  } catch (e) {
    console.log(`  fail goto: ${e.message.slice(0, 100)}`);
  }
  if (r.scrollY) {
    await page.evaluate((y) => window.scrollTo(0, y), r.scrollY);
    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(1500);

  const file = `walkthrough/${r.name}.png`;
  await page.screenshot({ path: file, fullPage: false });

  // Extract diagnostics
  const title = await page.title();
  const heroText = await page.locator("h1").first().innerText().catch(() => "");
  const visibleProducts = await page.locator('text=/€\\s*\\d/').count();

  results.push({ name: r.name, url: r.url, title, heroText: heroText.slice(0, 80), visibleProducts, errors, consoleMsgs });
  page.removeAllListeners("pageerror");
  page.removeAllListeners("console");
}

// Test ricambi: prova ad aprire dropdown e selezionare un modello
console.log("\n→ INTERAZIONE DROPDOWN RICAMBI");
await page.goto("http://localhost:3000/prodotti/ricambi", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
const dropdownBefore = await page.locator("[aria-haspopup='listbox']").count();
console.log(`  Trigger button found: ${dropdownBefore}`);
await page.screenshot({ path: "walkthrough/10-ricambi-before-click.png", fullPage: false });

if (dropdownBefore > 0) {
  await page.locator("[aria-haspopup='listbox']").click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: "walkthrough/11-ricambi-dropdown-open.png", fullPage: false });

  // Conta option visibili
  const options = await page.locator('[role="option"] button').count();
  console.log(`  Options visible: ${options}`);

  // Seleziona prima option (non "Tutti")
  if (options > 1) {
    await page.locator('[role="option"] button').nth(1).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "walkthrough/12-ricambi-after-select.png", fullPage: false });
    const afterCount = await page.locator('text=/€\\s*\\d/').count();
    console.log(`  Products after select: ${afterCount}`);
  }
}

console.log("\n=== DIAGNOSTICA ===");
for (const r of results) {
  console.log(`\n${r.name}  ${r.url}`);
  console.log(`  Title: ${r.title}`);
  console.log(`  H1: ${r.heroText}`);
  console.log(`  Prezzi visibili (€): ${r.visibleProducts}`);
  if (r.errors.length) console.log(`  ⚠ Pageerror: ${r.errors.join(" | ")}`);
  if (r.consoleMsgs.length) console.log(`  ⚠ Console: ${r.consoleMsgs.slice(0, 3).join(" | ")}`);
}

await browser.close();
console.log("\n✓ Screenshot in walkthrough/");
