import MDXComponents from "@theme-original/MDXComponents";
import FeaturePremiere from "../components/FeaturePremiere";
import GithubButton from "../components/GithubButton";
import PolicyStatus from "../components/PolicyStatus";
import Screenshot from "../components/Screenshot";
import * as Icons from "../components/ui-icons";
import Video from "../components/Video";
import YouTubeVideo from "../components/YouTubeVideo";
import ZupIt from "../components/ZupIt";

export default {
  ...MDXComponents,
  ...Icons,
  GithubButton,
  ZupIt,
  YouTubeVideo,
  Video,
  PolicyStatus,
  Screenshot,
  FeaturePremiere,
};
