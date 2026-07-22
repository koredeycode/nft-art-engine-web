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

export function generateMechaTitansArt(outputDir: string): GeneratedElement[] {
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
    const filename = `mecha_${sanitizedLayer}_${sanitizedElement}_${weight}.png`;
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
  // 1. HANGAR & BATTLEFIELD (Order 0)
  // ==========================
  const layer0 = "Hangar & Battlefield";

  // Space Station Hangar
  addElement(layer0, "Space Station Hangar", 30, (ctx: any) => {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    // Steel Girders
    drawPixelRect(ctx, 0, 0, 100, height, "#1e293b");
    drawPixelRect(ctx, 900, 0, 100, height, "#1e293b");
    drawPixelRect(ctx, 0, 0, width, 100, "#1e293b");

    // Caution stripes
    ctx.fillStyle = "#eab308";
    for (let x = 0; x < width; x += 60) {
      ctx.fillRect(x, 950, 30, 50);
    }
  });

  // Burning City Ruins
  addElement(layer0, "Burning City Ruins", 25, (ctx: any) => {
    ctx.fillStyle = "#1c1917";
    ctx.fillRect(0, 0, width, height);

    const grad = ctx.createLinearGradient(0, 500, 0, height);
    grad.addColorStop(0, "#7c2d12");
    grad.addColorStop(1, "#b91c1c");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 500, width, 500);
  });

  // Desert Base
  addElement(layer0, "Desert Base", 20, (ctx: any) => {
    ctx.fillStyle = "#78350f";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#d97706";
    ctx.fillRect(0, 600, width, 400);
  });

  // Ice Tundra
  addElement(layer0, "Ice Tundra", 15, (ctx: any) => {
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#e0f2fe";
    ctx.fillRect(0, 650, width, 350);
  });

  // Asteroid Belt
  addElement(layer0, "Asteroid Belt", 10, (ctx: any) => {
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);
    // Rocks
    ctx.fillStyle = "#475569";
    ctx.beginPath();
    ctx.arc(150, 200, 70, 0, Math.PI * 2);
    ctx.arc(850, 300, 90, 0, Math.PI * 2);
    ctx.fill();
  });

  // ==========================
  // 2. FRAME & ARMOR (Order 1)
  // ==========================
  const layer1 = "Frame & Armor";

  const drawMechaBody = (
    ctx: any,
    armorPrimary: string,
    armorSecondary: string,
    jointColor: string,
  ) => {
    // Massive Mecha Shoulders
    drawPixelRect(ctx, 200, 500, 600, 500, jointColor);
    drawPixelRect(ctx, 220, 480, 560, 400, armorPrimary);

    // Shoulder Vents / Plates
    drawPixelRect(ctx, 160, 460, 160, 200, armorSecondary);
    drawPixelRect(ctx, 680, 460, 160, 200, armorSecondary);

    // Chest Cockpit Hatch
    drawPixelRect(ctx, 420, 560, 160, 180, armorSecondary);
    drawPixelRect(ctx, 450, 590, 100, 120, "#00f0ff");

    // Neck Block
    drawPixelRect(ctx, 380, 360, 240, 140, jointColor);
    drawPixelRect(ctx, 400, 380, 200, 100, armorPrimary);
  };

  // Gundam White/Blue
  addElement(layer1, "Gundam White/Blue", 30, (ctx: any) => {
    drawMechaBody(ctx, "#f8fafc", "#2563eb", "#334155");
  });

  // Stealth Black
  addElement(layer1, "Stealth Black", 25, (ctx: any) => {
    drawMechaBody(ctx, "#1e293b", "#0f172a", "#f59e0b");
  });

  // Crimson Comet
  addElement(layer1, "Crimson Comet", 20, (ctx: any) => {
    drawMechaBody(ctx, "#dc2626", "#7f1d1d", "#fef08a");
  });

  // Gold Imperial
  addElement(layer1, "Gold Imperial", 15, (ctx: any) => {
    drawMechaBody(ctx, "#eab308", "#854d0e", "#fef08a");
  });

  // Heavy Artillery Olive
  addElement(layer1, "Heavy Artillery Olive", 10, (ctx: any) => {
    drawMechaBody(ctx, "#65a30d", "#365314", "#ca8a04");
  });

  // ==========================
  // 3. FACEPLATE & OPTICS (Order 2)
  // ==========================
  const layer2 = "Faceplate & Optics";

  // Mecha Head Frame Base
  const drawMechaHead = (ctx: any, headColor: string) => {
    drawPixelRect(ctx, 350, 200, 300, 220, headColor);
    // Chin Guard
    drawPixelRect(ctx, 420, 380, 160, 60, "#334155");
  };

  // Dual Mono-Eye
  addElement(layer2, "Dual Mono-Eye", 30, (ctx: any) => {
    drawMechaHead(ctx, "#f8fafc");
    // Single Glowing Red Sensor Eye Slit
    drawPixelRect(ctx, 370, 290, 260, 40, "#0f172a");
    drawPixelRect(ctx, 470, 295, 60, 30, "#ef4444");
  });

  // Twin Visor
  addElement(layer2, "Twin Visor", 25, (ctx: any) => {
    drawMechaHead(ctx, "#1e293b");
    drawPixelRect(ctx, 380, 280, 110, 50, "#00f0ff");
    drawPixelRect(ctx, 510, 280, 110, 50, "#00f0ff");
  });

  // Combat Mask
  addElement(layer2, "Combat Mask", 20, (ctx: any) => {
    drawMechaHead(ctx, "#dc2626");
    drawPixelRect(ctx, 370, 270, 260, 80, "#450a0a");
    drawPixelRect(ctx, 400, 290, 200, 20, "#fbbf24");
  });

  // Glowing Sensor Crest
  addElement(layer2, "Glowing Sensor Crest", 15, (ctx: any) => {
    drawMechaHead(ctx, "#eab308");
    // V-Fin Crest
    drawPixelRect(ctx, 480, 100, 40, 120, "#eab308");
    drawPixelRect(ctx, 400, 130, 90, 40, "#eab308");
    drawPixelRect(ctx, 510, 130, 90, 40, "#eab308");
  });

  // ==========================
  // 4. WEAPONS & SHIELDS (Order 3)
  // ==========================
  const layer3 = "Weapons & Shields";

  // Beam Rifle
  addElement(layer3, "Beam Rifle", 30, (ctx: any) => {
    // Heavy mecha rifle held right
    drawPixelRect(ctx, 740, 350, 80, 500, "#334155");
    drawPixelRect(ctx, 760, 300, 40, 60, "#00f0ff");
  });

  // Energy Saber
  addElement(layer3, "Energy Saber", 25, (ctx: any) => {
    drawPixelRect(ctx, 750, 100, 30, 600, "#ec4899");
    drawPixelRect(ctx, 730, 680, 70, 60, "#64748b");
  });

  // Gatling Cannon
  addElement(layer3, "Gatling Cannon", 20, (ctx: any) => {
    drawPixelRect(ctx, 720, 300, 120, 450, "#1e293b");
    drawPixelRect(ctx, 730, 250, 25, 60, "#94a3b8");
    drawPixelRect(ctx, 770, 250, 25, 60, "#94a3b8");
    drawPixelRect(ctx, 810, 250, 25, 60, "#94a3b8");
  });

  // Plasma Shield
  addElement(layer3, "Plasma Shield", 15, (ctx: any) => {
    // Left massive tower shield
    drawPixelRect(ctx, 100, 350, 220, 550, "#2563eb");
    drawPixelRect(ctx, 140, 390, 140, 470, "#f8fafc");
  });

  // ==========================
  // 5. BACKPACK & WINGS (Order 4)
  // ==========================
  const layer4 = "Backpack & Wings";

  // Thruster Wings
  addElement(layer4, "Thruster Wings", 30, (ctx: any) => {
    // High mecha wings extending out
    drawPixelRect(ctx, 40, 150, 320, 250, "#1e293b");
    drawPixelRect(ctx, 640, 150, 320, 250, "#1e293b");
    drawPixelRect(ctx, 80, 180, 240, 180, "#ef4444");
    drawPixelRect(ctx, 680, 180, 240, 180, "#ef4444");
  });

  // Heavy Rocket Boosters
  addElement(layer4, "Heavy Rocket Boosters", 25, (ctx: any) => {
    drawPixelRect(ctx, 240, 120, 100, 360, "#475569");
    drawPixelRect(ctx, 660, 120, 100, 360, "#475569");
    drawPixelRect(ctx, 250, 480, 80, 80, "#f97316");
    drawPixelRect(ctx, 670, 480, 80, 80, "#f97316");
  });

  // Cannon Pods
  addElement(layer4, "Cannon Pods", 20, (ctx: any) => {
    drawPixelRect(ctx, 260, 80, 80, 350, "#334155");
    drawPixelRect(ctx, 660, 80, 80, 350, "#334155");
  });

  // ==========================
  // 6. ENERGY SHIELD FX (Order 5)
  // ==========================
  const layer5 = "Energy Shield FX";

  // Forcefield Grid
  addElement(layer5, "Forcefield Grid", 30, (ctx: any) => {
    ctx.strokeStyle = "#00f0ff44";
    ctx.lineWidth = 4;
    for (let r = 100; r < 600; r += 120) {
      ctx.beginPath();
      ctx.arc(500, 500, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  // Spark Discharge
  addElement(layer5, "Spark Discharge", 25, (ctx: any) => {
    ctx.fillStyle = "#facc15";
    const sparks: [number, number][] = [
      [200, 300],
      [800, 350],
      [150, 700],
      [850, 750],
    ];
    sparks.forEach(([sx, sy]) => {
      ctx.fillRect(sx, sy, 30, 30);
    });
  });

  // Smoke Vent
  addElement(layer5, "Smoke Vent", 20, (ctx: any) => {
    ctx.fillStyle = "#64748baa";
    ctx.beginPath();
    ctx.arc(300, 350, 80, 0, Math.PI * 2);
    ctx.arc(700, 350, 80, 0, Math.PI * 2);
    ctx.fill();
  });

  // None
  addElement(layer5, "None", 10, (_ctx: any) => {
    // empty
  });

  return generated;
}
