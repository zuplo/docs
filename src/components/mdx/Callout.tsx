import {
  AlertTriangleIcon,
  InfoIcon,
  LightbulbIcon,
  ShieldAlertIcon,
} from "lucide-react";

type CalloutType = "note" | "tip" | "info" | "caution" | "danger";

type CalloutProps = {
  type: CalloutType;
  children: any;
  title: string;
};

// -----------------------------------------------------------
// IMPORTANT: YOU MUST KEEP THE STYLES OF THIS FILE IN SYNC
// WITH THE STYLES IN lib/markdown/callout.ts
// -----------------------------------------------------------

const Note = ({ children, title }: Omit<CalloutProps, "type">) => (
  <div
    className={`callout not-prose mb-4 rounded-md border-l-4 border-gray-600 bg-gray-50 p-4`}
  >
    <div className="flex">
      <div className="flex-shrink-0 pt-[6px]">
        <InfoIcon className={`h-5 w-5 text-gray-600`} aria-hidden="true" />
      </div>
      <div className="ml-3">
        <h3 className={`text-md font-medium text-gray-800`}>
          {title ?? "Note"}
        </h3>
        <div className={`text-md mt-2 text-gray-700`}>
          <p>{children}</p>
        </div>
      </div>
    </div>
  </div>
);

const Tip = ({ children, title }: Omit<CalloutProps, "type">) => (
  <div
    className={`callout not-prose mb-4 rounded-md border-l-4 border-green-400 bg-green-50 p-4`}
  >
    <div className="flex">
      <div className="flex-shrink-0 pt-[6px]">
        <LightbulbIcon
          className={`h-5 w-5 text-green-400`}
          aria-hidden="true"
        />
      </div>
      <div className="ml-3">
        <h3 className={`text-md font-medium text-green-800`}>
          {title ?? "Tip"}
        </h3>
        <div className={`text-md mt-2 text-green-700`}>
          <p>{children}</p>
        </div>
      </div>
    </div>
  </div>
);

const Info = ({ children, title }: Omit<CalloutProps, "type">) => (
  <div
    className={`callout not-prose mb-4 rounded-md border-l-4 border-blue-400 bg-blue-50 p-4`}
  >
    <div className="flex">
      <div className="flex-shrink-0 pt-[6px]">
        <InfoIcon className={`h-5 w-5 text-blue-400`} aria-hidden="true" />
      </div>
      <div className="ml-3">
        <h3 className={`text-md font-medium text-blue-700`}>
          {title ?? "Info"}
        </h3>
        <div className={`text-md mt-2 text-blue-600`}>
          <p>{children}</p>
        </div>
      </div>
    </div>
  </div>
);

const Caution = ({ children, title }: Omit<CalloutProps, "type">) => (
  <div
    className={`callout not-prose mb-4 rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-4`}
  >
    <div className="flex">
      <div className="flex-shrink-0 pt-[6px]">
        <AlertTriangleIcon
          className={`h-5 w-5 text-yellow-400`}
          aria-hidden="true"
        />
      </div>
      <div className="ml-3">
        <h3 className={`text-md font-medium text-yellow-800`}>
          {title ?? "Caution"}
        </h3>
        <div className={`text-md mt-2 text-yellow-700`}>
          <p>{children}</p>
        </div>
      </div>
    </div>
  </div>
);

const Danger = ({ children, title }: Omit<CalloutProps, "type">) => (
  <div
    className={`callout not-prose mb-4 rounded-md border-l-4 border-red-400 bg-red-50 p-4`}
  >
    <div className="flex">
      <div className="flex-shrink-0 pt-[6px]">
        <ShieldAlertIcon
          className={`h-5 w-5 text-red-400`}
          aria-hidden="true"
        />
      </div>
      <div className="ml-3">
        <h3 className={`text-md font-medium text-red-800`}>
          {title ?? "Danger"}
        </h3>
        <div className={`text-md mt-2 text-red-700`}>
          <p>{children}</p>
        </div>
      </div>
    </div>
  </div>
);

const config: Record<CalloutType, React.FC<Omit<CalloutProps, "type">>> = {
  note: Note,
  tip: Tip,
  info: Info,
  caution: Caution,
  danger: Danger,
};

export default function Callout({ children, title, type }: CalloutProps) {
  const El = config[type];
  if (!El) {
    throw new Error(`Callout type '${type}' is not valid`);
  }
  return <El title={title}>{children}</El>;
}
