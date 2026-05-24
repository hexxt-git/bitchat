import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import {
  Button,
  FieldGroup,
  FormInput,
  InputGroupAddon,
} from "@/features/shared/components/ui";
import { Attachment, Reload } from "pixelarticons/react";
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
  captcha: z
    .string()
    .min(1, "Captcha is required"),
});

export function CreateRoomForm() {
  const createRoom = useMutation(api.functions.chat.createRoom);
  const generateCaptcha = useMutation(api.functions.captcha.generateCaptcha);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [captchaId, setCaptchaId] = useState<string | null>(null);
  const [captchaImage, setCaptchaImage] = useState<string | null>(null);
  const [captchaLoading, setCaptchaLoading] = useState(true);

  useEffect(() => {
    generateCaptcha()
      .then((result) => {
        setCaptchaId(result.captchaId);
        setCaptchaImage(result.image);
      })
      .catch((err) => {
        setError(getErrorMessage(err));
      })
      .finally(() => {
        setCaptchaLoading(false);
      });
  }, []);

  const refreshCaptcha = () => {
    setCaptchaLoading(true);
    setCaptchaId(null);
    setCaptchaImage(null);
    generateCaptcha()
      .then((result) => {
        setCaptchaId(result.captchaId);
        setCaptchaImage(result.image);
        setError(null);
      })
      .catch((err) => {
        setError(getErrorMessage(err));
      })
      .finally(() => {
        setCaptchaLoading(false);
      });
  };

  const form = useForm({
    defaultValues: {
      name: "",
      captcha: "",
    },
    validators: {
      onSubmit: createRoomSchema,
    },
    onSubmit: async ({ value }: { value: { name: string; captcha: string } }) => {
      if (!captchaId) {
        setError("Captcha not loaded. Please refresh.");
        return;
      }
      setError(null);
      try {
        await createRoom({
          name: value.name.trim(),
          captchaId: captchaId as any,
          captchaAnswer: value.captcha.trim(),
        });
        navigate({ to: "/rooms/$room", params: { room: value.name.trim() } });
      } catch (err) {
        setError(getErrorMessage(err));
        refreshCaptcha();
        form.setFieldValue("captcha", "");
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
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Verify you are human</span>
          {captchaLoading ? (
            <div className="h-20 w-full border-2 border-foreground bg-base-100 flex items-center justify-center">
              <span className="text-sm text-base-content/50">Loading captcha...</span>
            </div>
          ) : captchaImage ? (
            <div className="flex items-center gap-2">
              <img
                src={captchaImage}
                alt="Captcha"
                className="h-20 w-auto border-2 border-foreground bg-white pixelated"
                style={{ imageRendering: "pixelated" }}
              />
              <Button type="button" size="icon" variant="outline" onClick={refreshCaptcha}>
                <Reload />
                <span className="sr-only">Refresh captcha</span>
              </Button>
            </div>
          ) : null}
          <form.Field
            name="captcha"
            children={(field) => (
              <FormInput
                field={field}
                label="Enter the text shown above"
                type="text"
                placeholder="e.g. A7K2M"
                autoComplete="off"
              />
            )}
          />
        </div>
        <Button
          type="submit"
          form="create-room-form"
          disabled={form.state.isSubmitting || captchaLoading || !captchaId}
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
