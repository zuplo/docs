import { NavItem } from "@/lib/interfaces";

function hasActiveNavLinkItemHelper(
  navItem: NavItem,
  pathnameWithoutAnchor: string,
): boolean {
  return (
    (navItem.href && navItem.href === pathnameWithoutAnchor) ||
    (!!navItem?.items &&
      navItem.items.some((innerItem) =>
        hasActiveNavLinkItemHelper(innerItem, pathnameWithoutAnchor),
      ))
  );
}

export function hasActiveNavLinkItem(
  navItem: NavItem,
  pathname: string,
): boolean {
  const pathnameWithoutAnchor = pathname.split("#")[0];

  return hasActiveNavLinkItemHelper(navItem, pathnameWithoutAnchor);
}
