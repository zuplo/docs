import { Callout } from "zudoku/components";

export function EnterpriseFeature({ name }: { name?: string }) {
  return (
    <Callout type="info" title={"Enterprise Feature"}>
      <p>
        {name ?? "This feature"} is available as an add-on as part of an
        enterprise plan. If you would like to purchase this feature, please
        contact us at <a href="mailto:sales@zuplo.com">sales@zuplo.com</a> or
        reach out to your account manager.
      </p>
      <p>
        Most enterprise features can be used in a trial mode for a limited time.
        Feel free to use enterprise features for development and testing
        purposes.
      </p>
    </Callout>
  );
}
