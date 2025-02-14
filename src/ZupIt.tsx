import { Callout } from "zudoku/components";

export default function ZupIt({ repoUrl }: { repoUrl: string }) {
  return (
    <Callout type="note" title="Create Project">
      <p>
        This sample is available on{" "}
        <a href={repoUrl} target="_blank">
          GitHub
        </a>{" "}
        or click the button below to open the code directly in the portal.{" "}
      </p>
      <a
        href={`https://portal.zuplo.com/clone?sourceRepoUrl=${repoUrl}`}
        target="_blank"
      >
        <img src="https://cdn.zuplo.com/www/zupit.svg" alt="ZupIt" />
      </a>
    </Callout>
  );
}
