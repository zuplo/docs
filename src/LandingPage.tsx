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
import { Image } from "./Image.js";
import imgUrl from "../public/media/zuplo-docs-landing.svg";

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
    href: "/docs/api-management/introduction",
    icon: <PackageIcon size={24} className="text-primary" />,
    title: "API Management",
    description: "Build & Manage high quality APIs",
    content:
      "Build, deploy, and manage APIs at scale with authentication, rate limiting, analytics, and more. Perfect for companies looking to productize their APIs.",
  },
  {
    href: "/docs/ai-gateway/introduction",
    icon: <BrainIcon size={24} className="text-primary" />,
    title: "AI Gateway",
    description: "Visibility and control over your AI",
    content:
      "Manage multiple AI providers through a single API. Add observability, rate limiting, and cost controls to your AI applications with minimal code changes.",
  },
  {
    href: "/docs/mcp-server/introduction",
    icon: <MCPIcon size={24} className="text-pink-500" />,
    title: "Model Context Protocol",
    description: "Go from API to MCP in seconds",
    content:
      "Connect your APIs and data sources to AI assistants using the Model Context Protocol. Enable AI agents to interact with your systems securely and efficiently.",
  },
  {
    href: "/docs/dev-portal/introduction",
    icon: <BookOpenTextIcon size={24} className="text-primary" />,
    title: "Developer Portal & Docs",
    description: "Beautiful API documentation",
    content:
      "Create stunning, interactive API documentation with built-in testing, code examples, and SDK generation. Help developers integrate with your APIs faster.",
  },
];

export const LandingPage = () => {
  return (
    <section>
      <Head>
        <title>Home</title>
      </Head>
      <div className="grid grid-cols-2 gap-5 md:gap-10 mt-5 md:mt-10">
        <div className="col-span-full md:col-span-1 flex flex-col justify-center">
          <h1 className="mb-10 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
            Zuplo Docs:
            <br />
            Intelligent API & AI Traffic Management
          </h1>
          <Typography className="max-w-full text-xl">
            Zuplo helps developers and businesses manage APIs, integrate AI, and
            deploy in dedicated environments. With Zuplo, you can build, manage,
            and scale APIs with confidence.
          </Typography>
        </div>
        <div className="hidden md:flex items-center justify-center">
          <Image src={imgUrl} alt="Zuplo Documentation" />
        </div>
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </section>
  );
};
