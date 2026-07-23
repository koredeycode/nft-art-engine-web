import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { Context } from "hono";
import { db } from "../db/index.js";
import { accounts, sessions, users, verifications } from "../db/schema.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: async (request) => {
    const origin = request?.headers.get("origin");
    const referer = request?.headers.get("referer");
    const origins = [
      "http://localhost:5173",
      "http://localhost:3001",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3001",
    ];
    if (origin) origins.push(origin);
    if (referer) {
      try {
        const u = new URL(referer);
        origins.push(u.origin);
      } catch {}
    }
    return origins;
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
