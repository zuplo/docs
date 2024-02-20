import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Policies", () => {
  test.describe("Response Modification", () => {
    [
      { name: "Transform Response Body", href: "/policies/transform-body-outbound" },
      { name: "Remove Response Headers", href: "/policies/remove-headers-outbound" },
      { name: "Clear Response Headers", href: "/policies/clear-headers-outbound" },
      { name: "Set Headers", href: "/policies/set-headers-outbound" },
      { name: "Set Status Code", href: "/policies/set-status-outbound" }
    ].forEach(({ name, href }) => {
      test(`${name} Page Visitable`, async ({ page }) => {
        const response = await page.goto(appUrl(href));
        expect(response?.status()).toBeLessThan(400);
      });
    });
  });
});
