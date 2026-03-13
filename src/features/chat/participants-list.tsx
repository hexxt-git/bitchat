import { useState, useEffect } from "react";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../convex/_generated/api";
import usePresence from "@convex-dev/presence/react";
import type { Id } from "../../../convex/_generated/dataModel";
import { formatTimeAgo } from "../shared/lib/utils";

const CHAT_ROOM_ID = "main-chat";

export function ParticipantsList() {
  const user = useQuery(convexQuery(api.functions.auth.getUser));

  return (
    <div className="space-y-1 flex-1 overflow-y-auto">
      <h2>Participants</h2>
      {user.data?._id && <ParticipantsListInner userId={user.data._id} />}
    </div>
  );
}

function ParticipantsListInner({ userId }: { userId: Id<"users"> }) {
  const [, setTick] = useState(0);
  const presenceState = usePresence(api.presence, CHAT_ROOM_ID, userId);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 5), 5000);
    return () => clearInterval(id);
  }, []);

  const participants = (presenceState ?? []).map((entry) => ({
    _id: entry.userId,
    email: "email" in entry ? String(entry.email ?? "") : "",
    name: entry.name ?? "Unknown",
    isOnline: entry.online,
    lastSeen: entry.lastDisconnected,
  }));

  return participants.map(({ _id, email, name, isOnline, lastSeen }) => (
    <div
      key={_id}
      className={`border-2 px-2 py-1 flex items-center gap-2 min-w-0 ${isOnline ? "" : "opacity-50"}`}
    >
      <span className="min-w-0 flex-1 truncate">
        {userId === _id && (
          <span className="text-accent scale-160 inline-block">*</span>
        )}
        {email || name || "Unknown"}
      </span>
      {!isOnline && lastSeen > 0 && (
        <span className="text-xs shrink-0">
          last seen {formatTimeAgo(lastSeen)}
        </span>
      )}
    </div>
  ));
}
