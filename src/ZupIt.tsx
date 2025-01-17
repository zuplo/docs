import { Callout, Link } from "zudoku/components";

export default function ZupIt({ repoUrl }: { repoUrl: string }) {
  return (
    <Callout type="note" title="Create Project">
      <p>
        This sample is available on on <Link href={repoUrl}>GitHub</Link> or
        click the button below to open the code directly in the portal.{" "}
      </p>
      <Link href={`http://portal.zuplo.com/clone?sourceRepoUrl=${repoUrl}`}>
        <img src="https://cdn.zuplo.com/www/zupit.svg" alt="ZupIt"></img>
      </Link>
    </Callout>
  );
}
