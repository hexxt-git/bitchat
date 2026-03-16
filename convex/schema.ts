import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  chatMessage: defineTable({
    senderId: v.id("users"),
    content: v.optional(v.string()),
    room: v.id("rooms"),
    file: v.optional(v.id("_storage")),
    file_processed: v.boolean(),
  }).index("by_room", ["room"]),
  rooms: defineTable({
    name: v.string(),
    createdBy: v.optional(v.id("users")),
    public: v.optional(v.boolean()),
  }).index("by_name", ["name"]),
});
