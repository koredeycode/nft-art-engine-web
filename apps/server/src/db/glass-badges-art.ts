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

export function generateGlassBadgesArt(outputDir: string): GeneratedElement[] {
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
    const filename = `badge_${sanitizedLayer}_${sanitizedElement}_${weight}.png`;
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
  // 1. CARD GLASS BASE (Order 0)
  // ==========================
  const layer0 = "Card Glass Base";

  // Dark Obsidian
  addElement(layer0, "Dark Obsidian", 30, (ctx: any) => {
    const grad = ctx.createLinearGradient(150, 150, 850, 850);
    grad.addColorStop(0, "#1e293bdd");
    grad.addColorStop(1, "#0f172add");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(150, 150, 700, 700, 40);
    ctx.fill();
  });

  // Frosted Sapphire
  addElement(layer0, "Frosted Sapphire", 25, (ctx: any) => {
    const grad = ctx.createLinearGradient(150, 150, 850, 850);
    grad.addColorStop(0, "#1e40afdd");
    grad.addColorStop(1, "#0369a1dd");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(150, 150, 700, 700, 40);
    ctx.fill();
  });

  // Emerald Crystal
  addElement(layer0, "Emerald Crystal", 20, (ctx: any) => {
    const grad = ctx.createLinearGradient(150, 150, 850, 850);
    grad.addColorStop(0, "#065f46dd");
    grad.addColorStop(1, "#047857dd");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(150, 150, 700, 700, 40);
    ctx.fill();
  });

  // Ruby Quartz
  addElement(layer0, "Ruby Quartz", 15, (ctx: any) => {
    const grad = ctx.createLinearGradient(150, 150, 850, 850);
    grad.addColorStop(0, "#9f1239dd");
    grad.addColorStop(1, "#be123cdd");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(150, 150, 700, 700, 40);
    ctx.fill();
  });

  // Holographic Iridescent
  addElement(layer0, "Holographic Iridescent", 10, (ctx: any) => {
    const grad = ctx.createLinearGradient(150, 150, 850, 850);
    grad.addColorStop(0, "#ec4899cc");
    grad.addColorStop(0.5, "#8b5cf6cc");
    grad.addColorStop(1, "#06b6d4cc");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(150, 150, 700, 700, 40);
    ctx.fill();
  });

  // ==========================
  // 2. FRAME & BEZEL (Order 1)
  // ==========================
  const layer1 = "Frame & Bezel";

  // Gold Metal Rim
  addElement(layer1, "Gold Metal Rim", 30, (ctx: any) => {
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.roundRect(150, 150, 700, 700, 40);
    ctx.stroke();
  });

  // Neon Cyber Ring
  addElement(layer1, "Neon Cyber Ring", 25, (ctx: any) => {
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(500, 500, 320, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Titanium Hexagon
  addElement(layer1, "Titanium Hexagon", 20, (ctx: any) => {
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 18;
    const r = 320;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hx = 500 + r * Math.cos(angle);
      const hy = 500 + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();
  });

  // Platinum Bezel
  addElement(layer1, "Platinum Bezel", 15, (ctx: any) => {
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.roundRect(150, 150, 700, 700, 40);
    ctx.stroke();
  });

  // ==========================
  // 3. 3D EMBLEM CORE (Order 2)
  // ==========================
  const layer2 = "3D Emblem Core";

  // Cosmic Portal
  addElement(layer2, "Cosmic Portal", 30, (ctx: any) => {
    const grad = ctx.createRadialGradient(500, 500, 20, 500, 500, 200);
    grad.addColorStop(0, "#a855f7");
    grad.addColorStop(1, "#3b82f6");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(500, 500, 180, 0, Math.PI * 2);
    ctx.fill();
  });

  // Diamond Crown
  addElement(layer2, "Diamond Crown", 25, (ctx: any) => {
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.moveTo(350, 580);
    ctx.lineTo(330, 400);
    ctx.lineTo(420, 480);
    ctx.lineTo(500, 360);
    ctx.lineTo(580, 480);
    ctx.lineTo(670, 400);
    ctx.lineTo(650, 580);
    ctx.closePath();
    ctx.fill();
  });

  // Lightning Bolt
  addElement(layer2, "Lightning Bolt", 20, (ctx: any) => {
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.moveTo(520, 320);
    ctx.lineTo(420, 500);
    ctx.lineTo(500, 500);
    ctx.lineTo(460, 680);
    ctx.lineTo(580, 480);
    ctx.lineTo(500, 480);
    ctx.closePath();
    ctx.fill();
  });

  // Skull Crest
  addElement(layer2, "Skull Crest", 15, (ctx: any) => {
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.arc(500, 460, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(440, 530, 120, 80);
  });

  // Phoenix Wings
  addElement(layer2, "Phoenix Wings", 10, (ctx: any) => {
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(380, 480, 140, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(620, 480, 140, Math.PI * 1.5, Math.PI * 0.5);
    ctx.fill();
  });

  // ==========================
  // 4. ENGRAVINGS & TRACES (Order 3)
  // ==========================
  const layer3 = "Engravings & Traces";

  // Circuit Traces
  addElement(layer3, "Circuit Traces", 30, (ctx: any) => {
    ctx.strokeStyle = "#00f0ff88";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(200, 300);
    ctx.lineTo(350, 300);
    ctx.lineTo(400, 350);
    ctx.moveTo(800, 700);
    ctx.lineTo(650, 700);
    ctx.lineTo(600, 650);
    ctx.stroke();
  });

  // Runic Engravings
  addElement(layer3, "Runic Engravings", 25, (ctx: any) => {
    ctx.strokeStyle = "#fbbf24aa";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(500, 500, 240, 0, Math.PI * 1.8);
    ctx.stroke();
  });

  // Serial Badges
  addElement(layer3, "Serial Badges", 20, (ctx: any) => {
    ctx.fillStyle = "#ffffffaa";
    ctx.fillRect(350, 750, 300, 40);
  });

  // ==========================
  // 5. LIGHTING & GLOW (Order 4)
  // ==========================
  const layer4 = "Lighting & Glow";

  // Cyan Rim Light
  addElement(layer4, "Cyan Rim Light", 30, (ctx: any) => {
    const grad = ctx.createRadialGradient(300, 300, 10, 300, 300, 400);
    grad.addColorStop(0, "#00f0ffaa");
    grad.addColorStop(1, "#00000000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  });

  // Magenta Neon Halo
  addElement(layer4, "Magenta Neon Halo", 25, (ctx: any) => {
    const grad = ctx.createRadialGradient(500, 500, 200, 500, 500, 450);
    grad.addColorStop(0, "#ec489966");
    grad.addColorStop(1, "#00000000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  });

  // Solar Flare Glint
  addElement(layer4, "Solar Flare Glint", 20, (ctx: any) => {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(700, 250, 25, 0, Math.PI * 2);
    ctx.fill();
  });

  // None
  addElement(layer4, "None", 10, (_ctx: any) => {
    // empty
  });

  return generated;
}
