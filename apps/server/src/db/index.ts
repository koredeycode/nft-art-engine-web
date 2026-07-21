import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import * as schema from "./schema.js";

const dbUrl = process.env.DATABASE_URL ?? "file:data/nft-engine.db";

const dbPath = dbUrl.replace(/^file:/, "");
mkdirSync(dirname(dbPath), { recursive: true });

const client = createClient({ url: dbUrl });

export const db = drizzle(client, { schema });
