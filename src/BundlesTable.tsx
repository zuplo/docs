import { useEffect, useState } from "react";
import { nodeModuleIssues } from "./bundles.issues";

type BundlesFile = {
  bundles: {
    name: string;
    url?: string;
    version: string;
    types: string;
    files: string[];
    description: string;
    isPublic: boolean;
    status?: StatusType;
    notes?: string;
  }[];
};

type StatusType = "Unknown" | "Has Issues";

export const BundlesTable = () => {
  const [data, setData] = useState<BundlesFile | null>(null);

  useEffect(() => {
    const response = fetch(
      "https://cdn.zuplo.com/types/@zuplo/bundled/bundles.v2.json",
    );
    response.then((res) => res.json()).then(setData);
  }, []);

  return (
    <table className="w-full border-collapse text-sm">
      <tr className="bg-gray-50 border-b">
        <th className="px-3 py-2 text-left font-medium text-gray-600">
          Module
        </th>
        <th className="px-3 py-2 text-left font-medium text-gray-600">
          Version
        </th>
        <th className="px-3 py-2 text-left font-medium text-gray-600">
          Status
        </th>{" "}
        <th className="px-3 py-2 text-left font-medium text-gray-600">Notes</th>
      </tr>
      {data?.bundles
        .filter((bundle) => bundle.isPublic)
        .map((bundle, i) => {
          const notes = nodeModuleIssues.find(
            (issue) => issue.name === bundle.name,
          )?.notes;

          return (
            <tr className="border-b hover:bg-gray-50" key={i}>
              <td className="px-3 py-2 align-top">
                <a
                  className="text-blue-600 hover:underline font-medium"
                  href={
                    bundle.url ?? `https://www.npmjs.com/package/${bundle.name}`
                  }
                >
                  {bundle.name}
                </a>
              </td>
              <td className="px-3 py-2 align-top">
                {notes ? (
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Issues
                  </span>
                ) : (
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Unknown
                  </span>
                )}
              </td>
              <td className="px-3 py-2 align-top font-mono text-xs">
                {bundle.version}
              </td>

              <td className="px-3 py-2 align-top text-gray-700 text-xs">
                {notes}
              </td>
            </tr>
          );
        })}
    </table>
  );
};
