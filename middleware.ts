import { next, waitUntil } from "@vercel/functions";

const POSTHOG_KEY = "phc_xB1aydh7a41MW9TwUtLJjKme4izQiWf9zKbKhpysAiW";
const SITE_ORIGIN = "https://zuplo.com";

function captureStaticPageview(request: Request, url: URL) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  return fetch("https://us.i.posthog.com/i/v0/e/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: POSTHOG_KEY,
      event: "$pageview",
      distinct_id: crypto.randomUUID(),
      properties: {
        $process_person_profile: false,
        $current_url: `${SITE_ORIGIN}${url.pathname}${url.search}`,
        $referrer: request.headers.get("referer") ?? "",
        $useragent: request.headers.get("user-agent") ?? "",
        $ip: ip,
      },
    }),
  });
}

export default function middleware(request: Request) {
  if (request.method === "GET" || request.method === "HEAD") {
    waitUntil(captureStaticPageview(request, new URL(request.url)));
  }
  return next();
}

export const config = {
  matcher: [
    "/docs/llms.txt",
    "/docs/llms-full.txt",
    "/docs/sitemap.xml",
    "/docs/:path*.md",
  ],
};
