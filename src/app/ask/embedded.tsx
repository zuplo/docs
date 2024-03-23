"use client";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

import { aiChatSettings, baseSettings } from "../../lib/search";

const EmbeddedChat = dynamic(
  () => import("@inkeep/widgets").then((mod) => mod.InkeepEmbeddedChat),
  {
    ssr: false,
    // loading: () => <div>loading...</div>, // optional: loading animation component
  },
);

function InkeepEmbeddedChat() {
  const { resolvedTheme } = useTheme();

  return (
    <EmbeddedChat
      stylesheetUrls={["/docs/styles/inkeep.css"]}
      baseSettings={{
        ...baseSettings,
        colorMode: {
          forcedColorMode: resolvedTheme,
        },
      }}
      aiChatSettings={aiChatSettings}
    />
  );
}

export default InkeepEmbeddedChat;
