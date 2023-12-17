"use client";

import { navigation } from "@/build/navigation.mjs";
import { useFindNavItemByLink } from "@/lib/hooks/useFindNavItemByLink";
import { NavCategory } from "@/lib/types";
import clsx from "classnames";
import Link from "next/link";

function ArrowIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="m9.182 13.423-1.17-1.16 3.505-3.505H3V7.065h8.517l-3.506-3.5L9.181 2.4l5.512 5.511-5.511 5.512Z" />
    </svg>
  );
}

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
            "flex items-center gap-x-2.5 text-sm font-bold leading-6 tracking-wider text-pink",
            dir === "previous" && "flex-row-reverse",
          )}
        >
          {label}
          <ArrowIcon
            className={clsx(
              "h-6 w-6 flex-none fill-current",
              dir === "previous" && "-scale-x-100",
            )}
          />
        </Link>
      </dd>
    </div>
  );
}
function collect(array: Array<NavCategory>, result: Array<NavCategory>): void {
  array.forEach((el) => {
    if (el.items) {
      collect(el.items, result);
    } else {
      result.push(el);
    }
  });
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
    <dl className="flex border-t border-slate-200 py-5 dark:border-slate-800">
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
