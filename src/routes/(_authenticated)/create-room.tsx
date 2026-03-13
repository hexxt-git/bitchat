import { createFileRoute, Link } from "@tanstack/react-router";
import { CreateRoomForm } from "@/features/chat/create-room-form";
import { Button } from "@/features/shared/components/ui/button";
import { Logout } from "pixelarticons/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { ThemeToggle } from "@/features/shared/components/theme-toggle";

export const Route = createFileRoute("/(_authenticated)/create-room")({
  component: CreateRoomPage,
});

function CreateRoomPage() {
  const { signOut } = useAuthActions();

  return (
    <main className="h-svh flex flex-col items-center justify-center">
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
      <div className="flex flex-col gap-8 w-96 mx-auto">
        <h1 className="text-4xl font-bold text-center">8-bit Chat</h1>
        <p className="text-center text-base-content/80">
          Create a new room to start chatting
        </p>
        <CreateRoomForm />
        <Button render={<Link to="/" />} variant="outline" nativeButton={false}>
          Back
        </Button>
      </div>
    </main>
  );
}
