import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Policies", () => {
  test.describe("Metrics, Billing & Quotas", () => {
    [
      { name: "Quota", href: "/policies/quota-inbound" },
      { name: "Moesif Analytics & Billing", href: "/policies/moesif-inbound" },
      { name: "Amberflo Metering / Billing", href: "/policies/amberflo-metering-inbound" },
      { name: "Readme Metrics", href: "/policies/readme-metrics-inbound" }
    ].forEach(({ name, href }) => {
      test(`${name} Page Visitable`, async ({ page }) => {
        const response = await page.goto(appUrl(href));
        expect(response?.status()).toBeLessThan(400);
      });
    });
  });
});
