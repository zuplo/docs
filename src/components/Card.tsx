import Link from "next/link";

interface Props {
  name: string;
  href: string;
  icon: string;
  testID?: string;
}

export const Card: React.FC<Props> = ({ name, href, icon, testID }) => {
  return (
    <Link
      href={href}
      className="bg-transpatent group flex items-center gap-4 rounded-lg border border-gray-500 p-4 transition-colors hover:bg-gray-500/50 text-black dark:text-white md:h-36 md:flex-col md:justify-center md:px-5 md:py-6 md:text-center no-underline"
      data-testid={testID}
    >
      <div className="rounded-lg bg-pink/10 p-2">
        <div
          className="mask-icon h-6 w-6 shrink-0 bg-pink md:h-8 md:w-8"
          style={{
            maskImage: `url(${icon})`,
            WebkitMaskImage: `url(${icon})`,
          }}
        ></div>
      </div>
      <h6 className=" text-sm font-bold transition-colors group-hover:text-pink">
        {name}
      </h6>
    </Link>
  );
};
