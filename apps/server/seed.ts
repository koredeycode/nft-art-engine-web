import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { eq } from "drizzle-orm";
import { generateArcadeRacersArt } from "./src/db/arcade-racers-art.js";
import { generateClassroomDoodlesArt } from "./src/db/classroom-doodles-art.js";
import { generateCryptoPetsArt } from "./src/db/crypto-pets-art.js";
import { generateCyberpunkArt } from "./src/db/cyberpunk-art.js";
import { generateFantasyQuestArt } from "./src/db/fantasy-quest-art.js";
import { generateGlassBadgesArt } from "./src/db/glass-badges-art.js";
import { db } from "./src/db/index.js";
import { generateKawaiiEatsArt } from "./src/db/kawaii-eats-art.js";
import { generateMechaTitansArt } from "./src/db/mecha-titans-art.js";
import { runMigrations } from "./src/db/migrate.js";
import { generateNotebookDoodlesArt } from "./src/db/notebook-doodles-art.js";
import { generateSacredGeometryArt } from "./src/db/sacred-geometry-art.js";
import {
  elements as elementsTable,
  layers as layersTable,
  projects as projectsTable,
} from "./src/db/schema.js";
import { generateSpaceExplorersArt } from "./src/db/space-explorers-art.js";
import { generateSteampunkArt } from "./src/db/steampunk-art.js";
import { generateSynthwaveCardsArt } from "./src/db/synthwave-cards-art.js";
import { generateVectorAvatarsArt } from "./src/db/vector-avatars-art.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../..");

const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(PROJECT_ROOT, "apps/server/data/uploads");

const HASHLIPS_LAYERS = path.resolve(PROJECT_ROOT, "../hashlips_art_engine/layers");

const HASHLIPS_LAYER_ORDER = [
  "Background",
  "Eyeball",
  "Eye color",
  "Iris",
  "Shine",
  "Bottom lid",
  "Top lid",
];

async function seedHashlipsDemo() {
  const existing = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.name, "Hashlips Demo"))
    .get();

  if (existing) {
    console.log("Project 'Hashlips Demo' already seeded. Skipping.");
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
    dnaTolerance: 10000,
    shuffleOrder: false,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created project: Hashlips Demo (${projectId})`);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  for (let orderIdx = 0; orderIdx < HASHLIPS_LAYER_ORDER.length; orderIdx++) {
    const layerName = HASHLIPS_LAYER_ORDER[orderIdx];
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

    const files = fs.readdirSync(layerDir).filter((f) => f.endsWith(".png") && !f.startsWith("."));

    for (const file of files) {
      const sourcePath = path.join(layerDir, file);
      const ext = path.extname(file);
      const base = path.basename(file, ext);
      const weightMatch = base.match(/#(\d+)$/);
      const weight = weightMatch ? Number.parseInt(weightMatch[1], 10) : 1;
      const cleanBase = base.replace(/#\d+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");

      const sanitizedLayer = layerName.replace(/[^a-zA-Z0-9_-]/g, "_");
      const uploadFilename = `hashlips_${sanitizedLayer}_${cleanBase}${ext}`;
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
}

async function seedCyberpunkDemo() {
  const existing = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.name, "Cyberpunk Pixel Avatars"))
    .get();

  if (existing) {
    console.log("Project 'Cyberpunk Pixel Avatars' already seeded. Skipping.");
    return;
  }

  const now = new Date();
  const projectId = crypto.randomUUID();

  await db.insert(projectsTable).values({
    id: projectId,
    userId: "default",
    name: "Cyberpunk Pixel Avatars",
    network: "sol",
    namePrefix: "CyberPunk",
    description:
      "Retro 8-bit Cyberpunk avatar collection featuring distinct pixel art layers, visors, accessories, and holographic overlays.",
    canvasWidth: 1000,
    canvasHeight: 1000,
    smoothing: false,
    rarityDelim: "#",
    dnaTolerance: 10000,
    shuffleOrder: false,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created project: Cyberpunk Pixel Avatars (${projectId})`);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  console.log("  Rendering Cyberpunk pixel art layer PNG elements...");
  const elements = generateCyberpunkArt(UPLOADS_DIR);

  const layerNames = [
    "Background",
    "Base Body",
    "Eyes & Visors",
    "Mouth & Accessories",
    "Headwear",
    "Overlays & FX",
  ];

  for (let orderIdx = 0; orderIdx < layerNames.length; orderIdx++) {
    const layerName = layerNames[orderIdx];
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

    const layerElements = elements.filter((e) => e.layerName === layerName);

    for (const elem of layerElements) {
      await db.insert(elementsTable).values({
        id: crypto.randomUUID(),
        layerId,
        filename: elem.filename,
        weight: elem.weight,
        createdAt: now,
      });
    }
  }
}

