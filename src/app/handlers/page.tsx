import { Metadata } from "next";
import Link from "next/link";
import { DocsHeader } from "../../components/DocsHeader";
import { DocsContainer } from "@/components/DocsContainer";
import { Prose } from "@/components/Prose";
import { Card } from "@/components/Card";
import handlers from "@/data/handlers";

export const metadata: Metadata = {
  title: "Handlers",
};

export default async function Page() {
  return (
    <DocsContainer className="w-full flex-col px-1 pb-[60px] md:px-8">
      <DocsHeader title="Handlers" />
      <Prose>
        <p>
          Handlers are the core of the Zuplo API gateway. Handlers are
          responsible for streaming a response from your downstream API or a
          place where you can write custom code for any scenario.
        </p>
        <p>
          Handlers are in the middle of the request lifecycle of Zuplo between
          inbound and outbound{" "}
          <Link
            href="docs/policies/"
            className="text-pink underline transition-colors hover:text-pink-hover"
          >
            policies
          </Link>{" "}
          .
        </p>
      </Prose>
      <p>
        Zuplo comes with several built-in handlers as well as the ability to
        write your own with a custom module.
      </p>

      <div
        role="list"
        className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {handlers.map((item) => (
          <Card
            key={item.id}
            name={item.name}
            href={item.href}
            icon={item.icon}
          />
        ))}
      </div>
    </DocsContainer>
  );
}
