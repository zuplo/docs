"use client";

import { navigation } from "@/build/navigation.mjs";
import { useFindNavItemByLink } from "@/lib/hooks/useFindNavItemByLink";
import { NavItem } from "@/lib/interfaces";
import clsx from "clsx";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";

function PageLink({
  label,
  href,
  dir = "next",
  ...restProps
}: Omit<React.ComponentPropsWithoutRef<"div">, "dir" | "title"> & {
  label: string;
  href: string;
  dir?: "previous" | "next";
}) {
  if (!href) {
    return null;
  }

  return (
    <div {...restProps}>
      <dt className="font-display text-sm font-medium text-gray-900 dark:text-white">
        {dir === "next" ? "Next" : "Previous"}
      </dt>
      <dd className="mt-1">
        <Link
          href={href}
          className={clsx(
            "flex items-center gap-x-1 text-base font-semibold text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300",
            dir === "previous" && "flex-row-reverse",
          )}
        >
          {label}
          {dir === "previous" ? (
            <ArrowLeftIcon className="flex-none" />
          ) : (
            <ArrowRightIcon className="flex-none" />
          )}
        </Link>
      </dd>
    </div>
  );
}

function collect(array: Array<NavItem>, result: Array<NavItem>): void {
  array.forEach((value) =>
    value.items ? collect(value.items, result) : result.push(value),
  );
}

export function PrevNextLinks() {
  let navigationLinks = navigation.flatMap((section) => section.items || []);
  let allLinks: Array<NavItem> = [];
  collect(navigationLinks, allLinks);

  let linkIndex = allLinks.findIndex(useFindNavItemByLink);
  let previousPage = linkIndex > -1 ? allLinks[linkIndex - 1] : null;
  let nextPage = linkIndex > -1 ? allLinks[linkIndex + 1] : null;

  if (!nextPage && !previousPage) {
    return null;
  }

  return (
    <dl className="mt-12 flex border-t border-gray-200 pt-6 dark:border-gray-800">
      {previousPage && previousPage.href && (
        <PageLink
          dir="previous"
          label={previousPage.label}
          href={previousPage?.href}
        />
      )}
      {nextPage && nextPage.href && (
        <PageLink
          className="ml-auto text-right"
          label={nextPage.label}
          href={nextPage?.href}
        />
      )}
    </dl>
  );
}