async function seedSpaceExplorersDemo() {
  const existing = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.name, "Galactic Space Explorers"))
    .get();

  if (existing) {
    console.log("Project 'Galactic Space Explorers' already seeded. Skipping.");
    return;
  }

  const now = new Date();
  const projectId = crypto.randomUUID();

  await db.insert(projectsTable).values({
    id: projectId,
    userId: "default",
    name: "Galactic Space Explorers",
    network: "eth",
    namePrefix: "Astro",
    description:
      "Retro 8-bit space exploration collection featuring pixel cosmic nebula backgrounds, space suits, alien lifeforms, helmet visors, and orbital beacons.",
    canvasWidth: 1000,
    canvasHeight: 1000,
    smoothing: false,
    rarityDelim: "#",
    dnaTolerance: 10000,
    shuffleOrder: false,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created project: Galactic Space Explorers (${projectId})`);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  console.log("  Rendering Space Explorers pixel art layer PNG elements...");
  const elements = generateSpaceExplorersArt(UPLOADS_DIR);

  const layerNames = [
    "Background",
    "Suit Body",
    "Face & Alien Head",
    "Helmet & Visor",
    "Space Gear & Props",
    "Cosmic Aura & FX",
  ];

  for (let orderIdx = 0; orderIdx < layerNames.length; orderIdx++) {
    const layerName = layerNames[orderIdx];
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

    const layerElements = elements.filter((e) => e.layerName === layerName);

    for (const elem of layerElements) {
      await db.insert(elementsTable).values({
        id: crypto.randomUUID(),
        layerId,
        filename: elem.filename,
        weight: elem.weight,
        createdAt: now,
      });
    }
  }
}

async function seedFantasyQuestDemo() {
  const existing = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.name, "Pixel Fantasy Quest"))
    .get();

  if (existing) {
    console.log("Project 'Pixel Fantasy Quest' already seeded. Skipping.");
    return;
  }

  const now = new Date();
  const projectId = crypto.randomUUID();

  await db.insert(projectsTable).values({
    id: projectId,
    userId: "default",
    name: "Pixel Fantasy Quest",
    network: "sol",
    namePrefix: "Hero",
    description:
      "Charming 8-bit RPG pixel heroes featuring retro dungeon backgrounds, character classes, enchanted weapons, mythical headwear, and magic spells.",
    canvasWidth: 1000,
    canvasHeight: 1000,
    smoothing: false,
    rarityDelim: "#",
    dnaTolerance: 10000,
    shuffleOrder: false,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created project: Pixel Fantasy Quest (${projectId})`);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  console.log("  Rendering Fantasy Quest pixel art layer PNG elements...");
  const elements = generateFantasyQuestArt(UPLOADS_DIR);

  const layerNames = [
    "Background",
    "Hero Armor & Clothing",
    "Head & Face",
    "Weapons & Magic",
    "Headwear & Crown",
    "Enchantment FX",
  ];

  for (let orderIdx = 0; orderIdx < layerNames.length; orderIdx++) {
    const layerName = layerNames[orderIdx];
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

    const layerElements = elements.filter((e) => e.layerName === layerName);

    for (const elem of layerElements) {
      await db.insert(elementsTable).values({
        id: crypto.randomUUID(),
        layerId,
        filename: elem.filename,
        weight: elem.weight,
        createdAt: now,
      });
    }
  }
}

