import Link from "@docusaurus/Link";
import React from "react";
import styles from "../pages/docs/index.module.css";

type CtaButtonProps = {
  url: string;
  text: string;
};

export default function CtaButton(props: CtaButtonProps) {
  return (
    <div className={styles.buttons}>
      <Link className="button button--primary button--lg" to={props.url}>
        {props.text}
      </Link>
    </div>
  );
}
