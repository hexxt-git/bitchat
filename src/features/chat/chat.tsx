import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { ParticipantsList } from "./participants-list";
import { useAuthActions } from "@convex-dev/auth/react";
import { Home, Logout } from "pixelarticons/react";
import { Button } from "../shared/components/ui/button";
import { ThemeToggle } from "../shared/components/theme-toggle";
import { api } from "../../../convex/_generated/api";

export function Chat({ roomId }: { roomId: string }) {
  const { signOut } = useAuthActions();
  const room = useQuery(convexQuery(api.functions.chat.getRoom, { roomId }));

  if (room.isLoading) {
    return (
      <div className="flex h-svh items-center justify-center">
        <p className="text-muted-foreground">Loading room…</p>
      </div>
    );
  }

  if (!room.data) {
    return (
      <div className="flex h-svh flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Room not found</p>
        <Button render={<Link to="/" />} nativeButton={false}>
          Back to rooms
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_auto] h-svh overflow-hidden min-w-0">
      <div className="flex flex-col min-w-0 min-h-0">
        <header className="shrink-0 px-4 py-2">
          <h1 className="text-xl font-bold">8-bit Chat</h1>
        </header>
        <MessageList roomId={roomId} />
        <ChatInput roomId={roomId} />
      </div>
      <div className="w-64 lg:w-86 border-s-2 p-2 flex-col flex gap-1.5">
        <ParticipantsList roomId={roomId} />
        <Button render={<Link to="/" />} variant="outline" nativeButton={false}>
          <Home />
          Back to rooms
        </Button>
        <div className="flex gap-1.5">
          <Button
            onClick={() => {
              signOut();
            }}
            className="flex-1 flex items-center gap-2 border-0"
          >
            <Logout />
            Sign out
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
