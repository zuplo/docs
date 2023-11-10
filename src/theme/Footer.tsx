import React, { useEffect, useState, useRef } from "react";
import { useColorMode } from "@docusaurus/theme-common";
import useInkeepSettings from "src/utils/useInkeepSettings";

export default function Footer() {
    const { colorMode } = useColorMode();
    const chatButtonRef = useRef(null);
    const { baseSettings, aiChatSettings, searchSettings, modalSettings } = useInkeepSettings();
    const chatButtonProps = {
        chatButonType: 'ICON_TEXT',
        baseSettings,
        aiChatSettings,
        searchSettings,
        modalSettings
    };
    const [inkeepEmbed, setInkeepEmbed] = useState(null);

    useEffect(() => {
        (async () => {
            const embed = await import('@inkeep/widgets-embed/dist/embed');
            setInkeepEmbed(() => embed);
        })();
    }, []);

    useEffect(() => {
        if (inkeepEmbed) {
            const inkeep = inkeepEmbed.Inkeep(baseSettings);
            chatButtonRef.current = inkeep.embed({
                componentType: "ChatButton",
                targetElement: document.getElementById("chat-button"),
                properties: {
                    ...chatButtonProps,
                    baseSettings: {
                        ...baseSettings,
                        theme: {
                            ...(baseSettings.theme || {}),
                            colorMode: {
                                forcedColorMode: colorMode === "dark" ? "dark" : "light",
                            }
                        }
                    }
                },
            });
        }
    }, [inkeepEmbed]);

    useEffect(() => {
        if (chatButtonRef && chatButtonRef.current) {
            chatButtonRef.current.render({
                baseSettings: {
                    theme: {
                        ...(baseSettings.theme || {}),
                        colorMode: {
                            forcedColorMode: colorMode === "dark" ? "dark" : "light",
                        }
                    }
                }
            });
        }
    }, [colorMode]);

    return (
        <div id="chat-button"></div>
    );
}