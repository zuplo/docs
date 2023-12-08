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
        "dark:white prose max-w-none leading-normal dark:prose-invert",
        // headings
        "prose-headings:mb-2.5 prose-headings:text-2xl prose-h2:mt-10",
        // lead
        "prose-lead:text-slate-500 dark:prose-lead:text-white",
        // links
        "prose-a:font-normal dark:prose-a:text-pink",
        // link underline
        "prose-a:font-normal prose-a:no-underline hover:prose-a:font-normal hover:prose-a:underline ",
        // pre
        "prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10",
        // hr
        "dark:prose-hr:border-slate-800",
        //paragraph
        "prose-p:my-2.5",
        //list
        "prose-ul:my-2.5 prose-li:my-0 prose-li:px-0",
        //img
        "prose-img:my-10",
        //code
        "prose-code:text-base prose-code:font-normal",
      )}
      {...props}
    />
  );
}
