"use client";

import { navigation } from "@/build/navigation.mjs";
import { NavItem } from "@/lib/interfaces";
import { hasActiveNavLinkItem } from "@/lib/utils/has-active-nav-link-item";
import clsx from "clsx";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function SubNavSection({
  link,
  depth,
  isCategory,
}: {
  link: NavItem;
  depth: number;
  isCategory?: boolean;
}) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(!hasActiveNavLinkItem(link, pathname));

  function onClick() {
    setHidden(!hidden);
  }

  // useEffect(() => {
  //   setHidden(!hasActiveNavLinkItem(link, pathname));
  // }, [pathname, setHidden, link.links]);

  return (
    <li className={`relative`}>
      <a
        className={clsx([
          "flex w-full cursor-pointer pl-1 text-gray-500",
          isCategory &&
            "font-display font-semibold text-gray-900 dark:text-white",
        ])}
        onClick={onClick}
      >
        <span className="flex-grow">{link.label}</span>
        {hidden ? (
          <ChevronRightIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </a>
      <ul
        role="list"
        className={`${
          hidden ? "hidden" : ""
        } ml-2 pl-2 mt-2 space-y-2 border-l border-gray-100 dark:border-gray-800 lg:mt-4 lg:space-y-4 lg:border-gray-200`}
      >
        {link.items?.map((link, i) => (
          <NavSection link={link} key={i} depth={depth + 1} />
        ))}
      </ul>
    </li>
  );
}

function NavSection({ link, depth }: { link: NavItem; depth: number }) {
  let pathname = usePathname();

  if (link.items || !link.href) {
    return <SubNavSection link={link} depth={depth} key={link.label} />;
  }

  if (depth === 0) {
    return (
      <li key={link.href} className="relative">
        <Link
          href={link.href}
          className={clsx(
            "block w-full pl-1 ",
            link.href === pathname
              ? "font-medium text-pink "
              : "text-gray-500 hover:text-gray-600  dark:text-gray-400  dark:hover:text-gray-300",
          )}
        >
          {link.label}
        </Link>
      </li>
    );
  } else {
    return (
      <li key={link.href} className="relative">
        <Link
          href={link.href}
          className={clsx(
            "block w-full pl-3.5 ",
            link.href === pathname
              ? "border-l text-pink font-medium"
              : "text-gray-500 hover:text-gray-600  dark:text-gray-400  dark:hover:text-gray-300",
          )}
        >
          {link.label}
        </Link>
      </li>
    );
  }
}

export function Navigation({ className }: { className?: string }) {
  return (
    <nav className={clsx("text-base lg:text-sm", className)}>
      <ul role="list" className="space-y-5">
        {navigation.map((section) => (
          <SubNavSection
            key={section.label}
            link={section}
            depth={0}
            isCategory
          />
        ))}
      </ul>
    </nav>
  );
}
