import { useEffect, useRef } from "react";
import { cn } from "../shared/lib/utils";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../convex/_generated/api";
import { Loader } from "pixelarticons/react";
import { motion, steps } from "motion/react";

type Message = {
  _id: string;
  _creationTime: number;
  senderEmail: string | null;
  senderName: string | null;
  content?: string;
  file?: string | null;
  file_processed?: boolean;
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
          {message.file &&
            (message.file_processed ? (
              <img
                src={message.file}
                alt="File"
                className="w-full max-w-xs aspect-3/2 object-cover grayscale-100"
              />
            ) : (
              <div className="relative overflow-hidden max-w-xs aspect-3/2 w-full">
                <img
                  src={message.file}
                  alt="File"
                  className="w-full max-w-xs aspect-3/2 object-cover"
                  style={{
                    filter: `grayscale(100%) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='b' filterUnits='userSpaceOnUse' primitiveUnits='userSpaceOnUse' x='0' y='0'%3E%3CfeFlood x='0' y='0' height='2' width='2'/%3E%3CfeComposite width='4' height='4'/%3E%3CfeTile result='a'/%3E%3CfeComposite in='SourceGraphic' in2='a' operator='in'/%3E%3CfeMorphology operator='dilate' radius='2'/%3E%3C/filter%3E%3C/svg%3E#b")`,
                    WebkitFilter: `grayscale(100%) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='b' filterUnits='userSpaceOnUse' primitiveUnits='userSpaceOnUse' x='0' y='0'%3E%3CfeFlood x='0' y='0' height='2' width='2'/%3E%3CfeComposite width='4' height='4'/%3E%3CfeTile result='a'/%3E%3CfeComposite in='SourceGraphic' in2='a' operator='in'/%3E%3CfeMorphology operator='dilate' radius='2'/%3E%3C/filter%3E%3C/svg%3E#b")`,
                  }}
                />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-100 p-2">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: steps(16),
                    }}
                  >
                    <Loader className="size-10" />
                  </motion.div>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
