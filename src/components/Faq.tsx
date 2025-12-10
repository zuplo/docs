import React from "react";

interface FaqItemProps {
  question: string;
  children: React.ReactNode;
}

export const FaqItem: React.FC<FaqItemProps> = ({ question, children }) => {
  return (
    <details className="group border-b border-border last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center gap-2 py-3 px-4 font-medium hover:bg-muted/30">
        <svg
          className="h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-150 group-open:rotate-90"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M4 2L8 6L4 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {question}
      </summary>
      <div className="pb-4 pl-9 pr-4 text-muted-foreground">{children}</div>
    </details>
  );
};

interface FaqProps {
  children: React.ReactNode;
}

export const Faq: React.FC<FaqProps> = ({ children }) => {
  return <div className="my-6 rounded-lg border border-border">{children}</div>;
};
