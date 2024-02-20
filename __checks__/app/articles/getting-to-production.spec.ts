import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Getting To Production", () => {
  [
    { name: "Environments", href: "/articles/environments" },
    { name: "GitHub Integration", href: "/articles/source-control" },
    { name: "Securing your backend", href: "/articles/securing-your-backend" },
    { name: "Custom Domains", href: "/articles/custom-domains" },
    { name: "Testing", href: "/articles/testing" },
    { name: "Zuplo in your stack", href: "/articles/zuplo-in-your-stack" },
    { name: "Log Plugins", href: "/articles/log-plugins" },
    { name: "Metrics Plugins", href: "/articles/metrics-plugins" }
  ].forEach(({ name, href }) => {
    test(`${name} Page Visitable`, async ({ page }) => {
      const response = await page.goto(appUrl(href));
      expect(response?.status()).toBeLessThan(400);
    });
  })
});
