---
name: verify-portal-docs
description:
  Verify documentation against the real Zuplo portal UI using Stagehand and
  agent auth. Use when reviewing docs PRs that reference portal navigation, UI
  elements, tab names, button labels, or settings pages. Also use when the user
  asks to check if docs match the current portal UI.
---

# Verify Portal Docs Against Real Portal UI

This skill automates verification of Zuplo documentation against the actual
portal UI using **Stagehand v3** (AI-powered browser automation) with agent
authentication.

## When to Use

- Reviewing PRs that change portal navigation instructions
- Checking if UI element names (tabs, buttons, sections) in docs match reality
- Verifying getting-started or tutorial steps against the current portal
- Any time docs reference portal UI elements that could be outdated

## Setup

### Dependencies

The verification scripts live in `scripts/verify-docs/` and require:

```bash
npm install @browserbasehq/stagehand zod @playwright/test dotenv
npx playwright install chromium
```

### Credentials

1. Need `ANTHROPIC_API_KEY` in the project `.env` file (for Stagehand AI)
2. Need portal agent auth credentials in `~/zuplo/portal/.env.agent-test`

To get agent auth credentials from 1Password:

```bash
cd ~/zuplo/portal && bash scripts/setup-agent-env.sh
```

## Architecture

### Stagehand + Playwright CDP Integration

Stagehand v3 runs a LOCAL browser. We connect Playwright to the same browser via
CDP to get full Playwright page API for auth injection and screenshots, while
using Stagehand's AI methods for verification.

```
Stagehand (LOCAL) → launches Chromium
    ↓
Playwright connects via CDP (stagehand.connectURL())
    ↓
pwPage: full Playwright API (route, evaluate, screenshot, keyboard)
stagehand: AI methods (act, extract, observe)
```

### Auth Injection

The portal redirects to Auth0 if no token is found. To authenticate:

1. Connect Playwright to Stagehand's browser via CDP
2. Use `context.addInitScript()` to inject the token into localStorage before
   the portal SPA can read it and redirect
3. Navigate to the portal — the SPA reads the token and stays logged in

This is the KEY technique. You cannot use `page.evaluate()` to set localStorage
because by the time the page loads, Auth0 has already redirected and the origin
has changed. The `addInitScript` runs before any page JavaScript.

```ts
await pwContext.addInitScript({
  content: `
    try {
      if (window.location.hostname.includes('portal.zuplo.com')) {
        localStorage.setItem('ZUPLO_AGENT_TOKEN', ${JSON.stringify(tokenJson)});
      }
    } catch(e) {}
  `,
});
await pwPage.goto(PORTAL_URL, { waitUntil: "networkidle" });
```

## Stagehand v3 API (key details)

- **Constructor**:
  `new Stagehand({ env: "LOCAL", model: "anthropic/claude-haiku-4-5-20251001", headless: true })`
  - The param is `model`, NOT `modelName`
- **Get page**: `stagehand.context.pages()[0]` (NOT `stagehand.page`)
- **Connect CDP**: `stagehand.connectURL()` returns the WebSocket URL
- **act**: `stagehand.act("Click the Create Team button")` — positional string,
  not object
- **extract**:
  `stagehand.extract("What tabs are visible?", z.object({ tabs: z.array(z.string()) }))`
  — positional args
- **observe**: `stagehand.observe("Find the New Project button")` — returns
  array of found elements

### Important: Stagehand page vs Playwright page

The Stagehand page object does NOT have `keyboard`, `route`, `evaluate`,
`waitForTimeout`, or `locator`. For those, use the Playwright page connected via
CDP:

```ts
const pwBrowser = await chromium.connectOverCDP(stagehand.connectURL());
const pwContext = pwBrowser.contexts()[0];
const pwPage = pwContext.pages()[0];

// Use pwPage for: screenshots, keyboard, evaluate, route, locator, waitForTimeout
// Use stagehand for: act, extract, observe (AI-powered)
```

## Running Verification Scripts

```bash
npx tsx scripts/verify-docs/ai-gateway-getting-started.ts
```

Scripts output PASS/FAIL/WARN findings and save screenshots to
`scripts/verify-docs/screenshots/`.

## Known Portal UI Structure (as of 2026-03-23)

### Project Types

**API Gateway projects** tabs: Project | Code | Environments | Logs | Analytics
| Services | Settings

