import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { ParticipantsList } from "./participants-list";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "../shared/components/ui/button";
import { ThemeToggle } from "../shared/components/theme-toggle";

export function Chat() {
  const { signOut } = useAuthActions();

  return (
    <div className="grid grid-cols-[1fr_auto] h-svh overflow-hidden min-w-0">
      <div className="flex flex-col min-w-0 min-h-0">
        <header className="shrink-0 px-4 py-2">
          <h1 className="text-lg font-bold">8-bit Chat</h1>
        </header>
        <MessageList />
        <ChatInput />
      </div>
      <div className="w-64 lg:w-86 border-s-2 p-2 flex-col flex gap-4">
        <ParticipantsList />
        <div className="flex gap-2">
          <Button
            onClick={() => {
              signOut();
            }}
            className="flex-1 border-0"
          >
            Sign out
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
