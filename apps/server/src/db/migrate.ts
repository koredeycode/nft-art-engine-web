import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./index.js";
import { fileURLToPath } from "node:url";
import { logger } from "../lib/logger.js";
import { users } from "./schema.js";
import { eq } from "drizzle-orm";

export async function runMigrations(): Promise<void> {
  const migrationsFolder = fileURLToPath(
    new URL("../../drizzle", import.meta.url),
  );
  logger.info({ migrationsFolder }, "running database migrations");
  await migrate(db, { migrationsFolder });
  logger.info("migrations complete");

  const defaultUser = await db
    .select()
    .from(users)
    .where(eq(users.id, "default"))
    .get();

  if (!defaultUser) {
    const now = new Date();
    await db.insert(users).values({
      id: "default",
      email: "default@nft-engine.local",
      name: "Default User",
      createdAt: now,
      updatedAt: now,
    });
    logger.info("seeded default user");
  }
}
