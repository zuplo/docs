import { NavItem } from "@/lib/interfaces";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";

type Props = {
  link: NavItem;
};

export function NavigationLinkItem({ link }: Props) {
  const pathname = usePathname();
  const isActive = link.href === pathname;

  return (
    <li
      className={clsx(
        "pl-4 border-l hover:border-pink",
        isActive ? "border-pink" : "border-transparent",
      )}
    >
      <Link
        href={link.href!}
        className={clsx(
          "block w-full",
          isActive
            ? "font-medium text-pink"
            : "text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300",
        )}
      >
        {link.label}
      </Link>
    </li>
  );
}
