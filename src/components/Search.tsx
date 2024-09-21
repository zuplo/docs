"use client";

import type { InkeepCustomTriggerProps } from "@inkeep/widgets";
import { SearchIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { aiChatSettings, baseSettings } from "../lib/search";

const InkeepCustomTrigger: any = dynamic(
  () => import("@inkeep/widgets").then((mod) => mod.InkeepCustomTrigger),
  { ssr: false },
);

export function Search() {
  return (
    <Suspense fallback={<SearchInner />}>
      <ClientSideSearch />
    </Suspense>
  );
}

function ClientSideSearch() {
  const searchParams = useSearchParams();

  const search = searchParams!.get("search");

  return <SearchInner prefilledQuery={search} />;
}

function SearchInner({ prefilledQuery }: { prefilledQuery?: string | null }) {
  const [modifierKey, setModifierKey] = useState<string>();
  useEffect(() => {
    setModifierKey(
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? "⌘" : "Ctrl ",
    );
  }, []);

  const [isOpen, setIsOpen] = useState(!!prefilledQuery);

  useEffect(() => {
    if (isOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, setIsOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const inkeepCustomTriggerProps: InkeepCustomTriggerProps = {
    isOpen,
    onClose: handleClose,
    baseSettings,
    aiChatSettings,
    searchSettings: {
      prefilledQuery: prefilledQuery || undefined,
    },
  };

  return (
    <>
      <button
        type="button"
        className="flex h-6 w-6 items-center justify-center font-sans text-sm text-gray-400 sm:justify-start md:h-auto md:w-52 md:flex-none md:rounded-lg md:bg-gray-800/75 md:py-2.5 md:pl-4 md:pr-3.5 md:ring-1 md:ring-inset md:ring-gray-800/90 md:hover:bg-gray-700/40 md:hover:ring-gray-400/40"
        onClick={() => setIsOpen(true)}
      >
        <SearchIcon width={20} />
        <span className="sr-only font-light md:not-sr-only md:ml-2">
          Search
        </span>
        {modifierKey && (
          <kbd className="ml-auto hidden font-normal font-sans text-gray-400/75 md:block">
            <kbd className="font-sans">{modifierKey}</kbd>
            <kbd className="font-sans">K</kbd>
          </kbd>
        )}
      </button>
      <InkeepCustomTrigger {...inkeepCustomTriggerProps} />
    </>
  );
}
