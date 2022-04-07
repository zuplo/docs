import {
  AirTableIcon,
  Auth0Icon,
  MongoDbIcon,
  SalesforceIcon,
} from "@brandicons/react/logos";
import { DocumentTextIcon, LockClosedIcon } from "@heroicons/react/outline";
import { BeakerIcon, CodeIcon } from "@heroicons/react/solid";
import cn from "classnames";
import { Ribbon } from "./ribbon";
import React from "react";

export default function QuickstartPicker() {
  const articles = [
    {
      text: "Proxy a public API",
      url: "/embed/quickstarts/proxy-public-api",
      icon: <BeakerIcon className="h-10 w-10 text-pink" />,
    },
    {
      text: "Hello World API",
      url: "/embed/quickstarts/hello-world-api",
      icon: <CodeIcon className="h-10 w-10 text-pink" />,
    },
    {
      text: "Gateway over Salesforce",
      url: "/embed/quickstarts/gateway-over-salesforce",
      icon: <SalesforceIcon className="h-10 w-10" />,
    },
    {
      text: "Gateway over AirTable",
      url: "/embed/quickstarts/gateway-over-airtable",
      icon: <AirTableIcon className="h-10 w-10" />,
    },
    {
      text: "Auth0 JWT Auth",
      url: "/embed/quickstarts/auth0-jwt-auth",
      icon: <Auth0Icon className="h-10 w-10" />,
      comingSoon: true,
    },
    {
      text: "API Rate Limiting",
      url: "/embed/quickstarts/api-rate-limiting",
      icon: <LockClosedIcon className="h-10 w-10 text-pink" />,
      comingSoon: true,
    },
    {
      text: "Gateway over MongoDB",
      url: "/embed/quickstarts/gateway-over-mongodb",
      icon: <MongoDbIcon className="h-10 w-10" />,
      comingSoon: true,
    },
    {
      text: "Response Rewrite",
      url: "/embed/quickstarts/response-rewrite",
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
          <a
            href={article.url}
            className={cn(
              // {
              //   "bg-gradient-to-br from-gray-400 to-gray-100":
              //     route.asPath === article.url,
              // },
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
        ))}
      </div>
    </div>
  );
}