async function seedCryptoPetsDemo() {
  const existing = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.name, "Pixel Crypto Pets"))
    .get();

  if (existing) {
    console.log("Project 'Pixel Crypto Pets' already seeded. Skipping.");
    return;
  }

  const now = new Date();
  const projectId = crypto.randomUUID();

  await db.insert(projectsTable).values({
    id: projectId,
    userId: "default",
    name: "Pixel Crypto Pets",
    network: "eth",
    namePrefix: "Pet",
    description:
      "Cute 8-bit handheld pixel creatures with vibrant pastel & neon environments, expressions, outfits, and headgear.",
    canvasWidth: 1000,
    canvasHeight: 1000,
    smoothing: false,
    rarityDelim: "#",
    dnaTolerance: 10000,
    shuffleOrder: false,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created project: Pixel Crypto Pets (${projectId})`);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  console.log("  Rendering Crypto Pets pixel art layer PNG elements...");
  const elements = generateCryptoPetsArt(UPLOADS_DIR);

  const layerNames = [
    "Environment",
    "Creature Body",
    "Expression & Eyes",
    "Accessories & Outfits",
    "Headgear",
    "Emanation FX",
  ];

  for (let orderIdx = 0; orderIdx < layerNames.length; orderIdx++) {
    const layerName = layerNames[orderIdx];
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

    const layerElements = elements.filter((e) => e.layerName === layerName);

    for (const elem of layerElements) {
      await db.insert(elementsTable).values({
        id: crypto.randomUUID(),
        layerId,
        filename: elem.filename,
        weight: elem.weight,
        createdAt: now,
      });
    }
  }
}

async function seedArcadeRacersDemo() {
  const existing = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.name, "8-Bit Arcade Racers"))
    .get();

  if (existing) {
    console.log("Project '8-Bit Arcade Racers' already seeded. Skipping.");
    return;
  }

  const now = new Date();
  const projectId = crypto.randomUUID();

  await db.insert(projectsTable).values({
    id: projectId,
    userId: "default",
    name: "8-Bit Arcade Racers",
    network: "base",
    namePrefix: "Racer",
    description:
      "High-octane 80s arcade pixel vehicles viewed from a rear perspective with glowing neon underglow and turbo spoilers.",
    canvasWidth: 1000,
    canvasHeight: 1000,
    smoothing: false,
    rarityDelim: "#",
    dnaTolerance: 10000,
    shuffleOrder: false,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created project: 8-Bit Arcade Racers (${projectId})`);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  console.log("  Rendering Arcade Racers pixel art layer PNG elements...");
  const elements = generateArcadeRacersArt(UPLOADS_DIR);

  const layerNames = [
    "Track & Horizon",
    "Car Chassis",
    "Paint Job & Livery",
    "Wheels & Rims",
    "Spoilers & Turbos",
    "Atmospheric FX",
  ];

  for (let orderIdx = 0; orderIdx < layerNames.length; orderIdx++) {
    const layerName = layerNames[orderIdx];
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

    const layerElements = elements.filter((e) => e.layerName === layerName);

    for (const elem of layerElements) {
      await db.insert(elementsTable).values({
        id: crypto.randomUUID(),
        layerId,
        filename: elem.filename,
        weight: elem.weight,
        createdAt: now,
      });
    }
  }
}

