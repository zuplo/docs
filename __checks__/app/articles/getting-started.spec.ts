import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Getting Started", () => {
  [
    { name: "Step 1", href: "/articles/step-1-setup-basic-gateway" },
    { name: "Step 2", href: "/articles/step-2-add-api-key-auth" },
    { name: "Step 3", href: "/articles/step-3-add-rate-limiting" },
    { name: "Step 4", href: "/articles/step-4-deploying-to-the-edge" }
  ].forEach(({ name, href }) => {
    test(`${name} Page Visitable`, async ({ page }) => {
      const response = await page.goto(appUrl(href));
      expect(response?.status()).toBeLessThan(400);
    });
  })
});
