"use client";

import { usePathname } from "next/navigation";

import { navigation } from "@/build/navigation.mjs";
import { NavCategory, NavItem } from "@/lib/interfaces";
import Link from "next/link";
import ChevronRightIcon from "@/components/svgs/chevron-right.svg";

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
      <div className="mb-10 flex items-center gap-x-[3px] text-sm leading-6 tracking-wider text-gray-600">
        <Link href="#">Home</Link>
        <ChevronRightIcon />
        {section && <p className="">{section.label}</p>}
      </div>

      {title && (
        <h1 className="mb-2.5 text-3xl leading-narrow text-white dark:text-black">
          {title}
        </h1>
      )}
    </header>
  );
}
