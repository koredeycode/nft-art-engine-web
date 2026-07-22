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

export function generateSynthwaveCardsArt(outputDir: string): GeneratedElement[] {
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
    const filename = `synth_${sanitizedLayer}_${sanitizedElement}_${weight}.png`;
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
  // 1. GRID HORIZON (Order 0)
  // ==========================
  const layer0 = "Grid Horizon";

  // Retro Grid Floor
  addElement(layer0, "Retro Grid Floor", 30, (ctx: any) => {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#1e0533");
    grad.addColorStop(0.5, "#4c007d");
    grad.addColorStop(1, "#030008");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#ff0077aa";
    ctx.lineWidth = 4;
    for (let y = 500; y <= height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  });

  // Wireframe Mountain
  addElement(layer0, "Wireframe Mountain", 25, (ctx: any) => {
    ctx.fillStyle = "#0c051a";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#00f0ffaa";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 500);
    ctx.lineTo(250, 250);
    ctx.lineTo(500, 500);
    ctx.lineTo(750, 200);
    ctx.lineTo(1000, 500);
    ctx.stroke();
  });

  // Midnight City Skyline
  addElement(layer0, "Midnight City Skyline", 20, (ctx: any) => {
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(100, 250, 140, 250);
    ctx.fillRect(300, 200, 180, 300);
    ctx.fillRect(600, 150, 200, 350);
  });

  // ==========================
  // 2. CELESTIAL SUN (Order 1)
  // ==========================
  const layer1 = "Celestial Sun";

  // Segmented Neon Sun
  addElement(layer1, "Segmented Neon Sun", 30, (ctx: any) => {
    const sunGrad = ctx.createLinearGradient(0, 200, 0, 600);
    sunGrad.addColorStop(0, "#facc15");
    sunGrad.addColorStop(1, "#ec4899");
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(500, 420, 200, 0, Math.PI * 2);
    ctx.fill();

    // Horizontal cuts
    ctx.fillStyle = "#1e0533";
    for (let y = 400; y < 620; y += 22) {
      ctx.fillRect(280, y, 440, (y - 400) / 10 + 4);
    }
  });

  // Eclipse Ring
  addElement(layer1, "Eclipse Ring", 25, (ctx: any) => {
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.arc(500, 420, 200, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Glowing Palm Moon
  addElement(layer1, "Glowing Palm Moon", 20, (ctx: any) => {
    ctx.fillStyle = "#c084fc";
    ctx.beginPath();
    ctx.arc(500, 420, 180, 0, Math.PI * 2);
    ctx.fill();
  });

  // ==========================
  // 3. FOREGROUND SUBJECT (Order 2)
  // ==========================
  const layer2 = "Foreground Subject";

  // Cassette Tape
  addElement(layer2, "Cassette Tape", 30, (ctx: any) => {
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(250, 480, 500, 300, 30);
    ctx.fill();

    // Spools
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(380, 600, 50, 0, Math.PI * 2);
    ctx.arc(620, 600, 50, 0, Math.PI * 2);
    ctx.fill();
  });

  // Retro Arcade Cabinet
  addElement(layer2, "Retro Arcade Cabinet", 25, (ctx: any) => {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(320, 350, 360, 450);
    // Glowing Screen
    ctx.fillStyle = "#00f0ff";
    ctx.fillRect(360, 400, 280, 200);
  });

  // Neon Palm Tree
  addElement(layer2, "Neon Palm Tree", 20, (ctx: any) => {
    ctx.fillStyle = "#ff0077";
    ctx.fillRect(480, 400, 40, 400);
    // Leaves
    ctx.beginPath();
    ctx.arc(400, 400, 120, Math.PI, Math.PI * 1.5);
    ctx.arc(600, 400, 120, Math.PI * 1.5, Math.PI * 2);
    ctx.fill();
  });

  // ==========================
  // 4. NEON FRAME (Order 3)
  // ==========================
  const layer3 = "Neon Frame";

  // Neon Triangle
  addElement(layer3, "Neon Triangle", 30, (ctx: any) => {
    ctx.strokeStyle = "#ff0077";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(500, 150);
    ctx.lineTo(850, 750);
    ctx.lineTo(150, 750);
    ctx.closePath();
    ctx.stroke();
  });

  // Hexagon Shield
  addElement(layer3, "Hexagon Shield", 25, (ctx: any) => {
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 14;
    const r = 380;
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

  // ==========================
  // 5. VHS GLITCH & FX (Order 4)
  // ==========================
  const layer4 = "VHS Glitch & FX";

  // CRT Scanlines
  addElement(layer4, "CRT Scanlines", 30, (ctx: any) => {
    ctx.fillStyle = "#00000044";
    for (let y = 0; y < height; y += 6) {
      ctx.fillRect(0, y, width, 3);
    }
  });

  // Chromatic Aberration
  addElement(layer4, "Chromatic Aberration", 25, (ctx: any) => {
    ctx.fillStyle = "#ff007733";
    ctx.fillRect(100, 300, 800, 20);
    ctx.fillStyle = "#00f0ff33";
    ctx.fillRect(100, 600, 800, 20);
  });

  // None
  addElement(layer4, "None", 10, (_ctx: any) => {
    // empty
  });

  return generated;
}
