import { docsRepoBaseEditLink } from "@/lib/links";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  filepath: string;
};

export function DocsFooter({ filepath }: Props) {
  return (
    <footer className="mt-12">
      <div>
        <Link
          href={`${docsRepoBaseEditLink.href}/${filepath}`}
          className="text-pink hover:text-pink-hover flex items-center gap-1"
          target="_blank"
        >
          <PencilIcon width={20} height={20} />
          Edit this page
        </Link>
      </div>
    </footer>
  );
}
