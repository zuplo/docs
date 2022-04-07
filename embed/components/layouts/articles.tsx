import React from "react";
import { LinkItem } from "../../lib/config";
import { SideContentsMenu } from "../side-contents-menu";
import Layout from "./base";

type Props = {
  title: string;
  children: React.ReactNode;
  sideMenu: LinkItem[];
  toc: Record<string, string>;
};

const ArticleLayout = ({ title, children, sideMenu, toc }: Props) => {
  return (
    <Layout title={title} sideMenu={sideMenu}>
      <div className="content-panel">{children}</div>
      <SideContentsMenu toc={toc} />
    </Layout>
  );
};

export default ArticleLayout;
