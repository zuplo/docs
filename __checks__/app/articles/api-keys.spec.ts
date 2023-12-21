import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("API Keys", () => {
  [
    { name: "Overview", href: "/articles/api-key-management" },
    { name: "Authentication", href: "/articles/api-key-authentication" },
    { name: "End User Access", href: "/articles/api-key-end-users" },
    { name: "Using the API", href: "/articles/api-key-api" },
    { name: "React Component", href: "/articles/api-key-react-component" },
    { name: "Leak Detection", href: "/articles/api-key-leak-detection" },
    { name: "Service Limits", href: "/articles/api-key-service-limits" },
    { name: "Buckets & Environments", href: "/articles/api-key-buckets" }
  ].forEach(({ name, href }) => {
    test(`${name} Page Visitable`, async ({ page }) => {
      const response = await page.goto(appUrl(href));
      expect(response?.status()).toBeLessThan(400);
    });
  })
});
