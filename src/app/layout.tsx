import clsx from "classnames";
import { type Metadata } from "next";

import { Providers } from "@/app/providers";
import { Layout } from "@/components/Layout";

import "@/styles/tailwind.css";
import "@/styles/styles.css";
import { inter, firaSans } from "../lib/fonts";

export const metadata: Metadata = {
  title: {
    template: "%s - Zuplo Docs",
    default: "Zuplo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={clsx("h-full antialiased", inter.variable, firaSans.variable)}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="icon"
          type="image/x-icon"
          href="https://cdn.zuplo.com/www/favicon.png"
        />
      </head>
      <body className="flex min-h-full bg-white text-white dark:bg-black dark:text-black">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
