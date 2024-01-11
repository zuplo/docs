export default async function Page({ params }: { params: { slug: string } }) {
  const policy: any = (await import("@/build/policies.mjs"))[
    params.slug.replaceAll("-", "_")
  ];
  return (
    <div>
      <h1>{policy.schema.title} Policy</h1>
    </div>
  );
}

export async function generateStaticParams() {
  const policies = await import("@/build/policies.mjs");
  return Object.keys(policies).map((key) => ({
    slug: key.replaceAll("_", "-"),
  }));
}
