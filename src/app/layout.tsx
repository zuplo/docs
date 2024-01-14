import clsx from "clsx";
import { type Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

import { Providers } from "@/app/providers";
import { Layout } from "@/components/Layout";

import "@/styles/tailwind.css";
import Script from "next/script";

const inter = Inter({
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
    template: "%s - Docs",
    default: "CacheAdvance - Never miss the cache again.",
  },
  description:
    "Cache every single thing your app could ever do ahead of time, so your code never even has to run at all.",
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
        <Script
          id="zaraz"
          strategy="afterInteractive"
          async
          src="https://za.zuplo.com/i.js"
          referrerPolicy="origin"
        />
        <Script
          id="koala-analytics"
          strategy="afterInteractive"
          async
          dangerouslySetInnerHTML={{
            __html: `
          window.koalaSettings = { host: 'https://kapi.zuplo.com' }; 
          !function(t){if(window.ko)return;window.ko=[],["identify","track","removeListeners","open","on","off","qualify","ready"].forEach(function(t){ko[t]=function(){var n=[].slice.call(arguments);return n.unshift(t),ko.push(n),ko}});var n=document.createElement("script");n.async=!0,n.setAttribute("src","https://kcdn.zuplo.com/v1/pk_32d64a435a311ccc9462e3721dba58cb3e35/sdk.js"),(document.body || document.head).appendChild(n)}();`,
          }}
        />
      </head>
      <body className="flex min-h-full bg-white dark:bg-slate-900">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
