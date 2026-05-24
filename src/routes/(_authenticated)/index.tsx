import { createFileRoute, Link } from "@tanstack/react-router";
import { JoinRoomForm } from "@/features/chat/join-room-form";
import { Button } from "@/features/shared/components/ui/button";
import { Logout, Settings2 } from "pixelarticons/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { ThemeToggle } from "@/features/shared/components/theme-toggle";
import { AuthBackground } from "@/features/auth/auth-background";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/(_authenticated)/")({
  component: IndexPage,
});

function IndexPage() {
  const { signOut } = useAuthActions();
  const userQuery = useQuery(convexQuery(api.functions.auth.getUser));

  return (
    <div className="relative min-h-svh w-full">
      <AuthBackground />
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="outline"
          size="icon"
          render={<Link to="/settings" />}
          nativeButton={false}
          aria-label="Open settings"
        >
          <Settings2 />
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
          <h1 className="text-4xl font-bold text-center">BitChat</h1>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <p className="text-center text-base-content/80">
                Signed in as{" "}
                {userQuery.data?.name || userQuery.data?.email || "Loading..."},
                Enter a room name to join or create a new one
              </p>
              <JoinRoomForm />
            </div>
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-base-content/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-base-100 px-2 text-base-content/60">
                  or
                </span>
              </div>
            </div>
            <Button
              render={<Link to="/create-room" />}
              nativeButton={false}
              className="w-full"
            >
              Create a new room
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
