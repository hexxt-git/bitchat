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
import { useState } from "react";

const pickFile = async () => {
  return new Promise<File | null>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = false;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      resolve(file ?? null);
    };
    input.click();
  });
};

export function ChatInput({ roomId }: { roomId: string }) {
  const [queuedFile, setQueuedFile] = useState<File | null>(null);

  const sendMessage = useMutation({
    mutationFn: useConvexMutation(api.functions.chat.sendMessage),
  });
  const generateFileUploadUrl = useConvexMutation(
    api.functions.chat.generateFileUploadUrl,
  );

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
      return result.storageId;
    },
  });

  const form = useForm({
    defaultValues: {
      content: "",
    },
    onSubmit: async ({ value }) => {
      const content = value.content.trim();
      if (!content && !queuedFile) return;

      let fileId: Id<"_storage"> | undefined;
      if (queuedFile) {
        fileId = await uploadFile.mutateAsync(queuedFile);
      }

      await sendMessage.mutateAsync({
        roomId,
        content: content || undefined,
        fileId,
      });

      form.reset();
      setQueuedFile(null);
    },
  });

  const handleUpload = async () => {
    const file = await pickFile();
    if (!file) return;
    setQueuedFile(file);
  };

  const removeQueuedFile = () => {
    setQueuedFile(null);
  };

  const isSubmitting = form.state.isSubmitting || uploadFile.isPending;

  return (
    <div className="lg:pb-8 lg:pt-4 lg:px-12 pb-4 pt-2 px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {queuedFile && (
          <div className="mb-2 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded border-2 px-2 py-1 text-xs hover:bg-base-200"
              onClick={removeQueuedFile}
              title="Remove attachment"
            >
              {queuedFile.name}
            </button>
          </div>
        )}
        <InputGroup>
          <form.Field
            name="content"
            children={(field) => (
              <InputGroupInput
                placeholder="Send a message"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="min-w-32"
              />
            )}
          />
          <InputGroupAddon align="inline-end">
            <Button
              type="button"
              onClick={handleUpload}
              disabled={isSubmitting}
              className="border-2"
            >
              <Upload />
            </Button>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Button type="submit" disabled={isSubmitting} className="border-2">
              {isSubmitting ? "Sending..." : "Send"}
              <Send />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  );
}
