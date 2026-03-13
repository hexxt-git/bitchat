import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }
    return await ctx.db.get(userId);
  },
});
