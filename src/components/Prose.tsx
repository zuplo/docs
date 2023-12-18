import clsx from "classnames";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export const Prose: React.FC<Props> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        className,
        "dark:white prose max-w-none leading-normal dark:prose-invert prose-li:px-0",
      )}
    >
      {children}
    </div>
  );
};
