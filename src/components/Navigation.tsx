import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import clsx from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavItem, NavSection, navigation } from "@/lib/navigation";
import { useState } from "react";

function SubNavSection({
  link,
  onLinkClick,
  depth,
}: {
  link: NavSection;
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
  depth: number;
}) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(
    !link.links.some((l) => "href" in l && l.href === pathname),
  );

  function onClick() {
    setHidden(!hidden);
  }

  // useEffect(() => {
  //   setHidden(!link.links.some((l) => "href" in l && l.href === pathname));
  // }, [pathname, setHidden, link.links]);

  return (
    <li className={`relative`}>
      <a
        className="flex  w-full pl-1 text-slate-500 cursor-pointer"
        onClick={onClick}
      >
        <span className="flex-grow">{link.title}</span>
        {hidden ? (
          <ChevronRightIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </a>
      <ul
        role="list"
        className={`${
          hidden ? "hidden" : ""
        } mt-2 space-y-2 border-l border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200 ml-2`}
      >
        {link.links.map((link, i) => (
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
  link: NavSection | NavItem;
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
  depth: number;
}) {
  let pathname = usePathname();
  if ("href" in link && depth === 0) {
    return (
      <li key={link.href} className="relative">
        <Link
          href={link.href}
          onClick={onLinkClick}
          className={clsx(
            "block w-full pl-1 ",
            link.href === pathname
              ? "font-medium  "
              : "text-slate-500  hover:text-slate-600  dark:text-slate-400  dark:hover:text-slate-300",
          )}
        >
          {link.title}
        </Link>
      </li>
    );
  } else if ("href" in link) {
    return (
      <li key={link.href} className="relative">
        <Link
          href={link.href}
          onClick={onLinkClick}
          className={clsx(
            "block w-full pl-3.5 ",
            link.href === pathname
              ? "font-medium  border-l border-pink"
              : "text-slate-500 hover:text-slate-600  dark:text-slate-400  dark:hover:text-slate-300",
          )}
        >
          {link.title}
        </Link>
      </li>
    );
  } else {
    return <SubNavSection link={link} depth={depth} key={link.title} />;
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
          <li key={section.title}>
            <h2 className="font-display font-semibold text-slate-900 dark:text-white">
              {section.title}
            </h2>
            <ul role="list" className="mt-2 space-y-2 lg:mt-4 lg:space-y-4 ">
              {section.links.map((link, i) => (
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
