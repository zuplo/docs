import { PropsWithChildren } from "react";
import clsx from "classnames";

export function DocsContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        className,
        "sticky top-[4.75rem] -ml-0.5 flex h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden pt-[60px]",
      )}
    >
      {children}
    </div>
  );
}
