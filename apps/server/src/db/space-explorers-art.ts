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

export function generateSpaceExplorersArt(outputDir: string): GeneratedElement[] {
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
    const filename = `space_${sanitizedLayer}_${sanitizedElement}_${weight}.png`;
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

  // Deep Cosmos
  addElement(layer0, "Deep Cosmos", 30, (ctx: any) => {
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, width, height);

    // Stars
    for (let i = 0; i < 120; i++) {
      const sx = (i * 157) % width;
      const sy = (i * 313) % height;
      const size = (i % 3) * 2 + 2;
      ctx.fillStyle = i % 2 === 0 ? "#ffffff" : "#60a5fa";
      ctx.fillRect(sx, sy, size, size);
    }
  });

  // Orion Nebula
  addElement(layer0, "Orion Nebula", 25, (ctx: any) => {
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, width, height);

    const grad = ctx.createRadialGradient(400, 400, 50, 400, 400, 600);
    grad.addColorStop(0, "#818cf8aa");
    grad.addColorStop(0.5, "#c084fc66");
    grad.addColorStop(1, "#00000000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Pixel stars
    ctx.fillStyle = "#e0e7ff";
    for (let i = 0; i < 90; i++) {
      ctx.fillRect((i * 191) % width, (i * 281) % height, 3, 3);
    }
  });

  // Supernova Blast
  addElement(layer0, "Supernova Blast", 20, (ctx: any) => {
    ctx.fillStyle = "#0f0728";
    ctx.fillRect(0, 0, width, height);

    // Core explosion radial
    const grad = ctx.createRadialGradient(500, 500, 20, 500, 500, 550);
    grad.addColorStop(0, "#fbbf24");
    grad.addColorStop(0.3, "#f43f5e");
    grad.addColorStop(0.7, "#881337");
    grad.addColorStop(1, "#00000000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  });

  // Lunar Eclipse
  addElement(layer0, "Lunar Eclipse", 15, (ctx: any) => {
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);

    // Moon ring glow
    ctx.fillStyle = "#ef4444aa";
    ctx.beginPath();
    ctx.arc(500, 450, 260, 0, Math.PI * 2);
    ctx.fill();

    // Dark moon body
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(500, 450, 245, 0, Math.PI * 2);
    ctx.fill();
  });

  // Wormhole Spiral
  addElement(layer0, "Wormhole Spiral", 10, (ctx: any) => {
    ctx.fillStyle = "#050515";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#22d3eeaa";
    ctx.lineWidth = 12;
    for (let r = 80; r <= 480; r += 60) {
      ctx.beginPath();
      ctx.arc(500, 500, r, 0, Math.PI * 1.6);
      ctx.stroke();
    }
  });

  // ==========================
  // 2. SUIT BODY (Order 1)
  // ==========================
  const layer1 = "Suit Body";

  const drawSpaceSuit = (ctx: any, primary: string, secondary: string, chestPatch: string) => {
    // Shoulder pads / Arms
    drawPixelRect(ctx, 240, 680, 520, 320, secondary);
    drawPixelRect(ctx, 270, 660, 460, 340, primary);

    // Chest box / Life support control
    drawPixelRect(ctx, 400, 720, 200, 180, secondary);
    drawPixelRect(ctx, 430, 750, 140, 120, chestPatch);

    // Status buttons on suit
    drawPixelRect(ctx, 450, 770, 20, 20, "#ef4444");
    drawPixelRect(ctx, 490, 770, 20, 20, "#10b981");
    drawPixelRect(ctx, 530, 770, 20, 20, "#3b82f6");

    // Neck ring connector
    drawPixelRect(ctx, 360, 540, 280, 130, secondary);
    drawPixelRect(ctx, 380, 560, 240, 100, primary);
  };

  // Classic White NASA
  addElement(layer1, "Classic White NASA", 30, (ctx: any) => {
    drawSpaceSuit(ctx, "#f8fafc", "#94a3b8", "#2563eb");
  });

  // Alien Bio-Suit
  addElement(layer1, "Alien Bio-Suit", 25, (ctx: any) => {
    drawSpaceSuit(ctx, "#059669", "#064e3b", "#34d399");
  });

  // Stealth Black Mech
  addElement(layer1, "Stealth Black Mech", 20, (ctx: any) => {
    drawSpaceSuit(ctx, "#1e293b", "#0f172a", "#f59e0b");
  });

  // Solar Gold Exo
  addElement(layer1, "Solar Gold Exo", 15, (ctx: any) => {
    drawSpaceSuit(ctx, "#d97706", "#78350f", "#fef08a");
  });

  // Cyber Cyan Armor
  addElement(layer1, "Cyber Cyan Armor", 10, (ctx: any) => {
    drawSpaceSuit(ctx, "#06b6d4", "#164e63", "#a5f3fc");
  });

  // ==========================
  // 3. FACE & ALIEN HEAD (Order 2)
  // ==========================
  const layer2 = "Face & Alien Head";

  // Human Astronaut
  addElement(layer2, "Human Astronaut", 30, (ctx: any) => {
    // Face box
    drawPixelRect(ctx, 380, 320, 240, 260, "#fde047"); // skin
    drawPixelRect(ctx, 400, 300, 200, 260, "#fbcfe8");
    // Hair
    drawPixelRect(ctx, 380, 280, 240, 60, "#78350f");
    // Eyes
    drawPixelRect(ctx, 430, 390, 30, 20, "#1e293b");
    drawPixelRect(ctx, 540, 390, 30, 20, "#1e293b");
    // Mouth
    drawPixelRect(ctx, 460, 480, 80, 15, "#be123c");
  });

  // Martian Green Alien
  addElement(layer2, "Martian Green Alien", 25, (ctx: any) => {
    // Enlarged head
    drawPixelRect(ctx, 340, 220, 320, 340, "#22c55e");
    // Big Black Alien Eyes
    drawPixelRect(ctx, 380, 340, 90, 110, "#090d16");
    drawPixelRect(ctx, 530, 340, 90, 110, "#090d16");
    drawPixelRect(ctx, 410, 360, 30, 30, "#ffffff");
    drawPixelRect(ctx, 560, 360, 30, 30, "#ffffff");
    // Small mouth dot
    drawPixelRect(ctx, 495, 500, 10, 10, "#15803d");
  });

  // Celestial Energy Being
  addElement(layer2, "Celestial Energy Being", 20, (ctx: any) => {
    drawPixelRect(ctx, 360, 250, 280, 300, "#818cf8");
    drawPixelRect(ctx, 390, 380, 50, 40, "#ffffff");
    drawPixelRect(ctx, 560, 380, 50, 40, "#ffffff");
  });

  // Android Bionic
  addElement(layer2, "Android Bionic", 15, (ctx: any) => {
    drawPixelRect(ctx, 360, 260, 280, 300, "#94a3b8");
    // Bionic plate line
    drawPixelRect(ctx, 500, 260, 10, 300, "#475569");
    drawPixelRect(ctx, 410, 380, 50, 25, "#ef4444");
    drawPixelRect(ctx, 540, 380, 50, 25, "#ef4444");
  });

  // Shadow Phantom
  addElement(layer2, "Shadow Phantom", 10, (ctx: any) => {
    drawPixelRect(ctx, 360, 250, 280, 310, "#0f172a");
    // Glowing purple eyes
    drawPixelRect(ctx, 410, 380, 50, 30, "#c084fc");
    drawPixelRect(ctx, 540, 380, 50, 30, "#c084fc");
  });

  // ==========================
  // 4. HELMET & VISOR (Order 3)
  // ==========================
  const layer3 = "Helmet & Visor";

  // Gold Reflective Bubble
  addElement(layer3, "Gold Reflective Bubble", 30, (ctx: any) => {
    // Outer Glass Dome
    ctx.fillStyle = "#fbbf24aa";
    ctx.beginPath();
    ctx.arc(500, 410, 210, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 12;
    ctx.stroke();

    // Reflection shine
    drawPixelRect(ctx, 380, 270, 70, 40, "#ffffffaa");
  });

  // Cyan HUD Visor
  addElement(layer3, "Cyan HUD Visor", 25, (ctx: any) => {
    ctx.fillStyle = "#06b6d488";
    ctx.beginPath();
    ctx.arc(500, 410, 210, 0, Math.PI * 2);
    ctx.fill();

    // Digital crosshair in visor
    ctx.fillStyle = "#22d3ee";
    ctx.fillRect(495, 340, 10, 140);
    ctx.fillRect(430, 405, 140, 10);
  });

  // Broken Glass Visor
  addElement(layer3, "Broken Glass Visor", 20, (ctx: any) => {
    ctx.fillStyle = "#38bdf844";
    ctx.beginPath();
    ctx.arc(500, 410, 210, 0, Math.PI * 2);
    ctx.fill();

    // Crack lines
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(500, 410);
    ctx.lineTo(620, 290);
    ctx.moveTo(500, 410);
    ctx.lineTo(660, 480);
    ctx.moveTo(500, 410);
    ctx.lineTo(410, 540);
    ctx.stroke();
  });

  // Alien Glass Dome
  addElement(layer3, "Alien Glass Dome", 15, (ctx: any) => {
    ctx.fillStyle = "#10b98155";
    ctx.beginPath();
    ctx.arc(500, 390, 230, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#34d399";
    ctx.lineWidth = 10;
    ctx.stroke();
  });

  // Cosmic Starfield Visor
  addElement(layer3, "Cosmic Starfield Visor", 10, (ctx: any) => {
    ctx.fillStyle = "#311042dd";
    ctx.beginPath();
    ctx.arc(500, 410, 210, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(420, 350, 6, 6);
    ctx.fillRect(570, 380, 6, 6);
    ctx.fillRect(480, 460, 8, 8);
  });

  // ==========================
  // 5. SPACE GEAR & PROPS (Order 4)
  // ==========================
  const layer4 = "Space Gear & Props";

  // Orbital Satellite
  addElement(layer4, "Orbital Satellite", 30, (ctx: any) => {
    // Floating satellite in corner
    drawPixelRect(ctx, 100, 150, 80, 50, "#94a3b8");
    drawPixelRect(ctx, 40, 160, 60, 30, "#2563eb");
    drawPixelRect(ctx, 180, 160, 60, 30, "#2563eb");
  });

  // Laser Blaster
  addElement(layer4, "Laser Blaster", 25, (ctx: any) => {
    // Held in right side
    drawPixelRect(ctx, 720, 620, 180, 60, "#334155");
    drawPixelRect(ctx, 880, 630, 50, 20, "#ef4444");
  });

  // Oxygen Tank Hose
  addElement(layer4, "Oxygen Tank Hose", 20, (ctx: any) => {
    // Heavy flex hose from chest to shoulder
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(330, 720);
    ctx.bezierCurveTo(240, 680, 240, 550, 360, 560);
    ctx.stroke();
  });

  // Floating Space Cat
  addElement(layer4, "Floating Space Cat", 15, (ctx: any) => {
    // Floating pixel cat in helmet bubble
    drawPixelRect(ctx, 760, 200, 70, 60, "#f97316"); // body
    drawPixelRect(ctx, 740, 180, 20, 30, "#f97316"); // ears
    drawPixelRect(ctx, 810, 180, 20, 30, "#f97316");
    drawPixelRect(ctx, 770, 215, 10, 10, "#000000"); // eye
    drawPixelRect(ctx, 800, 215, 10, 10, "#000000");
  });

  // Flag of Earth
  addElement(layer4, "Flag of Earth", 10, (ctx: any) => {
    drawPixelRect(ctx, 120, 550, 15, 250, "#cbd5e1"); // pole
    drawPixelRect(ctx, 135, 560, 120, 80, "#2563eb"); // flag
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(195, 600, 25, 0, Math.PI * 2);
    ctx.fill();
  });

  // ==========================
  // 6. COSMIC AURA & FX (Order 5)
  // ==========================
  const layer5 = "Cosmic Aura & FX";

  // Stardust Particle Trail
  addElement(layer5, "Stardust Particle Trail", 30, (ctx: any) => {
    ctx.fillStyle = "#fbbf24bb";
    const dots: [number, number][] = [
      [150, 300],
      [250, 180],
      [800, 220],
      [880, 400],
      [120, 700],
      [850, 780],
    ];
    dots.forEach(([x, y]) => {
      ctx.fillRect(x, y, 12, 12);
      ctx.fillRect(x - 6, y + 3, 24, 6);
      ctx.fillRect(x + 3, y - 6, 6, 24);
    });
  });

  // Nebula Glow
  addElement(layer5, "Nebula Glow", 25, (ctx: any) => {
    const grad = ctx.createRadialGradient(500, 500, 200, 500, 500, 500);
    grad.addColorStop(0, "#a855f744");
    grad.addColorStop(1, "#00000000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  });

  // Solar Flare
  addElement(layer5, "Solar Flare", 20, (ctx: any) => {
    ctx.fillStyle = "#f9731633";
    ctx.beginPath();
    ctx.arc(100, 100, 350, 0, Math.PI * 2);
    ctx.fill();
  });

  // Cosmic Rays
  addElement(layer5, "Cosmic Rays", 15, (ctx: any) => {
    ctx.strokeStyle = "#38bdf844";
    ctx.lineWidth = 8;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 140, 0);
      ctx.lineTo(i * 140 + 200, height);
      ctx.stroke();
    }
  });

  // None
  addElement(layer5, "None", 10, (_ctx: any) => {
    // empty
  });

  return generated;
}
