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
import { cn } from "zudoku/ui/util";

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
  <a href={href} className="col-span-2 lg:col-span-1">
    <Card
      className={cn(
        "group transition-shadow h-full transition-colors",
        "hover:shadow-lg hover:border-primary",
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-col gap-3 text-xl xl:text-2xl font-bold">
          <div
            className={cn(
              "flex transition-colors rounded-md p-2 w-fit bg-neutral-100 dark:bg-neutral-800",
              "group-hover:bg-primary/10 group-hover:text-primary group-hover:dark:bg-primary/20",
            )}
          >
            {icon}
          </div>
          {title}
        </CardTitle>
        <CardDescription className="text-md xl:text-lg">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="lg:mt-2">{content}</CardContent>
    </Card>
  </a>
);

const products: ProductCardProps[] = [
  {
    href: "/docs/api-management/introduction",
    icon: <PackageIcon size={24} />,
    title: "API Management",
    description: "Build & Manage high quality APIs",
    content:
      "Build, deploy, and manage APIs at scale with authentication, rate limiting, analytics, and more. Perfect for companies looking to productize their APIs.",
  },
  {
    href: "/docs/ai-gateway/introduction",
    icon: <BrainIcon size={24} />,
    title: "AI Gateway",
    description: "Visibility and control over your AI",
    content:
      "Manage multiple AI providers through a single API. Add observability, rate limiting, and cost controls to your AI applications with minimal code changes.",
  },
  {
    href: "/docs/mcp-server/introduction",
    icon: <MCPIcon size={24} />,
    title: "Model Context Protocol",
    description: "Go from API to MCP in seconds",
    content:
      "Connect your APIs and data sources to AI assistants using the Model Context Protocol. Enable AI agents to interact with your systems securely and efficiently.",
  },
  {
    href: "/docs/dev-portal/introduction",
    icon: <BookOpenTextIcon size={24} />,
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
      <div className="grid grid-cols-4 gap-5 xl:gap-10 mt-5 md:mt-10">
        <div className="col-span-full md:col-span-2 flex flex-col justify-center">
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
        <div className="hidden md:flex col-span-2 items-center justify-center">
          <Image src={imgUrl} alt="Zuplo Documentation" />
        </div>
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </section>
  );
};
