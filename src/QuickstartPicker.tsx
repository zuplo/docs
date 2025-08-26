import { CodeIcon, GlobeIcon } from "lucide-react";
import { TutorialModeSelector, TutorialMode } from "./TutorialModeSelector.js";

export function QuickstartPicker({
  alternateLink,
  mode,
}: {
  alternateLink: string;
  mode: "local" | "portal";
}) {
  // This component is used to select
  return (
    <TutorialModeSelector
      title="Choose your Development Approach"
      description="Select how you'd like to build your gateway. You can switch between approaches at any time."
    >
      <TutorialMode
        icon={<CodeIcon />}
        label="Local Development"
        active={mode === "local"}
        description="Develop and test your gateway locally using the Zuplo CLI. Full control over your environment."
        link={mode === "local" ? undefined : alternateLink}
      />
      <TutorialMode
        icon={<GlobeIcon />}
        active={mode === "portal"}
        label="Portal Development"
        description="Build and deploy your gateway using Zuplo's web-based portal. No local setup required."
        link={mode === "portal" ? undefined : alternateLink}
      />
    </TutorialModeSelector>
  );
}
