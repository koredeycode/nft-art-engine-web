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

export function generateCryptoPetsArt(outputDir: string): GeneratedElement[] {
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
    const filename = `pets_${sanitizedLayer}_${sanitizedElement}_${weight}.png`;
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
  // 1. ENVIRONMENT (Order 0)
  // ==========================
  const layer0 = "Environment";

  // Pixel Meadow
  addElement(layer0, "Pixel Meadow", 30, (ctx: any) => {
    ctx.fillStyle = "#bae6fd";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#4ade80";
    ctx.fillRect(0, 650, width, 350);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(0, 700, width, 300);

    // Sun
    ctx.fillStyle = "#fde047";
    ctx.beginPath();
    ctx.arc(800, 200, 80, 0, Math.PI * 2);
    ctx.fill();
  });

  // Volcano Island
  addElement(layer0, "Volcano Island", 25, (ctx: any) => {
    ctx.fillStyle = "#450a0a";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#dc2626";
    ctx.fillRect(0, 750, width, 250);
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(0, 770, width, 50);
  });

  // Underwater Coral
  addElement(layer0, "Underwater Coral", 20, (ctx: any) => {
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#f43f5e";
    ctx.fillRect(100, 700, 80, 300);
    ctx.fillRect(800, 650, 100, 350);

    // Bubbles
    ctx.fillStyle = "#bae6fd88";
    const bubbles: [number, number][] = [
      [300, 400],
      [400, 200],
      [700, 300],
    ];
    bubbles.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    });
  });

  // Cloud Castle
  addElement(layer0, "Cloud Castle", 15, (ctx: any) => {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#f472b6");
    grad.addColorStop(1, "#c084fc");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Fluffy clouds
    ctx.fillStyle = "#ffffffdd";
    ctx.beginPath();
    ctx.arc(300, 800, 160, 0, Math.PI * 2);
    ctx.arc(500, 780, 200, 0, Math.PI * 2);
    ctx.arc(700, 800, 160, 0, Math.PI * 2);
    ctx.fill();
  });

  // Cosmic Moon
  addElement(layer0, "Cosmic Moon", 10, (ctx: any) => {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.arc(500, 800, 400, 0, Math.PI * 2);
    ctx.fill();
  });

  // ==========================
  // 2. CREATURE BODY (Order 1)
  // ==========================
  const layer1 = "Creature Body";

  const drawChibiBody = (ctx: any, bodyColor: string, bellyColor: string) => {
    // Round Head & Body
    drawPixelRect(ctx, 320, 280, 360, 340, bodyColor);
    drawPixelRect(ctx, 300, 420, 400, 300, bodyColor);

    // Cute belly
    drawPixelRect(ctx, 370, 480, 260, 200, bellyColor);

    // Little Feet
    drawPixelRect(ctx, 340, 700, 90, 60, bodyColor);
    drawPixelRect(ctx, 570, 700, 90, 60, bodyColor);
  };

  // Fire Dragon
  addElement(layer1, "Fire Dragon", 30, (ctx: any) => {
    drawChibiBody(ctx, "#ef4444", "#fef08a");
    // Little Wings
    drawPixelRect(ctx, 220, 380, 90, 120, "#dc2626");
    drawPixelRect(ctx, 690, 380, 90, 120, "#dc2626");
  });

  // Water Slime
  addElement(layer1, "Water Slime", 25, (ctx: any) => {
    drawChibiBody(ctx, "#38bdf8", "#e0f2fe");
  });

  // Electric Bunny
  addElement(layer1, "Electric Bunny", 20, (ctx: any) => {
    drawChibiBody(ctx, "#facc15", "#fef9c3");
    // Bunny Ears
    drawPixelRect(ctx, 340, 100, 70, 200, "#facc15");
    drawPixelRect(ctx, 590, 100, 70, 200, "#facc15");
    drawPixelRect(ctx, 355, 120, 40, 160, "#f472b6");
    drawPixelRect(ctx, 605, 120, 40, 160, "#f472b6");
  });

  // Crystal Golem
  addElement(layer1, "Crystal Golem", 15, (ctx: any) => {
    drawChibiBody(ctx, "#c084fc", "#e9d5ff");
  });

  // Shadow Kitty
  addElement(layer1, "Shadow Kitty", 10, (ctx: any) => {
    drawChibiBody(ctx, "#1e293b", "#475569");
    // Cat Ears
    drawPixelRect(ctx, 320, 200, 80, 100, "#1e293b");
    drawPixelRect(ctx, 600, 200, 80, 100, "#1e293b");
  });

  // ==========================
  // 3. EXPRESSION & EYES (Order 2)
  // ==========================
  const layer2 = "Expression & Eyes";

  // Happy Sparkles
  addElement(layer2, "Happy Sparkles", 30, (ctx: any) => {
    // Big Kawaii Eyes
    drawPixelRect(ctx, 380, 360, 50, 70, "#0f172a");
    drawPixelRect(ctx, 570, 360, 50, 70, "#0f172a");
    drawPixelRect(ctx, 390, 370, 20, 20, "#ffffff");
    drawPixelRect(ctx, 580, 370, 20, 20, "#ffffff");
    // Cute Smile
    drawPixelRect(ctx, 470, 440, 60, 20, "#0f172a");
    // Rosy Cheeks
    drawPixelRect(ctx, 340, 430, 40, 20, "#f472b6");
    drawPixelRect(ctx, 620, 430, 40, 20, "#f472b6");
  });

  // Sleepy Zzz
  addElement(layer2, "Sleepy Zzz", 25, (ctx: any) => {
    // Closed U-eyes
    drawPixelRect(ctx, 380, 390, 60, 15, "#0f172a");
    drawPixelRect(ctx, 560, 390, 60, 15, "#0f172a");
    // Snore bubble
    ctx.fillStyle = "#38bdf888";
    ctx.beginPath();
    ctx.arc(520, 420, 25, 0, Math.PI * 2);
    ctx.fill();
  });

  // Fierce Fire
  addElement(layer2, "Fierce Fire", 20, (ctx: any) => {
    // Slanted angry eyes
    drawPixelRect(ctx, 370, 370, 70, 40, "#ef4444");
    drawPixelRect(ctx, 560, 370, 70, 40, "#ef4444");
    drawPixelRect(ctx, 390, 380, 30, 20, "#fef08a");
    drawPixelRect(ctx, 580, 380, 30, 20, "#fef08a");
  });

  // Derp Glasses
  addElement(layer2, "Derp Glasses", 15, (ctx: any) => {
    // Big round swirl glasses
    drawPixelRect(ctx, 350, 350, 110, 90, "#0f172a");
    drawPixelRect(ctx, 540, 350, 110, 90, "#0f172a");
    drawPixelRect(ctx, 460, 380, 80, 15, "#0f172a");
    drawPixelRect(ctx, 370, 370, 70, 50, "#ffffff");
    drawPixelRect(ctx, 560, 370, 70, 50, "#ffffff");
  });

  // Cyborg Optic
  addElement(layer2, "Cyborg Optic", 10, (ctx: any) => {
    drawPixelRect(ctx, 370, 370, 60, 60, "#00f0ff");
    drawPixelRect(ctx, 560, 370, 60, 60, "#ef4444");
  });

  // ==========================
  // 4. ACCESSORIES & OUTFITS (Order 3)
  // ==========================
  const layer3 = "Accessories & Outfits";

  // Red Bandana
  addElement(layer3, "Red Bandana", 30, (ctx: any) => {
    drawPixelRect(ctx, 440, 490, 120, 50, "#ef4444");
  });

  // Cute Bowtie
  addElement(layer3, "Cute Bowtie", 25, (ctx: any) => {
    drawPixelRect(ctx, 450, 490, 100, 40, "#ec4899");
    drawPixelRect(ctx, 485, 485, 30, 50, "#be185d");
  });

  // Wizard Cape
  addElement(layer3, "Wizard Cape", 20, (ctx: any) => {
    drawPixelRect(ctx, 280, 460, 440, 240, "#6366f1");
  });

  // Jetpack
  addElement(layer3, "Jetpack", 15, (ctx: any) => {
    drawPixelRect(ctx, 220, 420, 80, 200, "#64748b");
    drawPixelRect(ctx, 700, 420, 80, 200, "#64748b");
    drawPixelRect(ctx, 230, 600, 60, 50, "#f97316");
    drawPixelRect(ctx, 710, 600, 60, 50, "#f97316");
  });

  // Armor Plate
  addElement(layer3, "Armor Plate", 10, (ctx: any) => {
    drawPixelRect(ctx, 380, 500, 240, 120, "#94a3b8");
  });

  // ==========================
  // 5. HEADGEAR (Order 4)
  // ==========================
  const layer4 = "Headgear";

  // Tiny Party Hat
  addElement(layer4, "Tiny Party Hat", 30, (ctx: any) => {
    drawPixelRect(ctx, 460, 160, 80, 130, "#ec4899");
    drawPixelRect(ctx, 485, 130, 30, 30, "#facc15");
  });

  // Royal Crown
  addElement(layer4, "Royal Crown", 25, (ctx: any) => {
    drawPixelRect(ctx, 380, 200, 240, 90, "#eab308");
    drawPixelRect(ctx, 480, 220, 40, 40, "#ef4444");
  });

  // Flower Wreath
  addElement(layer4, "Flower Wreath", 20, (ctx: any) => {
    drawPixelRect(ctx, 330, 260, 340, 30, "#22c55e");
    drawPixelRect(ctx, 360, 250, 40, 40, "#f472b6");
    drawPixelRect(ctx, 480, 250, 40, 40, "#fbbf24");
    drawPixelRect(ctx, 600, 250, 40, 40, "#a855f7");
  });

  // Viking Helmet
  addElement(layer4, "Viking Helmet", 15, (ctx: any) => {
    drawPixelRect(ctx, 340, 200, 320, 90, "#64748b");
    drawPixelRect(ctx, 280, 140, 60, 90, "#f8fafc");
    drawPixelRect(ctx, 660, 140, 60, 90, "#f8fafc");
  });

  // Neon Headphones
  addElement(layer4, "Neon Headphones", 10, (ctx: any) => {
    drawPixelRect(ctx, 340, 180, 320, 30, "#00f0ff");
    drawPixelRect(ctx, 290, 280, 60, 120, "#00f0ff");
    drawPixelRect(ctx, 650, 280, 60, 120, "#00f0ff");
  });

  // ==========================
  // 6. EMANATION FX (Order 5)
  // ==========================
  const layer5 = "Emanation FX";

  // Heart Sparkles
  addElement(layer5, "Heart Sparkles", 30, (ctx: any) => {
    ctx.fillStyle = "#f472b6";
    const hearts: [number, number][] = [
      [200, 200],
      [800, 220],
      [150, 600],
      [850, 650],
    ];
    hearts.forEach(([hx, hy]) => {
      ctx.fillRect(hx - 15, hy, 30, 20);
      ctx.fillRect(hx - 10, hy + 20, 20, 15);
    });
  });

  // Lightning Crackle
  addElement(layer5, "Lightning Crackle", 25, (ctx: any) => {
    ctx.fillStyle = "#facc15";
    ctx.fillRect(150, 300, 40, 80);
    ctx.fillRect(800, 400, 40, 80);
  });

  // Flame Aura
  addElement(layer5, "Flame Aura", 20, (ctx: any) => {
    ctx.fillStyle = "#f97316aa";
    ctx.beginPath();
    ctx.arc(500, 500, 420, 0, Math.PI * 2);
    ctx.fill();
  });

  // Floating Bubbles
  addElement(layer5, "Floating Bubbles", 15, (ctx: any) => {
    ctx.fillStyle = "#38bdf888";
    const bubs: [number, number][] = [
      [180, 250],
      [820, 300],
      [220, 750],
      [780, 780],
    ];
    bubs.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();
    });
  });

  // None
  addElement(layer5, "None", 10, (_ctx: any) => {
    // empty
  });

  return generated;
}
