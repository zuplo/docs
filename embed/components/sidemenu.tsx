import Link from "next/link";
import { useRouter } from "next/router";
import { LinkItem } from "../lib/config";

const SupportIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12.0001"
      cy="12"
      r="9"
      transform="rotate(-90 12.0001 12)"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle
      cx="12.0001"
      cy="12"
      r="5"
      transform="rotate(-90 12.0001 12)"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.0001 11.9999L21.0001 11.9999C21.0001 15.3312 19.1902 18.2398 16.5001 19.7959L16.5001 19.7944L14.5004 16.3308C15.9947 15.4663 17.0001 13.8505 17.0001 11.9999ZM14.5005 7.66909L16.5001 4.20571L16.5017 4.20492C15.1775 3.43857 13.64 2.99994 12.0001 2.99994C10.3603 2.99994 8.82291 3.43848 7.49886 4.20467L7.50006 4.20592L9.49955 7.66914C10.2351 7.24354 11.0891 6.99994 12.0001 6.99994C12.911 6.99994 13.7649 7.24352 14.5005 7.66909ZM7.00006 11.9999L3.00006 11.9999C3.00006 15.331 4.80968 18.2393 7.49944 19.7955L7.50006 19.7942L9.49964 16.3308C8.00537 15.4662 7.00006 13.8505 7.00006 11.9999Z"
      fill="currentColor"
    />
  </svg>
);

interface SideNavMenuProps {
  items: LinkItem[];
}

export const SideNavMenu = ({ items }: SideNavMenuProps) => {
  const { asPath } = useRouter();
  return (
    <div className="hidden flex-col xl:flex rounded-lg w-full bg-white xl:rounded-r-none xl:w-1/5 xl:px-6 text-2xl pl-4 text-gray-600 leading-normal">
      <div
        className="xl:pl-4 w-full sticky inset-0 hidden h-64 xl:h-auto overflow-x-hidden overflow-y-auto xl:overflow-y-hidden xl:block mt-0 border border-gray-400 xl:border-transparent bg-white shadow xl:shadow-none xl:bg-transparent z-20 "
        style={{ top: "1em" }}
      >
        <p className="font-fancy font-medium text-sm py-3.5 pt-9 text-gray-600 uppercase tracking-widest">
          Documents
        </p>
        <ul className="list-reset">
          {items.map((menuItem, i) => {
            const href = `/articles${menuItem.url}`;
            return (
              <li
                key={i}
                className="md:my-0 hover:bg-purple-100 xl:hover:bg-transparent"
              >
                <Link href={href}>
                  <a className="block align-middle text-black no-underline hover:text-gray-600">
                    <span
                      className={`${
                        href === asPath ? "font-bold" : "font-regular"
                      } pb-1 md:pb-0 text-sm tracking-wide`}
                    >
                      {menuItem.title}
                    </span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="font-fancy font-medium text-sm py-3.5 pt-9 text-gray-600 uppercase tracking-widest">
          Reference
        </p>

        <ul className="list-reset">
          <li className="md:my-0 hover:bg-purple-100 xl:hover:bg-transparent">
            <Link href="/reference/runtime">
              <a className="block align-middle text-black no-underline hover:text-gray-600">
                <span
                  className={`${
                    "/reference/runtime" === asPath
                      ? "font-bold"
                      : "font-regular"
                  } pb-1 md:pb-0 text-sm tracking-wide`}
                >
                  @zuplo/runtime
                </span>
              </a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="mt-auto mb-5 flex justify-center">
        <a
          href="https://discord.com/invite/CEZrnZN897"
          target="_blank"
          className="no-underline flex items-center text-black text-sm"
        >
          <SupportIcon />
          <span className="ml-3">Support</span>
        </a>
      </div>
    </div>
  );
};
