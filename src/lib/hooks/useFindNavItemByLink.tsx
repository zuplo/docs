import { NavItem } from "@/lib/interfaces";
import { usePathname } from "next/navigation";
import { hasActiveNavLinkItem } from "../utils/has-active-nav-link-item";

export function useFindNavItemByLink(navItem: NavItem): boolean {
  const pathname = usePathname();

  return hasActiveNavLinkItem(navItem, pathname);
}
