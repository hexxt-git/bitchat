import { v } from "convex/values";
import { internalAction, internalMutation } from "../_generated/server";
import Replicate from "replicate";
import { internal } from "../_generated/api";

export const processImage = internalAction({
  args: {
    messageId: v.id("chatMessage"),
    originalStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    try {
      const originalUrl = await ctx.storage.getUrl(args.originalStorageId);
      if (!originalUrl) {
        throw new Error("Could not resolve original image URL");
      }

      console.log("originalUrl", originalUrl);

      const replicateApiKey = process.env.REPLICATE_API_KEY;

      if (!replicateApiKey) {
        throw new Error("REPLICATE_API_KEY is not set");
      }

      const replicate = new Replicate({ auth: replicateApiKey });

      const input = {
        prompt:
          "redraw this image with an 8-bit pixel art style with an exactly 128x86 canvas that is 3:2 aspect ratio. use only black and white with dithering and stylize the content to match the style.",
        input_images: [originalUrl],
        quality: "low",
        output_format: "webp",
        number_of_images: 1,
        aspect_ratio: "3:2",
        output_compression: 90,
      };

      const output = (await replicate.run("openai/gpt-image-1.5", {
        input,
      })) as unknown as { url?: () => string }[];

      const generatedUrl = output?.[0]?.url?.();
      if (!generatedUrl) {
        throw new Error("Replicate did not return an output URL");
      }

      console.log("generatedUrl", generatedUrl);

      const resp = await fetch(generatedUrl);
      if (!resp.ok)
        throw new Error(`Failed to download generated image: ${resp.status}`);
      const blob = await resp.blob();

      const uploadUrl = await ctx.storage.generateUploadUrl();
      const uploadResp = await fetch(uploadUrl, {
        method: "POST",
        body: blob,
      });

      if (!uploadResp.ok)
        throw new Error("Failed to upload generated image to storage");

      const uploadJson = await uploadResp.json();
      const newStorageId = uploadJson.storageId;
      if (!newStorageId) throw new Error("Upload did not return storageId");

      await ctx.runMutation(
        internal.functions.process_image.replaceMessageFile,
        {
          messageId: args.messageId,
          storageId: newStorageId,
        },
      );
    } catch (err) {
      console.error("Image processing failed, showing original:", err);
      await ctx.runMutation(
        internal.functions.process_image.markFileProcessed,
        { messageId: args.messageId },
      );
    }

    return null;
  },
});

export const replaceMessageFile = internalMutation({
  args: {
    messageId: v.id("chatMessage"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch("chatMessage", args.messageId, {
      file: args.storageId,
      file_processed: true,
    });
    return null;
  },
});

export const markFileProcessed = internalMutation({
  args: {
    messageId: v.id("chatMessage"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch("chatMessage", args.messageId, {
      file_processed: true,
    });
    return null;
  },
});
