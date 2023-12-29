"use client";

import { navigation } from "@/build/navigation.mjs";
import { type Result } from "@/build/search.mjs";
import { useFindNavItemByLink } from "@/lib/hooks/useFindNavItemByLink";
import {
  createAutocomplete,
  type AutocompleteApi,
  type AutocompleteCollection,
  type AutocompleteState,
} from "@algolia/autocomplete-core";
import { Dialog } from "@headlessui/react";
import clsx from "classnames";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Fragment,
  Suspense,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Highlighter from "react-highlight-words";

type EmptyObject = Record<string, never>;

type Autocomplete = AutocompleteApi<
  any,
  React.SyntheticEvent,
  React.MouseEvent,
  React.KeyboardEvent
>;

function useAutocomplete({
  close,
}: {
  close: (autocomplete: Autocomplete) => void;
}) {
  let id = useId();
  let router = useRouter();
  let [autocompleteState, setAutocompleteState] = useState<
    AutocompleteState<Result> | EmptyObject
  >({});

  function navigate({ itemUrl }: { itemUrl?: string }) {
    if (!itemUrl) {
      return;
    }

    router.push(itemUrl);

    if (
      itemUrl ===
      window.location.pathname + window.location.search + window.location.hash
    ) {
      close(autocomplete);
    }
  }

  let [autocomplete] = useState<Autocomplete>(() =>
    createAutocomplete<
      Result,
      React.SyntheticEvent,
      React.MouseEvent,
      React.KeyboardEvent
    >({
      id,
      placeholder: "Find something...",
      defaultActiveItemId: 0,
      onStateChange({ state }) {
        setAutocompleteState(state);
      },
      shouldPanelOpen({ state }) {
        return state.query !== "";
      },
      navigator: {
        navigate,
      },
      getSources({ query }) {
        return import("@/build/search.mjs").then(({ search }) => {
          return [
            {
              sourceId: "documentation",
              getItems() {
                return search(query, { limit: 5 });
              },
              getItemUrl({ item }) {
                return `/${item.url.replace(".md", "")}`;
              },
              onSelect: navigate,
            },
          ];
        });
      },
    }),
  );

  return { autocomplete, autocompleteState };
}

function LoadingIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  let id = useId();

  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="5.5" strokeLinejoin="round" />
      <path
        stroke={`url(#${id})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.5 10a5.5 5.5 0 1 0-5.5 5.5"
      />
      <defs>
        <linearGradient
          id={id}
          x1="13"
          x2="9.5"
          y1="9"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function HighlightQuery({ text, query }: { text: string; query: string }) {
  return (
    <Highlighter
      highlightClassName="group-aria-selected:underline bg-transparent text-pink-600 dark:text-pink-400"
      searchWords={[query]}
      autoEscape={true}
      textToHighlight={text}
    />
  );
}

function SearchResult({
  result,
  autocomplete,
  collection,
  query,
}: {
  result: Result;
  autocomplete: Autocomplete;
  collection: AutocompleteCollection<Result>;
  query: string;
}) {
  let id = useId();
  let sectionTitle = navigation.find((section) =>
    section.items.find(useFindNavItemByLink),
  )?.label;
  let hierarchy = [sectionTitle, result.pageTitle].filter(
    (x): x is string => typeof x === "string",
  );

  return (
    <li
      className="group block cursor-default rounded-lg px-3 py-2 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-700/30"
      aria-labelledby={`${id}-hierarchy ${id}-title`}
      {...autocomplete.getItemProps({
        item: result,
        source: collection.source,
      })}
    >
      <div
        id={`${id}-title`}
        aria-hidden="true"
        className="text-sm text-slate-700 group-aria-selected:text-pink-600 dark:text-slate-300 dark:group-aria-selected:text-pink-400"
      >
        <HighlightQuery text={result.title} query={query} />
      </div>
      {hierarchy.length > 0 && (
        <div
          id={`${id}-hierarchy`}
          aria-hidden="true"
          className="mt-0.5 truncate whitespace-nowrap text-xs text-slate-500 dark:text-slate-400"
        >
          {hierarchy.map((item, itemIndex, items) => (
            <Fragment key={itemIndex}>
              <HighlightQuery text={item} query={query} />
              <span
                className={
                  itemIndex === items.length - 1
                    ? "sr-only"
                    : "mx-2 text-slate-300 dark:text-slate-700"
                }
              >
                /
              </span>
            </Fragment>
          ))}
        </div>
      )}
    </li>
  );
}

function SearchResults({
  autocomplete,
  query,
  collection,
}: {
  autocomplete: Autocomplete;
  query: string;
  collection: AutocompleteCollection<Result>;
}) {
  if (collection.items.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-slate-700 dark:text-slate-400">
        No results for &ldquo;
        <span className="break-words text-slate-900 dark:text-white">
          {query}
        </span>
        &rdquo;
      </p>
    );
  }

  return (
    <ul {...autocomplete.getListProps()}>
      {collection.items.map((result) => (
        <SearchResult
          key={result.url}
          result={result}
          autocomplete={autocomplete}
          collection={collection}
          query={query}
        />
      ))}
    </ul>
  );
}

const SearchInput = forwardRef<
  React.ElementRef<"input">,
  {
    autocomplete: Autocomplete;
    autocompleteState: AutocompleteState<Result> | EmptyObject;
    onClose: () => void;
  }
>(function SearchInput({ autocomplete, autocompleteState, onClose }, inputRef) {
  let inputProps = autocomplete.getInputProps({ inputElement: null });

  return (
    <div className="group relative flex h-12">
      <SearchIcon className="absolute bottom-0 left-3 top-0 m-auto text-slate-400" />
      <input
        ref={inputRef}
        className={clsx(
          "flex-auto appearance-none bg-transparent pl-12 text-slate-900 outline-none placeholder:text-slate-400 focus:w-full focus:flex-none focus:outline-none dark:text-white sm:text-sm [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden",
          autocompleteState.status === "stalled" ? "pr-11" : "pr-4",
        )}
        {...inputProps}
        onKeyDown={(event) => {
          if (
            event.key === "Escape" &&
            !autocompleteState.isOpen &&
            autocompleteState.query === ""
          ) {
            // In Safari, closing the dialog with the escape key can sometimes cause the scroll position to jump to the
            // bottom of the page. This is a workaround for that until we can figure out a proper fix in Headless UI.
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }

            onClose();
          } else {
            inputProps.onKeyDown(event);
          }
        }}
      />
      {autocompleteState.status === "stalled" && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          <LoadingIcon className="h-6 w-6 animate-spin stroke-slate-700 text-slate-500" />
        </div>
      )}
    </div>
  );
});

function CloseOnNavigation({
  close,
  autocomplete,
}: {
  close: (autocomplete: Autocomplete) => void;
  autocomplete: Autocomplete;
}) {
  let pathname = usePathname();
  let searchParams = useSearchParams();

  useEffect(() => {
    close(autocomplete);
  }, [pathname, searchParams, close, autocomplete]);

  return null;
}

function SearchDialog({
  open,
  setOpen,
  className,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
}) {
  let formRef = useRef<React.ElementRef<"form">>(null);
  let panelRef = useRef<React.ElementRef<"div">>(null);
  let inputRef = useRef<React.ElementRef<typeof SearchInput>>(null);

  let close = useCallback(
    (autocomplete: Autocomplete) => {
      setOpen(false);
      autocomplete.setQuery("");
    },
    [setOpen],
  );

  let { autocomplete, autocompleteState } = useAutocomplete({
    close() {
      close(autocomplete);
    },
  });

  useEffect(() => {
    if (open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);

  return (
    <>
      <Suspense fallback={null}>
        <CloseOnNavigation close={close} autocomplete={autocomplete} />
      </Suspense>
      <Dialog
        open={open}
        onClose={() => close(autocomplete)}
        className={clsx("fixed inset-0 z-50", className)}
      >
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur" />

        <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-20 md:py-32 lg:px-8 lg:py-[15vh]">
          <Dialog.Panel className="mx-auto transform-gpu overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-800 dark:ring-1 dark:ring-slate-700 sm:max-w-xl">
            <div {...autocomplete.getRootProps({})}>
              <form
                ref={formRef}
                {...autocomplete.getFormProps({
                  inputElement: inputRef.current,
                })}
              >
                <SearchInput
                  ref={inputRef}
                  autocomplete={autocomplete}
                  autocompleteState={autocompleteState}
                  onClose={() => setOpen(false)}
                />
                <div
                  ref={panelRef}
                  className="border-t border-slate-200 bg-white px-2 py-3 empty:hidden dark:border-slate-400/10 dark:bg-slate-800"
                  {...autocomplete.getPanelProps({})}
                >
                  {autocompleteState.isOpen && (
                    <SearchResults
                      autocomplete={autocomplete}
                      query={autocompleteState.query}
                      collection={autocompleteState.collections[0]}
                    />
                  )}
                </div>
              </form>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

function useSearchProps() {
  let buttonRef = useRef<React.ElementRef<"button">>(null);
  let [open, setOpen] = useState(false);

  return {
    buttonProps: {
      ref: buttonRef,
      onClick() {
        setOpen(true);
      },
    },
    dialogProps: {
      open,
      setOpen: useCallback((open: boolean) => {
        let { width = 0, height = 0 } =
          buttonRef.current?.getBoundingClientRect() ?? {};
        if (!open || (width !== 0 && height !== 0)) {
          setOpen(open);
        }
      }, []),
    },
  };
}

export function Search() {
  let { buttonProps, dialogProps } = useSearchProps();

  return (
    <div>
      <button
        type="button"
        className="group flex h-6 w-6 items-center justify-center rounded-xl bg-transparent px-3.5 hover:bg-white hover:ring-2 hover:ring-pink md:h-auto md:w-80 md:flex-none md:justify-start md:p-3 md:text-sm md:ring-1 md:ring-inset md:ring-gray-600 lg:w-[198px]"
        {...buttonProps}
      >
        <SearchIcon className="h-4 w-4 flex-none text-gray-600 opacity-50 group-hover:text-gray-600 dark:text-white" />
        <span className="sr-only text-sm text-gray-600 group-hover:text-black md:not-sr-only md:ml-2">
          Search
        </span>
      </button>
      <SearchDialog {...dialogProps} />
    </div>
  );
}
