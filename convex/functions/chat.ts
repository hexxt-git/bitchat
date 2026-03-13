import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const sendMessage = mutation({
  args: {
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const senderId = await getAuthUserId(ctx);
    if (!senderId) {
      throw new Error("User not found");
    }
    await ctx.db.insert("chatMessage", {
      senderId,
      content: args.content,
    });
  },
});

export const listMessages = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }
    const messages = await ctx.db.query("chatMessage").order("desc").take(100);

    // Batch user lookups: fetch each unique sender once instead of per-message
    const senderIds = [
      ...new Set(messages.map((m) => m.senderId).filter(Boolean)),
    ];
    const userMap = new Map(
      await Promise.all(
        senderIds.map(async (id) => {
          const user = await ctx.db.get("users", id);
          return [id, user] as const;
        }),
      ),
    );

    return {
      messages: messages.map((message) => {
        const user = message.senderId ? userMap.get(message.senderId) : null;
        return {
          ...message,
          senderEmail: user?.email ?? null,
          senderName: user?.name ?? null,
        };
      }),
      users: Array.from(userMap),
    };
  },
});
