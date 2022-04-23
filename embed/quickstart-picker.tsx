import {
  AirTableIcon,
  Auth0Icon,
  MongoDbIcon,
  SalesforceIcon,
} from "@brandicons/react/logos";
import { DocumentTextIcon, LockClosedIcon } from "@heroicons/react/outline";
import { BeakerIcon, CodeIcon } from "@heroicons/react/solid";
import React from "react";

export default function QuickstartPicker({ slug }: { slug: string }) {
  const articles = [
    {
      text: "Proxy a public API",
      url: "/embed/proxy-public-api",
      icon: <BeakerIcon className="h-10 w-10 text-pink" />,
    },
    {
      text: "Hello World API",
      url: "/embed/hello-world-api",
      icon: <CodeIcon className="h-10 w-10 text-pink" />,
    },
    {
      text: "Gateway over Salesforce",
      url: "/embed/gateway-over-salesforce",
      icon: <SalesforceIcon className="h-10 w-10" />,
    },
    {
      text: "Gateway over AirTable",
      url: "/embed/gateway-over-airtable",
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
    <div className="quickstarts-wrapper">
      <div className="quickstarts">
        {articles.map((article, index) => (
          <a key={index} href={article.url}>
            <div className="quickstart-item">
              <div className="quickstarts-item-head">{article.icon}</div>
              <div className="quickstarts-item-title">{article.text}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
