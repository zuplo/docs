import { cva } from "class-variance-authority";
import { ReactNode } from "react";
import classNames from "classnames";

interface Props {
  children: ReactNode;
  className?: string;
  size?: "small" | "large";
}

const containerClasses = cva("container relative", {
  variants: {
    size: {
      small: "lg:max-w-3xl",
      large: "max-w-wide",
    },
  },
});

export const Container: React.FC<Props> = ({ children, size, className }) => {
  return (
    <div className={classNames(containerClasses({ size }), className)}>
      {children}
    </div>
  );
};
