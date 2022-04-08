import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Overview",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: (
      <>
        Learn about how Zuplo can help you secure, manage, and share your API.{" "}
        <a href="/docs/overview">Read the overview</a>.
      </>
    ),
  },
  {
    title: "A Policy for Everything",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: (
      <>
        Zuplo has policies a policy for everything. Authenticate with API Tokens
        or JWT, rewrite outgoing request, observe and log usage.{" "}
        <a href="/docs/policies">See Zuplo Policies</a>.
      </>
    ),
  },
  {
    title: "Configure or Code",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>
        Configure even complex API management scenarios with just a few click,
        but escape to code when you need full control.{" "}
        <a href="/docs/examples">See code examples</a>.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
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
