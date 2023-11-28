import clsx from "classnames";

import { Icon } from "@/components/Icon";

const styles = {
  note: {
    container:
      "bg-pink-50 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10",
    title: "text-pink-900 dark:text-pink-400",
    body: "text-pink-800 [--tw-prose-background:theme(colors.pink.50)] prose-a:text-pink-900 prose-code:text-pink-900 dark:text-slate-300 dark:prose-code:text-slate-300",
  },
  warning: {
    container:
      "bg-amber-50 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10",
    title: "text-amber-900 dark:text-amber-500",
    body: "text-amber-800 [--tw-prose-underline:theme(colors.amber.400)] [--tw-prose-background:theme(colors.amber.50)] prose-a:text-amber-900 prose-code:text-amber-900 dark:text-slate-300 dark:[--tw-prose-underline:theme(colors.pink.700)] dark:prose-code:text-slate-300",
  },
};

const icons = {
  note: (props: { className?: string }) => <Icon icon="lightbulb" {...props} />,
  warning: (props: { className?: string }) => (
    <Icon icon="warning" color="amber" {...props} />
  ),
};

export function Callout({
  title,
  children,
  type = "note",
}: {
  title: string;
  children: React.ReactNode;
  type?: keyof typeof styles;
}) {
  let IconComponent = icons[type];

  return (
    <div className={clsx("my-8 flex rounded-3xl p-6", styles[type].container)}>
      <IconComponent className="h-8 w-8 flex-none" />
      <div className="ml-4 flex-auto">
        <p className={clsx("m-0 font-display text-xl", styles[type].title)}>
          {title}
        </p>
        <div className={clsx("prose mt-2.5", styles[type].body)}>
          {children}
        </div>
      </div>
    </div>
  );
}
