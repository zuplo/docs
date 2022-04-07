import Head from "next/head";

export const MetaHeaders = ({ title }: { title?: string }) => {
  const realTitle = title ? `${title} | Zuplo Docs` : "Zuplo Docs";
  return (
    <Head>
      <title>{realTitle}</title>
      <meta
        content="The API Gateway Designed for Developers."
        name="description"
      />
      <meta content={realTitle} property="og:title" />
      <meta
        content="The API Gateway Designed for Developers."
        property="og:description"
      />
      <meta
        content="https://cdn.zuplo.com/www/images/zuplo_opg.png"
        property="og:image"
      />
      <meta content={realTitle} property="twitter:title" />
      <meta
        content="The API Gateway Designed for Developers."
        property="twitter:description"
      />
      <meta
        content="https://cdn.zuplo.com/www/images/zuplo_opg.png"
        property="twitter:image"
      />
      <meta property="og:type" content="website" />
      <meta content="summary_large_image" name="twitter:card" />
    </Head>
  );
};
