import { Navigation } from "@/components/navigation/Navigation";
import Header from "./header/Header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center px-4">
      <Header />

      <div className="max-w-8xl relative mx-auto flex w-full flex-auto justify-center sm:px-2 lg:px-8 xl:px-12">
        <div className="hidden lg:relative lg:block lg:flex-none">
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-gray-50 dark:hidden" />
          <div className="absolute bottom-0 right-0 top-0 hidden w-px bg-gray-800 dark:block" />
          <div className="sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] w-64 overflow-y-auto overflow-x-hidden py-12 pr-8 xl:w-72 xl:pr-16">
            <Navigation />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
