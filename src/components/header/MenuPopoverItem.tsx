import { MenuPopoverContent } from "@/components/header/MenuPopoverContent";
import { LinksCategory } from "@/lib/interfaces";
import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import { ChevronDownIcon } from "lucide-react";
import { Fragment, PropsWithChildren, useRef } from "react";

interface Props {
  links: Array<Array<LinksCategory>>;
  onItemClick?: () => void;
}

export const MenuPopoverItem: React.FC<PropsWithChildren<Props>> = ({
  links,
  onItemClick,
  children,
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timeOutRef = useRef<NodeJS.Timeout>();

  const handleEnter = (isOpen: boolean) => {
    const isTouchableDevice = "ontouchstart" in window;
    clearTimeout(timeOutRef.current);

    if (!isOpen && !isTouchableDevice) {
      triggerRef.current?.click();
    }
  };

  const handleLeave = (isOpen: boolean) => {
    timeOutRef.current = setTimeout(() => {
      isOpen && triggerRef.current?.click();
    }, 300);
  };

  return (
    <Popover>
      {({ open }) => (
        <div
          onMouseEnter={() => handleEnter(open)}
          onMouseLeave={() => handleLeave(open)}
        >
          <Popover.Button
            ref={triggerRef}
            className="tracking-wider flex items-center outline-none transition-colors hover:text-pink"
          >
            {children}
            <ChevronDownIcon
              className={clsx("h-5 w-5 transition-transform", {
                "rotate-180": open,
              })}
              aria-hidden="true"
            />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Popover.Panel className="fixed z-10 w-screen max-w-3xl -translate-x-1/2 p-5">
              {({ close }) => (
                <MenuPopoverContent
                  links={links}
                  onItemClick={() => {
                    close();
                    onItemClick?.();
                  }}
                />
              )}
            </Popover.Panel>
          </Transition>
        </div>
      )}
    </Popover>
  );
};
