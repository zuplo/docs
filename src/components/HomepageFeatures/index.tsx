import Link from "@docusaurus/Link";
import { ChipIcon, CloudIcon, CodeIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import React from "react";
import styles from "./styles.module.css";

type Link = {
  label: string;
  href: string;
};

type FeatureItem = {
  title: string;
  Icon: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
  links: Link[];
};

const FeatureList: FeatureItem[] = [
  {
    title: "Overview",
    Icon: CloudIcon,
    description: (
      <>
        Learn about how Zuplo can help you secure, manage, and share your API.
      </>
    ),
    links: [
      { label: "Getting Started", href: "/docs/overview" },
      { label: "What is Zuplo?", href: "/docs/overview/what-is-zuplo" },
      {
        label: "How does Zuplo work?",
        href: "/docs/overview/how-does-zuplo-work",
      },
      { label: "Using Handlers", href: "/docs/overview/handlers" },
      { label: "Using Policies", href: "/docs/overview/policies" },
    ],
  },
  {
    title: "A Policy for Everything",
    Icon: ChipIcon,
    description: (
      <>
        Zuplo has policies a policy for everything from authentication to mock
        responses and more.
      </>
    ),
    links: [
      { label: "Policies", href: "/docs/overview/policies" },
      { label: "Authentication", href: "/docs/policies/api-key-auth-inbound" },
      { label: "Rate Limits", href: "/docs/policies/rate-limit-inbound" },
      {
        label: "Access Control",
        href: "/docs/policies/acl-policy-inbound",
      },
      {
        label: "Validation",
        href: "/docs/policies/validate-json-schema-inbound",
      },
    ],
  },
  {
    title: "Configure or Code",
    Icon: CodeIcon,
    description: (
      <>
        Configure full API management with a few click, but escape to code when
        you need full control.
      </>
    ),
    links: [
      { label: "Proxy an API", href: "/docs/quickstarts/proxy-public-api" },
      {
        label: "Proxy a SaaS Service",
        href: "/docs/examples/gateway-over-airtable",
      },
      { label: "Writing Custom Code", href: "/docs/examples/hello-world-api" },
    ],
  },
];

function Feature({ title, Icon, description, links }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Icon className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
        <ul className={styles.featureList}>
          {links.map((link) => (
            <li>
              <Link to={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
