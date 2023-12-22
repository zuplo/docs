import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Policies", () => {
  test.describe("Authentication", () => {
    [
      { name: "API Key Authentication", href: "/policies/api-key-inbound" },
      { name: "Auth0 JWT Auth", href: "/policies/auth0-jwt-auth-inbound" },
      { name: "Clerk JWT Auth", href: "/policies/clerk-jwt-auth-inbound" },
      { name: "AWS Cognito JWT Auth", href: "/policies/cognito-jwt-auth-inbound" }
    ].forEach(({ name, href }) => {
      test(`${name} Page Visitable`, async ({ page }) => {
        const response = await page.goto(appUrl(href));
        expect(response?.status()).toBeLessThan(400);
      });
    });
  });
});
