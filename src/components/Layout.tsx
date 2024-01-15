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
    href: "https://zuplo.com/docs",
    name: "Docs",
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
        "sticky top-4 z-50 m-4 flex h-24 flex-none flex-wrap items-center justify-between rounded-xl bg-slate-900/95 px-4 py-5 shadow-md shadow-slate-900/25 transition duration-500 sm:px-6 lg:px-8",
        isScrolled
          ? "dark:bg-slate-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75"
          : "dark:bg-slate-900/95",
      )}
    >
      <div className="mr-6 flex lg:hidden">
        <MobileNavigation />
      </div>
      <div className="relative flex basis-0 items-center">
        <Link href="/" aria-label="Home page">
          <Logomark className="h-9 w-9" />
          <Logo className="h-9 w-auto" />
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
              className="strong hover:text-pink tracking-wider text-white no-underline outline-none transition-colors"
              aria-current={item.href === currentPath ? "page" : undefined}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <ThemeSelector className="relative z-10" />
        <Link href="https://portal.zuplo.com/signup" className="hidden tracking-wider btn btn-primary-dark md:inline-block font-base block whitespace-nowrap rounded-lg px-5 py-3 text-center text-sm font-semibold no-underline transition-colors bg-pink text-white hover:bg-white hover:text-black">
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
    <div className="flex w-full flex-col">
      <Header />

      {/* {isHomePage && <Hero />} */}

      <div className="max-w-8xl relative mx-auto mt-[-2rem] flex w-full flex-auto justify-center sm:px-2 lg:px-8 xl:px-12">
        <div className="hidden lg:relative lg:block lg:flex-none">
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
          <div className="absolute bottom-0 right-0 top-16 hidden h-12 w-px bg-gradient-to-t from-slate-800 dark:block" />
          <div className="absolute bottom-0 right-0 top-28 hidden w-px bg-slate-800 dark:block" />
          <div className="sticky top-[4rem] -ml-0.5 h-[calc(100vh-4rem)] w-64 overflow-y-auto overflow-x-hidden py-16 pl-0.5 pr-8 xl:w-72 xl:pr-16">
            <Navigation />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
