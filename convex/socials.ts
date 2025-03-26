import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('socials').collect();
  },
});

export const createRow = mutation({
  args: {
    followersCount: v.string(),
    platformName: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('socials', {
      followersCount: args.followersCount,
      platformName: args.platformName,
    });
  },
});
