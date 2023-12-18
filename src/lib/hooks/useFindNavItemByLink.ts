import { NavCategory } from "@/lib/types";
import { usePathname } from "next/navigation";

export function useFindNavItemByLink(navItem: NavCategory) {
  const pathname = usePathname();

  return (
    navItem.href === pathname.split("#")[0] ||
    (!!navItem?.items && navItem.items.some(useFindNavItemByLink))
  );
}
