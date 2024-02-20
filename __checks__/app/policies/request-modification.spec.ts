import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Policies", () => {
  test.describe("Request Modification", () => {
    [
      { name: "Transform Request Body", href: "/policies/transform-body-inbound" },
      { name: "Remove Request Headers", href: "/policies/remove-headers-inbound" },
      { name: "Clear Request Headers", href: "/policies/clear-headers-inbound" },
      { name: "Change Method", href: "/policies/change-method-inbound" }
    ].forEach(({ name, href }) => {
      test(`${name} Page Visitable`, async ({ page }) => {
        const response = await page.goto(appUrl(href));
        expect(response?.status()).toBeLessThan(400);
      });
    });
  });
});
