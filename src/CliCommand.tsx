import React from "react";
import { SyntaxHighlight } from "zudoku/ui/SyntaxHighlight";

// Helper components for custom content
export const CliIntro: React.FC<{
  command: string;
  children: React.ReactNode;
}> = ({ children }) => <>{children}</>;
export const CliDoc: React.FC<{
  command: string;
  children: React.ReactNode;
}> = ({ children }) => <>{children}</>;

// Component for command groups (commands with subcommands)
export const CliCommandGroup: React.FC<{
  command: string;
  description: string;
  aliases?: string[];
  children?: React.ReactNode;
}> = ({ command, description, aliases, children }) => {
  // Extract CliIntro content from children if present
  let introContent: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === CliIntro) {
        introContent = (child.props as { children: React.ReactNode }).children;
      }
    }
  });

  const helpLines = [
    `zuplo ${command} --help`,
    `zuplo ${command}`,
    "",
    description,
  ];

  if (aliases && aliases.length > 0) {
    helpLines.push("", `Aliases: ${aliases.join(", ")}`);
  }

  const helpOutput = helpLines.join("\n");

  return (
    <div className="cli-command-group mb-8">
      {introContent && <div className="my-4">{introContent}</div>}
      <SyntaxHighlight language="bash">{helpOutput}</SyntaxHighlight>
    </div>
  );
};

export interface CliOption {
  name: string;
  type: string;
  default?: string | number | boolean;
  required: boolean;
  deprecated: boolean | string;
  hidden: boolean;
  description?: string;
  alias?: string[];
  normalize?: boolean;
  choices?: string[];
  envVar?: string;
  conflicts?: string[];
}

export interface CliSubcommand {
  command: string;
  description: string;
  options: CliOption[];
  deprecated?: boolean | string;
  hidden?: boolean;
}

interface CliCommandProps {
  command: string;
  description: string;
  aliases?: string[];
  options?: CliOption[];
  subcommands?: CliSubcommand[];
  examples?: [string, string][];
  children?: React.ReactNode;
}

function formatOptionLine(option: CliOption): string {
  const nameCol = `--${option.name}`.padEnd(25);

  const parts = [];
  if (option.description) {
    parts.push(option.description);
  }

  const tags = [];
  if (option.type) tags.push(`[${option.type}]`);
  if (option.default !== undefined)
    tags.push(`[default: ${JSON.stringify(option.default)}]`);
  if (option.required) tags.push("[required]");

  if (tags.length > 0) {
    parts.push(tags.join(" "));
  }

  const description = parts.join(" ");
  return `  ${nameCol}${description}`;
}

export const CliCommand: React.FC<CliCommandProps> = ({
  command,
  description,
  aliases,
  options = [],
  subcommands = [],
  examples = [],
  children,
}) => {
  const visibleOptions = options.filter(
    (opt) => !opt.hidden && !opt.deprecated,
  );

  // Generate main command help output
  const mainHelpLines = [`zuplo ${command} --help`, `zuplo ${command}`];

  if (aliases && aliases.length > 0) {
    mainHelpLines.push("", `Aliases: ${aliases.join(", ")}`);
  }

  const visibleSubcommands = subcommands.filter(
    (sub) => !sub.hidden && !sub.deprecated,
  );

  if (visibleSubcommands.length > 0) {
    mainHelpLines.push("", "Commands:");
    visibleSubcommands.forEach((sub) => {
      const subCmd = `  zuplo ${sub.command}`.padEnd(40);
      mainHelpLines.push(`${subCmd}${sub.description}`);
    });
  }

  const mainHelpOutput = mainHelpLines.join("\n");

  return (
    <div className="cli-command-docs">
      {/* Description */}
      {description && <div className="my-4">{description}</div>}

      {/* Main Command Help */}
      <SyntaxHighlight language="bash">{mainHelpOutput}</SyntaxHighlight>

      {/* Custom content from partial files */}
      {children && <div className="my-4">{children}</div>}

      {/* Examples */}
      {examples.length > 0 && (
        <div className="my-8">
          <h2 className="text-2xl font-bold mb-6">Examples</h2>
          {examples.map(([cmd, desc], index) => (
            <div key={index} className="mb-6">
              <p className="mb-2 text-gray-700">{desc}</p>
              <SyntaxHighlight language="bash">
                {cmd.replace(/\$0/g, "zuplo")}
              </SyntaxHighlight>
            </div>
          ))}
        </div>
      )}

      {/* Individual Options */}
      {visibleOptions.length > 0 && (
        <div className="my-8">
          <h2 className="text-2xl font-bold mb-6">Options</h2>
          {visibleOptions.map((option) => (
            <div key={option.name} className="mb-8">
              <h3 className="text-xl font-semibold mb-2" id={option.name}>
                <code>--{option.name}</code>
              </h3>
              {option.description && (
                <p className="mb-3 text-gray-700">{option.description}</p>
              )}
              <div className="text-sm text-gray-600">
                {option.type && (
                  <span className="mr-3">
                    Type:{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      {option.type}
                    </code>
                  </span>
                )}
                {option.default !== undefined && (
                  <span className="mr-3">
                    Default:{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      {JSON.stringify(option.default)}
                    </code>
                  </span>
                )}
                {option.choices && option.choices.length > 0 && (
                  <span className="mr-3">
                    Choices:{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      {option.choices.join(", ")}
                    </code>
                  </span>
                )}
                {option.alias && option.alias.length > 0 && (
                  <span className="mr-3">
                    Alias:{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      -{option.alias.join(", -")}
                    </code>
                  </span>
                )}
                {option.envVar && (
                  <span className="mr-3">
                    Env:{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      {option.envVar}
                    </code>
                  </span>
                )}
                {option.conflicts && option.conflicts.length > 0 && (
                  <span className="mr-3">
                    Conflicts:{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      --{option.conflicts.join(", --")}
                    </code>
                  </span>
                )}
                {option.required && (
                  <span className="text-red-600 font-medium mr-3">
                    Required
                  </span>
                )}
                {option.deprecated && (
                  <span className="text-yellow-600 font-medium">
                    Deprecated
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subcommands */}
      {visibleSubcommands.map((subcommand) => {
        const subOptions = subcommand.options.filter(
          (opt) => !opt.hidden && !opt.deprecated,
        );
        const subHasOptions = subOptions.length > 0;

        const subHelpLines = [
          `zuplo ${subcommand.command} --help`,
          `zuplo ${subcommand.command}`,
          "",
          subcommand.description,
        ];

        if (subHasOptions) {
          subHelpLines.push("", "Options:");
          subHelpLines.push(
            "  --version  Show version number                                       [boolean]",
          );
          subHelpLines.push(
            "  --help     Show help                                                 [boolean]",
          );
          subOptions.forEach((opt) => {
            subHelpLines.push(formatOptionLine(opt));
          });
        }

        const subHelpOutput = subHelpLines.join("\n");

        return (
          <div key={subcommand.command} className="my-8">
            <h2>{subcommand.command.split(" ").slice(-1)[0]}</h2>
            <SyntaxHighlight language="bash">{subHelpOutput}</SyntaxHighlight>
          </div>
        );
      })}
    </div>
  );
};
