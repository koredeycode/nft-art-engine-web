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

export function generateNotebookDoodlesArt(outputDir: string): GeneratedElement[] {
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
    const filename = `doodle_${sanitizedLayer}_${sanitizedElement}_${weight}.png`;
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
  // 1. PAPER SURFACE (Order 0)
  // ==========================
  const layer0 = "Paper Surface";

  // Grid Notebook
  addElement(layer0, "Grid Notebook", 30, (ctx: any) => {
    ctx.fillStyle = "#fefce8";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#bae6fd";
    ctx.lineWidth = 2;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Red margin line
    ctx.strokeStyle = "#fca5a5";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(120, 0);
    ctx.lineTo(120, height);
    ctx.stroke();
  });

  // Dark Chalkboard
  addElement(layer0, "Dark Chalkboard", 25, (ctx: any) => {
    ctx.fillStyle = "#1c1917";
    ctx.fillRect(0, 0, width, height);

    // Chalk dust texture
    ctx.fillStyle = "#ffffff15";
    for (let i = 0; i < 150; i++) {
      ctx.fillRect((i * 197) % width, (i * 283) % height, (i % 5) + 2, (i % 5) + 2);
    }
  });

  // Kraft Brown Paper
  addElement(layer0, "Kraft Brown Paper", 20, (ctx: any) => {
    ctx.fillStyle = "#d97706";
    ctx.fillRect(0, 0, width, height);
  });

  // Blueprint Blue
  addElement(layer0, "Blueprint Blue", 15, (ctx: any) => {
    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#93c5fd44";
    ctx.lineWidth = 2;
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  });

  // ==========================
  // 2. DOODLE CREATURE (Order 1)
  // ==========================
  const layer1 = "Doodle Creature";

  // High Contrast Doodle Body with outer white/black backing stroke
  const drawDoodleBody = (ctx: any, fillColor: string, strokeColor: string) => {
    // White/High-contrast backdrop outline for 100% visibility on dark/light backgrounds
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(500, 380, 168, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(372, 532, 256, 276, 46);
    ctx.fill();

    // Colored Fill
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.arc(500, 380, 160, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(380, 540, 240, 260, 40);
    ctx.fill();

    // Bold Outer Stroke
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 12;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.arc(500, 380, 160, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(380, 540, 240, 260, 40);
    ctx.stroke();

    // Stick Arms
    ctx.beginPath();
    ctx.moveTo(380, 600);
    ctx.lineTo(250, 670);
    ctx.moveTo(620, 600);
    ctx.lineTo(750, 670);
    ctx.stroke();
  };

  // Stick Figure Hero
  addElement(layer1, "Stick Figure Hero", 30, (ctx: any) => {
    drawDoodleBody(ctx, "#fef08a", "#0f172a");
  });

  // Doodle Monster
  addElement(layer1, "Doodle Monster", 25, (ctx: any) => {
    drawDoodleBody(ctx, "#60a5fa", "#1e3a8a");
  });

  // Sketch Cat
  addElement(layer1, "Sketch Cat", 20, (ctx: any) => {
    drawDoodleBody(ctx, "#f472b6", "#881337");
    // Cat ears with high contrast
    ctx.strokeStyle = "#881337";
    ctx.lineWidth = 12;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(370, 260);
    ctx.lineTo(330, 150);
    ctx.lineTo(430, 230);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(630, 260);
    ctx.lineTo(670, 150);
    ctx.lineTo(570, 230);
    ctx.fill();
    ctx.stroke();
  });

  // Cartoon Ghost
  addElement(layer1, "Cartoon Ghost", 15, (ctx: any) => {
    drawDoodleBody(ctx, "#ffffff", "#0f172a");
  });

  // ==========================
  // 3. EXPRESSION & EYES (Order 2)
  // ==========================
  const layer2 = "Expression & Eyes";

  // Googly Eyes
  addElement(layer2, "Googly Eyes", 30, (ctx: any) => {
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 8;
    ctx.fillStyle = "#ffffff";

    ctx.beginPath();
    ctx.arc(430, 360, 38, 0, Math.PI * 2);
    ctx.arc(570, 360, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(440, 365, 14, 0, Math.PI * 2);
    ctx.arc(560, 365, 14, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.beginPath();
    ctx.arc(500, 420, 40, 0.2, Math.PI - 0.2);
    ctx.stroke();
  });

  // X_X Eyes
  addElement(layer2, "X_X Eyes", 25, (ctx: any) => {
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 12;

    // X 1
    ctx.beginPath();
    ctx.moveTo(400, 340);
    ctx.lineTo(450, 390);
    ctx.moveTo(450, 340);
    ctx.lineTo(400, 390);

    // X 2
    ctx.moveTo(550, 340);
    ctx.lineTo(600, 390);
    ctx.moveTo(600, 340);
    ctx.lineTo(550, 390);
    ctx.stroke();
  });

  // Heart Eyes
  addElement(layer2, "Heart Eyes", 20, (ctx: any) => {
    ctx.fillStyle = "#ec4899";
    ctx.beginPath();
    ctx.arc(430, 360, 30, 0, Math.PI * 2);
    ctx.arc(570, 360, 30, 0, Math.PI * 2);
    ctx.fill();
  });

  // ==========================
  // 4. DOODLE HATS (Order 3)
  // ==========================
  const layer3 = "Doodle Hats";

  // Paper Boat Hat
  addElement(layer3, "Paper Boat Hat", 30, (ctx: any) => {
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(310, 230);
    ctx.lineTo(690, 230);
    ctx.lineTo(500, 100);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // Doodle Party Crown
  addElement(layer3, "Doodle Party Crown", 25, (ctx: any) => {
    ctx.fillStyle = "#facc15";
    ctx.strokeStyle = "#854d0e";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(350, 230);
    ctx.lineTo(330, 130);
    ctx.lineTo(420, 170);
    ctx.lineTo(500, 90);
    ctx.lineTo(580, 170);
    ctx.lineTo(670, 130);
    ctx.lineTo(650, 230);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // Propeller Cap
  addElement(layer3, "Propeller Cap", 20, (ctx: any) => {
    ctx.fillStyle = "#ef4444";
    ctx.strokeStyle = "#7f1d1d";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(500, 220, 125, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

    // Yellow Propeller Blades
    ctx.fillStyle = "#facc15";
    ctx.fillRect(430, 85, 140, 20);
  });

  // ==========================
  // 5. SCRIBBLE FX (Order 4)
  // ==========================
  const layer4 = "Scribble FX";

  // Star Scribbles
  addElement(layer4, "Star Scribbles", 30, (ctx: any) => {
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 8;
    const stars: [number, number][] = [
      [180, 200],
      [820, 220],
      [160, 750],
      [840, 780],
    ];
    stars.forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.moveTo(sx - 25, sy);
      ctx.lineTo(sx + 25, sy);
      ctx.moveTo(sx, sy - 25);
      ctx.lineTo(sx, sy + 25);
      ctx.stroke();
    });
  });

  // Lightning Bolts
  addElement(layer4, "Lightning Bolts", 25, (ctx: any) => {
    ctx.fillStyle = "#facc15";
    ctx.strokeStyle = "#854d0e";
    ctx.lineWidth = 6;

    ctx.beginPath();
    ctx.moveTo(200, 280);
    ctx.lineTo(150, 360);
    ctx.lineTo(210, 360);
    ctx.lineTo(160, 460);
    ctx.lineTo(230, 380);
    ctx.lineTo(180, 380);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // Thought Bubble
  addElement(layer4, "Thought Bubble", 20, (ctx: any) => {
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(760, 200, 75, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  // None
  addElement(layer4, "None", 10, (_ctx: any) => {
    // empty
  });

  return generated;
}
