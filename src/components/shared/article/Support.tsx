import Link from "next/link";
import ContactIcon from "@/components/svgs/contact.svg";
import ChangelogIcon from "@/components/svgs/changelog.svg";

export default function ArticleSupport() {
  const linkClassName =
    "font-bold tracking-wider text-pink transition-colors hover:text-pink-hover";

  return (
    <div className="py-[60px]">
      <div className="flex flex-col justify-center gap-y-2.5 rounded-lg px-5 py-3.5 text-sm leading-6 ring-1 ring-gray-500">
        <div className="flex flex-wrap gap-x-2.5">
          <ContactIcon />
          <span>Do you have any questions?</span>
          <a className={linkClassName} href="mailto:support@zuplo.com">
            Contact us
          </a>
        </div>
        <div className="flex flex-wrap gap-x-2.5">
          <ChangelogIcon />
          <span>Check out our</span>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://zuplo.com/changelog"
            className={linkClassName}
          >
            product changelog
          </Link>
        </div>
      </div>
    </div>
  );
}
