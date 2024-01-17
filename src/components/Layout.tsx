"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo, Logomark } from "@/components/Logo";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Navigation } from "@/components/Navigation";
import { Search } from "@/components/Search";
import { ThemeSelector } from "@/components/ThemeSelector";

const links = [
  {
    href: "https://zuplo.com/features",
    name: "Product",
  },
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

function Header() {
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
        <Link href="/" aria-label="Home page">
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

export function Layout({ children }: { children: React.ReactNode }) {
  let pathname = usePathname();
  let isHomePage = pathname === "/";

  return (
    <div className="flex w-full flex-col items-center px-4">
      <Header />

      <div className="max-w-8xl relative mx-auto mt-[-2rem] flex w-full flex-auto justify-center sm:px-2 lg:px-8 xl:px-12">
        <div className="hidden lg:relative lg:block lg:flex-none">
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-gray-50 dark:hidden" />
          <div className="absolute bottom-0 right-0 top-16 hidden h-12 w-px bg-gradient-to-t from-gray-800 dark:block" />
          <div className="absolute bottom-0 right-0 top-28 hidden w-px bg-gray-800 dark:block" />
          <div className="sticky top-[4rem] -ml-0.5 h-[calc(100vh-4rem)] w-64 overflow-y-auto overflow-x-hidden py-16 pl-0.5 pr-8 xl:w-72 xl:pr-16">
            <Navigation />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
