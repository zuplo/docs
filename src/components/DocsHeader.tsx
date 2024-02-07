"use client";

import { usePathname } from "next/navigation";

import { navigation } from "@/build/navigation.mjs";
import { NavItem } from "@/lib/interfaces";

export function DocsHeader({ title }: { title?: string }) {
  let pathname = usePathname();

  const findLink = (link: NavItem): boolean => {
    if (link.href) {
      return link.href === pathname.split("#")[0];
    } else {
      return !!link.items?.some(findLink);
    }
  };

  let section = navigation.find((section) => section.items?.find(findLink));

  if (!title && !section) {
    return null;
  }

  return (
    <header className="mb-9 space-y-1">
      {section && (
        <p className="font-display text-sm font-medium text-pink-500">
          {section.label}
        </p>
      )}
      {title && (
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h1>
      )}
    </header>
  );
}
