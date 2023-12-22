"use client";

import { Dialog } from "@headlessui/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import LogoIcon from "./svgs/logo.svg";
import { Navigation } from "@/components/Navigation";
import { MenuIcon, X as CloseIcon } from "lucide-react";

function CloseOnNavigation({ close }: { close: () => void }) {
  let pathname = usePathname();
  let searchParams = useSearchParams();

  useEffect(() => {
    close();
  }, [pathname, searchParams, close]);

  return null;
}

export function MobileNavigation() {
  let [isOpen, setIsOpen] = useState(false);
  let close = useCallback(() => setIsOpen(false), [setIsOpen]);

  function onLinkClick(event: React.MouseEvent<HTMLAnchorElement>) {
    let link = event.currentTarget;
    if (
      link.pathname + link.search + link.hash ===
      window.location.pathname + window.location.search + window.location.hash
    ) {
      close();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative"
        aria-label="Open navigation"
      >
        <MenuIcon
          className="block h-6 w-6 stroke-gray-600"
          aria-hidden="true"
        />
      </button>
      <Suspense fallback={null}>
        <CloseOnNavigation close={close} />
      </Suspense>
      <Dialog
        open={isOpen}
        onClose={() => close()}
        className="fixed inset-0 z-50 flex items-start overflow-y-auto bg-slate-900/50 pr-10 backdrop-blur lg:hidden"
        aria-label="Navigation"
      >
        <Dialog.Panel className="min-h-full w-full max-w-xs bg-gray-400 px-4 pb-12 pt-5 dark:bg-white sm:px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="ml-6" aria-label="Home page">
              <LogoIcon alt="Zuplo logo" className="w-28 text-transparent" />
            </Link>
            <div className="flex">
              <button
                type="button"
                onClick={() => close()}
                aria-label="Close navigation"
              >
                <CloseIcon className="text-slate-500" />
              </button>
            </div>
          </div>
          <Navigation className="mt-5 px-1" onLinkClick={onLinkClick} />
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
