import { PropsWithChildren } from "react";

export function DocsContainer({ children }: PropsWithChildren) {
  return (
    <div className="sticky top-[4.75rem] -ml-0.5 flex h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden pt-[60px]">
      {children}
    </div>
  );
}
