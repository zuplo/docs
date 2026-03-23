/**
 * Verify and capture portal screenshots for docs/articles/custom-domains.mdx
 *
 * Screenshots:
 *   - custom-domains/image.png → Settings > Custom Domains page (~620x210)
 *   - custom-domains/image-2.png → Add Custom Domain dialog (~300x280)
 *
 * Run: npx tsx docs/articles/custom-domains.images.ts
 */
import { Stagehand } from "@browserbasehq/stagehand";
import { chromium } from "playwright-core";
import { config } from "dotenv";
import { existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
config({ path: resolve(ROOT, "../portal/.env.agent-test") });
config({ path: resolve(ROOT, ".env") });

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN ?? "";
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID ?? "";
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET ?? "";
const AUTH0_USERNAME = process.env.AUTH0_USERNAME ?? "";
const AUTH0_PASSWORD = process.env.AUTH0_PASSWORD ?? "";
const PORTAL_URL = process.env.PORTAL_URL ?? "https://portal.zuplo.com";

async function getTokens() {
  const res = await fetch(`${AUTH0_DOMAIN.replace(/\/$/, "")}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "http://auth0.com/oauth/grant-type/password-realm",
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      username: AUTH0_USERNAME,
      password: AUTH0_PASSWORD,
      audience: "https://api.zuplo.com/",
      scope: "openid profile email",
      realm: "Agent-Database",
    }),
  });
  if (!res.ok) throw new Error(`Auth failed: ${await res.text()}`);
  return res.json() as Promise<{ access_token: string; id_token: string }>;
}

const OUTPUT_DIR = resolve(import.meta.dirname, "custom-domains-screenshots");
mkdirSync(OUTPUT_DIR, { recursive: true });

async function main() {
  console.log("Getting tokens...");
  const tokens = await getTokens();
  console.log("Launching Stagehand...");

  const stagehand = new Stagehand({
    env: "LOCAL",
    model: "anthropic/claude-haiku-4-5-20251001",
    headless: true,
    verbose: 0,
  });
  await stagehand.init();

  // Keep stagehand page alive
  const stagehandPage = stagehand.context.pages()[0];
  await stagehandPage.goto("about:blank");

  const pwBrowser = await chromium.connectOverCDP(stagehand.connectURL());
  // Create a NEW context with 2x deviceScaleFactor for Retina screenshots
  const pwContext = await pwBrowser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await pwContext.newPage();

  // Auth
  const tokenJson = JSON.stringify({
    access_token: tokens.access_token,
    id_token: tokens.id_token,
  });
  await pwContext.addInitScript({
    content: `try { if (location.hostname.includes('portal.zuplo.com') || location.hostname.includes('zuplosite.com')) localStorage.setItem('ZUPLO_AGENT_TOKEN', ${JSON.stringify(tokenJson)}); } catch(e) {}`,
  });
  await page.goto(PORTAL_URL, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(5000);
  console.log(`Authenticated: ${page.url()}\n`);

  try {
    // ── image.png: Custom Domains settings page ──────────────────
    console.log("=== Screenshot 1: Custom Domains page ===");

    // Navigate to the my-api project
    await stagehand.act('Click on the project named "my-api"');
    await page.waitForTimeout(3000);

    await stagehand.act('Click "Settings" in the navigation');
    await page.waitForTimeout(2000);
    await stagehand.act('Click "Custom Domains" in the sidebar');
    await page.waitForTimeout(2000);

    // Capture the settings page: full sidebar + main content, no top nav/header
    // The original shows: Settings heading, sidebar with all items, and the
    // Custom Domains content with the Add button and description text.
    // We need: wide enough to show all content, tall enough for the sidebar.

    // Set a wider viewport so nothing gets cut off
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(1000);

    // Find the settings heading to crop from
    const settingsHeading = page
      .locator('h1:has-text("Settings"), h2:has-text("Settings")')
      .first();
    const headingBox = await settingsHeading.boundingBox().catch(() => null);
    const yStart = headingBox ? headingBox.y - 10 : 80;

    const img1Path = resolve(OUTPUT_DIR, "image.png");
    await page.screenshot({
      path: img1Path,
      clip: {
        x: 0,
        y: yStart,
        width: 1300,
        height: 350,
      },
    });
    console.log(`  Saved: ${img1Path}`);

    // Compare with original
    const orig1 = resolve(ROOT, "public/media/custom-domains/image.png");
    console.log(`  Original exists: ${existsSync(orig1)}`);

    // ── image-2.png: Add Custom Domain dialog ────────────────────
    console.log("\n=== Screenshot 2: Add Custom Domain dialog ===");

    await stagehand.act('Click the "Add New Custom Domain" button');
    await page.waitForTimeout(2000);

    // Capture just the dialog element
    const img2Path = resolve(OUTPUT_DIR, "image-2.png");

    // Try multiple selectors for the dialog
    const dialogSelectors = [
      '[role="dialog"]',
      '[data-slot="dialog-content"]',
      '[class*="DialogContent"]',
      '[class*="modal-content"]',
      '[class*="dialog"]',
    ];

    let captured = false;
    for (const sel of dialogSelectors) {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 1000 }).catch(() => false)) {
        // Remove border-radius and border before screenshotting so the
        // image works cleanly inside the docs ModalScreenshot component
        await el.evaluate((node: HTMLElement) => {
          node.style.borderRadius = "0";
          node.style.border = "none";
          node.style.boxShadow = "none";
        });
        await page.waitForTimeout(100);
        await el.screenshot({ path: img2Path });
        console.log(`  Captured dialog via selector: ${sel}`);
        captured = true;
        break;
      }
    }

    if (!captured) {
      // Use Stagehand to find and extract the dialog bounds
      console.log("  Trying element-based crop...");
      const dialogHeading = page.locator('text="Add Custom Domain"').first();
      const headingBox = await dialogHeading.boundingBox().catch(() => null);
      if (headingBox) {
        // Crop around the dialog area
        await page.screenshot({
          path: img2Path,
          clip: {
            x: Math.max(0, headingBox.x - 30),
            y: Math.max(0, headingBox.y - 20),
            width: 420,
            height: 300,
          },
        });
      } else {
        await page.screenshot({ path: img2Path });
      }
    }
    console.log(`  Saved: ${img2Path}`);

    const orig2 = resolve(ROOT, "public/media/custom-domains/image-2.png");
    console.log(`  Original exists: ${existsSync(orig2)}`);

    console.log(`\nDone. Review screenshots in: ${OUTPUT_DIR}`);
    console.log("To replace, copy to public/media/custom-domains/");
  } finally {
    await stagehand.close();
  }
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
