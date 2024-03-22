"use client";
import { InkeepEmbeddedChatProps } from "@inkeep/widgets";
import dynamic from "next/dynamic";
import { aiChatSettings, baseSettings } from "../../lib/search";

const EmbeddedChat = dynamic(
  () => import("@inkeep/widgets").then((mod) => mod.InkeepEmbeddedChat),
  {
    ssr: false,
    // loading: () => <div>loading...</div>, // optional: loading animation component
  },
);

function InkeepEmbeddedChat() {
  const embeddedChatProps: InkeepEmbeddedChatProps = {
    baseSettings,
    aiChatSettings,
  };

  return <EmbeddedChat {...embeddedChatProps} />;
}

export default InkeepEmbeddedChat;
