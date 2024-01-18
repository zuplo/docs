import { CopyButton } from "./CopyButton";

export default function Pre({ children, raw, className, ...props }: any) {
  return (
    <div className="group dark:bg-white/2.5">
      <pre {...props} className={`p-0 rounded-t-none mt-0 ${className}`}>
        <div className="relative p-4">
          <CopyButton code={raw} />
          {children}
        </div>
      </pre>
    </div>
  );
}
