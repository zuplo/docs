import data from "./bundles.json";

const BundlesTable = () => {
  return (
    <table>
      <tr>
        <td width={200}>Module</td>
        <td width={100}>Version</td>
        <td>Description</td>
      </tr>
      {data.bundles.map((bundle, i) => (
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

export default BundlesTable;
