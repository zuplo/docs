import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Intro Page", () => {
  test("Visitable", async ({ page }) => {
    const response = await page.goto(appUrl("/intro"));
    expect(response?.status()).toBeLessThan(400);
  })
});
