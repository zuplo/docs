import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import cn from "classnames";
import { useRouter } from "next/router";
import React from "react";
import { LinkItem } from "../lib/config";
import styles from "./header.module.css";
import Logo from "./logo";

interface Props {
  menuItems: LinkItem[];
}

const Header = ({ menuItems }: Props) => {
  const { asPath } = useRouter();
  return (
    <Disclosure as="header">
      {({ open }) => (
        <>
          <div className="flex flex-row justify-center">
            <div className="flex flex-grow justify-between items-center max-w-screen-xl px-5 py-[22px]">
              <div className="inline-flex items-center">
                <Logo
                  className="hidden lg:pt-[3px] lg:h-10 lg:block"
                  height={41}
                  width={147}
                />
                <Logo
                  className="pt-[8px] lg:h-10 lg:hidden"
                  height={26}
                  width={115}
                />
              </div>

              <div className="ml-auto mr-8 xl:mr-0 flex flex-col sm:flex-row gap-2">
                <a
                  href="https://zuplo.com/#sign_up_form"
                  className="no-underline text-sm sm:text-md rounded-lg shadow whitespace-nowrap w-full justify-center px-5 py-3 font-small font-normal tracking-wider text-white bg-pink hover:bg-white hover:text-black"
                >
                  Sign Up
                </a>
              </div>
              <div className="relative z-10 flex items-center xl:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="rounded-md inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel
            as="nav"
            className={cn(
              "xl:hidden absolute top-[80px] z-40 left-0 bg-black w-full shadow-2xl animate",
              styles.mobileNavigation
            )}
            aria-label="Global"
          >
            <div className="pt-2 pb-3 mb-2 px-2 space-y-1">
              {menuItems.map((item, index) => {
                const href = `/articles${item.url}`;
                const isActive = href === asPath;
                return (
                  <Disclosure.Button
                    key={index}
                    as="a"
                    href={href}
                    className={cn(
                      isActive ? "font-bold" : "font-regular",
                      "block text-gray-100 py-2 px-3 no-underline"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.title}
                  </Disclosure.Button>
                );
              })}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
