import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Support Page", () => {
  test("Visitable", async ({ page }) => {
    const response = await page.goto(appUrl("/articles/support"));
    expect(response?.status()).toBeLessThan(400);
  })
});
