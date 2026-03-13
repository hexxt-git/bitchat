import * as React from "react";

import { cn } from "@/features/shared/lib/utils";

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="input-group"
    className={cn(
      "flex h-9 w-full overflow-hidden border-2 border-foreground bg-base-100 text-base transition-colors has-data-[slot=addon]:flex",
      className,
    )}
    {...props}
  />
));
InputGroup.displayName = "InputGroup";

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    data-slot="input-group-input"
    className={cn(
      "flex flex-1 bg-transparent px-3 py-1 text-base outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-base-content disabled:cursor-not-allowed disabled:opacity-50 border-0",
      className,
    )}
    {...props}
  />
));
InputGroupInput.displayName = "InputGroupInput";

const InputGroupTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    data-slot="input-group-textarea"
    className={cn(
      "flex min-h-9 w-full flex-1 resize-none bg-base-100 px-3 py-2 text-base outline-none placeholder:text-base-content disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
InputGroupTextarea.displayName = "InputGroupTextarea";

type InputGroupAddonAlign =
  | "inline-start"
  | "inline-end"
  | "block-start"
  | "block-end";

const alignClasses: Record<InputGroupAddonAlign, string> = {
  "inline-start": "order-first",
  "inline-end": "order-last",
  "block-start":
    "absolute left-0 top-0 w-full border-b border-base-300 px-3 py-1.5",
  "block-end":
    "absolute bottom-0 left-0 w-full border-t border-base-300 px-3 py-1.5",
};

interface InputGroupAddonProps extends React.ComponentProps<"div"> {
  align?: InputGroupAddonAlign;
}

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: InputGroupAddonProps) {
  return (
    <div
      data-slot="addon"
      className={cn(
        "flex shrink-0 items-center gap-1.5 text-base-content [&_svg]:size-4",
        alignClasses[align],
        className,
      )}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn("text-sm", className)}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupText,
};
