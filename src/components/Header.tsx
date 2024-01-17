"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo, Logomark } from "@/components/Logo";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Search } from "@/components/Search";
import { ThemeSelector } from "@/components/ThemeSelector";

const links = [
  // {
  //   href: "https://zuplo.com/features",
  //   name: "Product",
  // },
  {
    href: "/",
    name: "Docs",
    active: true,
  },
  {
    href: "https://zuplo.com/pricing",
    name: "Pricing",
  },
  {
    href: "https://zuplo.com/blog",
    name: "Blog",
  },
  {
    href: "https://portal.zuplo.com",
    name: "Sign In",
  },
];

export default function Header() {
  const currentPath = usePathname();
  let [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={clsx(
        "max-w-wide sticky top-4 z-50 m-4 flex h-24 w-full flex-none flex-wrap items-center justify-between rounded-xl bg-black/95 px-4 py-5 shadow-md shadow-gray-900/25 transition duration-500 sm:px-6 lg:px-8",
        isScrolled
          ? "dark:bg-black/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-black/75"
          : "dark:bg-black/95",
      )}
    >
      <div className="mr-6 flex lg:hidden">
        <MobileNavigation />
      </div>
      <div className="relative flex basis-0 items-center">
        <Link href="https://zuplo.com" aria-label="Home page">
          <Logomark className="h-9 w-9 md:hidden" />
          <Logo className="hidden h-7 w-auto md:inline-block" />
        </Link>
      </div>
      <div className="relative flex basis-0 items-center justify-end gap-6 sm:gap-8 md:flex-grow">
        <div className="-my-5 mr-6 sm:mr-8 md:mr-0">
          <Search />
        </div>
        <div className="hidden items-center gap-10 text-base font-semibold text-white lg:flex">
          {links.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`strong hover:text-pink tracking-wider no-underline outline-none transition-colors ${
                item.active ? "text-pink" : " text-white"
              }`}
              aria-current={item.href === currentPath ? "page" : undefined}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <ThemeSelector className="relative z-10" />
        <Link
          href="https://portal.zuplo.com/signup"
          className="btn btn-primary-dark font-base bg-pink block hidden whitespace-nowrap rounded-lg px-5 py-3 text-center text-sm font-semibold tracking-wider text-white no-underline transition-colors hover:bg-white hover:text-black md:inline-block"
        >
          Start free
        </Link>
      </div>
    </header>
  );
}
