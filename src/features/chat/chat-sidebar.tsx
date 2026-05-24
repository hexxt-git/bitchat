import { Link } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { Home, Logout } from "pixelarticons/react";
import { Button } from "../shared/components/ui/button";
import { ThemeToggle } from "../shared/components/theme-toggle";
import { ParticipantsList } from "./participants-list";

interface ChatSidebarProps {
  roomId: string;
  onNavigateHome?: () => void;
}

export function ChatSidebar({ roomId, onNavigateHome }: ChatSidebarProps) {
  const { signOut } = useAuthActions();

  return (
    <>
      <aside className="flex h-full flex-col min-h-0 border-l">
        <div className="relative z-10 p-2 flex flex-col gap-1.5 min-h-0 flex-1 overflow-y-auto">
          <ParticipantsList roomId={roomId} />
          <Button
            render={<Link to="/" />}
            variant="outline"
            nativeButton={false}
            onClick={onNavigateHome}
          >
            <Home />
            Back to rooms
          </Button>
          <div className="flex gap-1.5">
             <Button
               onClick={() => {
                 void signOut();
               }}
               className="flex-1 flex items-center gap-2 border-0"
             >
              <Logout />
              Sign out
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
