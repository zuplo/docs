import {
  AirTableIcon,
  Auth0Icon,
  MongoDbIcon,
  SalesforceIcon,
} from "@brandicons/react/logos";
import { DocumentTextIcon, LockClosedIcon } from "@heroicons/react/outline";
import { BeakerIcon, CodeIcon } from "@heroicons/react/solid";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { MdxScopeContext } from "../../lib/context";
import { Ribbon } from "../ribbon";

export function QuickstartPicker() {
  const route = useRouter();
  const { embed } = useContext(MdxScopeContext);
  const basePath = embed ? "/embed" : "/articles";
  const articles = [
    {
      text: "Proxy a public API",
      url: basePath + "/quickstarts/proxy-public-api",
      icon: <BeakerIcon className="h-10 w-10 text-pink" />,
    },
    {
      text: "Hello World API",
      url: basePath + "/quickstarts/hello-world-api",
      icon: <CodeIcon className="h-10 w-10 text-pink" />,
    },
    {
      text: "Gateway over Salesforce",
      url: basePath + "/quickstarts/gateway-over-salesforce",
      icon: <SalesforceIcon className="h-10 w-10" />,
    },
    {
      text: "Gateway over AirTable",
      url: basePath + "/quickstarts/gateway-over-airtable",
      icon: <AirTableIcon className="h-10 w-10" />,
    },
    {
      text: "Auth0 JWT Auth",
      url: basePath + "/quickstarts/auth0-jwt-auth",
      icon: <Auth0Icon className="h-10 w-10" />,
      comingSoon: true,
    },
    {
      text: "API Rate Limiting",
      url: basePath + "/quickstarts/api-rate-limiting",
      icon: <LockClosedIcon className="h-10 w-10 text-pink" />,
      comingSoon: true,
    },
    {
      text: "Gateway over MongoDB",
      url: basePath + "/quickstarts/gateway-over-mongodb",
      icon: <MongoDbIcon className="h-10 w-10" />,
      comingSoon: true,
    },
    {
      text: "Response Rewrite",
      url: basePath + "/quickstarts/quickstarts/response-rewrite",
      icon: <DocumentTextIcon className="h-10 w-10 text-pink" />,
      comingSoon: true,
    },
  ];
  return (
    <div className="place-content-center">
      <div
        className={cn(
          "mx-auto",
          "grid",
          "gap-5",
          "xl:max-w-none",
          "grid-cols-2",
          "md:grid-cols-3",
          "lg:grid-cols-4",
          "place-content-center"
        )}
      >
        {articles.map((article, index) => (
          <Link key={index} href={article.url}>
            <a
              className={cn(
                {
                  "bg-gradient-to-br from-gray-400 to-gray-100":
                    route.asPath === article.url,
                },
                "no-underline",
                "border-solid",
                "border-2",
                "border-gray",
                "rounded-lg",
                "hover:bg-gradient-to-br",
                "hover:from-gray-400",
                "hover:to-gray-200",
                "text-black",
                "font-normal",
                "hover:font-normal"
              )}
            >
              <div
                className="flex flex-col rounded-lg overflow-hidden min-h-full"
                style={{ position: "relative" }}
              >
                {article.comingSoon ? <Ribbon /> : undefined}
                <div className="flex-shrink-0 pt-6 mx-auto pr-auto justify-center ">
                  {article.icon}
                </div>
                <div
                  className={cn(
                    "flex-1",
                    "p-5",
                    "flex",
                    "flex-col",
                    "text-center",
                    "text-sm",
                    "text-black"
                  )}
                >
                  {article.text}
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
