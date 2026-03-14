import { useEffect, useRef } from "react";
import { cn } from "../shared/lib/utils";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../convex/_generated/api";

type Message = {
  _id: string;
  _creationTime: number;
  senderEmail: string | null;
  senderName: string | null;
  content: string;
};

export function MessageList({ roomId }: { roomId: string }) {
  const user = useQuery(convexQuery(api.functions.auth.getUser));
  const messagesQuery = useQuery(
    convexQuery(api.functions.chat.listMessages, {
      roomId,
    }),
  );

  if (!user.data?._id) {
    return <div className="flex-1 min-h-0 min-w-0" />;
  }

  return (
    <MessageListInner
      ownerEmail={user.data.email ?? ""}
      messages={messagesQuery.data?.messages ?? []}
    />
  );
}

function MessageListInner({
  ownerEmail,
  messages,
}: {
  ownerEmail: string;
  messages: Message[];
}) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      ref={listRef}
      className="flex-1 flex flex-col-reverse gap-2 overflow-y-auto overflow-x-hidden min-w-0 p-2"
    >
      {messages.map((message) => (
        <div key={message._id} className="min-w-0 wrap-break-word">
          <span
            className={cn(
              "max-md:block max-md:text-xs -mb-1",
              message.senderEmail === ownerEmail
                ? "text-accent"
                : "text-base-content/70",
            )}
          >
            {message.senderName ?? message.senderEmail ?? "Unknown"}{" "}
            <span className="font-title text-xs max-md:text-[0.6rem]">
              ({new Date(message._creationTime).toLocaleTimeString()}):{" "}
            </span>
          </span>
          {message.content}
        </div>
      ))}
    </div>
  );
}
