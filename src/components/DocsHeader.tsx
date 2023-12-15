"use client";

import { usePathname } from "next/navigation";

import { navigation } from "@/build/navigation.mjs";
import { NavCategory, NavItem, Section } from "@/lib/types";
import Link from "next/link";
import ChevronRightIcon from "@/components/svgs/chevron-right.svg";
import { MobileTableOfContents } from "@/components/MobileTableOfContents";

export function DocsHeader({
  title,
  tableOfContents,
}: {
  title?: string;
  tableOfContents?: Array<Section>;
}) {
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
      <div className="mb-4 flex items-center gap-x-[3px] text-sm leading-6 tracking-wider text-gray-600 lg:mb-10">
        <Link href="/">Home</Link>
        {section && (
          <>
            <ChevronRightIcon />
            <p>{section.label}</p>
          </>
        )}
      </div>

      {tableOfContents && (
        <MobileTableOfContents tableOfContents={tableOfContents} />
      )}

      {title && (
        <h1 className="mb-2.5 text-3xl leading-narrow text-white dark:text-black">
          {title}
        </h1>
      )}
    </header>
  );
}
