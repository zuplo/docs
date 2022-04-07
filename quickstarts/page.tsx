import React from "react";
import QuickstartPicker from "./quickstart-picker";

type Props = {
  content: string;
  slug: string;
};

const EmbedPage = ({ content, slug }: Props) => {
  return (
    <>
      {/* <Head>
        <title>{article.title} | Zuplo Docs</title>
        <link
          rel="canonical"
          href={`https://docs.zuplo.com/${article.slug
            .join("/")
            .replace("/embed/", "/")}`}
        />
      </Head> */}

      <div className="flex flex-col w-full bg-white">
        <div className=" w-full xl:w-4/5 p-8 mt-6 xl:mt-0 text-gray-900 leading-normal">
          {/* <h1 className="font-fancy break-normal text-black font-bold  text-4xl xl:text-5xl">
            {article.title}
          </h1> */}
          <QuickstartPicker slug={slug} />
          <div
            className="markdown pt-6 pb-2 prose min-h-fit"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </>
  );
};

export default EmbedPage;

type Params = {
  params: {
    slug: string[];
  };
};
