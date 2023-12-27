import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Handlers", () => {
  test.describe("Root Page", () => {
    test("Visitable", async ({ page }) => {
      const response = await page.goto(appUrl("/handlers"));
      expect(response?.status()).toBeLessThan(400);
    });

    test("Content loaded", async ({ page }) => {
      await page.goto(appUrl("/handlers"));

      const handlers = await page.getByTestId("handlers-grid").getByTestId("handler-card").all();
      expect(handlers.length).toBeGreaterThan(0);

      const firstHandler = handlers[0];
      const firstHandlerName = await firstHandler.getByRole('heading').textContent();
      const firstHandlerHref = await firstHandler.getAttribute('href');
      expect(firstHandlerName).toBeTruthy();
      expect(firstHandlerHref).toBeTruthy();
      await firstHandler.click();

      const response = await page.goto(appUrl(firstHandlerHref!));
      expect(response?.status()).toBeLessThan(400);
    });
  });

  [
    { name: "AWS Lambda Handler", href: "/handlers/aws-lambda" },
    { name: "Custom Request Handlers", href: "/handlers/custom-handler" },
    { name: "OpenAPI Spec Handler", href: "/handlers/openapi" },
    { name: "Redirect Handler", href: "/handlers/redirect" },
    { name: "Internal Route Handlers", href: "/handlers/system-handlers" },
    { name: "URL Forward Handler", href: "/handlers/url-forward" },
    { name: "URL Rewrite Handler", href: "/handlers/url-rewrite" },
    { name: "WebSocket Handler", href: "/handlers/websocket-handler" }
  ].forEach(({ name, href }) => {
    test(`${name} Page Visitable`, async ({ page }) => {
      const response = await page.goto(appUrl(href));
      expect(response?.status()).toBeLessThan(400);
    });
  });
});
