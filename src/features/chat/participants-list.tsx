import { useState, useEffect } from "react";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../convex/_generated/api";
import usePresence from "@convex-dev/presence/react";
import type { Id } from "../../../convex/_generated/dataModel";
import { cn, formatTimeAgo } from "../shared/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../shared/components/ui/tooltip";
import { InfoBox } from "pixelarticons/react";

export function ParticipantsList({ roomId }: { roomId: string }) {
  const user = useQuery(convexQuery(api.functions.auth.getUser));
  const room = useQuery(convexQuery(api.functions.chat.getRoom, { roomId }));
  const creatorName = room.data?.creatorName;

  return (
    <div className="space-y-1 flex-1 overflow-y-auto">
      <h2 className="flex items-center gap-1.5 capitalize">
        {room.data?.name}
        <Tooltip>
          <TooltipTrigger
            className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-muted text-muted-foreground cursor-help text-xs font-medium border-0 p-0 min-w-0"
            aria-label={
              creatorName ? `Created by ${creatorName}` : "Creator unknown"
            }
          >
            <InfoBox />
          </TooltipTrigger>
          <TooltipContent>
            {creatorName ? `Created by ${creatorName}` : "Creator unknown"}
          </TooltipContent>
        </Tooltip>
      </h2>
      {user.data?._id && (
        <ParticipantsListInner userId={user.data._id} roomId={roomId} />
      )}
    </div>
  );
}

function ParticipantsListInner({
  userId,
  roomId,
}: {
  userId: Id<"users">;
  roomId: string;
}) {
  const [, setTick] = useState(0);
  const presenceState = usePresence(api.presence, roomId, userId);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 5), 5000);
    return () => clearInterval(id);
  }, []);

   const participants = (presenceState ?? []).map((entry) => {
     const extended = entry as unknown as Record<string, unknown>;
     return {
       _id: entry.userId,
       email: typeof extended.email === "string" ? extended.email : "",
       name: entry.name ?? "Unknown",
       isOnline: entry.online,
       lastSeen: entry.lastDisconnected,
     };
   });

  return participants.map(({ _id, email, name, isOnline, lastSeen }) => {
    const displayName = email || name || "Unknown";

    return (
      <div
        key={_id}
        className={cn(
          "border-2 px-2 py-1 flex items-center gap-2 min-w-0",
          isOnline ? "" : "opacity-50",
        )}
      >
        <span className="min-w-0 flex-1 truncate">
          {userId === _id && <span className="text-xs text-accent">&gt; </span>}
          {displayName}
        </span>
        {!isOnline && lastSeen > 0 && (
          <span className="text-xs shrink-0">
            last seen {formatTimeAgo(lastSeen)}
          </span>
        )}
      </div>
    );
  });
}
