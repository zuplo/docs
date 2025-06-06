import type { ZudokuConfig } from "zudoku";
import { devPortal, docs, policies, programming } from "./sidebar.js";
import { mdxComponents } from "./src/components.js";
import { diagramPlugin } from "./src/diagrams/common/plugin.js";
import { HeadNavigation } from "./src/HeadNavigation";

const config: ZudokuConfig = {
  basePath: "/docs",
  canonicalUrlOrigin: "https://zuplo.com",
  cdnUrl: {
    media: "https://cdn.zuplo.com/docs",
  },
  page: {
    logo: {
      alt: "Zuplo",
      src: {
        light: "/zuplo-light.svg",
        dark: "/zuplo-dark.svg",
      },
      width: "140px",
    },
  },
  metadata: {
    title: "%s - Zuplo Docs",
    description: "Zuplo Documentation",
    generator: "Zudoku",
    favicon: "https://cdn.zuplo.com/www/favicon.svg",
  },
  redirects: [
    {
      from: "/",
      to: "/articles/what-is-zuplo",
    },
    { from: "/policies/index", to: "/policies/overview" },
    { from: "/policies", to: "/policies/overview" },
  ],
  theme: {
    dark: {
      primary: "316 91% 45%",
      primaryForeground: "#FFFFFF",
    },
    light: {
      primary: "316 91% 45%",
      border: "220 13.04% 90.98%",
    },
  },
  // Temporary hack to inject CSS: https://github.com/zuplo/zudoku/issues/473
  plugins: [
    diagramPlugin(),
    {
      getHead: () => (
        <script>
          {`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init be ws Ss me ys capture Ne calculateEventProperties xs register register_once register_for_session unregister unregister_for_session Rs getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Is ks createPersonProfile Ps bs opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing $s debug Es getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('phc_xB1aydh7a41MW9TwUtLJjKme4izQiWf9zKbKhpysAiW', { person_profiles: 'always', api_host: 'https://us.i.posthog.com', defaults: '2025-05-24' })`}
        </script>
      ),
    },
  ],
  UNSAFE_slotlets: {
    "head-navigation-start": HeadNavigation,
  },
  search: {
    type: "inkeep",
    apiKey: "499c156cf7a9798343949c8bb5665ac95e48132c6d68c42e",
    integrationId: "clot3asdz0000s601nc8jwnzx",
    organizationId: "org_dDOlt2uJlMWM8oIS",
    primaryBrandColor: "#ff00bd",
    organizationDisplayName: "Zuplo",
  },
  topNavigation: [
    {
      id: "docs",
      label: "Documentation",
    },
    {
      id: "policies",
      label: "Policies & Handlers",
    },
    {
      id: "programming",
      label: "Programming API",
    },
    {
      id: "api",
      label: "REST API",
    },
  ],
  sidebar: {
    docs,
    policies,
    programming,
    devPortal,
  },
  mdx: {
    components: mdxComponents,
  },
  apis: {
    type: "file",
    input: "./api.json",
    navigationId: "api",
    options: {
      expandAllTags: true,
    },
  },
  docs: [
    { files: "/docs/**/*.{md,mdx}" },
    { files: "/generated/**/*.{md,mdx}" },
  ],
  sitemap: {
    siteUrl: "https://zuplo.com/docs",
    exclude: ["/", ""],
  },
};

export default config;
