import Callout from "@/components/markdown/Callout";
import Link from "next/link";

export default function CustomPolicyNotice({
  name,
  id,
}: {
  name: string;
  id: string;
}) {
  const href = id.endsWith("-inbound")
    ? "/policies/custom-code-inbound"
    : "/policies/custom-code-outbound";
  return (
    <div>
      <Callout type="tip" title="Custom Policy Example">
        <p>
          Zuplo is extensible, so we don&apos;t have a built-in policy for{" "}
          {name}, instead we have a template here that shows you how you can use
          your superpower (code) to achieve your goals. To learn more about
          custom policies{" "}
          <Link href={href} target="_blank">
            see the documentation
          </Link>
          .
        </p>
      </Callout>
    </div>
  );
}
