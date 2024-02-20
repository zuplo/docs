import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Security Page", () => {
  test("Visitable", async ({ page }) => {
    const response = await page.goto(appUrl("/articles/security"));
    expect(response?.status()).toBeLessThan(400);
  })
});
