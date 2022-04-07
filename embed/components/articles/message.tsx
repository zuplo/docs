import cn from "classnames";
import Image from "next/image";
import { Children, isValidElement, ReactNode } from "react";
import errorSrc from "../../public/assets/img/error.svg";
import infoSrc from "../../public/assets/img/info.svg";
import successSrc from "../../public/assets/img/success.svg";
import warningSrc from "../../public/assets/img/warning.svg";
import messageStyles from "./message.module.css";

type Variant = "base" | "info" | "error" | "success" | "warning";

interface Props {
  variant?: Variant;
  icon?: string;
  children?: ReactNode;
}

const ICON: Record<Exclude<Variant, "base">, string> = {
  info: infoSrc,
  error: errorSrc,
  success: successSrc,
  warning: warningSrc,
};

const Row = ({ variant, icon = ICON[variant], children }: Props) => (
  <div className="flex my-2">
    {icon && <Image src={icon} />}
    <span className={cn(icon && "ml-2.5", "mt-0.5")}>{children}</span>
  </div>
);

export const Message = ({ variant = "base", icon, children }: Props) => {
  const childrenAreRows = Children.toArray(children).every(
    (child) =>
      child === "\n" ||
      (isValidElement(child) &&
        typeof child.type !== "string" &&
        child.type.name === "Row")
  );
  return (
    <div
      className={`flex flex-col text-sm text-black py-1.5 px-5 rounded-xl border border-${variant}-300 bg-${variant}-100 mb-5 ${messageStyles["message"]}`}
      role="alert"
    >
      {childrenAreRows ? (
        children
      ) : (
        <Row icon={icon} variant={variant}>
          {children}
        </Row>
      )}
    </div>
  );
};

Message.Row = Row;
