import { NavItem } from "../interfaces";

export function getInnerNavLinkItems(navItems: Array<NavItem>): Array<NavItem> {
  return navItems.flatMap((navItem) =>
    navItem.items?.length ? getInnerNavLinkItems(navItem.items) : navItem,
  );
}
