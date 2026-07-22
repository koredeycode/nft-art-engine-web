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

export function generateSacredGeometryArt(outputDir: string): GeneratedElement[] {
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
    ctx.imageSmoothingEnabled = true;

    drawFn(ctx);

    const sanitizedLayer = layerName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const sanitizedElement = cleanName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `sacred_${sanitizedLayer}_${sanitizedElement}_${weight}.png`;
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

  // ==========================
  // 1. BACKGROUND TEXTURE (Order 0)
  // ==========================
  const layer0 = "Background Texture";

  // Deep Velvet
  addElement(layer0, "Deep Velvet", 30, (ctx: any) => {
    const grad = ctx.createRadialGradient(500, 500, 50, 500, 500, 600);
    grad.addColorStop(0, "#4c1d95");
    grad.addColorStop(1, "#0f172a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  });

  // Cosmic Galaxy
  addElement(layer0, "Cosmic Galaxy", 25, (ctx: any) => {
    const grad = ctx.createRadialGradient(500, 500, 50, 500, 500, 600);
    grad.addColorStop(0, "#0369a1");
    grad.addColorStop(1, "#020617");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  });

  // Dark Marble
  addElement(layer0, "Dark Marble", 20, (ctx: any) => {
    ctx.fillStyle = "#18181b";
    ctx.fillRect(0, 0, width, height);
  });

  // Parchment Paper
  addElement(layer0, "Parchment Paper", 15, (ctx: any) => {
    ctx.fillStyle = "#fef3c7";
    ctx.fillRect(0, 0, width, height);
  });

  // ==========================
  // 2. SACRED POLYGON (Order 1)
  // ==========================
  const layer1 = "Sacred Polygon";

  // Flower of Life
  addElement(layer1, "Flower of Life", 30, (ctx: any) => {
    ctx.strokeStyle = "#eab308aa";
    ctx.lineWidth = 4;

    const centerR = 120;
    ctx.beginPath();
    ctx.arc(500, 500, centerR, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      const cx = 500 + Math.cos(a) * centerR;
      const cy = 500 + Math.sin(a) * centerR;
      ctx.beginPath();
      ctx.arc(cx, cy, centerR, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  // Metatron Cube
  addElement(layer1, "Metatron Cube", 25, (ctx: any) => {
    ctx.strokeStyle = "#e2e8f0aa";
    ctx.lineWidth = 4;
    const r = 240;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      const hx = 500 + r * Math.cos(a);
      const hy = 500 + r * Math.sin(a);
      ctx.lineTo(hx, hy);
      for (let j = i + 1; j < 6; j++) {
        const a2 = (Math.PI / 3) * j;
        const hx2 = 500 + r * Math.cos(a2);
        const hy2 = 500 + r * Math.sin(a2);
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx2, hy2);
      }
    }
    ctx.stroke();
  });

  // Sri Yantra
  addElement(layer1, "Sri Yantra", 20, (ctx: any) => {
    ctx.strokeStyle = "#f59e0baa";
    ctx.lineWidth = 4;
    for (let s = 100; s <= 350; s += 60) {
      ctx.beginPath();
      ctx.moveTo(500, 500 - s);
      ctx.lineTo(500 + s, 500 + s);
      ctx.lineTo(500 - s, 500 + s);
      ctx.closePath();
      ctx.stroke();
    }
  });

  // ==========================
  // 3. INNER RING (Order 2)
  // ==========================
  const layer2 = "Inner Ring";

  // Concentric Orbs
  addElement(layer2, "Concentric Orbs", 30, (ctx: any) => {
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 6;
    for (let r = 160; r <= 380; r += 50) {
      ctx.beginPath();
      ctx.arc(500, 500, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  // Solar Radiance
  addElement(layer2, "Solar Radiance", 25, (ctx: any) => {
    ctx.strokeStyle = "#facc15aa";
    ctx.lineWidth = 4;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
      ctx.beginPath();
      ctx.moveTo(500 + Math.cos(a) * 150, 500 + Math.sin(a) * 150);
      ctx.lineTo(500 + Math.cos(a) * 360, 500 + Math.sin(a) * 360);
      ctx.stroke();
    }
  });

  // ==========================
  // 4. CENTER GEMSTONE (Order 3)
  // ==========================
  const layer3 = "Center Gemstone";

  // Amethyst
  addElement(layer3, "Amethyst", 30, (ctx: any) => {
    const grad = ctx.createRadialGradient(500, 500, 10, 500, 500, 80);
    grad.addColorStop(0, "#c084fc");
    grad.addColorStop(1, "#6b21a8");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(500, 500, 70, 0, Math.PI * 2);
    ctx.fill();
  });

  // Emerald
  addElement(layer3, "Emerald", 25, (ctx: any) => {
    const grad = ctx.createRadialGradient(500, 500, 10, 500, 500, 80);
    grad.addColorStop(0, "#34d399");
    grad.addColorStop(1, "#047857");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(500, 500, 70, 0, Math.PI * 2);
    ctx.fill();
  });

  // Sapphire
  addElement(layer3, "Sapphire", 20, (ctx: any) => {
    const grad = ctx.createRadialGradient(500, 500, 10, 500, 500, 80);
    grad.addColorStop(0, "#38bdf8");
    grad.addColorStop(1, "#0369a1");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(500, 500, 70, 0, Math.PI * 2);
    ctx.fill();
  });

  // Ruby
  addElement(layer3, "Ruby", 15, (ctx: any) => {
    const grad = ctx.createRadialGradient(500, 500, 10, 500, 500, 80);
    grad.addColorStop(0, "#f43f5e");
    grad.addColorStop(1, "#be123c");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(500, 500, 70, 0, Math.PI * 2);
    ctx.fill();
  });

  // ==========================
  // 5. FOIL POLISH (Order 4)
  // ==========================
  const layer4 = "Foil Polish";

  // Gold Leaf Shine
  addElement(layer4, "Gold Leaf Shine", 30, (ctx: any) => {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#fef08a44");
    grad.addColorStop(0.5, "#eab30888");
    grad.addColorStop(1, "#fef08a44");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  });

  // Silver Foil Shimmer
  addElement(layer4, "Silver Foil Shimmer", 25, (ctx: any) => {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#f8fafc44");
    grad.addColorStop(0.5, "#cbd5e188");
    grad.addColorStop(1, "#f8fafc44");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  });

  // None
  addElement(layer4, "None", 10, (_ctx: any) => {
    // empty
  });

  return generated;
}
