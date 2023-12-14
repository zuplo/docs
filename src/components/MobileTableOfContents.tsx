"use client";

import { Section } from "@/lib/types";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "classnames";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export function MobileTableOfContents({
  tableOfContents,
}: {
  tableOfContents: Array<Section>;
}) {
  const optionClassName =
    "text-normal w-full bg-white dark:bg-black dark:bg-opacity-5 bg-opacity-5 px-3 py-1.5";
  const chevronClassName = "w-5 h-5";

  return (
    <>
      {tableOfContents.length > 0 && (
        <div className="my-4 block xl:hidden">
          <Listbox>
            {({ open }) => (
              <>
                <Listbox.Button
                  className={clsx([
                    optionClassName,
                    "flex items-center justify-between text-left",
                    open ? "rounded-t-md border-b" : "rounded-md",
                  ])}
                >
                  On this page
                  {open ? (
                    <ChevronUpIcon className={chevronClassName} />
                  ) : (
                    <ChevronDownIcon className={chevronClassName} />
                  )}
                </Listbox.Button>
                <Transition
                  enter="transition duration-500 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-300 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Listbox.Options
                    className={clsx([optionClassName, "rounded-b-md"])}
                  >
                    {tableOfContents.map((section) => (
                      <Listbox.Option key={section.id} value={section}>
                        <Link href={`#${section.id}`} className="block w-full">
                          {section.title}
                        </Link>
                        {section.children.length > 0 && (
                          <>
                            {section.children.map((subSection) => (
                              <li key={subSection.id}>
                                <Link
                                  href={`#${subSection.id}`}
                                  className="block w-full"
                                >
                                  {subSection.title}
                                </Link>
                              </li>
                            ))}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </>
            )}
          </Listbox>
        </div>
      )}
    </>
  );
}