async function seedMechaTitansDemo() {
  const existing = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.name, "Pixel Mecha Titans"))
    .get();

  if (existing) {
    console.log("Project 'Pixel Mecha Titans' already seeded. Skipping.");
    return;
  }

  const now = new Date();
  const projectId = crypto.randomUUID();

  await db.insert(projectsTable).values({
    id: projectId,
    userId: "default",
    name: "Pixel Mecha Titans",
    network: "polygon",
    namePrefix: "Mecha",
    description:
      "Modular 8-bit battle mechs featuring heavy armor frames, optic visors, beam weaponry, and wing thrusters.",
    canvasWidth: 1000,
    canvasHeight: 1000,
    smoothing: false,
    rarityDelim: "#",
    dnaTolerance: 10000,
    shuffleOrder: false,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created project: Pixel Mecha Titans (${projectId})`);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  console.log("  Rendering Mecha Titans pixel art layer PNG elements...");
  const elements = generateMechaTitansArt(UPLOADS_DIR);

  const layerNames = [
    "Hangar & Battlefield",
    "Frame & Armor",
    "Faceplate & Optics",
    "Weapons & Shields",
    "Backpack & Wings",
    "Energy Shield FX",
  ];

  for (let orderIdx = 0; orderIdx < layerNames.length; orderIdx++) {
    const layerName = layerNames[orderIdx];
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

    const layerElements = elements.filter((e) => e.layerName === layerName);

    for (const elem of layerElements) {
      await db.insert(elementsTable).values({
        id: crypto.randomUUID(),
        layerId,
        filename: elem.filename,
        weight: elem.weight,
        createdAt: now,
      });
    }
  }
}

async function seedSteampunkDemo() {
  const existing = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.name, "Pixel Steampunk Inventors"))
    .get();

  if (existing) {
    console.log("Project 'Pixel Steampunk Inventors' already seeded. Skipping.");
    return;
  }

  const now = new Date();
  const projectId = crypto.randomUUID();

  await db.insert(projectsTable).values({
    id: projectId,
    userId: "default",
    name: "Pixel Steampunk Inventors",
    network: "eth",
    namePrefix: "Inventor",
    description:
      "Retro-futuristic Victorian steampunk collection with brass gears, leather goggles, copper pipes, and clockwork gadgets.",
    canvasWidth: 1000,
    canvasHeight: 1000,
    smoothing: false,
    rarityDelim: "#",
    dnaTolerance: 10000,
    shuffleOrder: false,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created project: Pixel Steampunk Inventors (${projectId})`);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  console.log("  Rendering Steampunk pixel art layer PNG elements...");
  const elements = generateSteampunkArt(UPLOADS_DIR);

  const layerNames = [
    "Backdrop",
    "Attire & Coat",
    "Face & Goggles",
    "Gizmos & Props",
    "Hats & Gear",
    "Atmospheric FX",
  ];

  for (let orderIdx = 0; orderIdx < layerNames.length; orderIdx++) {
    const layerName = layerNames[orderIdx];
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

    const layerElements = elements.filter((e) => e.layerName === layerName);

    for (const elem of layerElements) {
      await db.insert(elementsTable).values({
        id: crypto.randomUUID(),
        layerId,
        filename: elem.filename,
        weight: elem.weight,
        createdAt: now,
      });
    }
  }
}

