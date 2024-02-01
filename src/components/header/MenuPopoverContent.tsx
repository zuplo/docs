import { LinksCategory } from "@/lib/interfaces";
import Link from "next/link";

interface Props {
  links: Array<Array<LinksCategory>>;
  onItemClick?: () => void;
}

export function MenuPopoverContent({ links, onItemClick }: Props) {
  return (
    <div className="flex flex-col gap-x-3.5 gap-y-7 rounded-xl bg-white p-5 pt-7 font-fancy text-base font-bold leading-tight shadow-lg xl:flex-row">
      {links.map((linksCategories, index) => (
        <div key={index} className="flex flex-1 flex-col gap-7">
          {linksCategories.map((linksCategory) => (
            <div key={linksCategory.name}>
              <div className="mb-3.5 text-sm uppercase tracking-widest text-gray-600 lg:px-5">
                {linksCategory.name}
              </div>
              <div className="flex flex-col gap-5 lg:gap-0">
                {linksCategory.links.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-black hover:text-pink lg:rounded-xl lg:px-5 lg:py-4 lg:hover:bg-gray-500/10 lg:hover:text-black"
                    onClick={() => onItemClick?.()}
                  >
                    {item.name}
                    <div className="font-normal text-gray-600 lg:mt-1">
                      {item.shortDescription}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
