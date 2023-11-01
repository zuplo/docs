import MDXComponents from "@theme-original/MDXComponents";
import CustomPolicyNotice from "../components/CustomPolicyNotice";
import FeaturePremiere from "../components/FeaturePremiere";
import GithubButton from "../components/GithubButton";
import PolicyStatus from "../components/PolicyStatus";
import Screenshot from "../components/Screenshot";
import Video from "../components/Video";
import YouTubeVideo from "../components/YouTubeVideo";
import ZupIt from "../components/ZupIt";
import * as Icons from "../components/ui-icons";

export default {
  ...MDXComponents,
  ...Icons,
  GithubButton,
  ZupIt,
  YouTubeVideo,
  Video,
  PolicyStatus,
  CustomPolicyNotice,
  Screenshot,
  FeaturePremiere,
};
