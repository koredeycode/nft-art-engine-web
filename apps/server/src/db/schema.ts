import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  network: text("network", { enum: ["eth", "sol"] }).default("eth"),
  namePrefix: text("name_prefix"),
  description: text("description"),
  baseUri: text("base_uri"),
  canvasWidth: integer("canvas_width").default(4096),
  canvasHeight: integer("canvas_height").default(4096),
  smoothing: integer("smoothing", { mode: "boolean" }).default(true),
  rarityDelim: text("rarity_delim").default("#"),
  dnaTolerance: integer("dna_tolerance").default(2),
  bgGenerate: integer("bg_generate", { mode: "boolean" }).default(false),
  bgBrightness: text("bg_brightness"),
  bgStatic: integer("bg_static", { mode: "boolean" }).default(false),
  bgDefault: text("bg_default"),
  shuffleOrder: integer("shuffle_order", { mode: "boolean" }).default(false),
  extraMetadata: text("extra_metadata", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const layers = sqliteTable("layers", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id),
  name: text("name").notNull(),
  order: integer("order").notNull(),
  blendMode: text("blend_mode").default("source-over"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const elements = sqliteTable("elements", {
  id: text("id").primaryKey(),
  layerId: text("layer_id")
    .notNull()
    .references(() => layers.id),
  filename: text("filename").notNull(),
  weight: integer("weight").default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const generationJobs = sqliteTable("generation_jobs", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id),
  status: text("status", {
    enum: ["queued", "running", "completed", "failed", "cancelled"],
  })
    .notNull()
    .default("queued"),
  totalEditions: integer("total_editions").notNull(),
  currentEdition: integer("current_edition").default(0),
  progress: real("progress").default(0),
  error: text("error"),
  startedAt: integer("started_at", { mode: "timestamp_ms" }),
  completedAt: integer("completed_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
