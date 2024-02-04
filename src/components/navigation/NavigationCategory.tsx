import { NavItem } from "@/lib/interfaces";
import { hasActiveNavLinkItem } from "@/lib/utils/has-active-nav-link-item";
import clsx from "clsx";
import { ChevronRightIcon, ChevronDownIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NavigationLinkItem } from "./NavigationLinkItem";

type Props = {
  navItem: NavItem;
  isRoot?: boolean;
};

export function NavigationCategory({ navItem, isRoot }: Props) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(
    !hasActiveNavLinkItem(navItem, pathname),
  );

  function onClick() {
    setIsCollapsed((isCollapsed) => !isCollapsed);
  }

  // useEffect(() => {
  //   setHidden(!hasActiveNavLinkItem(link, pathname));
  // }, [pathname, setHidden, link.links]);

  return (
    <li className={clsx(!isRoot && "pl-4")}>
      <a
        className={clsx([
          "flex w-full cursor-pointer",
          isRoot
            ? "font-display font-semibold text-gray-900 dark:text-white"
            : "text-gray-500 dark:text-gray-400 dark:hover:text-gray-300",
        ])}
        onClick={onClick}
      >
        <span className="flex-grow">{navItem.label}</span>
        {isCollapsed ? (
          <ChevronRightIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </a>
      <ul
        role="list"
        className={clsx([
          "mt-2 space-y-2 border-l border-gray-100 dark:border-gray-800 lg:mt-4 lg:space-y-4 lg:border-gray-200",
          isCollapsed && "hidden",
        ])}
      >
        {navItem.items?.map((innerItem) =>
          innerItem.items?.length ? (
            <NavigationCategory navItem={innerItem} key={innerItem.label} />
          ) : (
            <NavigationLinkItem link={innerItem} key={innerItem.label} />
          ),
        )}
      </ul>
    </li>
  );
}
