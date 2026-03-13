import * as React from "react";

import { cn } from "@/features/shared/lib/utils";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/features/shared/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/features/shared/components/ui/input-group";

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

export interface FormInputProps extends Omit<
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
    ref,
  ) => {
    const inputId = field.name;
    const derivedAutoComplete = autoComplete ?? defaultAutoComplete[field.name];
    const isInvalid =
      field.state.meta.isTouched && field.state.meta.errors.length > 0;
    const errors = isInvalid
      ? field.state.meta.errors.filter(
          (e): e is string => typeof e === "string",
        )
      : [];
    const hasError = errors.length > 0;

    return (
      <Field
        data-slot="form-input"
        className={cn(undefined, containerClassName)}
      >
        {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
        <InputGroup
          className={cn(
            "focus-within:ring-2 focus-within:ring-ring focus-within:outline-none",
            hasError && "border-destructive",
          )}
        >
          {leftIcon && (
            <InputGroupAddon className="px-3">
              {React.createElement(leftIcon, { className: "size-4" })}
            </InputGroupAddon>
          )}
          <InputGroupInput
            ref={ref}
            id={inputId}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            data-slot="form-input-field"
            className={cn(
              "min-w-0 bg-base-100",
              !leftIcon && "pl-3",
              !rightIcon && "pr-3",
              leftIcon && "pl-0",
              rightIcon && "pr-0",
              className,
            )}
            aria-invalid={hasError}
            autoComplete={derivedAutoComplete}
            {...inputProps}
          />
          {rightIcon && (
            <InputGroupAddon align="inline-end" className="px-3">
              {React.createElement(rightIcon, { className: "size-4" })}
            </InputGroupAddon>
          )}
        </InputGroup>
        <FieldError errors={errors} />
      </Field>
    );
  },
);

FormInput.displayName = "FormInput";

export { FormInput };