async function seedKawaiiEatsDemo() {
  const existing = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.name, "Kawaii Boba & Street Eats"))
    .get();

  if (existing) {
    console.log("Project 'Kawaii Boba & Street Eats' already seeded. Skipping.");
    return;
  }

  const now = new Date();
  const projectId = crypto.randomUUID();

  await db.insert(projectsTable).values({
    id: projectId,
    userId: "default",
    name: "Kawaii Boba & Street Eats",
    network: "sol",
    namePrefix: "Boba",
    description:
      "Adorable 8-bit food & drink avatars featuring Boba Tea cups, Ramen bowls, sushi, toppings, and kawaii expressions.",
    canvasWidth: 1000,
    canvasHeight: 1000,
    smoothing: false,
    rarityDelim: "#",
    dnaTolerance: 10000,
    shuffleOrder: false,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created project: Kawaii Boba & Street Eats (${projectId})`);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  console.log("  Rendering Kawaii Eats pixel art layer PNG elements...");
  const elements = generateKawaiiEatsArt(UPLOADS_DIR);

  const layerNames = [
    "Diner / Kitchen Backdrop",
    "Food Base / Cup",
    "Main Flavor / Filling",
    "Toppings & Fillings",
    "Face & Expression",
    "Garnish & Sparkles",
  ];

  for (let orderIdx = 0; orderIdx < layerNames.length; orderIdx++) {
    const layerName = layerNames[orderIdx];
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

    const layerElements = elements.filter((e) => e.layerName === layerName);

    for (const elem of layerElements) {
      await db.insert(elementsTable).values({
        id: crypto.randomUUID(),
        layerId,
        filename: elem.filename,
        weight: elem.weight,
        createdAt: now,
      });
    }
  }
}

async function seedGlassBadgesDemo() {
  const existing = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.name, "3D Glassmorphic Badges"))
    .get();

  if (existing) {
    console.log("Project '3D Glassmorphic Badges' already seeded. Skipping.");
    return;
  }

  const now = new Date();
  const projectId = crypto.randomUUID();

  await db.insert(projectsTable).values({
    id: projectId,
    userId: "default",
    name: "3D Glassmorphic Badges",
    network: "polygon",
    namePrefix: "Badge",
    description:
      "Sleek 3D translucent frosted glass cards with metallic bezels, floating emblems, and neon rim lighting.",
    canvasWidth: 1000,
    canvasHeight: 1000,
    smoothing: true,
    rarityDelim: "#",
    dnaTolerance: 10000,
    shuffleOrder: false,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created project: 3D Glassmorphic Badges (${projectId})`);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  console.log("  Rendering Glass Badges vector PNG elements...");
  const elements = generateGlassBadgesArt(UPLOADS_DIR);

  const layerNames = [
    "Card Glass Base",
    "Frame & Bezel",
    "3D Emblem Core",
    "Engravings & Traces",
    "Lighting & Glow",
  ];

  for (let orderIdx = 0; orderIdx < layerNames.length; orderIdx++) {
    const layerName = layerNames[orderIdx];
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

    const layerElements = elements.filter((e) => e.layerName === layerName);

    for (const elem of layerElements) {
      await db.insert(elementsTable).values({
        id: crypto.randomUUID(),
        layerId,
        filename: elem.filename,
        weight: elem.weight,
        createdAt: now,
      });
    }
  }
}

