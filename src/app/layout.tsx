import { Providers, SuspendedProviders } from "@/app/providers";
import { Layout } from "@/components/Layout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import clsx from "clsx";
import { type Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

import "@/styles/styles.css";
import "@/styles/tailwind.css";
import { Suspense } from "react";
import { Analytics } from "./analytics";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Use local version of Lexend so that we can use OpenType features
const lexend = localFont({
  src: "../fonts/lexend.woff2",
  display: "swap",
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: {
    template: "%s - Zuplo Docs",
    default: "Zuplo Docs",
  },
  metadataBase: new URL("https://zuplo.com/docs"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={clsx("h-full antialiased", inter.variable, lexend.variable)}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://cdn.zuplo.com" crossOrigin="" />
        <link
          rel="icon"
          type="image/x-icon"
          href="https://cdn.zuplo.com/www/favicon.png"
        />
        <Analytics />
      </head>
      <body className="flex min-h-full bg-white dark:bg-black">
        <Suspense>
          <SuspendedProviders />
        </Suspense>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
        <SpeedInsights endpoint="https://docs.zuplopreview.net/_vercel/speed-insights/vitals" />
      </body>
    </html>
  );
}
