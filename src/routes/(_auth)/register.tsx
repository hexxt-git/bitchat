import { createFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "@/features/auth/register-form";

export const Route = createFileRoute("/(_auth)/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return <RegisterForm />;
}
