import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Open API Page", () => {
  test("Visitable", async ({ page }) => {
    const response = await page.goto(appUrl("/articles/open-api"));
    expect(response?.status()).toBeLessThan(400);
  })
});
