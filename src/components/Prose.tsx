import clsx from "classnames";

export function Prose<T extends React.ElementType = "div">({
  as,
  className,
  ...props
}: React.ComponentPropsWithoutRef<T> & {
  as?: T;
}) {
  let Component = as ?? "div";

  return (
    <Component
      className={clsx(
        className,
        "prose prose-slate max-w-none dark:prose-invert dark:text-slate-400",
        // headings
        "prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem]",
        // lead
        "prose-lead:text-slate-500 dark:prose-lead:text-slate-400",
        // links
        "prose-a:font-normal dark:prose-a:text-pink-400",
        // link underline
        "prose-a:font-normal prose-a:no-underline hover:prose-a:font-normal hover:prose-a:underline ",
        // pre
        "prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10",
        // hr
        "dark:prose-hr:border-slate-800",
      )}
      {...props}
    />
  );
}