import { Head, Typography } from "zudoku/components";
import {
  BrainIcon,
  PackageIcon,
  BookOpenTextIcon,
} from "@phosphor-icons/react/dist/ssr";
import MCPIcon from "./icons/MCPServer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "zudoku/ui/Card";

interface ProductCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  content: string;
}

const ProductCard = ({
  href,
  icon,
  title,
  description,
  content,
}: ProductCardProps) => (
  <a href={href}>
    <Card className="hover:shadow-lg transition-shadow h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="mt-1">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">{content}</CardContent>
    </Card>
  </a>
);

const products: ProductCardProps[] = [
  {
    href: "/docs/articles/what-is-zuplo",
    icon: <PackageIcon size={24} className="text-primary" />,
    title: "API Management",
    description: "Build & Manage high quality APIs",
    content:
      "Build, deploy, and manage APIs at scale with authentication, rate limiting, analytics, and more. Perfect for companies looking to productize their APIs.",
  },
  {
    href: "/docs/ai-gateway/overview",
    icon: <BrainIcon size={24} className="text-primary" />,
    title: "AI Gateway",
    description: "Visibility and control over your AI",
    content:
      "Manage multiple AI providers through a single API. Add observability, rate limiting, and cost controls to your AI applications with minimal code changes.",
  },
  {
    href: "/docs/mcp-server/overview",
    icon: <MCPIcon size={24} className="text-pink-500" />,
    title: "Model Context Protocol",
    description: "Go from API to MCP in seconds",
    content:
      "Connect your APIs and data sources to AI assistants using the Model Context Protocol. Enable AI agents to interact with your systems securely and efficiently.",
  },
  {
    href: "/docs/dev-portal/introduction",
    icon: <BookOpenTextIcon size={24} className="text-primary" />,
    title: "Developer Portal",
    description: "Beautiful API documentation",
    content:
      "Create stunning, interactive API documentation with built-in testing, code examples, and SDK generation. Help developers integrate with your APIs faster.",
  },
];

export const Landingpage = () => {
  return (
    <section>
      <Head>
        <title>Home</title>
      </Head>
      <div className="grid lg:gap-12 pb-8 lg:py-16 lg:grid-cols-12 gap-10">
        <div className="mr-auto lg:col-span-8 col-span-full mt-10 lg:mt-0">
          <h1 className="mb-10 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
            Zuplo Documentation
          </h1>
          <Typography className="max-w-full">
            <p>
              Zuplo offers a suite of products designed to meet the diverse
              needs of developers and businesses. Whether you're looking to
              manage APIs, integrate AI capabilities, or deploy in a dedicated
              environment, Zuplo has you covered. Explore the complete Zuplo
              platform designed to help you build, manage, and scale APIs with
              confidence.
            </p>
          </Typography>
          <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {products.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
        <img
          src="/docs.jpg"
          className="max-w-[330px] w-full hidden lg:mt-0 lg:col-span-4 lg:flex rounded-lg drop-shadow-lg dark:drop-shadow-none"
          alt="Zuplo Documentation"
        />
      </div>
    </section>
  );
};
