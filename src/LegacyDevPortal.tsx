import { Callout } from "zudoku/components";

export function LegacyDevPortal() {
  return (
    <Callout type="danger" title={"Legacy Feature"}>
      <p>
        This version of the developer portal is no longer availible to new
        projects and will be sunset on November 15, 2025. If you are looking for
        the new developer portal, please refer to the{" "}
        <a href="/docs/dev-portal/introduction">docs</a>.
      </p>
      <p style={{ marginTop: "1rem" }}>
        If you are using the legacy developer portal, please{" "}
        <a href="/docs/dev-portal/migration">
          migrate to the new Zudoku powered portal experience
        </a>{" "}
        before November 15, 2025.
      </p>
    </Callout>
  );
}
