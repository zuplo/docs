"use client";

import { POSTHOG_KEY, POSTHOG_URL } from "@/lib/env";
import { ThemeProvider } from "next-themes";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { PropsWithChildren, useEffect } from "react";

if (typeof window !== "undefined" && POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: process.env.NODE_ENV === "production" ? POSTHOG_URL : undefined,
    disable_session_recording: true,
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
  });
}

function PageViewProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Track pageviews
  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`;
      }

      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * Providers that are wrapped in suspense, usually because they use
 * useSearchParams, etc.
 */
export function SuspendedProviders() {
  return <PageViewProvider />;
}

/**
 * Client providers/context that wrap the main components
 */
export function Providers({ children }: PropsWithChildren) {
  return (
    <PostHogProvider client={posthog}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </PostHogProvider>
  );
}
