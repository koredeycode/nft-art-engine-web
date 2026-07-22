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

export function generateVectorAvatarsArt(outputDir: string): GeneratedElement[] {
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
    const filename = `vector_${sanitizedLayer}_${sanitizedElement}_${weight}.png`;
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

  // Helper for crisp vector drawing
  const drawPixelRect = (ctx: any, x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  };

  // ==========================
  // 1. SOLID BACKGROUND (Order 0)
  // ==========================
  const layer0 = "Solid Background";

  addElement(layer0, "Pastel Mint", 30, (ctx: any) => {
    ctx.fillStyle = "#a7f3d0";
    ctx.fillRect(0, 0, width, height);
  });

  addElement(layer0, "Sunset Orange", 25, (ctx: any) => {
    ctx.fillStyle = "#fed7aa";
    ctx.fillRect(0, 0, width, height);
  });

  addElement(layer0, "Electric Indigo", 20, (ctx: any) => {
    ctx.fillStyle = "#c7d2fe";
    ctx.fillRect(0, 0, width, height);
  });

  addElement(layer0, "Cream Sand", 15, (ctx: any) => {
    ctx.fillStyle = "#fef3c7";
    ctx.fillRect(0, 0, width, height);
  });

  addElement(layer0, "Dark Charcoal", 10, (ctx: any) => {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, width, height);
  });

  // ==========================
  // 2. BASE HEAD & SKIN (Order 1)
  // ==========================
  const layer1 = "Base Head & Skin";

  const drawHeadShape = (ctx: any, skinTone: string) => {
    // Neck
    ctx.fillStyle = skinTone;
    ctx.fillRect(430, 480, 140, 160);

    // Head Oval / Rounded Rect
    ctx.beginPath();
    ctx.roundRect(330, 200, 340, 340, 100);
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.arc(310, 360, 35, 0, Math.PI * 2);
    ctx.arc(690, 360, 35, 0, Math.PI * 2);
    ctx.fill();
  };

  addElement(layer1, "Warm Skin", 30, (ctx: any) => {
    drawHeadShape(ctx, "#fde047");
  });

  addElement(layer1, "Soft Pink Skin", 25, (ctx: any) => {
    drawHeadShape(ctx, "#fbcfe8");
  });

  addElement(layer1, "Caramel Skin", 20, (ctx: any) => {
    drawHeadShape(ctx, "#f59e0b");
  });

  addElement(layer1, "Deep Bronze Skin", 15, (ctx: any) => {
    drawHeadShape(ctx, "#78350f");
  });

  addElement(layer1, "Cyan Cyber Skin", 10, (ctx: any) => {
    drawHeadShape(ctx, "#38bdf8");
  });

  // ==========================
  // 3. OUTFIT (Order 2)
  // ==========================
  const layer2 = "Outfit";

  const drawOutfitBase = (ctx: any, bodyColor: string, accentColor: string) => {
    // Shoulders
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.roundRect(240, 580, 520, 420, 90);
    ctx.fill();

    // Collar Cutout
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(500, 580, 100, 0, Math.PI);
    ctx.fill();
  };

  addElement(layer2, "Hoodie", 30, (ctx: any) => {
    drawOutfitBase(ctx, "#6366f1", "#4338ca");
  });

  addElement(layer2, "Denim Jacket", 25, (ctx: any) => {
    drawOutfitBase(ctx, "#0284c7", "#0369a1");
  });

  addElement(layer2, "Turtleneck", 20, (ctx: any) => {
    drawOutfitBase(ctx, "#0f172a", "#334155");
  });

  addElement(layer2, "Blazer & Tee", 15, (ctx: any) => {
    drawOutfitBase(ctx, "#be123c", "#ffffff");
  });

  addElement(layer2, "Sporty Tracksuit", 10, (ctx: any) => {
    drawOutfitBase(ctx, "#10b981", "#047857");
  });

  // ==========================
  // 4. HAIRSTYLE (Order 3)
  // ==========================
  const layer3 = "Hairstyle";

  addElement(layer3, "Bob Cut", 30, (ctx: any) => {
    ctx.fillStyle = "#1e293b";
    // Top Dome Hair
    ctx.beginPath();
    ctx.arc(500, 240, 195, Math.PI, 0);
    ctx.fill();
    // Side bangs framing face without covering eyes
    ctx.fillRect(310, 220, 60, 160);
    ctx.fillRect(630, 220, 60, 160);
  });

  addElement(layer3, "Curly Afro", 25, (ctx: any) => {
    ctx.fillStyle = "#451a03";
    ctx.beginPath();
    ctx.arc(500, 230, 220, 0, Math.PI * 2);
    ctx.fill();
    // Cutout for face
    ctx.fillStyle = "#ffffff00";
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.roundRect(350, 250, 300, 280, 80);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  });

  addElement(layer3, "Sleek Bun", 20, (ctx: any) => {
    ctx.fillStyle = "#b45309";
    ctx.beginPath();
    ctx.arc(500, 220, 180, Math.PI * 0.9, Math.PI * 0.1);
    ctx.fill();
    // Top bun
    ctx.beginPath();
    ctx.arc(500, 90, 65, 0, Math.PI * 2);
    ctx.fill();
  });

  addElement(layer3, "Beanie", 15, (ctx: any) => {
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.roundRect(320, 120, 360, 140, 40);
    ctx.fill();
    ctx.fillStyle = "#b91c1c";
    ctx.fillRect(310, 230, 380, 35);
  });

  // ==========================
  // 5. FACE EXPRESSION & SPECS (Order 4)
  // ==========================
  const layer4 = "Face Expression & Specs";

  addElement(layer4, "Minimalist Eyes & Smile", 30, (ctx: any) => {
    // Eyes
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(420, 350, 16, 0, Math.PI * 2);
    ctx.arc(580, 350, 16, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(500, 400, 40, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Rosy Cheeks
    ctx.fillStyle = "#f472b6aa";
    ctx.beginPath();
    ctx.arc(380, 390, 20, 0, Math.PI * 2);
    ctx.arc(620, 390, 20, 0, Math.PI * 2);
    ctx.fill();
  });

  addElement(layer4, "Cool Specs & Smile", 25, (ctx: any) => {
    // Round Glasses
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(420, 350, 45, 0, Math.PI * 2);
    ctx.arc(580, 350, 45, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillRect(465, 345, 70, 10);

    // Smile
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(500, 410, 35, 0.2, Math.PI - 0.2);
    ctx.stroke();
  });

  addElement(layer4, "Wink & Laugh", 20, (ctx: any) => {
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 8;
    // Eye 1
    ctx.beginPath();
    ctx.arc(420, 350, 16, 0, Math.PI * 2);
    ctx.stroke();
    // Wink Line
    ctx.beginPath();
    ctx.moveTo(560, 350);
    ctx.lineTo(600, 350);
    ctx.stroke();

    // Laugh Mouth
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(500, 410, 30, 0, Math.PI);
    ctx.fill();
  });

  addElement(layer4, "Neon Sunglasses", 15, (ctx: any) => {
    ctx.fillStyle = "#ec4899";
    ctx.beginPath();
    ctx.roundRect(370, 320, 260, 65, 20);
    ctx.fill();
    ctx.fillStyle = "#ffffffaa";
    ctx.fillRect(390, 330, 60, 20);
  });

  // ==========================
  // 6. POP ACCESSORY (Order 5)
  // ==========================
  const layer5 = "Pop Accessory";

  addElement(layer5, "Coffee Cup", 30, (ctx: any) => {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(680, 580, 120, 160, 20);
    ctx.fill();
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(680, 560, 120, 30);
  });

  addElement(layer5, "Wireless Headphones", 25, (ctx: any) => {
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(500, 200, 200, Math.PI * 0.95, Math.PI * 0.05);
    ctx.stroke();

    ctx.fillStyle = "#ec4899";
    ctx.beginPath();
    ctx.roundRect(280, 310, 45, 110, 20);
    ctx.roundRect(675, 310, 45, 110, 20);
    ctx.fill();
  });

  addElement(layer5, "Potted Plant", 20, (ctx: any) => {
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.roundRect(140, 640, 120, 140, 20);
    ctx.fill();
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(200, 580, 70, 0, Math.PI * 2);
    ctx.fill();
  });

  addElement(layer5, "None", 10, (_ctx: any) => {
    // empty
  });

  return generated;
}
