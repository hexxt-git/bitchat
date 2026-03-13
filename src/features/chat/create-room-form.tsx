import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import {
  Button,
  FieldGroup,
  FormInput,
  InputGroupAddon,
} from "@/features/shared/components/ui";
import { Attachment } from "pixelarticons/react";
import { getErrorMessage } from "@/features/shared/lib/utils";

const createRoomSchema = z.object({
  name: z
    .string()
    .min(1, "Room name is required")
    .max(50, "Room name must be at most 50 characters")
    .refine(
      (val) => /^[a-zA-Z0-9-_ ]+$/.test(val),
      "Room name can only contain letters, numbers, spaces, hyphens, and underscores",
    ),
});

export function CreateRoomForm() {
  const createRoom = useMutation(api.functions.chat.createRoom);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: createRoomSchema,
    },
    onSubmit: async ({ value }: { value: { name: string } }) => {
      setError(null);
      try {
        await createRoom({ name: value.name.trim() });
        navigate({ to: "/rooms/$room", params: { room: value.name.trim() } });
      } catch (err) {
        setError(getErrorMessage(err));
      }
    },
  });

  const handleRandomize = () => {
    form.setFieldValue("name", Math.floor(Math.random() * 1e16).toString(36));
  };

  return (
    <form
      id="create-room-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
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
              addons={
                <InputGroupAddon align="inline-end">
                  <Button size="icon" onClick={handleRandomize}>
                    <Attachment />
                    <span className="sr-only">Randomize</span>
                  </Button>
                </InputGroupAddon>
              }
            />
          )}
        />
        <Button
          type="submit"
          form="create-room-form"
          disabled={form.state.isSubmitting}
        >
          {form.state.isSubmitting ? "Creating..." : "Create room"}
        </Button>
        {error && (
          <div className="bg-destructive-subtle border border-destructive-border p-2">
            <p className="text-destructive font-mono text-xs">Error: {error}</p>
          </div>
        )}
      </FieldGroup>
    </form>
  );
}
