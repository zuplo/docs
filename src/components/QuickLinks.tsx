import Link from "next/link";

import { Icon } from "@/components/Icon";

export function QuickLinks({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {children}
    </div>
  );
}

export interface Props {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentProps<typeof Icon>["icon"];
}

export function QuickLink({ title, description, href, icon }: Props) {
  return (
    <div className="hover:border-pink group relative rounded-xl border border-gray-200 dark:border-gray-800 dark:hover:border-pink transition duration-300">
      <div className="relative overflow-hidden rounded-xl p-6">
        <Icon icon={icon} className="h-8 w-8" />
        <h2 className="font-display mt-4 text-base text-gray-900 dark:text-white">
          <Link href={href}>
            <span className="absolute -inset-px rounded-xl" />
            {title}
          </Link>
        </h2>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}
