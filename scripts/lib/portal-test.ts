/**
 * Shared test harness for verifying docs against the real Zuplo portal.
 *
 * Launches Stagehand (LOCAL) + Playwright via CDP, authenticates to the
 * portal, and provides helpers for writing doc verification tests.
 *
 * Usage in a test file:
 *   import { portalTest } from "../../scripts/lib/portal-test.ts";
 *   await portalTest("doc-name", async ({ stagehand, page }) => { ... });
 */
import { Stagehand } from "@browserbasehq/stagehand";
import { chromium, type Page } from "playwright-core";
import { config } from "dotenv";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const PORTAL_ENV = resolve(ROOT, "../portal/.env.agent-test");

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

// ── Finding reporter ──────────────────────────────────────────────

export interface Finding {
  step: string;
  status: "PASS" | "FAIL" | "WARN";
  doc: string;
  actual: string;
}

export function createReporter() {
  const findings: Finding[] = [];

  function pass(step: string, doc: string, actual?: string) {
    findings.push({ step, status: "PASS", doc, actual: actual ?? doc });
    console.log(`  [PASS] ${step}: ${doc}`);
  }
  function fail(step: string, doc: string, actual: string) {
    findings.push({ step, status: "FAIL", doc, actual });
    console.log(`  [FAIL] ${step}: ${doc}`);
    console.log(`         Actual: ${actual}`);
  }
  function warn(step: string, doc: string, actual: string) {
    findings.push({ step, status: "WARN", doc, actual });
    console.log(`  [WARN] ${step}: ${doc}`);
    console.log(`         Actual: ${actual}`);
  }

  function summary() {
    const p = findings.filter((f) => f.status === "PASS").length;
    const fl = findings.filter((f) => f.status === "FAIL").length;
    const w = findings.filter((f) => f.status === "WARN").length;
    console.log("\n========================================");
    console.log("         VERIFICATION SUMMARY");
    console.log("========================================");
    console.log(`  PASS: ${p}  |  FAIL: ${fl}  |  WARN: ${w}\n`);
    if (fl > 0) {
      console.log("--- FAILURES ---");
      for (const x of findings.filter((x) => x.status === "FAIL"))
        console.log(
          `  [${x.step}] Doc: ${x.doc}\n           Got: ${x.actual}\n`,
        );
    }
    if (w > 0) {
      console.log("--- WARNINGS ---");
      for (const x of findings.filter((x) => x.status === "WARN"))
        console.log(
          `  [${x.step}] Doc: ${x.doc}\n           Got: ${x.actual}\n`,
        );
    }
    return { pass: p, fail: fl, warn: w };
  }

  return { findings, pass, fail, warn, summary };
}

// ── Test harness ──────────────────────────────────────────────────

export interface TestContext {
  stagehand: Stagehand;
  /** Playwright page — use for screenshots, keyboard, evaluate, locator */
  page: Page;
  /** Screenshot helper: snap("step-name") */
  snap: (name: string) => Promise<string>;
  /** Finding reporter */
  report: ReturnType<typeof createReporter>;
  /** Portal base URL */
  portalUrl: string;
}

/**
 * Run a portal doc verification test.
 *
 * @param name  Test name (used for screenshot subfolder)
 * @param testFn  Async function receiving the test context
 * @param callerPath  Pass `import.meta.filename` so screenshots go next to the test
 */
export async function portalTest(
  name: string,
  testFn: (ctx: TestContext) => Promise<void>,
  callerPath?: string,
) {
  // Screenshot dir next to the calling test file
  const screenshotDir = callerPath
    ? resolve(dirname(callerPath), `${name}-screenshots`)
    : resolve(ROOT, `docs/${name}-screenshots`);
  mkdirSync(screenshotDir, { recursive: true });

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

  // Connect Playwright via CDP for full page API
  const pwBrowser = await chromium.connectOverCDP(stagehand.connectURL());
  const pwContext = pwBrowser.contexts()[0];
  const page = pwContext.pages()[0];

  // Auth: inject token via addInitScript before portal can redirect
  const tokenJson = JSON.stringify({
    access_token: tokens.access_token,
    id_token: tokens.id_token,
  });
  await pwContext.addInitScript({
    content: `try { if (location.hostname.includes('portal.zuplo.com') || location.hostname.includes('zuplosite.com')) localStorage.setItem('ZUPLO_AGENT_TOKEN', ${JSON.stringify(tokenJson)}); } catch(e) {}`,
  });
  await page.goto(PORTAL_URL, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(3000);
  console.log(`Authenticated: ${page.url()}\n`);

  const snap = async (stepName: string) => {
    const path = resolve(screenshotDir, `${stepName}.png`);
    await page.screenshot({ path, fullPage: true });
    console.log(`  [screenshot] ${stepName}.png`);
    return path;
  };

  const report = createReporter();

  try {
    await testFn({ stagehand, page, snap, report, portalUrl: PORTAL_URL });
    report.summary();
  } finally {
    await stagehand.close();
  }
}
