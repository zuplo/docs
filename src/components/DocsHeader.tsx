"use client";

import { usePathname } from "next/navigation";

import { NavItem, NavSection, navigation } from "@/lib/navigation";

export function DocsHeader({ title }: { title?: string }) {
  let pathname = usePathname();

  const findLink = (link: NavSection | NavItem): boolean => {
    if ("href" in link) {
      return link.href === pathname.split("#")[0];
    } else {
      return link.links.some(findLink);
    }
  };

  let section = navigation.find((section) => section.links.find(findLink));

  if (!title && !section) {
    return null;
  }

  return (
    <header className="mb-9 space-y-1">
      {section && (
        <p className="font-display text-sm font-medium text-pink-500">
          {section.title}
        </p>
      )}
      {title && (
        <h1 className="font-display text-3xl tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
      )}
    </header>
  );
}
