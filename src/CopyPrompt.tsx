import React, { PropsWithChildren, useState, useEffect } from "react";
import { CopyIcon } from "zudoku/icons";

interface CopyPromptProps extends PropsWithChildren {
  src?: string;
}

export const CopyPrompt = ({ children, src }: CopyPromptProps) => {
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (src) {
      setLoading(true);
      setError(null);

      fetch(src)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
          }
          return response.text();
        })
        .then((text) => {
          setContent(text);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [src]);

  const copyToClipboard = () => {
    let text = "";

    if (src && content) {
      text = content;
    } else if (typeof children === "string") {
      text = children;
    } else if (children) {
      text = React.Children.toArray(children).join(" ");
    } else {
      text = "Use this pre-built prompt to get started faster.";
    }

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const displayContent = () => {
    if (src) {
      if (loading) return "Loading...";
      if (error) return `Error: ${error}`;
      if (content) return content;
    }

    return children || "Use this pre-built prompt to get started faster.";
  };

  return (
    <div className="relative border border-border rounded-lg overflow-hidden bg-secondary my-6">
      <div className="px-4 py-3 text-sm text-foreground bg-card whitespace-pre-wrap">
        {displayContent()}
      </div>
      <div className="px-4 py-2 bg-secondary border-t border-border flex justify-end">
        <button
          onClick={copyToClipboard}
          disabled={loading || !!error}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-card border border-border rounded hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CopyIcon size={14} />
          {copied ? "Copied!" : "Copy prompt"}
        </button>
      </div>
    </div>
  );
};
