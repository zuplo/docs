import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Policies", () => {
  test.describe("Authorization", () => {
    [
      { name: "Access Control List", href: "/policies/acl-policy-inbound" },
      { name: "RBAC Authorization", href: "/policies/rbac-policy-inbound" },
      { name: "Geo-location filtering", href: "/policies/geo-filter-inbound" },
      { name: "IP Restriction", href: "/policies/ip-restriction-inbound" }
    ].forEach(({ name, href }) => {
      test(`${name} Page Visitable`, async ({ page }) => {
        const response = await page.goto(appUrl(href));
        expect(response?.status()).toBeLessThan(400);
      });
    });
  });
});
