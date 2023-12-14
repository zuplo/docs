import Link from "next/link";

import { Icon } from "@/components/Icon";
import { QuickLinkItem } from "@/lib/types";

export function QuickLinks({ items }: { items: Array<QuickLinkItem> }) {
  return (
    <div className="not-prose grid grid-cols-1 gap-6 sm:grid-cols-2">
      {items.map((item) => (
        <QuickLink
          key={item.id}
          title={item.title}
          href={item.href}
          icon={item.icon}
        />
      ))}
    </div>
  );
}

export function QuickLink({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description?: string;
  href: string;
  icon: React.ComponentProps<typeof Icon>["icon"];
}) {
  return (
    <div className="group relative rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.pink.50)),var(--quick-links-hover-bg,theme(colors.pink.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.pink.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.black)]" />
      <div className="relative overflow-hidden rounded-xl p-6">
        <Icon icon={icon} className="h-8 w-8" />
        <h2 className="mt-4 font-display text-base text-black group-hover:text-white">
          <Link href={href}>
            <span className="absolute -inset-px rounded-xl" />
            {title}
          </Link>
        </h2>
        {description && (
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
