import { Callout } from "zudoku/components";

export function LegacyMonetization() {
  return (
    <Callout type="danger" title={"Legacy Feature"}>
      <p>
        The monetization feature is no longer available for new projects and
        will be sunset on November 15, 2025. Please see our{" "}
        <a href="/docs/articles/monetization">Monetization documentation</a> for
        the new, more flexible solution and integration with OpenMeter.
      </p>
      <p style={{ marginTop: "1rem" }}>
        If you have questions, please reach out to us at{" "}
        <a href="mailto:support@zuplo.com">support@zuplo.com</a>.
      </p>
    </Callout>
  );
}
