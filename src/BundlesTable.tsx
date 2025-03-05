import { useEffect, useState } from "react";

type BundlesFile = {
  bundles: {
    name: string;
    url?: string;
    version: string;
    types: string;
    files: string[];
    description: string;
    isPublic: boolean;
  }[];
};

export const BundlesTable = () => {
  const [data, setData] = useState<BundlesFile | null>(null);

  useEffect(() => {
    const response = fetch(
      "https://cdn.zuplo.com/types/@zuplo/bundled/bundles.v2.json",
    );
    response.then((res) => res.json()).then(setData);
  }, []);

  return (
    <table>
      <tr>
        <td width={200}>Module</td>
        <td width={100}>Version</td>
        <td>Description</td>
      </tr>
      {data?.bundles
        .filter((bundle) => bundle.isPublic)
        .map((bundle, i) => (
          <tr key={i}>
            <td>
              <a
                href={
                  bundle.url ?? `https://www.npmjs.com/package/${bundle.name}`
                }
              >
                {bundle.name}
              </a>
            </td>
            <td>{bundle.version}</td>
            <td>{bundle.description}</td>
          </tr>
        ))}
    </table>
  );
};
