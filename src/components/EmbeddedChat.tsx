import React, { useEffect, useRef } from "react";

type _react = typeof React;

const baseSettings = {
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

const aiChatSettings = {
  shareChatUrlBasePath: `${process.env.NODE_ENV === "development" ? "http://localhost:9000" : "https://zuplo.com"}/docs/ask`,
  isChatSharingEnabled: true,
  quickQuestions: [
    "How do I create a custom policy?",
    "What is the difference between production and preview environments?",
    "How do I set a custom domain?",
    "How do I use environment variables?",
  ],
};

interface InkeepWidget {
  render: (config: any & { isOpen: boolean }) => void;
}

declare global {
  let Inkeep: () => {
    embed: (config: any) => InkeepWidget;
  };
}

const EmbeddedChat = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Inkeep().embed({
      componentType: "EmbeddedChat",
      targetElement: ref.current!,
      properties: {
        stylesheetUrls: ["/docs/styles/inkeep.css"],
        baseSettings: {
          ...baseSettings,
          colorMode: {
            // ...baseSettings.colorMode,
            forcedColorMode: "dark",
          },
        },
        aiChatSettings,
      },
    });
  }, [ref]);

  return <div ref={ref} />;
};

export default EmbeddedChat;
