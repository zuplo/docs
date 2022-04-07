export const SideContentsMenu = ({ toc }: { toc: Record<string, string> }) => {
  const entries = Object.entries(toc);
  return (
    <div className="w-full bg-white rounded-r-lg md:w-1/5 md:px-6 text-2xl pl-4 text-gray-600 leading-normal hidden md:block">
      {entries.length > 0 && (
        <p className="font-fancy font-medium text-sm py-3.5 pt-9 text-gray-600 uppercase tracking-widest">
          Content
        </p>
      )}
      {/* TODO: Do we need this button? Whole container is hidden < md */}
      <div className="block md:hidden sticky inset-0">
        <button
          id="content-toggle"
          className="
              flex
              w-full
              justify-end
              px-3
              py-3
              bg-white
              md:bg-transparent
              border
              rounded
              border-gray-600
              hover:border-purple-500
              appearance-none
              focus:outline-none
            "
        >
          <svg
            className="fill-current h-3 float-right"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </button>
      </div>
      <div
        className="
            w-full
            sticky
            inset-0
            hidden
            h-64
            md:h-auto
            overflow-x-hidden overflow-y-auto
            md:overflow-y-hidden md:block
            mt-0
            border border-gray-400
            md:border-transparent
            bg-white
            shadow
            md:shadow-none md:bg-transparent
            z-20
            "
        style={{ top: "1em" }}
      >
        <ul className="list-reset">
          {entries.map(([id, title], index) => (
            <li
              key={index}
              className="md:my-0 hover:bg-purple-100 md:hover:bg-transparent pt-2"
            >
              <a
                href={`#${id}`}
                className="block align-middle text-black no-underline hover:text-gray-600  leading-5"
              >
                <span className="font-regular pb-1 md:pb-0 text-sm tracking-wide">
                  {title.length === 1 ? `Step: ${title}` : title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
