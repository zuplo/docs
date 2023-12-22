import { expect, test } from '@playwright/test';
import { appUrl } from '../../utils/app-url';

test.describe("Policies", () => {
  test.describe("Async & Archival", () => {
    [
      { name: "Archive Request to Azure Storage", href: "/policies/archive-request-azure-storage-inbound" },
      { name: "Archive Request to AWS S3", href: "/policies/archive-request-aws-s3-inbound" },
      { name: "Archive Response to Azure Storage", href: "/policies/archive-response-azure-storage-outbound" },
      { name: "Archive Response to AWS S3", href: "/policies/archive-response-aws-s3-outbound" }
    ].forEach(({ name, href }) => {
      test(`${name} Page Visitable`, async ({ page }) => {
        const response = await page.goto(appUrl(href));
        expect(response?.status()).toBeLessThan(400);
      });
    });
  });
});
