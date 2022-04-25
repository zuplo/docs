import {
  DocumentTextIcon,
  LockClosedIcon,
  FastForwardIcon,
} from "@heroicons/react/outline";
import { BeakerIcon } from "@heroicons/react/solid";
import React from "react";
import styles from "./QuickstartPicker.module.css";

import { useLocation } from "@docusaurus/router";

export default function QuickstartPicker({ slug }: { slug: string }) {
  const articles = [
    {
      text: "Proxy a Public API",
      slug: "quickstarts/proxy-public-api",
      icon: <BeakerIcon className={styles["quickstarts-item-icon"]} />,
    },
    {
      text: "Use API Key Authentication",
      slug: "quickstarts/use-api-key-authentication",
      icon: <LockClosedIcon className={styles["quickstarts-item-icon"]} />,
    },
    {
      text: "Publish your Developer Portal",
      slug: "quickstarts/publish-developer-portal",
      icon: <DocumentTextIcon className={styles["quickstarts-item-icon"]} />,
    },
    {
      text: "Per Customer Rate Limiting",
      slug: "quickstarts/per-customer-rate-limits",
      icon: <FastForwardIcon className={styles["quickstarts-item-icon"]} />,
    },
  ];

  const location = useLocation();
  const isEmbed = location.pathname.startsWith("/embed/");
  const currentSlug = location.pathname
    .replace("/embed/", "")
    .replace("/docs/", "");
  return (
    <div className={styles["quickstarts"]}>
      {articles.map((article, index) => (
        <a
          key={index}
          href={isEmbed ? `/embed/${article.slug}` : `/docs/${article.slug}`}
        >
          <div
            className={`${styles["quickstarts-item"]} ${
              currentSlug === article.slug
                ? styles["quickstarts-item-active"]
                : undefined
            }`}
          >
            <div className={styles["quickstarts-item-head"]}>
              {article.icon}
            </div>
            <div className={styles["quickstarts-item-title"]}>
              {article.text}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
