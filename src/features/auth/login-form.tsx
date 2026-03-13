import { useAuthActions } from "@convex-dev/auth/react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import { Button, FieldGroup, FormInput } from "@/features/shared/components/ui";
import { Lock, Mail } from "pixelarticons/react";
import { getErrorMessage } from "../shared/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(100, "Password must be at most 100 characters"),
});

function validateLoginForm({
  value,
}: {
  value: { email: string; password: string };
}) {
  const result = loginSchema.safeParse(value);
  if (!result.success) {
    const flattened = result.error.flatten();
    const fields: Record<string, string> = {};
    for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
      if (messages?.[0]) fields[key] = messages[0];
    }
    return { fields };
  }
  return undefined;
}

export function LoginForm() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [emailVerificationSent, setEmailVerificationSent] = useState<
    string | null
  >(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: validateLoginForm,
    },
    onSubmit: async ({
      value,
    }: {
      value: { email: string; password: string };
    }) => {
      setError(null);
      setEmailVerificationSent(null);
      const formData = new FormData();
      formData.set("email", value.email);
      formData.set("password", value.password);
      formData.set("flow", "signIn");

      try {
        const result = await signIn("password", formData);
        if (result?.signingIn) {
          navigate({ to: "/" });
        } else {
          setEmailVerificationSent(value.email);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      }
    },
  });

  return (
    <main className="h-svh flex flex-col items-center justify-center">
      <div className="flex flex-col gap-8 w-96 mx-auto">
        <h1 className="text-2xl font-bold text-center">8-bit Chat</h1>
        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="email"
              children={(field) => (
                <FormInput
                  field={field}
                  label="Email"
                  type="email"
                  placeholder="Email"
                  rightIcon={Mail}
                />
              )}
            />
            <form.Field
              name="password"
              children={(field) => (
                <FormInput
                  field={field}
                  label="Password"
                  type="password"
                  placeholder="Password"
                  rightIcon={Lock}
                />
              )}
            />
            <Button
              type="submit"
              form="login-form"
              disabled={form.state.isSubmitting}
            >
              {form.state.isSubmitting ? "Loading..." : "Log in"}
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-base-300" />
              <span className="text-muted-foreground text-sm">or</span>
              <div className="flex-1 h-px bg-base-300" />
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={form.state.isSubmitting}
              onClick={() => void signIn("google")}
            >
              Sign in with Google
            </Button>
            <div className="flex flex-row gap-2">
              <span>Don&apos;t have an account?</span>
              <Link
                to="/register"
                className="text-primary underline decoration-2 hover:no-underline cursor-pointer"
              >
                Register instead
              </Link>
            </div>
            {emailVerificationSent && (
              <div className="bg-base-200 border-2 border-foreground p-3">
                <p className="font-medium">Check your email</p>
                <p className="text-base-content/80 text-sm mt-1">
                  Your email isn&apos;t verified yet. We sent a verification link
                  to <strong>{emailVerificationSent}</strong>. Click the link to
                  complete sign in.
                </p>
              </div>
            )}
            {error && (
              <div className="bg-destructive-subtle border border-destructive-border p-2">
                <p className="text-destructive font-mono text-xs">
                  Error logging in: {error}
                </p>
              </div>
            )}
          </FieldGroup>
        </form>
      </div>
    </main>
  );
}
