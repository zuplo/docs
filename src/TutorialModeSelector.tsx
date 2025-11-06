import { Children, isValidElement, ReactNode } from "react";
import { Link } from "zudoku/components";
interface ModeProps {
  icon?: ReactNode;
  label: string;
  active?: boolean;
  description?: string;
  link?: string;
}

export function TutorialMode(_props: ModeProps) {
  return null; // This component is only used for passing props
}

interface TutorialModeSelectorProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function TutorialModeSelector({
  children,
  title,
  description,
}: TutorialModeSelectorProps) {
  const childArray = Children.toArray(children);

  // Extract Mode components
  const modes: ModeProps[] = [];

  childArray.forEach((child) => {
    if (isValidElement(child) && child.type === TutorialMode) {
      modes.push(child.props as ModeProps);
    }
  });

  // Find the active mode
  const activeMode = modes.find((mode) => mode.active);

  return (
    <div className="mb-8 not-prose">
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-base text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Combined tab bar and content */}
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Mode selector tabs */}
        <div className="flex bg-secondary border-b border-border">
          {modes.map((mode, index) => {
            const isActive = mode.active;

            return isActive ? (
              <div
                key={index}
                className="flex-1 flex items-center justify-center gap-2 h-12 text-sm font-medium bg-card text-primary border-b-2 border-primary -mb-[1px] transition-all"
              >
                {mode.icon && (
                  <span
                    className="inline-flex shrink-0"
                    style={{ fontSize: "16px", lineHeight: "1" }}
                  >
                    {mode.icon}
                  </span>
                )}
                <span>{mode.label}</span>
              </div>
            ) : (
              <Link
                key={index}
                to={mode.link!}
                className="flex-1 flex items-center justify-center gap-2 h-12 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              >
                {mode.icon && (
                  <span
                    className="inline-flex shrink-0"
                    style={{ fontSize: "16px", lineHeight: "1" }}
                  >
                    {mode.icon}
                  </span>
                )}
                <span>{mode.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Active mode content */}
        {activeMode && (
          <div className="bg-card p-6">
            <div className="flex items-start gap-3">
              {activeMode.icon && (
                <span
                  className="inline-flex shrink-0 text-primary mt-0.5"
                  style={{ fontSize: "20px", lineHeight: "1" }}
                >
                  {activeMode.icon}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base text-foreground mb-2">
                  {activeMode.label}
                </h3>
                {activeMode.description && (
                  <p className="text-sm leading-relaxed text-muted-foreground m-0">
                    {activeMode.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
