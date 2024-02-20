import Callout from "@/components/markdown/Callout";

export default function PolicyStatus({
  isBeta,
  isPaidAddOn,
}: {
  isBeta: boolean;
  isPaidAddOn: boolean;
}) {
  if (isPaidAddOn) {
    return (
      <div>
        <Callout type="info" title="Paid Add On">
          <p>
            This policy is only available as a paid add-on. If you would like to
            try this please reach out to us:{" "}
            <a href="mailto:sales@zuplo.com">sales@zuplo.com</a>
          </p>
        </Callout>
      </div>
    );
  }
  if (isBeta) {
    return (
      <div>
        <Callout type="caution" title="Beta">
          <p>
            This policy is in beta. You can use it today, but it may change in
            non-backward compatible ways before the final release.
          </p>
        </Callout>
      </div>
    );
  }
  return null;
}
