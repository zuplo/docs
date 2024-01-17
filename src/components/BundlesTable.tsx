interface BundlesFile {
  bundles: {
    name: string;
    url?: string;
    version: string;
    types: string;
    files: string[];
    description: string;
    public: boolean;
  }[];
}
export default async function BundlesTable() {
  const response = await fetch(
    "https://cdn.zuplo.com/types/@zuplo/bundled/bundles.v2.json",
    {
      next: {
        revalidate: 3600,
      },
    },
  );
  const data: BundlesFile = await response.json();
  return (
    <table>
      <tr>
        <td width={200}>Module</td>
        <td width={100}>Version</td>
        <td>Description</td>
      </tr>
      {data.bundles
        .filter((bundle) => bundle.public)
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
}
