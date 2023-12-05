import clsx from "classnames";
import { type Metadata } from "next";

import { Providers } from "@/app/providers";
import { Layout } from "@/components/Layout";

import "@/styles/tailwind.css";
import "@/styles/styles.css";
import { beVietnamProFont } from "../lib/fonts";

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
      className={clsx("h-full antialiased", beVietnamProFont.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-full bg-white dark:bg-black">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