**AI Gateway projects** tabs: Project | Apps | Teams | Settings

AI Gateway projects do NOT have Code, Environments, Logs, Analytics, or Services
tabs.

### Project Creation Flow

1. Click "New Project" button on Projects list
2. Dialog shows project type dropdown ("API Gateway" by default)
3. For AI Gateway: click "AI or MCP Gateway" link at bottom of dialog
4. There is NO "AI Gateway" template — templates are only "Starter Project" and
   "Empty Project"
5. Enter name, click "Create Project"

### AI Gateway Team Detail

Tabs: Overview | Usage & Limits | Members | Settings

- Create Team form has: name field, icon picker, "Create Team" button
- Limits are set AFTER creation via "Usage & Limits" tab (not during creation)
- "Create Sub-Team" button appears in team detail view

### AI Gateway App Form Fields

App Name, Team, Provider, Completions (model), Embeddings (model), Budget Limit
(DAILY/MONTHLY), Budget Warning (DAILY/MONTHLY), Tokens Limit (DAILY/MONTHLY),
Tokens Warning (DAILY/MONTHLY), Requests Limit (DAILY/MONTHLY), Requests Warning
(DAILY/MONTHLY), Semantic Caching (toggle), Semantic Tolerance

Note: there is NO single "Model" field — it's split into "Completions" and
"Embeddings".

### Project Settings Sidebar (API Gateway)

General, Custom Domains, Members & Access, Environment Variables, Source
Control, API Key Consumers, Billing, Environments, Zuplo API Keys

### Project Settings Sidebar (AI Gateway)

General, AI Providers, Members & Access, Usage Limits & Thresholds

### Account Settings Sidebar

General, Billing, Members, API Keys, Custom Domains, Feature Previews, Security,
Audit Logs, Compliance & Trust, Support

## Common Doc Errors to Check For

- "Files tab" should be "Code tab"
- "Settings tab" should just be "Settings" (click action)
- "Members tab" should be "Members & Access" (in project settings)
- "Custom Domain" should be "Custom Domains" (plural)
- "Upgrade & Billing" should be "Billing"
- "Project Information" in settings sidebar is labeled "General"
- AI Gateway docs should not reference "Code tab"
- "Model" field in app creation is actually "Completions"/"Embeddings"
- Team limits are on "Usage & Limits" tab, not "Settings"
- No "AI Gateway" template — use "AI or MCP Gateway" link
- "Add New Custom Domain" button is now "Add Custom Domain"

## Screenshot Guidelines

### Dialogs/Modals

When screenshotting dialogs or modals, ALWAYS remove border-radius, border, and
box-shadow before capturing. The docs use a `<ModalScreenshot>` component that
adds its own rounded corners and shadow, so the raw image must have square
corners and no border.

```ts
await el.evaluate((node: HTMLElement) => {
  node.style.borderRadius = "0";
  node.style.border = "none";
  node.style.boxShadow = "none";
});
await page.waitForTimeout(100);
await el.screenshot({ path: outputPath });
```

The dialog selector in the portal is `[data-slot="dialog-content"]` (not
`[role="dialog"]` which doesn't always match).

### Page Screenshots

For non-modal screenshots, crop to match the approximate size of the existing
image. Don't take full-page screenshots — use `clip` to capture just the
relevant content area. Typical approach:

```ts
// Find where content starts (below the nav bar)
const navBox = await page.locator("nav").first().boundingBox();
const yStart = navBox ? navBox.y + navBox.height + 8 : 100;
await page.screenshot({
  path: outputPath,
  clip: { x: 0, y: yStart, width: 960, height: 280 },
});
```

### High-Resolution (2x/Retina)

Always take screenshots at 2x device scale factor. Create a new browser context
with `deviceScaleFactor: 2`:

```ts
const pwContext = await pwBrowser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await pwContext.newPage();
```

This produces images at double the CSS pixel dimensions (e.g. a 1300x350 clip
becomes a 2600x700 pixel image), which look sharp on Retina displays and match
the quality of existing CDN-hosted images.

### Direct URL Navigation

Instead of clicking through the portal step by step, navigate directly to the
target page via URL. Portal URLs follow the pattern:
`https://portal.zuplo.com/accounts/{account}/projects/{project}/settings/custom-domains`

This is faster and more reliable than using Stagehand to click through multiple
navigation steps.
