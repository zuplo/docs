import clsx from 'clsx'

export function Prose<T extends React.ElementType = 'div'>({
  as,
  className,
  ...props
}: React.ComponentPropsWithoutRef<T> & {
  as?: T
}) {
  let Component = as ?? 'div'

  return (
    <Component
      className={clsx(
        className,
        'prose prose-gray max-w-none dark:prose-invert dark:text-gray-400',
        // headings
        'prose-headings:scroll-mt-28 prose-headings:font-display lg:prose-headings:scroll-mt-[8.5rem]',
        // lead
        'prose-lead:text-gray-500 dark:prose-lead:text-gray-400',
        // links

        // link underline

        // pre
        'prose-pre:rounded-xl prose-pre:bg-gray-900 prose-pre:shadow-lg dark:prose-pre:bg-gray-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-gray-300/10',
        // hr
        'dark:prose-hr:border-gray-800',
      )}
      {...props}
    />
  )
}
