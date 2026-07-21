import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./index.js";
import { fileURLToPath } from "node:url";
import { logger } from "../lib/logger.js";

export async function runMigrations(): Promise<void> {
  const migrationsFolder = fileURLToPath(
    new URL("../../drizzle", import.meta.url),
  );
  logger.info({ migrationsFolder }, "running database migrations");
  await migrate(db, { migrationsFolder });
  logger.info("migrations complete");
}
