import { Callout } from "zudoku/components";

export function LegacyDevPortal() {
  return (
    <Callout type="danger" title={"Legacy Feature"}>
      <p>
        This version of the developer portal is no longer availible to new
        projects. If you are looking for the new developer portal, please refer
        to the <a href="/docs/dev-portal/introduction">docs</a>.
      </p>
    </Callout>
  );
}
