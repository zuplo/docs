import clsx from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ChevronRightIcon from "@/components/svgs/chevron-right.svg";
import ChevronDownIcon from "@/components/svgs/chevron-down.svg";
import ArrowIcon from "@/components/svgs/arrow.svg";

import { navigation } from "@/build/navigation.mjs";
import { useState } from "react";
import { NavCategory } from "@/lib/types";
import { NavigationType } from "@/lib/enums/navigation-type";

function SubNavSection({
  navItem,
  onLinkClick,
  depth,
  linkClassName,
}: {
  navItem: NavCategory;
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
  depth: number;
  linkClassName: string;
}) {
  const pathname = usePathname();
  const chevronClassName = "absolute left-0 top-0";
  const [hidden, setHidden] = useState(
    !!navItem?.items &&
      !navItem.items.some((item) => !!item?.href && item.href === pathname),
  );

  function onClick() {
    setHidden(!hidden);
  }

  // useEffect(() => {
  //   setHidden(!link.links.some((l) => "href" in l && l.href === pathname));
  // }, [pathname, setHidden, link.links]);

  return (
    <li className="relative">
      {hidden ? (
        <ChevronRightIcon className={chevronClassName} />
      ) : (
        <ChevronDownIcon className={chevronClassName} />
      )}
      {!!navItem.href && hidden ? (
        <Link
          href={navItem.href}
          className={clsx(linkClassName, `font-${hidden ? "medium" : "bold"}`)}
          onClick={onClick}
        >
          <span className="flex-grow">{navItem.label}</span>
        </Link>
      ) : (
        <a
          className={clsx(linkClassName, `font-${hidden ? "medium" : "bold"}`)}
          onClick={onClick}
        >
          <span className="flex-grow">{navItem.label}</span>
        </a>
      )}
      <ul
        role="list"
        className={clsx(
          hidden ? "hidden" : "",
          "ml-2 mt-2 space-y-2 lg:mt-4 lg:space-y-4",
        )}
      >
        {!!navItem?.items &&
          navItem.items.map((item, i) => (
            <NavSection
              key={i}
              navItem={item}
              onLinkClick={onLinkClick}
              depth={depth + 1}
            />
          ))}
      </ul>
    </li>
  );
}

function NavSection({
  navItem,
  onLinkClick,
  depth,
}: {
  navItem: NavCategory;
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
  depth: number;
}) {
  const pathname = usePathname();
  const linkClassName =
    "block w-full px-6 leading-6 tracking-wider transition-all hover:text-pink hover:text-shadow cursor-pointer relative";

  return (
    <>
      {navItem?.type === NavigationType.SUB_CATEGORY ? (
        <SubNavSection
          linkClassName={linkClassName}
          navItem={navItem}
          depth={depth}
          key={navItem.label}
        />
      ) : (
        <>
          {!!navItem?.href && (
            <li key={navItem.href}>
              <Link
                href={navItem.href}
                onClick={onLinkClick}
                rel="noopener noreferrer"
                target={navItem?.isExternal ? "_blank" : "_self"}
                prefetch={!navItem?.isExternal}
                className={clsx(
                  linkClassName,
                  navItem.href === pathname ? "font-bold" : "font-medium",
                )}
              >
                {navItem.label}
                {navItem?.isExternal && (
                  <ArrowIcon className={clsx("absolute right-0 top-0")} />
                )}
              </Link>
            </li>
          )}
        </>
      )}
    </>
  );
}

export function Navigation({
  className,
  onLinkClick,
}: {
  className?: string;
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <nav className={clsx("text-base lg:text-sm", className)}>
      <ul role="list" className="space-y-9">
        {navigation.map((section: NavCategory) => (
          <li key={section.label}>
            {section?.type === NavigationType.CATEGORY && (
              <h5 className="pl-6 text-sm text-slate-400 font-medium">
                {section?.href ? (
                  <Link href={section.href}>{section.label}</Link>
                ) : (
                  <>{section.label}</>
                )}
              </h5>
            )}
            <ul role="list" className="mt-2 space-y-2 lg:mt-3.5 lg:space-y-4 ">
              {!!section?.items &&
                section?.items.map((navItem, i) => (
                  <NavSection
                    navItem={navItem}
                    key={i}
                    onLinkClick={onLinkClick}
                    depth={0}
                  />
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
