import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";

import { AuthLoadingIndicator } from "@/features/auth/auth-loading-indicator";
import { useDelay } from "@/features/shared/utils/use-delay";
import { useConvexAuth } from "convex/react";

export const Route = createFileRoute("/(_authenticated)")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const auth = useConvexAuth();
  const isDelayed = useDelay(1000);

  if (auth.isLoading || !isDelayed) {
    return <AuthLoadingIndicator />;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
