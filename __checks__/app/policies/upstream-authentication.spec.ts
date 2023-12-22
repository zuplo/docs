import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Policies", () => {
  test.describe("Upstream Authentication", () => {
    [
      { name: "Upstream Azure AD Service Auth", href: "/policies/upstream-azure-ad-service-auth-inbound" },
      { name: "Upstream GCP Service Auth", href: "/policies/upstream-gcp-service-auth-inbound" },
      { name: "Upstream GCP Self-Signed JWT", href: "/policies/upstream-gcp-jwt-inbound" },
      { name: "Upstream Firebase Admin Auth", href: "/policies/upstream-firebase-admin-auth-inbound" },
      { name: "Upstream Firebase User Auth", href: "/policies/upstream-firebase-user-auth-inbound" }
    ].forEach(({ name, href }) => {
      test(`${name} Page Visitable`, async ({ page }) => {
        const response = await page.goto(appUrl(href));
        expect(response?.status()).toBeLessThan(400);
      });
    });
  });
});
