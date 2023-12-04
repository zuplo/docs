"use client";

import { usePathname } from "next/navigation";

import { navigation } from "@/build/navigation.mjs";
import { NavCategory, NavItem } from "@/lib/interfaces";

export function DocsHeader({ title }: { title?: string }) {
  let pathname = usePathname();

  const findLink = (link: NavCategory | NavItem): boolean => {
    if ("href" in link) {
      return link.href === pathname.split("#")[0];
    } else {
      return link.items.some(findLink);
    }
  };

  let section = navigation.find((section) => section.items.find(findLink));

  if (!title && !section) {
    return null;
  }

  return (
    <header className="mb-5">
      {section && (
        <p className="mb-10 font-display text-sm font-medium text-pink-500">
          {section.label}
        </p>
      )}
      {title && (
        <h1 className="mb-2.5 text-3xl leading-narrow text-black dark:text-white">
          {title}
        </h1>
      )}
    </header>
  );
}
