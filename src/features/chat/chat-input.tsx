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
import { Send, Upload } from "pixelarticons/react";
import { Id } from "../../../convex/_generated/dataModel";

const pickFile = async () => {
  return new Promise<File | null>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      resolve(file);
    };
    input.click();
  });
};

export function ChatInput({ roomId }: { roomId: string }) {
  const sendMessage = useMutation({
    mutationFn: useConvexMutation(api.functions.chat.sendMessage),
  });
  const generateFileUploadUrl = useConvexMutation(
    api.functions.chat.generateFileUploadUrl,
  );
  const sendFile = useConvexMutation(api.functions.chat.sendFile);

  const uploadFile = useMutation({
    mutationFn: async (file: File) => {
      const url = await generateFileUploadUrl();
      if (!url) throw new Error("Failed to generate file upload URL");
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!response.ok) throw new Error("Failed to upload file");
      const result: { storageId: Id<"_storage"> } = await response.json();
      if (!result.storageId) throw new Error("Failed to get storage ID");
      await sendFile({ roomId, fileId: result.storageId });
    },
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

  const handleUpload = async () => {
    const file = await pickFile();
    if (!file) return;
    await uploadFile.mutateAsync(file);
  };

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
            <Button
              type="button"
              onClick={handleUpload}
              disabled={form.state.isSubmitting || uploadFile.isPending}
              className="border-2"
            >
              <Upload />
            </Button>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Button
              type="submit"
              disabled={form.state.isSubmitting || uploadFile.isPending}
              className="border-2"
            >
              {form.state.isSubmitting ? "Sending..." : "Send"}
              <Send />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  );
}
