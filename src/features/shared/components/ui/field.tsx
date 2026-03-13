import * as React from "react";

import { cn } from "@/features/shared/lib/utils";

const orientationVariants = {
  vertical: "flex flex-col gap-1.5",
  horizontal:
    "flex flex-row items-center gap-3 [&_input]:flex-1 [&_select]:flex-1",
};

interface FieldProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  orientation?: keyof typeof orientationVariants;
  children?: React.ReactNode;
}

function Field({
  className,
  orientation = "vertical",
  ...props
}: FieldProps) {
  return (
    <div
      data-slot="field"
      className={cn(orientationVariants[orientation], className)}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="field-label"
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}

function FieldDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-sm text-base-content", className)}
      {...props}
    />
  );
}

function FieldError({
  className,
  errors,
  ...props
}: React.ComponentProps<"p"> & {
  errors?: string[];
}) {
  if (!errors?.length) return null;
  return (
    <p
      data-slot="field-error"
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {errors.join(", ")}
    </p>
  );
}

export {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
};
