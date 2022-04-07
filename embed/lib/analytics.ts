export const SEGMENT_WRITE_KEY = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;
export const GOOGLE_ANALYTICS_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_KEY;

import type { Analytics } from "@segment/analytics-next";
declare global {
  interface Window {
    analytics?: Analytics;
    // Google tag manager property
    dataLayer?: { push: (obj: { event: string; page: string }) => void };
  }
}
