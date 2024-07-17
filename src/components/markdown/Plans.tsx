import Callout from "./Callout";

export function EnterpriseFeature({ name }: { name?: string }) {
  return (
    <Callout type="caution" title={"Enterprise Feature"}>
      <p>
        {name ?? "This feature"} is available as an add-on as part of an
        enterprise plan. If you would like to test or purchase this feature,
        please contact us at{" "}
        <a href="mailto:sales@zuplo.com">sales@zuplo.com</a> or reach out to
        your account manager.
      </p>
    </Callout>
  );
}
