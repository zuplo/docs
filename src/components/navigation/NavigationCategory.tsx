import { NavItem } from "@/lib/interfaces";
import { hasActiveNavLinkItem } from "@/lib/utils/has-active-nav-link-item";
import clsx from "clsx";
import { ChevronRightIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { NavigationLinkItem } from "./NavigationLinkItem";

type Props = {
  navItem: NavItem;
  isRoot?: boolean;
};

function getItemHref(navItem: NavItem): string {
  if (navItem.href) {
    return navItem.href;
  }

  return navItem.items?.[0] ? getItemHref(navItem.items[0]) : "";
}

function isCategoryExpanded(navItem: NavItem, pathname: string): boolean {
  return navItem.isExpandedByDefault || hasActiveNavLinkItem(navItem, pathname);
}

export function NavigationCategory({ navItem, isRoot }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(
    !isCategoryExpanded(navItem, pathname),
  );
  const categoryHref = getItemHref(navItem);

  const onClick = () => {
    if (isCollapsed) {
      if (!hasActiveNavLinkItem(navItem, pathname)) router.push(categoryHref);
      setIsCollapsed(false);
    } else {
      setIsCollapsed(true);
    }
  };

  return (
    <li className={clsx(!isRoot && "pl-4")}>
      <a
        className={clsx([
          "flex w-full cursor-pointer items-center",
          isRoot
            ? "font-display font-semibold text-gray-900 dark:text-white"
            : "text-gray-500 dark:text-gray-400 dark:hover:text-gray-300",
        ])}
        onClick={onClick}
      >
        <span className="flex-grow">{navItem.label}</span>
        <ChevronRightIcon
          className={clsx("h-4 w-4 duration-200", !isCollapsed && "rotate-90")}
        />
      </a>
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
