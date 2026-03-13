import { createFileRoute, Link } from "@tanstack/react-router";
import { CreateRoomForm } from "@/features/chat/create-room-form";
import { Button } from "@/features/shared/components/ui/button";
import { Logout } from "pixelarticons/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { ThemeToggle } from "@/features/shared/components/theme-toggle";
import { AuthBackground } from "@/features/auth/auth-background";

export const Route = createFileRoute("/(_authenticated)/create-room")({
  component: CreateRoomPage,
});

function CreateRoomPage() {
  const { signOut } = useAuthActions();

  return (
    <div className="relative min-h-svh w-full">
      <AuthBackground />
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="outline"
          onClick={() => void signOut()}
          className="flex items-center gap-2"
        >
          <Logout className="size-4" />
          Sign out
        </Button>
      </div>
      <main className="relative z-10 h-svh flex flex-col items-center justify-center pt-16 pb-8 px-4">
        <div className="flex flex-col gap-8 w-full max-w-sm sm:max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-center">Bitchat</h1>
          <p className="text-center text-base-content/80">
            Create a new room to start chatting
          </p>
          <CreateRoomForm />
          <Button
            render={<Link to="/" />}
            variant="outline"
            nativeButton={false}
          >
            Back
          </Button>
        </div>
      </main>
    </div>
  );
}
