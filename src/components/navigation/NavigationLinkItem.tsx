import { NavItem } from "@/lib/interfaces";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useMobileNavigation } from "./MobileNavigation";

type Props = {
  link: NavItem;
};

export function NavigationLinkItem({ link }: Props) {
  const pathname = usePathname();
  const isActive = link.href === pathname;
  const ranOnce = useRef(false);
  const liRef = useRef<HTMLLIElement>(null);
  const { close } = useMobileNavigation();

  useEffect(() => {
    if (ranOnce.current || !liRef.current) return;

    liRef.current.scrollIntoView({ block: "nearest" });
    ranOnce.current = true;
  }, [isActive]);

  return (
    <li
      ref={liRef}
      className={clsx(
        "pl-4 border-l hover:border-pink",
        isActive ? "border-pink" : "border-transparent",
      )}
    >
      <Link
        href={link.href!}
        onClick={close}
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
