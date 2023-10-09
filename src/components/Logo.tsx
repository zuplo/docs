import classNames from "classnames";
import Link from "next/link";

import LogoIcon from "./svgs/logo.svg";

const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <Link
    href="https://zuplo.com"
    className={classNames("transition-opacity hover:opacity-80", className)}
    prefetch={false}
    aria-label="Navigate to home page"
  >
    <LogoIcon alt="Zuplo logo" className="text-transparent" />
  </Link>
);

export default Logo;
