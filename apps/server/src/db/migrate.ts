import { fileURLToPath } from "node:url";
import { eq, or } from "drizzle-orm";
import { migrate } from "drizzle-orm/libsql/migrator";
import { auth } from "../lib/auth.js";
import { logger } from "../lib/logger.js";
import { db } from "./index.js";
import { projects, users } from "./schema.js";

export async function runMigrations(): Promise<void> {
  const migrationsFolder = fileURLToPath(new URL("../../drizzle", import.meta.url));
  logger.info({ migrationsFolder }, "running database migrations");
  await migrate(db, { migrationsFolder });
  logger.info("migrations complete");

  // Ensure demo@mintrix.xyz exists with password123
  let demoUser = await db.select().from(users).where(eq(users.email, "demo@mintrix.xyz")).get();

  if (!demoUser) {
    try {
      await auth.api.signUpEmail({
        body: {
          email: "demo@mintrix.xyz",
          password: "password123",
          name: "Mintrix Demo",
        },
      });
      logger.info("Created demo@mintrix.xyz user account");
      demoUser = await db.select().from(users).where(eq(users.email, "demo@mintrix.xyz")).get();
    } catch (err) {
      logger.error({ err }, "Failed to create demo@mintrix.xyz user");
    }
  }

  if (demoUser) {
    // Re-assign default/unassigned projects to demo@mintrix.xyz
    await db
      .update(projects)
      .set({ userId: demoUser.id })
      .where(or(eq(projects.userId, "default"), eq(projects.userId, "")))
      .run();
    logger.info({ demoUserId: demoUser.id }, "Linked unassigned collections to demo@mintrix.xyz");
  }
}

