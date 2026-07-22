import fs from "node:fs";
import path from "node:path";
import { createCanvas } from "@napi-rs/canvas";

export interface GeneratedElement {
  layerName: string;
  elementName: string;
  weight: number;
  filename: string;
  filePath: string;
}

export function generateFantasyQuestArt(outputDir: string): GeneratedElement[] {
  fs.mkdirSync(outputDir, { recursive: true });

  const width = 1000;
  const height = 1000;
  const generated: GeneratedElement[] = [];

  const addElement = (
    layerName: string,
    cleanName: string,
    weight: number,
    drawFn: (ctx: any) => void,
  ) => {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    drawFn(ctx);

    const sanitizedLayer = layerName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const sanitizedElement = cleanName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `fantasy_${sanitizedLayer}_${sanitizedElement}_${weight}.png`;
    const filePath = path.join(outputDir, filename);

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(filePath, buffer);

    generated.push({
      layerName,
      elementName: cleanName,
      weight,
      filename,
      filePath,
    });
  };

  const drawPixelRect = (ctx: any, x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  };

  // ==========================
  // 1. BACKGROUND (Order 0)
  // ==========================
  const layer0 = "Background";

  // Dungeon Fortress
  addElement(layer0, "Dungeon Fortress", 30, (ctx: any) => {
    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(0, 0, width, height);

    // Stone brick grid
    ctx.fillStyle = "#0f172a";
    for (let y = 0; y < height; y += 80) {
      const offset = (y / 80) % 2 === 0 ? 0 : 60;
      for (let x = -offset; x < width + 60; x += 120) {
        ctx.fillRect(x, y, 110, 70);
      }
    }

    // Torches on wall
    drawPixelRect(ctx, 150, 300, 30, 80, "#78350f");
    drawPixelRect(ctx, 820, 300, 30, 80, "#78350f");
    drawPixelRect(ctx, 140, 260, 50, 40, "#f97316");
    drawPixelRect(ctx, 810, 260, 50, 40, "#f97316");
  });

  // Enchanted Forest
  addElement(layer0, "Enchanted Forest", 25, (ctx: any) => {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#064e3b");
    grad.addColorStop(1, "#022c22");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Trees
    ctx.fillStyle = "#065f46";
    ctx.fillRect(60, 200, 160, 800);
    ctx.fillRect(780, 150, 180, 850);

    // Magic glowing mushrooms / fireflies
    ctx.fillStyle = "#a7f3d0";
    for (let i = 0; i < 50; i++) {
      ctx.fillRect((i * 173) % width, (i * 239) % height, 6, 6);
    }
  });

  // Dragon Lair
  addElement(layer0, "Dragon Lair", 20, (ctx: any) => {
    ctx.fillStyle = "#450a0a";
    ctx.fillRect(0, 0, width, height);

    // Lava cavern pools
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(0, 700, width, 300);
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(0, 720, width, 50);
  });

  // Mystic Portal
  addElement(layer0, "Mystic Portal", 15, (ctx: any) => {
    ctx.fillStyle = "#090514";
    ctx.fillRect(0, 0, width, height);

    // Swirling purple archway
    ctx.fillStyle = "#a855f7aa";
    ctx.beginPath();
    ctx.arc(500, 450, 300, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#e9d5ff";
    ctx.beginPath();
    ctx.arc(500, 450, 180, 0, Math.PI * 2);
    ctx.fill();
  });

  // Mountain Sunset
  addElement(layer0, "Mountain Sunset", 10, (ctx: any) => {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#7c2d12");
    grad.addColorStop(0.6, "#c2410c");
    grad.addColorStop(1, "#f59e0b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Mountain silhouettes
    ctx.fillStyle = "#1c1917";
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(250, 400);
    ctx.lineTo(500, height);
    ctx.lineTo(750, 350);
    ctx.lineTo(1000, height);
    ctx.fill();
  });

  // ==========================
  // 2. HERO ARMOR & CLOTHING (Order 1)
  // ==========================
  const layer1 = "Hero Armor & Clothing";

  const drawHeroOutfit = (ctx: any, baseColor: string, trimColor: string, beltColor: string) => {
    // Shoulders & Body
    drawPixelRect(ctx, 280, 680, 440, 320, trimColor);
    drawPixelRect(ctx, 310, 660, 380, 340, baseColor);

    // Belt
    drawPixelRect(ctx, 330, 820, 340, 40, beltColor);
    drawPixelRect(ctx, 470, 810, 60, 60, "#fbbf24"); // buckle

    // Collar / Neck
    drawPixelRect(ctx, 380, 560, 240, 120, trimColor);
    drawPixelRect(ctx, 400, 580, 200, 90, baseColor);
  };

  // Knight Steel Plate
  addElement(layer1, "Knight Steel Plate", 30, (ctx: any) => {
    drawHeroOutfit(ctx, "#94a3b8", "#334155", "#475569");
  });

  // Wizard Rune Robes
  addElement(layer1, "Wizard Rune Robes", 25, (ctx: any) => {
    drawHeroOutfit(ctx, "#4338ca", "#312e81", "#c084fc");
  });

  // Rogue Leather Tunic
  addElement(layer1, "Rogue Leather Tunic", 20, (ctx: any) => {
    drawHeroOutfit(ctx, "#78350f", "#451a03", "#d97706");
  });

  // Paladin Gold Armor
  addElement(layer1, "Paladin Gold Armor", 15, (ctx: any) => {
    drawHeroOutfit(ctx, "#eab308", "#854d0e", "#fef08a");
  });

  // Barbarian Fur
  addElement(layer1, "Barbarian Fur", 10, (ctx: any) => {
    drawHeroOutfit(ctx, "#b45309", "#7c2d12", "#ef4444");
  });

  // ==========================
  // 3. HEAD & FACE (Order 2)
  // ==========================
  const layer2 = "Head & Face";

  // Noble Knight
  addElement(layer2, "Noble Knight", 30, (ctx: any) => {
    drawPixelRect(ctx, 350, 280, 300, 300, "#fde047");
    // Hair
    drawPixelRect(ctx, 340, 260, 320, 70, "#b45309");
    // Eyes
    drawPixelRect(ctx, 400, 380, 40, 25, "#1e293b");
    drawPixelRect(ctx, 560, 380, 40, 25, "#1e293b");
    // Mouth
    drawPixelRect(ctx, 450, 480, 100, 15, "#991b1b");
  });

  // Dark Elf
  addElement(layer2, "Dark Elf", 25, (ctx: any) => {
    drawPixelRect(ctx, 350, 280, 300, 300, "#475569");
    // Long Elven Ears
    drawPixelRect(ctx, 270, 330, 80, 50, "#475569");
    drawPixelRect(ctx, 650, 330, 80, 50, "#475569");
    // White Hair
    drawPixelRect(ctx, 330, 240, 340, 80, "#f8fafc");
    // Glowing Purple Eyes
    drawPixelRect(ctx, 400, 380, 40, 25, "#c084fc");
    drawPixelRect(ctx, 560, 380, 40, 25, "#c084fc");
  });

  // Bearded Dwarf
  addElement(layer2, "Bearded Dwarf", 20, (ctx: any) => {
    drawPixelRect(ctx, 340, 300, 320, 260, "#fbcfe8");
    // Huge Beard
    drawPixelRect(ctx, 320, 440, 360, 200, "#d97706");
    // Nose & Eyes
    drawPixelRect(ctx, 460, 410, 80, 40, "#f87171");
    drawPixelRect(ctx, 400, 380, 40, 25, "#0f172a");
    drawPixelRect(ctx, 560, 380, 40, 25, "#0f172a");
  });

  // Fiery Demon Horns
  addElement(layer2, "Fiery Demon Horns", 15, (ctx: any) => {
    drawPixelRect(ctx, 350, 280, 300, 300, "#991b1b");
    // Glowing Yellow Eyes
    drawPixelRect(ctx, 400, 380, 40, 25, "#fef08a");
    drawPixelRect(ctx, 560, 380, 40, 25, "#fef08a");
    // Horns
    drawPixelRect(ctx, 300, 150, 50, 140, "#450a0a");
    drawPixelRect(ctx, 650, 150, 50, 140, "#450a0a");
  });

  // Ethereal Spirit
  addElement(layer2, "Ethereal Spirit", 10, (ctx: any) => {
    drawPixelRect(ctx, 350, 270, 300, 310, "#38bdf888");
    drawPixelRect(ctx, 400, 370, 50, 35, "#ffffff");
    drawPixelRect(ctx, 550, 370, 50, 35, "#ffffff");
  });

  // ==========================
  // 4. WEAPONS & MAGIC (Order 3)
  // ==========================
  const layer3 = "Weapons & Magic";

  // Excalibur Sword
  addElement(layer3, "Excalibur Sword", 30, (ctx: any) => {
    // Silver blade held up right side
    drawPixelRect(ctx, 750, 150, 35, 600, "#cbd5e1");
    drawPixelRect(ctx, 760, 130, 15, 620, "#ffffff"); // edge
    drawPixelRect(ctx, 690, 720, 155, 30, "#fbbf24"); // crossguard
  });

  // Arcane Staff with Gem
  addElement(layer3, "Arcane Staff with Gem", 25, (ctx: any) => {
    // Wooden staff
    drawPixelRect(ctx, 160, 180, 30, 750, "#78350f");
    // Glowing Gem Orb
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(175, 140, 50, 0, Math.PI * 2);
    ctx.fill();
  });

  // Shadow Dagger
  addElement(layer3, "Shadow Dagger", 20, (ctx: any) => {
    drawPixelRect(ctx, 760, 400, 25, 300, "#1e293b");
    drawPixelRect(ctx, 720, 680, 100, 20, "#9333ea");
  });

  // Phoenix Shield
  addElement(layer3, "Phoenix Shield", 15, (ctx: any) => {
    drawPixelRect(ctx, 140, 500, 200, 320, "#b91c1c");
    drawPixelRect(ctx, 160, 520, 160, 280, "#f59e0b");
  });

  // Glowing Fireball
  addElement(layer3, "Glowing Fireball", 10, (ctx: any) => {
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(800, 550, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fef08a";
    ctx.beginPath();
    ctx.arc(800, 550, 45, 0, Math.PI * 2);
    ctx.fill();
  });

  // ==========================
  // 5. HEADWEAR & CROWN (Order 4)
  // ==========================
  const layer4 = "Headwear & Crown";

  // Golden Crown
  addElement(layer4, "Golden Crown", 30, (ctx: any) => {
    drawPixelRect(ctx, 330, 210, 340, 80, "#eab308");
    // Crown spikes
    drawPixelRect(ctx, 330, 160, 60, 50, "#eab308");
    drawPixelRect(ctx, 470, 140, 60, 70, "#eab308");
    drawPixelRect(ctx, 610, 160, 60, 50, "#eab308");
    // Jewels
    drawPixelRect(ctx, 490, 230, 20, 30, "#ef4444");
  });

  // Wizard Hat
  addElement(layer4, "Wizard Hat", 25, (ctx: any) => {
    // Brim
    drawPixelRect(ctx, 280, 250, 440, 40, "#312e81");
    // Cone
    drawPixelRect(ctx, 360, 60, 280, 200, "#4338ca");
    drawPixelRect(ctx, 420, 10, 160, 60, "#4338ca");
  });

  // Knight Helmet
  addElement(layer4, "Knight Helmet", 20, (ctx: any) => {
    drawPixelRect(ctx, 320, 180, 360, 180, "#64748b");
    // Visor slit
    drawPixelRect(ctx, 350, 280, 300, 20, "#0f172a");
  });

  // Elven Band
  addElement(layer4, "Elven Band", 15, (ctx: any) => {
    drawPixelRect(ctx, 330, 260, 340, 20, "#10b981");
    drawPixelRect(ctx, 480, 240, 40, 40, "#a7f3d0");
  });

  // Horned Helmet
  addElement(layer4, "Horned Helmet", 10, (ctx: any) => {
    drawPixelRect(ctx, 340, 200, 320, 100, "#451a03");
    // Big Iron Horns
    drawPixelRect(ctx, 270, 120, 70, 100, "#94a3b8");
    drawPixelRect(ctx, 660, 120, 70, 100, "#94a3b8");
  });

  // ==========================
  // 6. ENCHANTMENT FX (Order 5)
  // ==========================
  const layer5 = "Enchantment FX";

  // Arcane Rune Aura
  addElement(layer5, "Arcane Rune Aura", 30, (ctx: any) => {
    ctx.strokeStyle = "#a855f7aa";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(500, 500, 420, 0, Math.PI * 2);
    ctx.stroke();

    // Floating runes
    ctx.fillStyle = "#c084fc";
    const runes = [
      [200, 200],
      [800, 200],
      [200, 800],
      [800, 800],
    ];
    runes.forEach(([rx, ry]) => {
      ctx.fillRect(rx, ry, 30, 30);
    });
  });

  // Divine Light Beam
  addElement(layer5, "Divine Light Beam", 25, (ctx: any) => {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#fef08a88");
    grad.addColorStop(1, "#00000000");
    ctx.fillStyle = grad;
    ctx.fillRect(350, 0, 300, height);
  });

  // Shadow Smoke
  addElement(layer5, "Shadow Smoke", 20, (ctx: any) => {
    ctx.fillStyle = "#0f172aaa";
    ctx.fillRect(0, 750, width, 250);
  });

  // Floating Magic Mana
  addElement(layer5, "Floating Magic Mana", 15, (ctx: any) => {
    ctx.fillStyle = "#38bdf8";
    for (let i = 0; i < 40; i++) {
      ctx.fillRect((i * 197) % width, (i * 263) % height, 10, 10);
    }
  });

  // None
  addElement(layer5, "None", 10, (_ctx: any) => {
    // empty
  });

  return generated;
}
