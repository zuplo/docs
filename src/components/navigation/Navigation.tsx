"use client";

import { navigation } from "@/build/navigation.mjs";
import clsx from "clsx";
import { NavigationCategory } from "./NavigationCategory";

type Props = {
  className?: string;
};

export function Navigation({ className }: Props) {
  return (
    <nav className={clsx("text-base lg:text-sm", className)}>
      <ul role="list">
        {navigation.map((section) => (
          <NavigationCategory key={section.label} navItem={section} isRoot />
        ))}
      </ul>
    </nav>
  );
}
