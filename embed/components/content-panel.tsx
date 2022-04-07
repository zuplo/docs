import Link from "next/link";

export const ContentPanel = ({
  url,
  image,
  title,
  text,
}: {
  url: string;
  title: string;
  image?: JSX.Element;
  text: string;
}) => (
  <Link href={url}>
    <a className="no-underline text-black hover:text-black">
      <div className="flex flex-col  overflow-hidden min-h-full">
        <div className="border-solid border-2 border-gray flex-shrink-0 justify-center rounded-lg min-h-[100px] flex  items-center">
          <div className="">{image}</div>
        </div>
        <div className="flex-1 flex flex-col">
          <h3 className={`text-left text-black font-medium pt-3 pb-2`}>
            {title}
          </h3>
          <p>{text}</p>
        </div>
      </div>
    </a>
  </Link>
);
