"use client";

import { createContext, useCallback, useContext, useState } from "react";
import Link from "next/link";
import { Dialog } from "@headlessui/react";

import { Logomark } from "@/components/Logo";
import { Navigation } from "@/components/navigation/Navigation";
import { MenuIcon, XIcon } from "lucide-react";

const MobileNavigationContext = createContext<{
  isOpen: boolean;
  close: () => void;
}>({
  isOpen: false,
  // default is close function is a noop (for non-mobile)
  close: () => {},
});

export const useMobileNavigation = () => useContext(MobileNavigationContext);

export function MobileNavigation() {
  let [isOpen, setIsOpen] = useState(false);
  let close = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <MobileNavigationContext.Provider value={{ isOpen, close }}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative"
        aria-label="Open navigation"
      >
        <MenuIcon className="h-6 w-6 stroke-gray-500" />
      </button>
      <Dialog
        open={isOpen}
        onClose={() => close()}
        className="fixed inset-0 z-50 flex items-start overflow-y-auto bg-gray-900/50 pr-10 backdrop-blur lg:hidden"
        aria-label="Navigation"
      >
        <Dialog.Panel className="min-h-full w-full max-w-xs bg-gray-50 px-4 pb-12 pt-5 dark:bg-gray-900 sm:px-6">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => close()}
              aria-label="Close navigation"
            >
              <XIcon className="h-6 w-6 stroke-gray-500" />
            </button>
            <Link href="/" className="ml-6" aria-label="Home page">
              <Logomark className="h-9 w-9" />
            </Link>
          </div>
          <Navigation className="mt-5 px-1" />
        </Dialog.Panel>
      </Dialog>
    </MobileNavigationContext.Provider>
  );
}
