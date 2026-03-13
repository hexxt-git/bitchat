import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/features/auth/login-form";
import { z } from "zod";

export const Route = createFileRoute("/(_auth)/login")({
  validateSearch: z.object({
    from: z.string().optional(),
  }),
  component: LoginPage,
});

function LoginPage() {
  return <LoginForm />;
}
