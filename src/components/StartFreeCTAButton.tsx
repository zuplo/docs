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
        className={classNames(
          "btn hidden rounded-xl px-7 pb-4 text-base text-sm leading-6 md:inline-block",
          {
            [`${style}`]: style,
            "btn-primary-dark": type === "dark",
            "btn-primary-light": type === "light",
          },
        )}
        href={"https://portal.zuplo.com"}
      >
        Sign Up
      </Link>
      <Link
        className={classNames(
          "btn rounded-xl px-7 pb-4 text-base text-sm leading-6 md:hidden",
          {
            [`${style}`]: style,
            "btn-primary-dark": type === "dark",
            "btn-primary-light": type === "light",
          },
        )}
        href="https://calendly.com/d/y3n-4dg-8xc/call-with-zuplo"
      >
        Book a demo
      </Link>
    </>
  );
};
