import classNames from "classnames";
import Link from "next/link";

type StartFreeCTAButtonProps = {
  style?: string;
  type?: "light" | "dark";
};

export const StartFreeCTAButton = ({
  style,
  type = "dark",
}: StartFreeCTAButtonProps) => {
  return (
    <>
      <Link
        className={classNames("btn hidden md:inline-block", {
          [`${style}`]: style,
          "btn-primary-dark": type === "dark",
          "btn-primary-light": type === "light",
        })}
        href={"https://portal.zuplo.com"}
      >
        Start free
      </Link>
      <Link
        className={classNames("btn md:hidden", {
          [`${style}`]: style,
          "btn-primary-dark": type === "dark",
          "btn-primary-light": type === "light",
        })}
        href="https://calendly.com/d/y3n-4dg-8xc/call-with-zuplo"
      >
        Book a demo
      </Link>
    </>
  );
};
