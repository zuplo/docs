"use client";

import { navigation } from "@/build/navigation.mjs";
import { NavCategory, Section } from "@/lib/types";
import Link from "next/link";
import { MobileTableOfContents } from "@/components/MobileTableOfContents";
import { useFindNavItemByLink } from "@/lib/hooks/useFindNavItemByLink";
import { nanoid } from "nanoid";
import { ChevronRightIcon } from "lucide-react";

export function DocsHeader({
  title,
  tableOfContents,
}: {
  title?: string;
  tableOfContents?: Array<Section>;
}) {
  const section = navigation.find((section) =>
    section.items.find(useFindNavItemByLink),
  );

  if (!title && !section) {
    return null;
  }

  const breadcrumbItems: Array<NavCategory> = [{ label: "Home", href: "/" }];

  if (section) {
    breadcrumbItems.push({
      label: section.label,
      href: section.href,
    });
    let currentSection = section;

    while (currentSection?.items?.length) {
      currentSection = currentSection.items.find(useFindNavItemByLink);

      if (currentSection) {
        breadcrumbItems.push({
          label: currentSection.label,
          href: currentSection?.href,
        });
      }
    }
  }

  return (
    <header className="mb-5">
      <div className="mb-4 flex flex-wrap items-center gap-x-[3px] text-sm leading-6 text-slate-400 lg:mb-2">
        {breadcrumbItems.map((item, index) => (
          <div className="flex items-center" key={nanoid()}>
            {!!item?.href ? (
              <Link href={item.href} className="hover:text-pink">{item.label}</Link>
            ) : (
              <p>{item.label}</p>
            )}
            {index < breadcrumbItems.length - 1 && (
              <ChevronRightIcon width={18} height={18} />
            )}
          </div>
        ))}
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
