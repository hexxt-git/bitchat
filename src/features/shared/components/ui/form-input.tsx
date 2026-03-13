import * as React from "react";

import { cn } from "@/features/shared/lib/utils";

/** Icon component type - accepts className and SVG props (e.g. pixelarticons) */
export type IconComponent = React.ComponentType<
  React.SVGProps<SVGSVGElement> & { className?: string }
>;

const defaultAutoComplete: Record<string, string> = {
  email: "email",
  username: "username",
  password: "current-password",
};

export interface FormFieldLike {
  name: string;
  state: {
    value: string;
    meta: { isTouched: boolean; errors: unknown[] };
  };
  handleBlur: () => void;
  handleChange: (value: string) => void;
}

export interface FormInputProps
  extends Omit<
    React.ComponentProps<"input">,
    "value" | "onChange" | "onBlur" | "name" | "id"
  > {
  field: FormFieldLike;
  label?: string;
  leftIcon?: IconComponent;
  rightIcon?: IconComponent;
  containerClassName?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      field,
      label,
      leftIcon,
      rightIcon,
      containerClassName,
      className,
      autoComplete,
      ...inputProps
    },
    ref
  ) => {
    const inputId = field.name;
    const derivedAutoComplete =
      autoComplete ?? defaultAutoComplete[field.name];
    const isInvalid =
      field.state.meta.isTouched && field.state.meta.errors.length > 0;
    const errors = isInvalid
      ? field.state.meta.errors.filter(
          (e): e is string => typeof e === "string"
        )
      : [];
    const hasError = errors.length > 0;

    return (
      <div
        data-slot="form-input"
        className={cn("flex flex-col gap-1.5", containerClassName)}
      >
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex h-9 w-full overflow-hidden border-2 border-foreground bg-base-100 text-base transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:outline-none",
            hasError && "border-destructive"
          )}
        >
          {leftIcon && (
            <span className="flex shrink-0 items-center px-3 text-base-content [&_svg]:size-4">
              {React.createElement(leftIcon, { className: "size-4" })}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            data-slot="form-input-field"
            className={cn(
              "flex flex-1 min-w-0 bg-base-100 px-3 py-1 text-base outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-base-content disabled:cursor-not-allowed disabled:opacity-50 border-0",
              !leftIcon && "pl-3",
              !rightIcon && "pr-3",
              leftIcon && "pl-0",
              rightIcon && "pr-0",
              className
            )}
            aria-invalid={hasError}
            autoComplete={derivedAutoComplete}
            {...inputProps}
          />
          {rightIcon && (
            <span className="flex shrink-0 items-center px-3 text-base-content [&_svg]:size-4">
              {React.createElement(rightIcon, { className: "size-4" })}
            </span>
          )}
        </div>
        {hasError && (
          <p className="text-sm text-destructive">{errors.join(", ")}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export { FormInput };
