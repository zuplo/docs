import clsx from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ChevronRightIcon from "@/components/svgs/chevron-right.svg";
import ChevronDownIcon from "@/components/svgs/chevron-down.svg";
import ArrowIcon from "@/components/svgs/arrow.svg";

import { navigation } from "@/build/navigation.mjs";
import { NavCategory, NavItem } from "@/lib/interfaces";
import { useState } from "react";

function SubNavSection({
  link,
  onLinkClick,
  depth,
  linkClassName,
}: {
  link: NavCategory;
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
  depth: number;
  linkClassName: string;
}) {
  const pathname = usePathname();
  const chevronClassName = "absolute left-0 top-0";
  const [hidden, setHidden] = useState(
    !link.items.some((l) => "href" in l && l.href === pathname),
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
      <a
        className={clsx(linkClassName, `font-${hidden ? "medium" : "bold"}`)}
        onClick={onClick}
      >
        <span className="flex-grow">{link.label}</span>
      </a>
      <ul
        role="list"
        className={clsx(
          hidden ? "hidden" : "",
          "ml-2 mt-2 space-y-2 lg:mt-4 lg:space-y-4",
        )}
      >
        {link.items.map((link, i) => (
          <NavSection
            link={link}
            key={i}
            onLinkClick={onLinkClick}
            depth={depth + 1}
          />
        ))}
      </ul>
    </li>
  );
}

function NavSection({
  link,
  onLinkClick,
  depth,
}: {
  link: NavCategory | NavItem;
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
  depth: number;
}) {
  const pathname = usePathname();
  const linkClassName =
    "block w-full px-6 leading-6 tracking-wider transition-all hover:text-pink hover:text-shadow";

  if ("href" in link) {
    return (
      <li key={link.href} className="relative">
        <Link
          href={link.href}
          onClick={onLinkClick}
          className={clsx(
            linkClassName,
            link.href === pathname ? "font-bold" : "font-medium",
          )}
        >
          {link.label}
        </Link>
        <ArrowIcon className="absolute right-0 top-0 hidden" />
      </li>
    );
  } else {
    return (
      <SubNavSection
        linkClassName={linkClassName}
        link={link}
        depth={depth}
        key={link.label}
      />
    );
  }
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
        {navigation.map((section) => (
          <li key={section.label}>
            <h5 className="pl-6 uppercase leading-normal tracking-widest text-gray-600">
              {section.label}
            </h5>
            <ul role="list" className="mt-2 space-y-2 lg:mt-3.5 lg:space-y-4 ">
              {section.items.map((link, i) => (
                <NavSection
                  link={link}
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
