"use client";

import clsx from "classnames";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { type Section } from "@/lib/types";

export function TableOfContents({
  tableOfContents,
}: {
  tableOfContents: Array<Section>;
}) {
  let [currentSection, setCurrentSection] = useState(tableOfContents[0]?.id);

  let getHeadings = useCallback((tableOfContents: Array<Section>) => {
    return tableOfContents
      .flatMap((node) => [node.id, ...node.children.map((child) => child.id)])
      .map((id) => {
        let el = document.getElementById(id);
        if (!el) return null;

        let style = window.getComputedStyle(el);
        let scrollMt = parseFloat(style.scrollMarginTop);

        let top = window.scrollY + el.getBoundingClientRect().top - scrollMt;
        return { id, top };
      })
      .filter((x): x is { id: string; top: number } => x !== null);
  }, []);

  useEffect(() => {
    if (tableOfContents.length === 0) return;
    let headings = getHeadings(tableOfContents);
    function onScroll() {
      let top = window.scrollY;
      let current = headings[0].id;
      for (let heading of headings) {
        if (top >= heading.top - 20) {
          current = heading.id;
        } else {
          break;
        }
      }
      setCurrentSection(current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [getHeadings, tableOfContents]);

  function isActive(section: Section) {
    if (section.id === currentSection) {
      return true;
    }
    if (!section.children) {
      return false;
    }
    return section.children.findIndex(isActive) > -1;
  }

  return (
    <div className="hidden pl-8 pt-[60px] xl:sticky xl:top-0 xl:block xl:flex-none xl:overflow-y-auto">
      <nav aria-labelledby="on-this-page-title" className="w-56">
        {tableOfContents.length > 0 && (
          <>
            <h2
              id="on-this-page-title"
              className="uppercase leading-normal tracking-widest text-gray-600"
            >
              On this page
            </h2>
            <ol role="list" className="mt-4 space-y-3 text-sm">
              {tableOfContents.map((section) => (
                <li key={section.id} className="leading-6 tracking-wider">
                  <Link
                    href={`#${section.id}`}
                    className={clsx(
                      "block w-full transition-all hover:text-pink hover:text-shadow",
                      isActive(section) ? "font-bold" : "font-medium",
                    )}
                  >
                    {section.title}
                  </Link>
                  {section.children.length > 0 && (
                    <ol role="list" className="mt-2 space-y-3 pl-5">
                      {section.children.map((subSection) => (
                        <li key={subSection.id}>
                          <Link
                            href={`#${subSection.id}`}
                            className={clsx(
                              "transition-all hover:text-pink hover:text-shadow",
                              isActive(subSection)
                                ? "font-bold"
                                : "font-medium",
                            )}
                          >
                            {subSection.title}
                          </Link>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
            </ol>
          </>
        )}
      </nav>
    </div>
  );
}
