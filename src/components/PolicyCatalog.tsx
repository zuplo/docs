import { useLocation } from "@docusaurus/router";
import React from "react";
import styles from "./PolicyCatalog.module.css";

export default function PolicyCatalog({
  policies,
}: {
  policies: { id: string; name: string; icon: string }[];
}) {
  const location = useLocation();

  return (
    <div className={styles["policy-list"]}>
      {policies
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((policy, index) => (
          <a key={policy.id} href={`/docs/policies/${policy.id}`}>
            <div
              className={`${styles["policy-item"]} ${
                location.pathname === `/docs/policies/${policy.id}`
                  ? styles["policy-item-active"]
                  : undefined
              }`}
            >
              <div className={styles["policy-item-head"]}>
                <img src={policy.icon} width={48} height={48} />
              </div>
              <div className={styles["policy-item-title"]}>{policy.name}</div>
            </div>
          </a>
        ))}
    </div>
  );
}
