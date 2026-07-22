import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { Context } from "hono";
import { db } from "../db/index.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
});

export async function getUserFromContext(c: Context) {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    if (session?.user) {
      return session.user;
    }
  } catch {
    // Ignore auth extraction error for unauthenticated requests
  }
  return null;
}
