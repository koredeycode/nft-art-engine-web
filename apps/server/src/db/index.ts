import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";

const dbUrl = process.env.DATABASE_URL ?? "file:data/nft-engine.db";

const client = createClient({ url: dbUrl });

export const db = drizzle(client, { schema });
