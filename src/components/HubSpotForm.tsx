import useIsBrowser from "@docusaurus/useIsBrowser";
import React, { useEffect } from "react";

type HubSpotFormProps = {
  region: string;
  portalId: string;
  formId: string;
};

export default function HubSpotForm({
  region,
  portalId,
  formId,
}: HubSpotFormProps) {
  const isBrowser = useIsBrowser();
  useEffect(() => {
    if (isBrowser) {
      const script = document.createElement(`script`);
      script.defer = true;
      script.onload = () => {
        // @ts-ignore
        hbspt?.forms.create({
          target: document.getElementById("hubspot-form"),
          region,
          portalId,
          formId,
        });
      };
      script.src = `https://js.hsforms.net/forms/v2.js`;
      document.head.appendChild(script);
    }
  }, [isBrowser]);
  return <div id="hubspot-form" />;
}
