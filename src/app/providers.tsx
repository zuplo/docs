"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      forcedTheme="dark"
      attribute="class"
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
