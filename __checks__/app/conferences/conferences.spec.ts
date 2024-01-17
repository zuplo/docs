import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Conferences", () => {
  [
    { name: "Conference Prize Terms", href: "/conferences/conference-prize-terms" },
  ].forEach(({ name, href }) => {
    test(`${name} Page Visitable`, async ({ page }) => {
      const response = await page.goto(appUrl(href));
      expect(response?.status()).toBeLessThan(400);
    });
  })
});
