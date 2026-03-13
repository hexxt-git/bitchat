import { createFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "@/features/auth/register-form";
import { z } from "zod";

export const Route = createFileRoute("/(_auth)/register")({
  validateSearch: z.object({
    from: z.string().optional(),
  }),
  component: RegisterPage,
});

function RegisterPage() {
  return <RegisterForm />;
}
