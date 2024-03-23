import {
  InkeepAIChatSettings,
  InkeepModalSettings,
  InkeepSearchSettings,
  InkeepWidgetBaseSettings,
} from "@inkeep/widgets";

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
          variant: "subtle", // Choose from 'emphasized' or 'subtle'
        },
      },
    },
  },
};

const modalSettings: InkeepModalSettings = {
  // optional settings
};

const searchSettings: InkeepSearchSettings = {
  // optional settings
};

const aiChatSettings: InkeepAIChatSettings = {
  shareChatUrlBasePath: `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://zuplo.com"}/docs/ask`,
  isChatSharingEnabled: true,
  quickQuestions: [
    "How do I create a custom policy?",
    "What is the difference between production and preview environments?",
    "How do I set a custom domain?",
    "How do I use environment variables?",
  ],
};

export { aiChatSettings, baseSettings, modalSettings, searchSettings };
