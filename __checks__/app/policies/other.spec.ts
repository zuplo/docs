import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Policies", () => {
  test.describe("Other", () => {
    [
      { name: "Composite Inbound", href: "/policies/composite-inbound" },
      { name: "Brown Out", href: "/policies/brownout-inbound" },
      { name: "Caching", href: "/policies/caching-inbound" },
      { name: "Custom Code Inbound", href: "/policies/custom-code-inbound" },
      { name: "Custom Code Outbound", href: "/policies/custom-code-outbound" }
    ].forEach(({ name, href }) => {
      test(`${name} Page Visitable`, async ({ page }) => {
        const response = await page.goto(appUrl(href));
        expect(response?.status()).toBeLessThan(400);
      });
    });
  });
});
