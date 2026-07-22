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

export function generateKawaiiEatsArt(outputDir: string): GeneratedElement[] {
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
    const filename = `food_${sanitizedLayer}_${sanitizedElement}_${weight}.png`;
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
  // 1. DINER / KITCHEN BACKDROP (Order 0)
  // ==========================
  const layer0 = "Diner / Kitchen Backdrop";

  // Neon Izakaya
  addElement(layer0, "Neon Izakaya", 30, (ctx: any) => {
    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(0, 0, width, height);

    // Lanterns
    drawPixelRect(ctx, 120, 100, 80, 120, "#ef4444");
    drawPixelRect(ctx, 800, 100, 80, 120, "#ef4444");
  });

  // Retro Diner
  addElement(layer0, "Retro Diner", 25, (ctx: any) => {
    ctx.fillStyle = "#fbcfe8";
    ctx.fillRect(0, 0, width, height);

    // Checkerboard floor
    ctx.fillStyle = "#0f172a";
    for (let x = 0; x < width; x += 100) {
      if ((x / 100) % 2 === 0) {
        ctx.fillRect(x, 800, 100, 200);
      }
    }
  });

  // Night Market Stall
  addElement(layer0, "Night Market Stall", 20, (ctx: any) => {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#f59e0b";
    for (let x = 50; x < width; x += 150) {
      ctx.fillRect(x, 80, 100, 20);
    }
  });

  // Pastel Cafe
  addElement(layer0, "Pastel Cafe", 15, (ctx: any) => {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#bae6fd");
    grad.addColorStop(1, "#fbcfe8");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  });

  // Cosmic Candy Land
  addElement(layer0, "Cosmic Candy Land", 10, (ctx: any) => {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#c084fc");
    grad.addColorStop(1, "#38bdf8");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  });

  // ==========================
  // 2. FOOD BASE / CUP (Order 1)
  // ==========================
  const layer1 = "Food Base / Cup";

  const drawContainer = (ctx: any, containerColor: string, rimColor: string) => {
    // Large Boba Cup / Bowl Silhouette
    ctx.fillStyle = containerColor;
    ctx.beginPath();
    ctx.moveTo(300, 300);
    ctx.lineTo(700, 300);
    ctx.lineTo(620, 800);
    ctx.lineTo(380, 800);
    ctx.fill();

    // Top Rim Lid
    drawPixelRect(ctx, 280, 270, 440, 35, rimColor);
  };

  // Boba Cup
  addElement(layer1, "Boba Cup", 30, (ctx: any) => {
    drawContainer(ctx, "#ffffffdd", "#f472b6");
    // Straw stuck in top
    drawPixelRect(ctx, 480, 100, 40, 200, "#a855f7");
  });

  // Ceramic Ramen Bowl
  addElement(layer1, "Ceramic Ramen Bowl", 25, (ctx: any) => {
    drawContainer(ctx, "#be123c", "#fef08a");
  });

  // Bento Box
  addElement(layer1, "Bento Box", 20, (ctx: any) => {
    drawPixelRect(ctx, 260, 350, 480, 420, "#78350f");
    drawPixelRect(ctx, 280, 370, 440, 380, "#f8fafc");
  });

  // Burger Bun
  addElement(layer1, "Burger Bun", 15, (ctx: any) => {
    // Bottom Bun
    drawPixelRect(ctx, 260, 680, 480, 120, "#d97706");
    // Top Bun Dome
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.arc(500, 450, 240, Math.PI, 0);
    ctx.fill();
  });

  // Ice Cream Cone
  addElement(layer1, "Ice Cream Cone", 10, (ctx: any) => {
    // Waffle Cone
    ctx.fillStyle = "#b45309";
    ctx.beginPath();
    ctx.moveTo(280, 500);
    ctx.lineTo(720, 500);
    ctx.lineTo(500, 920);
    ctx.fill();
  });

  // ==========================
  // 3. MAIN FLAVOR / FILLING (Order 2)
  // ==========================
  const layer2 = "Main Flavor / Filling";

  // Taro Purple
  addElement(layer2, "Taro Purple", 30, (ctx: any) => {
    ctx.fillStyle = "#c084fc";
    ctx.beginPath();
    ctx.moveTo(310, 340);
    ctx.lineTo(690, 340);
    ctx.lineTo(625, 780);
    ctx.lineTo(375, 780);
    ctx.fill();
  });

  // Matcha Green
  addElement(layer2, "Matcha Green", 25, (ctx: any) => {
    ctx.fillStyle = "#4ade80";
    ctx.beginPath();
    ctx.moveTo(310, 340);
    ctx.lineTo(690, 340);
    ctx.lineTo(625, 780);
    ctx.lineTo(375, 780);
    ctx.fill();
  });

  // Spicy Red Broth
  addElement(layer2, "Spicy Red Broth", 20, (ctx: any) => {
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(310, 340);
    ctx.lineTo(690, 340);
    ctx.lineTo(625, 780);
    ctx.lineTo(375, 780);
    ctx.fill();
  });

  // Golden Crispy
  addElement(layer2, "Golden Crispy", 15, (ctx: any) => {
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.moveTo(310, 340);
    ctx.lineTo(690, 340);
    ctx.lineTo(625, 780);
    ctx.lineTo(375, 780);
    ctx.fill();
  });

  // Cotton Candy Blue
  addElement(layer2, "Cotton Candy Blue", 10, (ctx: any) => {
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.moveTo(310, 340);
    ctx.lineTo(690, 340);
    ctx.lineTo(625, 780);
    ctx.lineTo(375, 780);
    ctx.fill();
  });

  // ==========================
  // 4. TOPPINGS & FILLINGS (Order 3)
  // ==========================
  const layer3 = "Toppings & Fillings";

  // Boba Pearls
  addElement(layer3, "Boba Pearls", 30, (ctx: any) => {
    ctx.fillStyle = "#1e293b";
    const pearls: [number, number][] = [
      [420, 720],
      [480, 750],
      [540, 710],
      [400, 650],
      [500, 670],
      [580, 660],
    ];
    pearls.forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(px, py, 30, 0, Math.PI * 2);
      ctx.fill();
    });
  });

  // Egg & Chashu Pork
  addElement(layer3, "Egg & Chashu Pork", 25, (ctx: any) => {
    // Soft boiled egg half
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(420, 360, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(420, 360, 25, 0, Math.PI * 2);
    ctx.fill();
  });

  // Rainbow Sprinkles
  addElement(layer3, "Rainbow Sprinkles", 20, (ctx: any) => {
    const colors = ["#ef4444", "#3b82f6", "#facc15", "#ec4899", "#10b981"];
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = colors[i % colors.length];
      const sx = 350 + ((i * 37) % 300);
      const sy = 360 + ((i * 53) % 300);
      ctx.fillRect(sx, sy, 15, 6);
    }
  });

  // Cheese Drip
  addElement(layer3, "Cheese Drip", 15, (ctx: any) => {
    ctx.fillStyle = "#facc15";
    drawPixelRect(ctx, 300, 330, 400, 40, "#facc15");
    drawPixelRect(ctx, 360, 370, 50, 80, "#facc15");
    drawPixelRect(ctx, 520, 370, 60, 110, "#facc15");
  });

  // ==========================
  // 5. FACE & EXPRESSION (Order 4)
  // ==========================
  const layer4 = "Face & Expression";

  // Cute Smile
  addElement(layer4, "Cute Smile", 30, (ctx: any) => {
    // Kawaii Eyes
    drawPixelRect(ctx, 410, 480, 30, 40, "#0f172a");
    drawPixelRect(ctx, 560, 480, 30, 40, "#0f172a");
    // Smile
    drawPixelRect(ctx, 475, 520, 50, 15, "#0f172a");
    // Cheeks
    drawPixelRect(ctx, 370, 510, 30, 20, "#f472b6");
    drawPixelRect(ctx, 600, 510, 30, 20, "#f472b6");
  });

  // Winking Eye
  addElement(layer4, "Winking Eye", 25, (ctx: any) => {
    drawPixelRect(ctx, 410, 490, 35, 10, "#0f172a"); // wink
    drawPixelRect(ctx, 560, 480, 30, 40, "#0f172a");
  });

  // Yummy Tongue
  addElement(layer4, "Yummy Tongue", 20, (ctx: any) => {
    drawPixelRect(ctx, 410, 480, 30, 40, "#0f172a");
    drawPixelRect(ctx, 560, 480, 30, 40, "#0f172a");
    // Tongue sticking out
    drawPixelRect(ctx, 480, 520, 40, 30, "#ef4444");
  });

  // Cool Shades
  addElement(layer4, "Cool Shades", 15, (ctx: any) => {
    drawPixelRect(ctx, 380, 470, 240, 50, "#0f172a");
  });

  // ==========================
  // 6. GARNISH & SPARKLES (Order 5)
  // ==========================
  const layer5 = "Garnish & Sparkles";

  // Pocky Sticks
  addElement(layer5, "Pocky Sticks", 30, (ctx: any) => {
    drawPixelRect(ctx, 600, 150, 20, 300, "#78350f");
    drawPixelRect(ctx, 600, 150, 20, 180, "#451a03"); // chocolate dip
  });

  // Mint Leaf
  addElement(layer5, "Mint Leaf", 25, (ctx: any) => {
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(380, 240, 35, 0, Math.PI * 2);
    ctx.arc(430, 240, 35, 0, Math.PI * 2);
    ctx.fill();
  });

  // Little Umbrella
  addElement(layer5, "Little Umbrella", 20, (ctx: any) => {
    drawPixelRect(ctx, 620, 100, 10, 250, "#f59e0b"); // stick
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(625, 120, 80, Math.PI, 0);
    ctx.fill();
  });

  // Floating Star Sparkles
  addElement(layer5, "Floating Star Sparkles", 15, (ctx: any) => {
    ctx.fillStyle = "#fef08a";
    const stars: [number, number][] = [
      [180, 250],
      [820, 280],
      [220, 720],
      [800, 750],
    ];
    stars.forEach(([sx, sy]) => {
      ctx.fillRect(sx - 10, sy, 20, 6);
      ctx.fillRect(sx, sy - 10, 6, 20);
    });
  });

  // None
  addElement(layer5, "None", 10, (_ctx: any) => {
    // empty
  });

  return generated;
}
