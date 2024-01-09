"use client";

import { navigation } from "@/build/navigation.mjs";
import { useFindNavItemByLink } from "@/lib/hooks/useFindNavItemByLink";
import { NavCategory } from "@/lib/types";
import clsx from "classnames";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";

function PageLink({
  label,
  href,
  dir = "next",
  ...props
}: Omit<React.ComponentPropsWithoutRef<"div">, "dir" | "title"> & {
  label: string;
  href: string;
  dir?: "previous" | "next";
}) {
  return (
    <div {...props}>
      {/* <dt className="font-display text-sm font-medium text-slate-900 dark:text-white">
        {dir === "next" ? "Next" : "Previous"}
      </dt> */}
      <dd>
        <Link
          href={href}
          className={clsx(
            "flex items-center gap-x-2.5 text-sm leading-6 text-slate-400 hover:text-pink",
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
function collect(array: Array<NavCategory>, result: Array<NavCategory>): void {
  array.forEach((value) =>
    value.items ? collect(value.items, result) : result.push(value),
  );
}

export function PrevNextLinks() {
  let navigationLinks = navigation.flatMap((section) => section.items);
  let allLinks: Array<NavCategory> = [];
  collect(navigationLinks, allLinks);

  let linkIndex = allLinks.findIndex(useFindNavItemByLink);
  let previousPage = linkIndex > -1 ? allLinks[linkIndex - 1] : null;
  let nextPage = linkIndex > -1 ? allLinks[linkIndex + 1] : null;

  if (!nextPage && !previousPage) {
    return null;
  }

  return (
    <dl className="flex border-t border-slate-200 py-5">
      {previousPage && !!previousPage?.href && (
        <PageLink
          dir="previous"
          label={previousPage.label}
          href={previousPage.href}
        />
      )}
      {nextPage && !!nextPage?.href && (
        <PageLink
          className="ml-auto text-right"
          label={nextPage.label}
          href={nextPage.href}
        />
      )}
    </dl>
  );
}
