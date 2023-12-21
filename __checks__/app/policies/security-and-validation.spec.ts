import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Policies", () => {
  test.describe("Security & Validation", () => {
    [
      { name: "Rate Limiting", href: "/policies/rate-limit-inbound" },
      { name: "Audit Logs", href: "/policies/audit-log-inbound" },
      { name: "Request Validation", href: "/policies/request-validation-inbound" },
      { name: "Bot Detection", href: "/policies/bot-detection-inbound" },
      { name: "Require Origin", href: "/policies/require-origin-inbound" },
      { name: "Request Size Limit", href: "/policies/request-size-limit-inbound" }
    ].forEach(({ name, href }) => {
      test(`${name} Page Visitable`, async ({ page }) => {
        const response = await page.goto(appUrl(href));
        expect(response?.status()).toBeLessThan(400);
      });
    });
  });
});
