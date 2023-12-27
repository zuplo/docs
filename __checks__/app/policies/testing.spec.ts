import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Policies", () => {
  test.describe("Testing", () => {
    [
      { name: "A/B Test Inbound", href: "/policies/ab-test-inbound" },
      { name: "Mock API Response", href: "/policies/mock-api-inbound" },
      { name: "Sleep / Delay", href: "/policies/sleep-inbound" },
    ].forEach(({ name, href }) => {
      test(`${name} Page Visitable`, async ({ page }) => {
        const response = await page.goto(appUrl(href));
        expect(response?.status()).toBeLessThan(400);
      });
    });
  });
});
