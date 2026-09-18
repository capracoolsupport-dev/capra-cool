import { chromium } from "@playwright/test";
import path from "path";

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const outDir = "C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\b11313e0-26b9-45f0-96cb-19192d6ca16d";

  // 1. Hero & Header
  await page.screenshot({ path: path.join(outDir, "capra_hero_header.png"), clip: { x: 0, y: 0, width: 1440, height: 750 } });

  // 2. Discover Category Cards & All Products
  const shopEl = await page.$("#shop");
  if (shopEl) {
    await page.evaluate(() => document.getElementById("discover").scrollIntoView());
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, "capra_catalog.png"), clip: { x: 0, y: 650, width: 1440, height: 900 } });
  }

  // 3. Open Size Selector & Bag Drawer
  await page.evaluate(() => document.getElementById("shop").scrollIntoView());
  await page.waitForTimeout(500);
  await page.locator('.product[data-product-id="alpine-hoodie"] .add-btn').click();
  await page.waitForTimeout(400);
  await page.locator('#sizeModalButtons .size-btn[data-size="L"]').click();
  await page.locator('#sizeModal button:has-text("Add to Bag")').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, "capra_bag_drawer.png") });

  await browser.close();
  console.log("Screenshots captured successfully!");
}

run().catch(console.error);
