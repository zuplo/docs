import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Policies Page", () => {
  test("Visitable", async ({ page }) => {
    const response = await page.goto(appUrl("/policies"));
    expect(response?.status()).toBeLessThan(400);
  });

  test("Content loaded", async ({ page }) => {
    await page.goto(appUrl("/policies"));

    const policies = await page.getByTestId("policies-grid").getByTestId("policy-card").all();
    expect(policies.length).toBeGreaterThan(0);

    const firstPolicy = policies[0];
    const firstPolicyName = await firstPolicy.getByRole('heading').textContent();
    const firstPolicyHref = await firstPolicy.getAttribute('href');
    expect(firstPolicyName).toBeTruthy();
    expect(firstPolicyHref).toBeTruthy();
    await firstPolicy.click();

    const response = await page.goto(appUrl(firstPolicyHref!));
    expect(response?.status()).toBeLessThan(400);
  });
});
