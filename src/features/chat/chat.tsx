import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { Menu, Cancel, UserPlus } from "pixelarticons/react";
import { Button } from "../shared/components/ui/button";
import { api } from "../../../convex/_generated/api";
import { ChatSidebar } from "./chat-sidebar";
import { ShareRoomDialog } from "./share-room-dialog";

export function Chat({ roomId }: { roomId: string }) {
  const room = useQuery(convexQuery(api.functions.chat.getRoom, { roomId }));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  if (room.isLoading) {
    return (
      <div className="flex h-svh items-center justify-center">
        <p className="text-muted-foreground">Loading room…</p>
      </div>
    );
  }

  if (!room.data) {
    return (
      <div className="flex h-svh flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground">Room not found</p>
        <Button render={<Link to="/" />} nativeButton={false}>
          Back to rooms
        </Button>
      </div>
    );
  }

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : roomId;

  return (
    <div className="flex h-svh overflow-hidden min-w-0 relative">
      {/* Main chat area */}
      <div className="flex flex-col min-w-0 min-h-0 flex-1">
        <header className="shrink-0 px-4 py-2 flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold flex-1">BitChat</h1>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShareOpen(true)}
              aria-label="Share room"
            >
              <UserPlus className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open room list"
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </header>
        <MessageList roomId={roomId} />
        <ChatInput roomId={roomId} />
      </div>

      {/* Desktop sidebar - always visible */}
      <div className="hidden lg:flex shrink-0 w-64 xl:w-80 border-s-2 flex-col h-full relative">
        <ChatSidebar roomId={roomId} />
      </div>

      {/* Mobile sidebar - overlay when toggled */}
      {sidebarOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/20 dark:bg-black/80 dark:backdrop-saturate-50 z-40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="lg:hidden fixed top-0 right-0 h-full w-[280px] max-w-[85vw] bg-base-100 border-l-2 z-50 flex flex-col shadow-lg"
            role="dialog"
            aria-label="Room list and participants"
          >
            <div className="shrink-0 p-2 flex items-center justify-between">
              <span className="font-semibold">Room & participants</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close"
              >
                <Cancel className="size-5" />
              </Button>
            </div>
            <div className="flex-1 min-h-0">
              <ChatSidebar
                roomId={roomId}
                onNavigateHome={() => setSidebarOpen(false)}
              />
            </div>
          </aside>
        </>
      )}
      <ShareRoomDialog
        open={shareOpen}
        url={shareUrl}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}
