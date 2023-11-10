import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {
    InkeepAIChatSettings,
    InkeepSearchSettings,
    InkeepWidgetBaseSettings,
    InkeepModalSettings
} from "@inkeep/widgets";

type InkeepIdentifierSettings = {
    apiKey: string;
    integrationId: string;
    organizationId: string;
};

type InkeepSharedSettings = {
    baseSettings: InkeepWidgetBaseSettings;
    aiChatSettings: InkeepAIChatSettings;
    searchSettings: InkeepSearchSettings;
    modalSettings: InkeepModalSettings;
};

const useInkeepSettings = (): InkeepSharedSettings => {
    const { siteConfig } = useDocusaurusContext();
    const inkeepBaseConfig = siteConfig.customFields.inkeepCredentials as InkeepIdentifierSettings;

    const baseSettings: InkeepWidgetBaseSettings = {
        apiKey: inkeepBaseConfig.apiKey || "",
        integrationId: inkeepBaseConfig.integrationId || "",
        organizationId: inkeepBaseConfig.organizationId || "",
        organizationDisplayName: "Zuplo",
        primaryBrandColor: "#FF00BD",
        theme: {
            primaryColors: {
                textColorOnPrimary: "#000000",
            },
        }
    }

    const aiChatSettings: InkeepAIChatSettings = {
        botAvatarSrcUrl: '/img/bot_avatar.svg',
        quickQuestions: [
            'How do I set up a basic gateway?',
            'How do I add API key based authentication?',
            'How do I set up a custom CI/CD pipeline?',
        ],
        getHelpCallToActions: [
            {
                icon: { builtIn: 'FaDiscord' },
                name: 'Discord',
                url: 'https://discord.com/invite/JCtKy9p77n',
            },
        ],
    };

    const searchSettings: InkeepSearchSettings = {
        // optional
    };

    const modalSettings: InkeepModalSettings = {
        defaultView: 'AI_CHAT',
        isModeSwitchingEnabled: false, // toggle to true to enable search
        areOpenHotKeysDisabled: true
    }

    return { baseSettings, aiChatSettings, searchSettings, modalSettings };
};

export default useInkeepSettings;