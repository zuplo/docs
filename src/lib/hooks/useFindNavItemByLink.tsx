import { NavItem } from "@/lib/interfaces";
import { usePathname } from "next/navigation";

export function useFindNavItemByLink(navItem: NavItem): boolean {
  const pathname = usePathname();

  return (
    navItem.href === pathname.split("#")[0] ||
    (!!navItem?.items && navItem.items.some(useFindNavItemByLink))
  );
}
