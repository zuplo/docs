import Script from "next/script";
import React from "react";
import { LinkItem } from "../../lib/config";
import { Footer } from "../footer";
import Header from "../header";
import { MetaHeaders } from "../meta";
import { SideNavMenu } from "../sidemenu";

type Props = {
  title?: string;
  children: React.ReactNode;
  sideMenu: LinkItem[];
};

const Layout = ({ title, children, sideMenu }: Props) => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-KPV44M3BGG"
      ></Script>
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || []; 
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KPV44M3BGG');`,
        }}
      />
      <script></script>
      <MetaHeaders title={title} />
      <div className="flex min-h-screen">
        <div className="flex flex-col w-full">
          <div className="bg-black">
            <Header menuItems={sideMenu} />
          </div>
          <div className="w-full flex flex-wrap mx-auto max-w-screen-xl md:px-5 min-h-[500px]">
            <SideNavMenu items={sideMenu} />
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
