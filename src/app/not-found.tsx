import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
      <div className="flex h-full flex-col items-center justify-center text-center text-white dark:text-black">
        <p className="font-display text-sm font-medium">404</p>
        <h1 className="mt-3 font-display text-3xl tracking-tight">
          Page not found
        </h1>
        <p className="mt-2 text-sm">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <Link href="/" className="mt-8 text-sm font-medium">
          Go back to docs
        </Link>
      </div>
    </div>
  );
}
