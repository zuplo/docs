import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "zudoku/ui/Card";
import {
  BrainIcon,
  PackageIcon,
  BookOpenTextIcon,
} from "@phosphor-icons/react/dist/ssr";
import MCPIcon from "./icons/MCPServer";

const ProductsList = () => (
  <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
    <a href="/docs/api-management/overview">
      <Card className="hover:shadow-lg transition-shadow h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            <PackageIcon size={24} className="text-primary" />
            API Management
          </CardTitle>
          <CardDescription className="mt-1">
            Build & Manage high quality APIs
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          Build, deploy, and manage APIs at scale with authentication, rate
          limiting, analytics, and more. Perfect for companies looking to
          productize their APIs.
        </CardContent>
      </Card>
    </a>
    <a href="/docs/ai-gateway/overview">
      <Card className="hover:shadow-lg transition-shadow h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            <BrainIcon size={24} className="text-primary" />
            AI Gateway
          </CardTitle>
          <CardDescription className="mt-1">
            Visibility and control over your AI
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          Manage multiple AI providers through a single API. Add observability,
          rate limiting, and cost controls to your AI applications with minimal
          code changes.
        </CardContent>
      </Card>
    </a>
    <a href="/docs/mcp-server/overview">
      <Card className="hover:shadow-lg transition-shadow h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            <MCPIcon size={24} className="text-pink-500" />
            Model Context Protocol
          </CardTitle>
          <CardDescription className="mt-1">
            Go from API to MCP in seconds
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          Connect your APIs and data sources to AI assistants using the Model
          Context Protocol. Enable AI agents to interact with your systems
          securely and efficiently.
        </CardContent>
      </Card>
    </a>
    <a href="/docs/dev-portal/introduction">
      <Card className="hover:shadow-lg transition-shadow h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            <BookOpenTextIcon size={24} className="text-primary" />
            Developer Portal
          </CardTitle>
          <CardDescription className="mt-1">
            Beautiful API documentation
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          Create stunning, interactive API documentation with built-in testing,
          code examples, and SDK generation. Help developers integrate with your
          APIs faster.
        </CardContent>
      </Card>
    </a>
  </div>
);

export default ProductsList;
