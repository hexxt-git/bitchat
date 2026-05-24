import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { Button, FieldGroup, FormInput } from "@/features/shared/components/ui";
import { Message } from "pixelarticons/react";
import { api } from "../../../convex/_generated/api";

const joinRoomSchema = z.object({
  name: z
    .string()
    .min(1, "Room name is required")
    .max(50, "Room name must be at most 50 characters")
    .refine(
      (val) => /^[a-zA-Z0-9-_ ]+$/.test(val),
      "Room name can only contain letters, numbers, spaces, hyphens, and underscores",
    ),
});

export function JoinRoomForm() {
  const navigate = useNavigate();
  const [roomToJoin, setRoomToJoin] = useState<string | null>(null);

  const roomQuery = useQuery({
    ...convexQuery(api.functions.chat.getRoom, { roomId: roomToJoin ?? "" }),
    enabled: roomToJoin !== null,
  });

  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: joinRoomSchema,
    },
    onSubmit: async ({ value }: { value: { name: string } }) => {
      setRoomToJoin(value.name.trim());
    },
  });

   useEffect(() => {
     if (roomQuery.data && roomToJoin) {
       void navigate({ to: "/rooms/$room", params: { room: roomToJoin } });
     }
   }, [roomQuery.data, roomToJoin, navigate]);

  const showNotFoundError =
    roomToJoin &&
    roomQuery.isSuccess &&
    !roomQuery.isFetching &&
    !roomQuery.data;

  return (
    <form
      id="join-room-form"
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="name"
          children={(field) => (
            <FormInput
              field={field}
              label="Room name"
              type="text"
              placeholder="e.g. general"
              rightIcon={Message}
            />
          )}
        />
        <Button
          type="submit"
          form="join-room-form"
          disabled={
            form.state.isSubmitting ||
            (roomToJoin !== null && roomQuery.isFetching)
          }
        >
          {roomToJoin !== null && roomQuery.isFetching
            ? "Joining..."
            : "Join room"}
        </Button>
        {showNotFoundError && (
          <div className="bg-destructive-subtle border border-destructive-border p-2">
            <p className="text-destructive font-mono text-xs">
              Room not found. Check the name and try again.
            </p>
          </div>
        )}
      </FieldGroup>
    </form>
  );
}
