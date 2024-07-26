import { Providers, SuspendedProviders } from "@/app/providers";
import { Layout } from "@/components/Layout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import clsx from "clsx";
import { type Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

import "@/styles/styles.css";
import "@/styles/tailwind.css";
import Script from "next/script";
import { Suspense } from "react";
import { GOOGLE_TAG_MANAGER_ID, KOALA_URL } from "../lib/env";

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
        {GOOGLE_TAG_MANAGER_ID && (
          <>
            <Script
              id="gtm"
              async
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://ta.zuplo.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GOOGLE_TAG_MANAGER_ID}');`,
              }}
            />
          </>
        )}
        {KOALA_URL && (
          <Script
            id="koala-analytics"
            strategy="afterInteractive"
            async
            dangerouslySetInnerHTML={{
              __html: `
          window.koalaSettings = { host: '${KOALA_URL}' };
          !function(t){if(window.ko)return;window.ko=[],["identify","track","removeListeners","open","on","off","qualify","ready"].forEach(function(t){ko[t]=function(){var n=[].slice.call(arguments);return n.unshift(t),ko.push(n),ko}});var n=document.createElement("script");n.async=!0,n.setAttribute("src","${KOALA_URL}/v1/pk_32d64a435a311ccc9462e3721dba58cb3e35/sdk.js"),(document.body || document.head).appendChild(n)}();`,
            }}
          />
        )}
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
