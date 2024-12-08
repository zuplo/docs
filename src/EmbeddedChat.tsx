import {
  type InkeepAIChatSettings,
  InkeepEmbeddedChat,
  type InkeepWidgetBaseSettings,
} from "@inkeep/widgets";
import React from "react";

const baseSettings: InkeepWidgetBaseSettings = {
  apiKey: "499c156cf7a9798343949c8bb5665ac95e48132c6d68c42e",
  integrationId: "clot3asdz0000s601nc8jwnzx",
  organizationId: "org_dDOlt2uJlMWM8oIS",
  primaryBrandColor: "#ff00bd",
  organizationDisplayName: "Zuplo",
  theme: {
    components: {
      AIChatPageWrapper: {
        defaultProps: {
          size: "shrink-vertically",
          variant: "no-shadow",
        },
      },
      SearchBarTrigger: {
        defaultProps: {
          size: "expand",
          variant: "subtle",
        },
      },
    },
  },
};

const aiChatSettings: InkeepAIChatSettings = {
  shareChatUrlBasePath: `${process.env.NODE_ENV === "development" ? "http://localhost:9000" : "https://zuplo.com"}/docs/ask`,
  isChatSharingEnabled: true,
  quickQuestions: [
    "How do I create a custom policy?",
    "What is the difference between production and preview environments?",
    "How do I set a custom domain?",
    "How do I use environment variables?",
  ],
};

const EmbeddedChat = () => {
  return (
    <div>
      <InkeepEmbeddedChat
        stylesheetUrls={["/docs/styles/inkeep.css"]}
        baseSettings={{
          ...baseSettings,
          colorMode: {
            ...baseSettings.colorMode,
            forcedColorMode: "dark",
          },
        }}
        aiChatSettings={aiChatSettings}
      />
    </div>
  );
};

export default EmbeddedChat;
