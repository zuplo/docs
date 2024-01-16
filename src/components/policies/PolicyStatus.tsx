import Callout from "@/components/markdown/Callout";

export default function PolicyStatus({
  isPreview,
  isPaidAddOn,
}: {
  isPreview: boolean;
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
  if (isPreview) {
    return (
      <div>
        <Callout type="caution" title="Early Access">
          <p>
            This policy is in private beta. If you would like to use this please
            reach out to us:{" "}
            <a href="mailto:whatzup@zuplo.com">whatzup@zuplo.com</a>
          </p>
        </Callout>
      </div>
    );
  }
  return null;
}
