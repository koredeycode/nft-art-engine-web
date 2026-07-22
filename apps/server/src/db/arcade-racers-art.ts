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

export function generateArcadeRacersArt(outputDir: string): GeneratedElement[] {
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
    const filename = `racer_${sanitizedLayer}_${sanitizedElement}_${weight}.png`;
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
  // 1. TRACK & HORIZON (Order 0)
  // ==========================
  const layer0 = "Track & Horizon";

  // Neon Highway
  addElement(layer0, "Neon Highway", 30, (ctx: any) => {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#180033");
    grad.addColorStop(0.5, "#4c007d");
    grad.addColorStop(1, "#050014");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Road Grid Perspective
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(350, 450);
    ctx.lineTo(650, 450);
    ctx.lineTo(950, height);
    ctx.lineTo(50, height);
    ctx.fill();

    // Neon Lines
    ctx.strokeStyle = "#ff0077";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(500, 450);
    ctx.lineTo(500, height);
    ctx.stroke();
  });

  // Desert Canyon
  addElement(layer0, "Desert Canyon", 25, (ctx: any) => {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#7c2d12");
    grad.addColorStop(0.5, "#c2410c");
    grad.addColorStop(1, "#1c1917");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Canyon Road
    ctx.fillStyle = "#292524";
    ctx.beginPath();
    ctx.moveTo(380, 450);
    ctx.lineTo(620, 450);
    ctx.lineTo(900, height);
    ctx.lineTo(100, height);
    ctx.fill();
  });

  // Cyber Grid City
  addElement(layer0, "Cyber Grid City", 20, (ctx: any) => {
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#00f0ff55";
    ctx.lineWidth = 4;
    for (let y = 450; y <= height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  });

  // Tokyo Night Drift
  addElement(layer0, "Tokyo Night Drift", 15, (ctx: any) => {
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, width, height);

    // Tokyo Neon Lights
    ctx.fillStyle = "#ec4899";
    ctx.fillRect(100, 200, 40, 250);
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(860, 180, 50, 270);
  });

  // Tropical Sunset
  addElement(layer0, "Tropical Sunset", 10, (ctx: any) => {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#831843");
    grad.addColorStop(0.5, "#be185d");
    grad.addColorStop(1, "#f59e0b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Sun
    ctx.fillStyle = "#fef08a";
    ctx.beginPath();
    ctx.arc(500, 400, 150, 0, Math.PI * 2);
    ctx.fill();
  });

  // ==========================
  // 2. CAR CHASSIS (Order 1)
  // ==========================
  const layer1 = "Car Chassis";

  const drawCarRear = (ctx: any, bodyColor: string, cabinColor: string, tailLightColor: string) => {
    // Main Car Body (Rear View)
    drawPixelRect(ctx, 220, 560, 560, 240, bodyColor);
    // Cabin Roof
    drawPixelRect(ctx, 320, 440, 360, 140, cabinColor);
    // Rear Windshield Glass
    drawPixelRect(ctx, 350, 460, 300, 90, "#1e293b");

    // Taillights
    drawPixelRect(ctx, 240, 600, 120, 45, tailLightColor);
    drawPixelRect(ctx, 640, 600, 120, 45, tailLightColor);

    // License Plate
    drawPixelRect(ctx, 440, 660, 120, 40, "#ffffff");
    drawPixelRect(ctx, 460, 670, 80, 20, "#000000");
  };

  // Countach Supercar
  addElement(layer1, "Countach Supercar", 30, (ctx: any) => {
    drawCarRear(ctx, "#ef4444", "#991b1b", "#ff0033");
  });

  // Cyber Truck
  addElement(layer1, "Cyber Truck", 25, (ctx: any) => {
    drawCarRear(ctx, "#cbd5e1", "#475569", "#00f0ff");
  });

  // Retro Muscle Car
  addElement(layer1, "Retro Muscle Car", 20, (ctx: any) => {
    drawCarRear(ctx, "#1e1b4b", "#312e81", "#f59e0b");
  });

  // Hover Speeder
  addElement(layer1, "Hover Speeder", 15, (ctx: any) => {
    drawCarRear(ctx, "#06b6d4", "#164e63", "#a5f3fc");
  });

  // Formula Pixel
  addElement(layer1, "Formula Pixel", 10, (ctx: any) => {
    drawCarRear(ctx, "#eab308", "#854d0e", "#ef4444");
  });

  // ==========================
  // 3. PAINT JOB & LIVERY (Order 2)
  // ==========================
  const layer2 = "Paint Job & Livery";

  // Hot Pink Flame
  addElement(layer2, "Hot Pink Flame", 30, (ctx: any) => {
    drawPixelRect(ctx, 240, 560, 560, 40, "#ec4899");
  });

  // Matrix Code
  addElement(layer2, "Matrix Code", 25, (ctx: any) => {
    ctx.fillStyle = "#22c55e";
    const drops: [number, number][] = [
      [260, 580],
      [380, 570],
      [620, 580],
      [700, 570],
    ];
    drops.forEach(([x, y]) => {
      ctx.fillRect(x, y, 15, 80);
    });
  });

  // Chrome Mirror
  addElement(layer2, "Chrome Mirror", 20, (ctx: any) => {
    drawPixelRect(ctx, 220, 680, 560, 20, "#ffffff");
  });

  // Racing Stripes
  addElement(layer2, "Racing Stripes", 15, (ctx: any) => {
    drawPixelRect(ctx, 470, 440, 20, 340, "#ffffff");
    drawPixelRect(ctx, 510, 440, 20, 340, "#ffffff");
  });

  // Police Interceptor
  addElement(layer2, "Police Interceptor", 10, (ctx: any) => {
    drawPixelRect(ctx, 220, 700, 560, 100, "#ffffff");
  });

  // ==========================
  // 4. WHEELS & RIMS (Order 3)
  // ==========================
  const layer3 = "Wheels & Rims";

  // Glowing Neon Spoke
  addElement(layer3, "Glowing Neon Spoke", 30, (ctx: any) => {
    // Rear tires
    drawPixelRect(ctx, 160, 720, 100, 140, "#0f172a");
    drawPixelRect(ctx, 740, 720, 100, 140, "#0f172a");
    // Neon Rims
    drawPixelRect(ctx, 180, 750, 60, 80, "#00f0ff");
    drawPixelRect(ctx, 760, 750, 60, 80, "#00f0ff");
  });

  // Golden Wire Rims
  addElement(layer3, "Golden Wire Rims", 25, (ctx: any) => {
    drawPixelRect(ctx, 160, 720, 100, 140, "#0f172a");
    drawPixelRect(ctx, 740, 720, 100, 140, "#0f172a");
    drawPixelRect(ctx, 180, 750, 60, 80, "#eab308");
    drawPixelRect(ctx, 760, 750, 60, 80, "#eab308");
  });

  // Floating Mag-Lev Pods
  addElement(layer3, "Floating Mag-Lev Pods", 20, (ctx: any) => {
    ctx.fillStyle = "#38bdf8aa";
    ctx.beginPath();
    ctx.arc(210, 800, 60, 0, Math.PI * 2);
    ctx.arc(790, 800, 60, 0, Math.PI * 2);
    ctx.fill();
  });

  // Monster Tread
  addElement(layer3, "Monster Tread", 15, (ctx: any) => {
    drawPixelRect(ctx, 120, 700, 150, 170, "#1e293b");
    drawPixelRect(ctx, 730, 700, 150, 170, "#1e293b");
  });

  // ==========================
  // 5. SPOILERS & TURBOS (Order 4)
  // ==========================
  const layer4 = "Spoilers & Turbos";

  // Dual Carbon Wing
  addElement(layer4, "Dual Carbon Wing", 30, (ctx: any) => {
    // High Rear Spoiler
    drawPixelRect(ctx, 180, 480, 640, 40, "#0f172a");
    drawPixelRect(ctx, 240, 520, 30, 60, "#0f172a");
    drawPixelRect(ctx, 730, 520, 30, 60, "#0f172a");
  });

  // Twin Nitro Exhaust
  addElement(layer4, "Twin Nitro Exhaust", 25, (ctx: any) => {
    drawPixelRect(ctx, 360, 780, 50, 50, "#64748b");
    drawPixelRect(ctx, 590, 780, 50, 50, "#64748b");
    // Blue Nitro Flame
    drawPixelRect(ctx, 365, 830, 40, 60, "#38bdf8");
    drawPixelRect(ctx, 595, 830, 40, 60, "#38bdf8");
  });

  // Rocket Booster
  addElement(layer4, "Rocket Booster", 20, (ctx: any) => {
    drawPixelRect(ctx, 450, 730, 100, 80, "#334155");
    drawPixelRect(ctx, 460, 810, 80, 90, "#f97316");
  });

  // Police Lightbar
  addElement(layer4, "Police Lightbar", 15, (ctx: any) => {
    drawPixelRect(ctx, 380, 400, 240, 35, "#0f172a");
    drawPixelRect(ctx, 400, 405, 90, 25, "#ef4444");
    drawPixelRect(ctx, 510, 405, 90, 25, "#3b82f6");
  });

  // ==========================
  // 6. ATMOSPHERIC FX (Order 5)
  // ==========================
  const layer5 = "Atmospheric FX";

  // Speed Lines
  addElement(layer5, "Speed Lines", 30, (ctx: any) => {
    ctx.fillStyle = "#ffffffaa";
    for (let x = 50; x < width; x += 180) {
      ctx.fillRect(x, 0, 8, height);
    }
  });

  // Tire Smoke Dust
  addElement(layer5, "Tire Smoke Dust", 25, (ctx: any) => {
    ctx.fillStyle = "#94a3b8aa";
    ctx.beginPath();
    ctx.arc(150, 850, 100, 0, Math.PI * 2);
    ctx.arc(850, 850, 100, 0, Math.PI * 2);
    ctx.fill();
  });

  // Neon Grid Bloom
  addElement(layer5, "Neon Grid Bloom", 20, (ctx: any) => {
    const grad = ctx.createRadialGradient(500, 700, 100, 500, 700, 450);
    grad.addColorStop(0, "#ff007766");
    grad.addColorStop(1, "#00000000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  });

  // Rain Droplets
  addElement(layer5, "Rain Droplets", 15, (ctx: any) => {
    ctx.fillStyle = "#38bdf888";
    for (let i = 0; i < 50; i++) {
      ctx.fillRect((i * 197) % width, (i * 283) % height, 4, 30);
    }
  });

  // None
  addElement(layer5, "None", 10, (_ctx: any) => {
    // empty
  });

  return generated;
}
