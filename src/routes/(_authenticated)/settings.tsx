import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useTheme } from "next-themes";

import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../convex/_generated/api";
import { AuthBackground } from "@/features/auth/auth-background";
import { Button, FieldGroup, FormInput } from "@/features/shared/components/ui";
import {
  CloudSun,
  Home,
  Logout,
  Monitor,
  Moon,
  User,
} from "pixelarticons/react";
import { getErrorMessage } from "@/features/shared/lib/utils";

export const Route = createFileRoute("/(_authenticated)/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { signOut } = useAuthActions();
  const userQuery = useQuery(convexQuery(api.functions.auth.getUser));
  const updateUser = useMutation(api.functions.auth.updateUser);
  const { theme, resolvedTheme, setTheme } = useTheme();

  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const updateNameSchema = z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be at most 100 characters"),
  });

  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: updateNameSchema,
    },
    onSubmit: async ({ value }: { value: { name: string } }) => {
      setError(null);
      setStatus("idle");
      try {
        await updateUser({ name: value.name.trim() });
        setStatus("saved");
      } catch (err) {
        setStatus("error");
        setError(getErrorMessage(err));
      }
    },
  });

  useEffect(() => {
    if (userQuery.data?.name) {
      form.setFieldValue("name", userQuery.data.name);
    }
  }, [userQuery.data?.name, form]);

  return (
    <div className="relative min-h-svh w-full">
      <AuthBackground />
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <Button
          variant="outline"
          render={<Link to="/" />}
          nativeButton={false}
          size="icon"
          aria-label="Back to home"
        >
          <Home />
        </Button>
        <Button
          variant="outline"
          onClick={() => void signOut()}
          className="flex items-center gap-2"
        >
          <Logout />
          Sign out
        </Button>
      </div>
      <main className="relative z-10 h-svh flex flex-col items-center justify-center pt-16 pb-8 px-4">
        <div className="flex flex-col gap-8 w-full max-w-sm sm:max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-center">Settings</h1>
          <form
            id="settings-form"
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit();
            }}
            className="flex flex-col gap-6"
            noValidate
          >
            <FieldGroup>
              <form.Field
                name="name"
                children={(field) => (
                  <FormInput
                    field={field}
                    label="Display name"
                    type="text"
                    placeholder="Your name"
                    rightIcon={User}
                  />
                )}
              />
              <Button
                type="submit"
                form="settings-form"
                disabled={form.state.isSubmitting}
              >
                {form.state.isSubmitting ? "Saving..." : "Save changes"}
              </Button>
              {status === "saved" && !error && (
                <p className="text-xs text-success">Profile updated.</p>
              )}
              {error && (
                <div className="bg-destructive-subtle border border-destructive-border p-2">
                  <p className="text-destructive font-mono text-xs">
                    Error: {error}
                  </p>
                </div>
              )}
            </FieldGroup>
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold text-base">Theme</h2>
              <p className="text-sm text-base-content/80">
                Toggle between light, dark, or system theme.
              </p>
              <div className="flex gap-2 [&>button]:flex-1">
                <Button
                  type="button"
                  variant={resolvedTheme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                  aria-label="Light theme"
                >
                  <CloudSun className="h-4 w-4" />
                  Light
                </Button>
                <Button
                  type="button"
                  variant={resolvedTheme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                  aria-label="Dark theme"
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
                <Button
                  type="button"
                  variant={theme === "system" ? "default" : "outline"}
                  onClick={() => setTheme("system")}
                  aria-label="System theme"
                >
                  <Monitor className="h-4 w-4" />
                  System
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