async function seedVectorAvatarsDemo() {
  const existing = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.name, "Flat Vector Avatars"))
    .get();

  if (existing) {
    const oldLayers = await db
      .select()
      .from(layersTable)
      .where(eq(layersTable.projectId, existing.id))
      .all();
    for (const ol of oldLayers) {
      await db.delete(elementsTable).where(eq(elementsTable.layerId, ol.id)).run();
    }
    await db.delete(layersTable).where(eq(layersTable.projectId, existing.id)).run();
    await db.delete(projectsTable).where(eq(projectsTable.id, existing.id)).run();
  }

  const now = new Date();
  const projectId = crypto.randomUUID();

  await db.insert(projectsTable).values({
    id: projectId,
    userId: "default",
    name: "Flat Vector Avatars",
    network: "eth",
    namePrefix: "Vector",
    description:
      "Modern tech vector illustration avatars featuring solid pastel color blocks, clean outfits, hairstyles, and pop accessories.",
    canvasWidth: 1000,
    canvasHeight: 1000,
    smoothing: true,
    rarityDelim: "#",
    dnaTolerance: 10000,
    shuffleOrder: false,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created project: Flat Vector Avatars (${projectId})`);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  console.log("  Rendering Vector Avatars PNG elements...");
  const elements = generateVectorAvatarsArt(UPLOADS_DIR);

  const layerNames = [
    "Solid Background",
    "Base Head & Skin",
    "Outfit",
    "Hairstyle",
    "Face Expression & Specs",
    "Pop Accessory",
  ];

  for (let orderIdx = 0; orderIdx < layerNames.length; orderIdx++) {
    const layerName = layerNames[orderIdx];
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

    const layerElements = elements.filter((e) => e.layerName === layerName);

    for (const elem of layerElements) {
      await db.insert(elementsTable).values({
        id: crypto.randomUUID(),
        layerId,
        filename: elem.filename,
        weight: elem.weight,
        createdAt: now,
      });
    }
  }
}

async function seedSynthwaveCardsDemo() {
  const existing = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.name, "Vaporwave & Synthwave Cards"))
    .get();

  if (existing) {
    console.log("Project 'Vaporwave & Synthwave Cards' already seeded. Skipping.");
    return;
  }

  const now = new Date();
  const projectId = crypto.randomUUID();

  await db.insert(projectsTable).values({
    id: projectId,
    userId: "default",
    name: "Vaporwave & Synthwave Cards",
    network: "base",
    namePrefix: "Synth",
    description:
      "High-contrast 80s synthwave vector art cards with wireframe grids, neon suns, cassette subjects, and CRT glitch overlays.",
    canvasWidth: 1000,
    canvasHeight: 1000,
    smoothing: true,
    rarityDelim: "#",
    dnaTolerance: 10000,
    shuffleOrder: false,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created project: Vaporwave & Synthwave Cards (${projectId})`);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  console.log("  Rendering Synthwave Cards PNG elements...");
  const elements = generateSynthwaveCardsArt(UPLOADS_DIR);

  const layerNames = [
    "Grid Horizon",
    "Celestial Sun",
    "Foreground Subject",
    "Neon Frame",
    "VHS Glitch & FX",
  ];

  for (let orderIdx = 0; orderIdx < layerNames.length; orderIdx++) {
    const layerName = layerNames[orderIdx];
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

    const layerElements = elements.filter((e) => e.layerName === layerName);

    for (const elem of layerElements) {
      await db.insert(elementsTable).values({
        id: crypto.randomUUID(),
        layerId,
        filename: elem.filename,
        weight: elem.weight,
        createdAt: now,
      });
    }
  }
}

async function seedSacredGeometryDemo() {
  const existing = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.name, "Sacred Geometry Medallions"))
    .get();

  if (existing) {
    console.log("Project 'Sacred Geometry Medallions' already seeded. Skipping.");
    return;
  }

  const now = new Date();
  const projectId = crypto.randomUUID();

  await db.insert(projectsTable).values({
    id: projectId,
    userId: "default",
    name: "Sacred Geometry Medallions",
    network: "eth",
    namePrefix: "Sacred",
    description:
      "Intricate mathematical line-art medallions with sacred polygons, concentric rings, polished gems, and metallic foil finishes.",
    canvasWidth: 1000,
    canvasHeight: 1000,
    smoothing: true,
    rarityDelim: "#",
    dnaTolerance: 10000,
    shuffleOrder: false,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created project: Sacred Geometry Medallions (${projectId})`);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  console.log("  Rendering Sacred Geometry PNG elements...");
  const elements = generateSacredGeometryArt(UPLOADS_DIR);

  const layerNames = [
    "Background Texture",
    "Sacred Polygon",
    "Inner Ring",
    "Center Gemstone",
    "Foil Polish",
  ];

  for (let orderIdx = 0; orderIdx < layerNames.length; orderIdx++) {
    const layerName = layerNames[orderIdx];
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

    const layerElements = elements.filter((e) => e.layerName === layerName);

    for (const elem of layerElements) {
      await db.insert(elementsTable).values({
        id: crypto.randomUUID(),
        layerId,
        filename: elem.filename,
        weight: elem.weight,
        createdAt: now,
      });
    }
  }
}

async function seedNotebookDoodlesDemo() {
  const existing = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.name, "Hand-Drawn Notebook Doodles"))
    .get();

  if (existing) {
    console.log("Project 'Hand-Drawn Notebook Doodles' already seeded. Skipping.");
    return;
  }

  const now = new Date();
  const projectId = crypto.randomUUID();

  await db.insert(projectsTable).values({
    id: projectId,
    userId: "default",
    name: "Hand-Drawn Notebook Doodles",
    network: "sol",
    namePrefix: "Doodle",
    description:
      "Whimsical notebook pencil sketch and chalkboard doodle characters with paper textures, googly eyes, paper boat hats, and star scribbles.",
    canvasWidth: 1000,
    canvasHeight: 1000,
    smoothing: true,
    rarityDelim: "#",
    dnaTolerance: 10000,
    shuffleOrder: false,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created project: Hand-Drawn Notebook Doodles (${projectId})`);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  console.log("  Rendering Notebook Doodles PNG elements...");
  const elements = generateNotebookDoodlesArt(UPLOADS_DIR);

  const layerNames = [
    "Paper Surface",
    "Doodle Creature",
    "Expression & Eyes",
    "Doodle Hats",
    "Scribble FX",
  ];

  for (let orderIdx = 0; orderIdx < layerNames.length; orderIdx++) {
    const layerName = layerNames[orderIdx];
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

    const layerElements = elements.filter((e) => e.layerName === layerName);

    for (const elem of layerElements) {
      await db.insert(elementsTable).values({
        id: crypto.randomUUID(),
        layerId,
        filename: elem.filename,
        weight: elem.weight,
        createdAt: now,
      });
    }
  }
}

