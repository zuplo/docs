import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("CLI", () => {
  test.describe("Root Page", () => {
    test("Visitable", async ({ page }) => {
      const response = await page.goto(appUrl("/cli"));
      expect(response?.status()).toBeLessThan(400);
    });
  });

  [
    { name: "Analytics", href: "/cli/analytics" },
    { name: "Authentication", href: "/cli/authentication" },
    { name: "Conversion Commands", href: "/cli/convert" },
    { name: "Deployment Commands", href: "/cli/deployments" },
    { name: "Installing the Zuplo CLI", href: "/cli/installation" },
    { name: "Local Development Commands", href: "/cli/local-development" },
    { name: "Project Commands", href: "/cli/project" },
    { name: "Test Command", href: "/cli/test" },
    { name: "Tunnel Commands", href: "/cli/tunnels" },
    { name: "Environment Variables Commands", href: "/cli/variables" },
  ].forEach(({ name, href }) => {
    test(`${name} Page Visitable`, async ({ page }) => {
      const response = await page.goto(appUrl(href));
      expect(response?.status()).toBeLessThan(400);
    });
  })
});
