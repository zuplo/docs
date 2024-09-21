import { NavItem } from "@/lib/interfaces";
import { hasActiveNavLinkItem } from "@/lib/utils/has-active-nav-link-item";
import clsx from "clsx";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NavigationLinkItem } from "./NavigationLinkItem";

type Props = {
  navItem: NavItem;
  isRoot?: boolean;
};

function getItemHref(navItem: NavItem): string | undefined {
  if (navItem.href) {
    return navItem.href;
  }

  const href = navItem.items?.[0] ? getItemHref(navItem.items[0]) : undefined;
  if (!href) {
    console.warn(`No href found for nav item: ${navItem.label}`);
    return "";
  }
  return href;
}

function isCategoryExpanded(navItem: NavItem, pathname: string): boolean {
  return navItem.isExpandedByDefault || hasActiveNavLinkItem(navItem, pathname);
}

export function NavigationCategory({ navItem, isRoot }: Props) {
  const pathname = usePathname();
  const ranOnce = useRef(false);
  const liRef = useRef<HTMLLIElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(
    !isCategoryExpanded(navItem, pathname!),
  );
  const categoryHref = getItemHref(navItem);

  const isActive =
    navItem.href === pathname || hasActiveNavLinkItem(navItem, pathname!);

  useEffect(() => {
    if (ranOnce.current || !liRef.current) return;

    liRef.current.scrollIntoView({ block: "nearest" });
    ranOnce.current = true;
  }, []);

  const onClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  const onChevronClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <li ref={liRef} className={clsx(!isRoot && "pl-4")}>
      <Link
        className={clsx([
          "flex w-full cursor-pointer items-center",
          isActive
            ? "font-medium text-pink"
            : "text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300",
        ])}
        href={categoryHref!}
      >
        <span className="flex-grow" onClick={onClick}>
          {navItem.label}
        </span>
        <span onClick={onChevronClick}>
          <ChevronRightIcon
            className={clsx(
              "h-4 w-4 duration-100",
              !isCollapsed && "rotate-90",
            )}
          />
        </span>
      </Link>
      <ul
        role="list"
        className={clsx([
          "grid duration-200 border-l border-gray-100 dark:border-gray-800 lg:border-gray-200",
          isCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
          (!isCollapsed || isRoot) && "my-3",
        ])}
      >
        <div className="overflow-hidden flex flex-col gap-3">
          {navItem.items?.map((innerItem) =>
            innerItem.items?.length ? (
              <NavigationCategory navItem={innerItem} key={innerItem.label} />
            ) : (
              <NavigationLinkItem link={innerItem} key={innerItem.label} />
            ),
          )}
        </div>
      </ul>
    </li>
  );
}
