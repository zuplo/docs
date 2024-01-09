import Link from "@docusaurus/Link";
import Admonition from "@theme/Admonition";
import React from "react";

export default function ZupIt({ repoUrl }: { repoUrl: string }) {
  return (
    <div>
      <Admonition type="note">
        <p>
          This sample is available on on <Link href={repoUrl}>GitHub</Link> or
          click the button below to open the code directly in the portal.{" "}
        </p>
        <Link href={`http://portal.zuplo.com/clone?sourceRepoUrl=${repoUrl}`}>
          <img
            loading="lazy"
            src="https://cdn.zuplo.com/www/zupit.svg"
            alt="ZupIt"
          ></img>
        </Link>
      </Admonition>
    </div>
  );
}
