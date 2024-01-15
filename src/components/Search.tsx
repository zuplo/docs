"use client";

import type {
  InkeepCustomTriggerProps,
  InkeepWidgetBaseSettings,
} from "@inkeep/widgets";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

function SearchIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" {...props}>
      <path d="M16.293 17.707a1 1 0 0 0 1.414-1.414l-1.414 1.414ZM9 14a5 5 0 0 1-5-5H2a7 7 0 0 0 7 7v-2ZM4 9a5 5 0 0 1 5-5V2a7 7 0 0 0-7 7h2Zm5-5a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7v2Zm8.707 12.293-3.757-3.757-1.414 1.414 3.757 3.757 1.414-1.414ZM14 9a4.98 4.98 0 0 1-1.464 3.536l1.414 1.414A6.98 6.98 0 0 0 16 9h-2Zm-1.464 3.536A4.98 4.98 0 0 1 9 14v2a6.98 6.98 0 0 0 4.95-2.05l-1.414-1.414Z" />
    </svg>
  );
}

const InkeepCustomTrigger: any = dynamic(
  () => import("@inkeep/widgets").then((mod) => mod.InkeepCustomTrigger),
  { ssr: false },
);

const baseSettings: InkeepWidgetBaseSettings = {
  apiKey: "499c156cf7a9798343949c8bb5665ac95e48132c6d68c42e",
  integrationId: "clot3asdz0000s601nc8jwnzx",
  organizationId: "org_dDOlt2uJlMWM8oIS",
  primaryBrandColor: "#ff00bd",
  organizationDisplayName: "Zuplo",
  theme: {
    components: {
      SearchBarTrigger: {
        defaultProps: {
          size: "expand",
          variant: "subtle", // Choose from 'emphasized' or 'subtle'
        },
      },
    },
  },
};

export function Search() {
  let [modifierKey, setModifierKey] = useState<string>();
  useEffect(() => {
    setModifierKey(
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? "⌘" : "Ctrl ",
    );
  }, []);

  const [isOpen, setIsOpen] = useState(false);

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
  };

  return (
    <>
      <button
        type="button"
        className="group flex h-6 w-6 items-center justify-center sm:justify-start md:h-auto md:w-80 md:flex-none md:rounded-lg md:py-2.5 md:pl-4 md:pr-3.5 md:text-sm md:ring-1 md:ring-slate-700 md:hover:ring-slate-400 dark:md:bg-slate-800/75 dark:md:ring-inset dark:md:ring-white/5 dark:md:hover:bg-slate-700/40 dark:md:hover:ring-slate-500 lg:w-96"
        onClick={() => setIsOpen(true)}
      >
        <SearchIcon className="h-5 w-5 flex-none fill-slate-400 group-hover:fill-slate-500 dark:fill-slate-500 md:group-hover:fill-slate-400" />
        <span className="sr-only md:not-sr-only md:ml-2 md:text-slate-500 md:dark:text-slate-400">
          Search docs
        </span>
        {modifierKey && (
          <kbd className="ml-auto hidden font-medium text-slate-400 dark:text-slate-500 md:block">
            <kbd className="font-sans">{modifierKey}</kbd>
            <kbd className="font-sans">K</kbd>
          </kbd>
        )}
      </button>
      <InkeepCustomTrigger {...inkeepCustomTriggerProps} />
    </>
  );
}
