import { AuthBackground } from "@/features/auth/auth-background";
import { AuthLoadingIndicator } from "@/features/auth/auth-loading-indicator";
import { ThemeToggle } from "@/features/shared/components/theme-toggle";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { useDelay } from "@/features/shared/utils/use-delay";

export const Route = createFileRoute("/(_auth)")({
  component: RouteComponent,
});

function RouteComponent() {
  const auth = useConvexAuth();
  const isDelayed = useDelay(1000);

  if (auth.isLoading || !isDelayed) {
    return <AuthLoadingIndicator />;
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <AuthBackground />
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
      </div>
      <div className="relative z-10">
        <Outlet />
      </div>
    </>
  );
}
