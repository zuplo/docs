"use client";

import { useEffect, useState } from "react";

import Logo from "@/components/Logo";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Navigation } from "@/components/Navigation";
import classNames from "classnames";
import { Search } from "./Search";
import { StartFreeCTAButton } from "./StartFreeCTAButton";
import { ThemeSelector } from "./ThemeSelector";
import { Container } from "@/components/shared/Container";

function Header() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={classNames("fixed top-0 z-20 w-full bg-white dark:bg-black ", {
        "!dark:bg-black": scrollY > 10,
      })}
    >
      <div className="relative w-full px-5">
        <div className="mx-auto flex min-h-[52px] w-full max-w-[1180px] items-center justify-between py-2 lg:box-content lg:px-0 lg:py-5">
          <div className="flex p-3 lg:hidden">
            <MobileNavigation />
          </div>
          <div className="relative flex basis-0 items-center">
            <Logo className="block w-28 lg:w-36" />
          </div>
          <div className="flex flex-grow justify-end lg:justify-center">
            <div className="">
              <Search />
            </div>
          </div>
          <div className="hidden justify-end lg:flex">
            <ThemeSelector className="relative z-10 my-auto mr-8" />
            <StartFreeCTAButton />
          </div>
          {/* <div className="-my-5 mr-6 sm:mr-8 md:mr-0">
            <Search />
          </div>
          <div className="relative flex basis-0 justify-end gap-6 sm:gap-8 md:flex-grow">
            <ThemeSelector className="relative z-10" />
            <div className="hidden lg:flex">
              <StartFreeCTAButton />
            </div>
          </div> */}
        </div>
      </div>
    </header>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col bg-white dark:bg-black">
      <Header />
      <div className="relative w-full px-5">
        <div className="relative mx-auto mt-[70px] w-full max-w-8xl rounded-xl bg-gray-400 dark:bg-white lg:mt-[92px]">
          <Container className="flex h-[calc(100vh-7rem)] flex-auto justify-center">
            <aside className="hidden border-r border-gray-500 lg:relative lg:block lg:flex-none">
              {/* <div className="absolute inset-y-0 right-0 w-[50vw] dark:hidden" />
              <div className="absolute bottom-0 right-0 top-16 hidden h-12 w-px bg-gradient-to-t from-slate-800 dark:block" />
              <div className="absolute bottom-0 right-0 top-28 hidden w-px bg-slate-800 dark:block" /> */}
              <div className="sticky top-[4.75rem] -ml-0.5 h-[calc(100vh-7rem)] w-64 overflow-y-auto overflow-x-hidden py-16 pl-0.5 xl:w-72 xl:pr-8">
                <Navigation />
              </div>
            </aside>
            {children}
          </Container>
        </div>
      </div>
    </div>
  );
}
