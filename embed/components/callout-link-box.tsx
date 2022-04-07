import { ArrowSmRightIcon } from "@heroicons/react/solid";
import Link from "next/link";

export const CalloutLinkBox = ({
  text,
  linkText,
  href,
  target,
}: {
  text: string;
  linkText: string;
  href: string;
  target?: React.HTMLAttributeAnchorTarget;
}) => (
  <div className="flex flex-row mt-8 p-3 rounded-lg border-solid border-gray border text-sm">
    <div className="leading-none">
      <span className="align-middle pr-2">{text}</span>
      <Link href={href}>
        <a className="font-medium no-underline align-middle" target={target}>
          {linkText}
        </a>
      </Link>
      <ArrowSmRightIcon className="h-6 w-6 text-pink inline-flex" />
    </div>
  </div>
);