async function seedClassroomDoodlesDemo() {
  const existing = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.name, "Chalkboard Classroom Doodles"))
    .get();

  if (existing) {
    console.log("Project 'Chalkboard Classroom Doodles' already seeded. Skipping.");
    return;
  }

  const now = new Date();
  const projectId = crypto.randomUUID();

  await db.insert(projectsTable).values({
    id: projectId,
    userId: "default",
    name: "Chalkboard Classroom Doodles",
    network: "polygon",
    namePrefix: "Chalk",
    description:
      "Charming classroom chalkboard doodles featuring space rockets, UFOs, dinos, robots, googly eyes, and math formulas.",
    canvasWidth: 1000,
    canvasHeight: 1000,
    smoothing: true,
    rarityDelim: "#",
    dnaTolerance: 10000,
    shuffleOrder: false,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created project: Chalkboard Classroom Doodles (${projectId})`);

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  console.log("  Rendering Classroom Doodles PNG elements...");
  const elements = generateClassroomDoodlesArt(UPLOADS_DIR);

  const layerNames = [
    "Chalkboard Surface",
    "Chalk Creature Base",
    "Chalk Expression",
    "Chalk Accessories",
    "Chalkboard Math & Star FX",
  ];

  for (let orderIdx = 0; orderIdx < layerNames.length; orderIdx++) {
    const layerName = layerNames[orderIdx];
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

    const layerElements = elements.filter((e) => e.layerName === layerName);

    for (const elem of layerElements) {
      await db.insert(elementsTable).values({
        id: crypto.randomUUID(),
        layerId,
        filename: elem.filename,
        weight: elem.weight,
        createdAt: now,
      });
    }
  }
}

async function main() {
  await runMigrations();
  await seedHashlipsDemo();
  await seedCyberpunkDemo();
  await seedSpaceExplorersDemo();
  await seedFantasyQuestDemo();
  await seedCryptoPetsDemo();
  await seedArcadeRacersDemo();
  await seedMechaTitansDemo();
  await seedSteampunkDemo();
  await seedKawaiiEatsDemo();
  await seedGlassBadgesDemo();
  await seedVectorAvatarsDemo();
  await seedSynthwaveCardsDemo();
  await seedSacredGeometryDemo();
  await seedNotebookDoodlesDemo();
  await seedClassroomDoodlesDemo();

  console.log("\nAll seeds complete!");
  console.log(`Uploads dir: ${UPLOADS_DIR}`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
