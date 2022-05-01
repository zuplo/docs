import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className={styles.heroIntro}>
          Check out our{" "}
          <Link to="/docs/quickstarts/proxy-public-api">quick starts</Link>,
          browse <Link to="/docs/examples">examples</Link>, or learn{" "}
          <Link to="/docs/overview">how Zuplo can help</Link> you share your
          API. Connect with the team on{" "}
          <Link to="https://discord.gg/W36Ddfcd" target="_blank">
            Discord
          </Link>
          .
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/quickstarts/proxy-public-api"
          >
            Get Started &nbsp;&nbsp;→
          </Link>
          <Link
            className="button button--secondary button--lg margin-left--md"
            to="/docs/examples"
          >
            Examples
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`Zuplo Docs`}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
