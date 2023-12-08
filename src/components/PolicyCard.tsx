import Link from "next/link";

interface Props {
  name: string;
  href: string;
  icon: string;
}

export const PolicyCard: React.FC<Props> = ({ name, href, icon }) => {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-lg border border-gray-500 bg-white p-4 text-black transition-colors hover:bg-gray-500/50 md:h-36 md:flex-col md:justify-center md:px-5 md:py-6 md:text-center"
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
      <h6 className="font-fancy text-sm font-bold transition-colors group-hover:text-pink">
        {name}
      </h6>
    </Link>
  );
};
