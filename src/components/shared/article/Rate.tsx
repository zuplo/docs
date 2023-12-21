import Link from "next/link";
import LikeIcon from "@/components/svgs/like.svg";
import DislikeIcon from "@/components/svgs/dislike.svg";
import clsx from "classnames";

export default function ArticleRate() {
  const linkClassName = "btn btn-tertiary-dark flex items-center";

  return (
    <div className="flex flex-wrap items-center gap-5 pt-[60px]">
      <h4 className="text-2xl text-white dark:text-black">
        Was this article helpful?
      </h4>
      <div className="flex">
        <Link className={clsx(linkClassName, "mr-2.5")} href={"#"}>
          Yes
          <LikeIcon />
        </Link>
        <Link className={linkClassName} href={"#"}>
          No
          <DislikeIcon />
        </Link>
      </div>
    </div>
  );
}