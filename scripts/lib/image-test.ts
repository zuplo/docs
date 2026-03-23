/**
 * Shared harness for portal screenshot verification tests.
 *
 * Each .images.ts test file defines a list of screenshots to verify.
 * This harness navigates to the right page, takes a fresh screenshot,
 * and compares it to the existing image.
 *
 * If the existing image is outdated, the new screenshot is saved as a
 * replacement candidate next to the original.
 *
 * IMPORTANT: When screenshotting dialogs/modals, always remove
 * border-radius, border, and box-shadow first. The docs use a
 * ModalScreenshot component that adds its own styling, so the raw
 * image must have square corners and no border.
 */
import { Stagehand } from "@browserbasehq/stagehand";
import { chromium, type Page } from "playwright-core";
import { config } from "dotenv";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
} from "node:fs";
import { dirname, resolve, basename } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const PORTAL_ENV = resolve(ROOT, "../portal/.env.agent-test");
const PUBLIC = resolve(ROOT, "public");

if (!existsSync(PORTAL_ENV)) {
  console.error(`Missing ${PORTAL_ENV}`);
  console.error("Run: cd ~/zuplo/portal && bash scripts/setup-agent-env.sh");
  process.exit(1);
}

config({ path: PORTAL_ENV });
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
  if (!res.ok)
    throw new Error(`Auth0 ROPC failed (${res.status}): ${await res.text()}`);
  return res.json() as Promise<{ access_token: string; id_token: string }>;
}

/** A screenshot to verify. */
export interface ScreenshotSpec {
  /** The image path relative to public/media/ (e.g. "custom-domains/image.png") */
  imagePath: string;
  /** Human description of what the screenshot should show */
  description: string;
  /** Stagehand instructions to navigate to the page that should be screenshotted */
  navigationSteps: string[];
}

export interface ImageTestContext {
  stagehand: Stagehand;
  page: Page;
}

/**
 * Run a portal screenshot verification test.
 *
 * For each screenshot spec:
 * 1. Navigate to the right page using Stagehand
 * 2. Take a fresh screenshot
 * 3. Save as a replacement candidate
 */
export async function imageTest(
  testName: string,
  specs: ScreenshotSpec[],
  callerPath: string,
) {
  const outputDir = resolve(dirname(callerPath), `${testName}-screenshots`);
  mkdirSync(outputDir, { recursive: true });

  console.log(`Getting tokens...`);
  const tokens = await getTokens();
  console.log(`Launching Stagehand...`);

  const stagehand = new Stagehand({
    env: "LOCAL",
    model: "anthropic/claude-haiku-4-5-20251001",
    headless: true,
    verbose: 0,
  });
  await stagehand.init();

  // Keep a reference to the stagehand page to prevent cleanup
  const stagehandPage = stagehand.context.pages()[0];
  await stagehandPage.goto("about:blank");

  const pwBrowser = await chromium.connectOverCDP(stagehand.connectURL());
  // Create a 2x context for high-resolution (Retina) screenshots
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
  await page.goto(PORTAL_URL, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(3000);
  console.log(`Authenticated: ${page.url()}\n`);

  let updated = 0;
  let skipped = 0;
  let missing = 0;

  try {
    for (const spec of specs) {
      console.log(`\n--- ${spec.imagePath} ---`);
      console.log(`  Description: ${spec.description}`);

      const existingPath = resolve(PUBLIC, "media", spec.imagePath);
      const exists = existsSync(existingPath);

      if (!exists) {
        console.log(`  [MISSING] Original image not found at ${existingPath}`);
        missing++;
      }

      // Navigate
      // First go back to projects page for a clean start
      await page.goto(PORTAL_URL, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(2000);

      for (const step of spec.navigationSteps) {
        console.log(`  > ${step}`);
        await stagehand.act(step);
        await page.waitForTimeout(2000);
      }

      // Take screenshot
      const newPath = resolve(outputDir, basename(spec.imagePath));
      await page.screenshot({ path: newPath, fullPage: false });
      console.log(`  [SCREENSHOT] ${newPath}`);

      if (exists) {
        console.log(`  [CHECK] Compare with existing: ${existingPath}`);
        updated++;
      } else {
        console.log(`  [NEW] No existing image — new screenshot created`);
      }
    }

    console.log("\n========================================");
    console.log("         IMAGE TEST SUMMARY");
    console.log("========================================");
    console.log(`  Screenshots taken: ${specs.length}`);
    console.log(`  Updated: ${updated}`);
    console.log(`  Missing originals: ${missing}`);
    console.log(`  Output dir: ${outputDir}`);
    console.log(
      "\nReview the screenshots in the output dir. To replace outdated",
    );
    console.log("images, copy them to public/media/<path>.");
  } finally {
    await stagehand.close();
  }
}
