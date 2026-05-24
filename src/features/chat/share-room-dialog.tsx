import { useCallback, useState } from "react";
import { Button } from "../shared/components/ui/button";
import { Cancel } from "pixelarticons/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../shared/components/ui/input-group";

interface ShareRoomDialogProps {
  open: boolean;
  url: string;
  onClose: () => void;
}

export function ShareRoomDialog({ open, url, onClose }: ShareRoomDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [url]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 dark:bg-black/80 dark:backdrop-saturate-50"
      role="dialog"
      aria-modal="true"
      aria-label="Share room link"
    >
      <div className="bg-base-100 border-2 max-w-md w-full mx-4 p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold text-base">Share this room</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close share dialog"
          >
            <Cancel />
          </Button>
        </div>
        <p className="text-sm text-base-content/80">
          Copy the link below and share it with others to invite them to this
          room.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleCopyLink();
          }}
          className="flex flex-col gap-2"
        >
          <InputGroup>
            <InputGroupInput
              readOnly
              value={url}
              className="bg-base-100 text-xs break-all"
            />
            <InputGroupAddon align="inline-end">
              <Button type="submit">{copied ? "Copied!" : "Copy link"}</Button>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </div>
  );
}
