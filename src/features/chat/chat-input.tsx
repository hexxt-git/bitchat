import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../shared/components/ui/input-group";
import { Button } from "../shared/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import { Send } from "pixelarticons/react";

export function ChatInput({ roomId }: { roomId: string }) {
  const sendMessage = useMutation({
    mutationFn: useConvexMutation(api.functions.chat.sendMessage),
  });

  const form = useForm({
    defaultValues: {
      content: "",
    },
    onSubmit: async ({ value }) => {
      if (!value.content.trim()) return;
      await sendMessage.mutateAsync({ content: value.content.trim(), roomId });
      form.reset();
    },
  });

  return (
    <div className="lg:pb-8 lg:pt-4 lg:px-12 pb-4 pt-2 px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <InputGroup>
          <form.Field
            name="content"
            children={(field) => (
              <InputGroupInput
                placeholder="Send a message"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
          <InputGroupAddon align="inline-end">
            <Button type="submit" disabled={form.state.isSubmitting}>
              {form.state.isSubmitting ? "Sending..." : "Send"}
              <Send />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  );
}
