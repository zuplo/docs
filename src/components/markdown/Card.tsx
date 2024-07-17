import Link from "next/link";
import { PropsWithChildren } from "react";
import Badge from "./Badge";

/*
<CardGroup>
  <Card type="reference" title="hello" description="This is a thing" href="/" />
  <Card type="example" title="hello" description="This is a thing" href="/" />
  <Card type="tutorial" title="hello" description="This is a thing" href="/" />
  <Card type="blog" title="hello" description="This is a thing" href="/" />
</CardGroup>
*/

const cards = {
  reference: {
    title: "Reference",
    badgeStyle: "text-blue-800 bg-blue-50",
  },
  example: {
    title: "Example",
    badgeStyle: "text-green-800 bg-green-50",
  },
  tutorial: {
    title: "Tutorial",
    badgeStyle: "text-yellow-800 bg-yellow-50",
  },
  blog: {
    title: "Blog Post",
    badgeStyle: "text-red-800 bg-red-50",
  },
};

export type BadgeType = keyof typeof cards;

export function Card({
  type,
  title,
  href,
  description,
}: {
  type: BadgeType;
  title: string;
  href: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <div
        className={`group relative rounded-xl border border-slate-200  hover:bg-gray-50/50 dark:border-slate-800`}
      >
        <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 "></div>
        <div className="relative overflow-hidden rounded-xl p-6">
          <Badge title={cards[type].title} className={cards[type].badgeStyle} />
          <h2 className="mt-4 font-medium text-base text-slate-900 dark:text-white">
            <span className="absolute -inset-px rounded-xl"></span>
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function CardGroup({ children }: PropsWithChildren) {
  return (
    <div className="not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {children}
    </div>
  );
}
