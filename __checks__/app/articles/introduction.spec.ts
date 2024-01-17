import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Introduction", () => {
  [
    { name: "What is Zuplo?", href: "/articles/what-is-zuplo" },
    { name: "Who uses Zuplo, and why?", href: "/articles/who-uses-and-why" },
    { name: "Zuplo in your stack", href: "/articles/zuplo-in-your-stack" }
  ].forEach(({ name, href }) => {
    test(`${name} Page Visitable`, async ({ page }) => {
      const response = await page.goto(appUrl(href));
      expect(response?.status()).toBeLessThan(400);
    });
  })
});
