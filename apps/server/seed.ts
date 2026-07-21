import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import { db } from "./src/db/index.js";
import {
  projects as projectsTable,
  layers as layersTable,
  elements as elementsTable,
} from "./src/db/schema.js";
import { eq } from "drizzle-orm";
import { runMigrations } from "./src/db/migrate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../..");

const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(PROJECT_ROOT, "apps/server/data/uploads");

const HASHLIPS_LAYERS = path.resolve(
  PROJECT_ROOT,
  "../hashlips_art_engine/layers",
);

const LAYER_ORDER = [
  "Background",
  "Eyeball",
  "Eye color",
  "Iris",
  "Shine",
  "Bottom lid",
  "Top lid",
];

async function main() {
  await runMigrations();

  const existing = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.name, "Hashlips Demo"))
    .get();

  if (existing) {
    console.log("Project already seeded. Skipping.");
    return;
  }

  const now = new Date();
  const projectId = crypto.randomUUID();

  await db.insert(projectsTable).values({
    id: projectId,
    userId: "default",
    name: "Hashlips Demo",
    network: "eth",
    namePrefix: "MyNFT",
    description: "Demo project seeded from the HashLips art engine example.",
    canvasWidth: 4096,
    canvasHeight: 4096,
    smoothing: true,
    rarityDelim: "#",
    dnaTolerance: 2,
    shuffleOrder: false,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created project: ${projectId}`);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  for (let orderIdx = 0; orderIdx < LAYER_ORDER.length; orderIdx++) {
    const layerName = LAYER_ORDER[orderIdx];
    const layerDir = path.join(HASHLIPS_LAYERS, layerName);

    if (!fs.existsSync(layerDir)) {
      console.warn(`  Layer directory not found: ${layerDir}`);
      continue;
    }

    const layerId = crypto.randomUUID();
    await db.insert(layersTable).values({
      id: layerId,
      projectId,
      name: layerName,
      order: orderIdx,
      blendMode: "source-over",
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  Layer: ${layerName} (${layerId})`);

    const files = fs
      .readdirSync(layerDir)
      .filter((f) => f.endsWith(".png") && !f.startsWith("."));

    for (const file of files) {
      const sourcePath = path.join(layerDir, file);
      const ext = path.extname(file);
      const base = path.basename(file, ext);
      const weightMatch = base.match(/#(\d+)$/);
      const weight = weightMatch ? parseInt(weightMatch[1], 10) : 1;
      const cleanBase = base.replace(/#\d+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");

      // Use layer prefix to keep filenames unique in flat uploads dir
      const sanitizedLayer = layerName.replace(/[^a-zA-Z0-9_-]/g, "_");
      const uploadFilename = `${sanitizedLayer}_${cleanBase}${ext}`;
      const destPath = path.join(UPLOADS_DIR, uploadFilename);
      fs.copyFileSync(sourcePath, destPath);

      await db.insert(elementsTable).values({
        id: crypto.randomUUID(),
        layerId,
        filename: uploadFilename,
        weight,
        createdAt: now,
      });
      console.log(`    Element: ${cleanBase} (weight=${weight})`);
    }
  }

  console.log("\nSeed complete!");
  console.log(`Project ID: ${projectId}`);
  console.log(`Uploads dir: ${UPLOADS_DIR}`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
