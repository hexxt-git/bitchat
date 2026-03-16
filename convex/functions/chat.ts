import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "../_generated/api";

export const createRoom = mutation({
  args: {
    name: v.string(),
    public: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await getAuthUserId(ctx);
    const name = args.name.trim();
    if (!name) {
      throw new Error("Room name is required");
    }
    const existing = await ctx.db
      .query("rooms")
      .withIndex("by_name", (q) => q.eq("name", name))
      .first();
    if (existing) {
      return existing._id;
    }
    const userId = await getAuthUserId(ctx);
    return await ctx.db.insert("rooms", {
      name,
      createdBy: userId ?? undefined,
      public: args.public,
    });
  },
});

export const getRoom = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_name", (q) => q.eq("name", args.roomId))
      .first();
    if (!room) return null;
    const creator = room.createdBy
      ? await ctx.db.get("users", room.createdBy)
      : null;
    return {
      _id: room._id,
      name: room.name,
      createdBy: room.createdBy,
      creatorName: creator?.name || creator?.email || null,
    };
  },
});

export const sendMessage = mutation({
  args: {
    roomId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const senderId = await getAuthUserId(ctx);
    if (!senderId) {
      throw new Error("User not found");
    }
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_name", (q) => q.eq("name", args.roomId))
      .first();
    if (!room) {
      throw new Error("Room not found");
    }
    await ctx.db.insert("chatMessage", {
      senderId,
      content: args.content,
      room: room._id,
      file_processed: false,
    });
  },
});

export const generateFileUploadUrl = mutation({
  handler: async (ctx) => {
    const senderId = await getAuthUserId(ctx);
    if (!senderId) {
      throw new Error("User not found");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const sendFile = mutation({
  args: { roomId: v.string(), fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    const senderId = await getAuthUserId(ctx);
    if (!senderId) {
      throw new Error("User not found");
    }
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_name", (q) => q.eq("name", args.roomId))
      .first();
    if (!room) {
      throw new Error("Room not found");
    }
    const messageId = await ctx.db.insert("chatMessage", {
      senderId,
      room: room._id,
      file: args.fileId,
      file_processed: false,
    });

    await ctx.scheduler.runAfter(
      0,
      internal.functions.process_image.processImage,
      {
        messageId,
        originalStorageId: args.fileId,
      },
    );
  },
});

export const listMessages = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_name", (q) => q.eq("name", args.roomId))
      .first();
    if (!room) {
      throw new Error("Room not found");
    }
    const messages = await ctx.db
      .query("chatMessage")
      .withIndex("by_room", (q) => q.eq("room", room._id))
      .order("desc")
      .take(100);

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
      messages: await Promise.all(
        messages.map(async (message) => {
          const user = message.senderId ? userMap.get(message.senderId) : null;
          const file = message.file
            ? await ctx.storage.getUrl(message.file)
            : null;
          return {
            ...message,
            file: file ?? null,
            senderEmail: user?.email ?? null,
            senderName: user?.name ?? null,
          };
        }),
      ),
      users: Array.from(userMap),
    };
  },
});
