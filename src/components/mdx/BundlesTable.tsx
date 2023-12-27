import React from "react";
import Link from "next/link";
import data from "../../../bundles.json";

const BundlesTable: React.FC<{ url: string }> = ({ url }) => {
  return (
    <table>
      <thead>
        <tr>
          <td>Module</td>
          <td>Version</td>
          <td>Description</td>
        </tr>
      </thead>
      <tbody>
        {data.bundles.map((bundle) => (
          <tr key={bundle.name}>
            <td>
              <Link
                href={
                  bundle.url ?? `https://www.npmjs.com/package/${bundle.name}`
                }
                rel="noopener noreferrer"
                target="_blank"
              >
                {bundle.name}
              </Link>
            </td>
            <td>{bundle.version}</td>
            <td>{bundle.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BundlesTable;
