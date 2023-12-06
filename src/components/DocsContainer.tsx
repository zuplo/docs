import { PropsWithChildren } from "react";

export function DocsContainer({ children }: PropsWithChildren) {
  return (
    <div className="sticky top-[4.75rem] -ml-0.5 flex h-[calc(100vh-10rem)] min-w-0 max-w-2xl overflow-y-auto overflow-x-hidden py-[60px] lg:max-w-none">
      {children}
    </div>
  );
}
