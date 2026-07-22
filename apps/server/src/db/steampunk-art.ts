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

export function generateSteampunkArt(outputDir: string): GeneratedElement[] {
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
    const filename = `steam_${sanitizedLayer}_${sanitizedElement}_${weight}.png`;
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
  // 1. BACKDROP (Order 0)
  // ==========================
  const layer0 = "Backdrop";

  // Clockwork Tower
  addElement(layer0, "Clockwork Tower", 30, (ctx: any) => {
    ctx.fillStyle = "#292524";
    ctx.fillRect(0, 0, width, height);

    // Large Brass Gear in Background
    ctx.strokeStyle = "#d9770688";
    ctx.lineWidth = 24;
    ctx.beginPath();
    ctx.arc(500, 450, 320, 0, Math.PI * 2);
    ctx.stroke();

    // Gear Teeth
    ctx.fillStyle = "#d9770688";
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
      const gx = 500 + Math.cos(a) * 330;
      const gy = 450 + Math.sin(a) * 330;
      ctx.fillRect(gx - 20, gy - 20, 40, 40);
    }
  });

  // Airship Deck
  addElement(layer0, "Airship Deck", 25, (ctx: any) => {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#0284c7");
    grad.addColorStop(0.6, "#bae6fd");
    grad.addColorStop(1, "#78350f");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Airship Wooden Railing
    drawPixelRect(ctx, 0, 700, width, 50, "#451a03");
    drawPixelRect(ctx, 0, 750, width, 250, "#78350f");
  });

  // Industrial Workshop
  addElement(layer0, "Industrial Workshop", 20, (ctx: any) => {
    ctx.fillStyle = "#1c1917";
    ctx.fillRect(0, 0, width, height);

    // Copper pipes
    ctx.fillStyle = "#b45309";
    ctx.fillRect(100, 0, 50, height);
    ctx.fillRect(850, 0, 50, height);
    ctx.fillRect(0, 200, width, 40);
  });

  // Steam Station
  addElement(layer0, "Steam Station", 15, (ctx: any) => {
    ctx.fillStyle = "#44403c";
    ctx.fillRect(0, 0, width, height);
  });

  // ==========================
  // 2. ATTIRE & COAT (Order 1)
  // ==========================
  const layer1 = "Attire & Coat";

  const drawSteampunkCoat = (
    ctx: any,
    coatColor: string,
    vestColor: string,
    brassColor: string,
  ) => {
    drawPixelRect(ctx, 280, 660, 440, 340, coatColor);
    drawPixelRect(ctx, 360, 680, 280, 320, vestColor);

    // Brass Buttons
    drawPixelRect(ctx, 390, 720, 25, 25, brassColor);
    drawPixelRect(ctx, 390, 780, 25, 25, brassColor);
    drawPixelRect(ctx, 585, 720, 25, 25, brassColor);
    drawPixelRect(ctx, 585, 780, 25, 25, brassColor);

    // High Collar
    drawPixelRect(ctx, 360, 540, 280, 140, coatColor);
  };

  // Victorian Tailcoat
  addElement(layer1, "Victorian Tailcoat", 30, (ctx: any) => {
    drawSteampunkCoat(ctx, "#451a03", "#78350f", "#f59e0b");
  });

  // Brass Padded Jacket
  addElement(layer1, "Brass Padded Jacket", 25, (ctx: any) => {
    drawSteampunkCoat(ctx, "#78350f", "#b45309", "#d97706");
  });

  // Aviator Leather Suit
  addElement(layer1, "Aviator Leather Suit", 20, (ctx: any) => {
    drawSteampunkCoat(ctx, "#292524", "#44403c", "#d97706");
  });

  // Inventor Apron
  addElement(layer1, "Inventor Apron", 15, (ctx: any) => {
    drawSteampunkCoat(ctx, "#78350f", "#a16207", "#ca8a04");
  });

  // ==========================
  // 3. FACE & GOGGLES (Order 2)
  // ==========================
  const layer2 = "Face & Goggles";

  // Steampunk Head Base
  const drawSteamHead = (ctx: any) => {
    drawPixelRect(ctx, 350, 260, 300, 300, "#fde047");
    // Hair
    drawPixelRect(ctx, 340, 240, 320, 80, "#451a03");
  };

  // Brass Double Goggles
  addElement(layer2, "Brass Double Goggles", 30, (ctx: any) => {
    drawSteamHead(ctx);
    // Double Brass Goggles over eyes
    drawPixelRect(ctx, 320, 340, 360, 30, "#78350f"); // strap
    drawPixelRect(ctx, 360, 320, 120, 100, "#d97706");
    drawPixelRect(ctx, 520, 320, 120, 100, "#d97706");
    drawPixelRect(ctx, 380, 340, 80, 60, "#00f0ff");
    drawPixelRect(ctx, 540, 340, 80, 60, "#00f0ff");
  });

  // Leather Aviator Cap
  addElement(layer2, "Leather Aviator Cap", 25, (ctx: any) => {
    drawSteamHead(ctx);
    drawPixelRect(ctx, 330, 220, 340, 160, "#451a03");
    // Goggles pushed up on forehead
    drawPixelRect(ctx, 370, 230, 110, 70, "#b45309");
    drawPixelRect(ctx, 520, 230, 110, 70, "#b45309");
  });

  // Monocle & Mustache
  addElement(layer2, "Monocle & Mustache", 20, (ctx: any) => {
    drawSteamHead(ctx);
    // Monocle on right eye
    drawPixelRect(ctx, 540, 340, 80, 80, "#ca8a04");
    drawPixelRect(ctx, 555, 355, 50, 50, "#e0f2fe");
    // Handlebar Mustache
    drawPixelRect(ctx, 400, 460, 200, 30, "#451a03");
    drawPixelRect(ctx, 370, 470, 40, 40, "#451a03");
    drawPixelRect(ctx, 590, 470, 40, 40, "#451a03");
  });

  // Copper Respirator Mask
  addElement(layer2, "Copper Respirator Mask", 15, (ctx: any) => {
    drawSteamHead(ctx);
    drawPixelRect(ctx, 380, 450, 240, 120, "#b45309");
    drawPixelRect(ctx, 420, 480, 60, 60, "#d97706");
    drawPixelRect(ctx, 520, 480, 60, 60, "#d97706");
  });

  // ==========================
  // 4. GIZMOS & PROPS (Order 3)
  // ==========================
  const layer3 = "Gizmos & Props";

  // Pocket Watch
  addElement(layer3, "Pocket Watch", 30, (ctx: any) => {
    // Golden chain and watch held
    drawPixelRect(ctx, 720, 600, 120, 120, "#eab308");
    drawPixelRect(ctx, 740, 620, 80, 80, "#ffffff");
  });

  // Brass Raygun
  addElement(layer3, "Brass Raygun", 25, (ctx: any) => {
    drawPixelRect(ctx, 720, 520, 180, 70, "#b45309");
    drawPixelRect(ctx, 880, 530, 40, 50, "#38bdf8"); // glowing tip
  });

  // Pipe Wrench
  addElement(layer3, "Pipe Wrench", 20, (ctx: any) => {
    drawPixelRect(ctx, 750, 400, 40, 400, "#78350f");
    drawPixelRect(ctx, 720, 380, 100, 80, "#d97706");
  });

  // Glowing Ether Lantern
  addElement(layer3, "Glowing Ether Lantern", 15, (ctx: any) => {
    drawPixelRect(ctx, 740, 500, 100, 160, "#b45309");
    drawPixelRect(ctx, 760, 530, 60, 100, "#34d399"); // green ether glow
  });

  // ==========================
  // 5. HATS & GEAR (Order 4)
  // ==========================
  const layer4 = "Hats & Gear";

  // Top Hat with Gears
  addElement(layer4, "Top Hat with Gears", 30, (ctx: any) => {
    // Brim
    drawPixelRect(ctx, 290, 240, 420, 35, "#1c1917");
    // Crown
    drawPixelRect(ctx, 350, 40, 300, 205, "#1c1917");
    // Brass Band & Gear
    drawPixelRect(ctx, 350, 210, 300, 30, "#b45309");
    drawPixelRect(ctx, 470, 190, 60, 60, "#eab308");
  });

  // Bowler Hat
  addElement(layer4, "Bowler Hat", 25, (ctx: any) => {
    drawPixelRect(ctx, 310, 230, 380, 30, "#292524");
    drawPixelRect(ctx, 360, 120, 280, 120, "#292524");
  });

  // Clockwork Crown
  addElement(layer4, "Clockwork Crown", 20, (ctx: any) => {
    drawPixelRect(ctx, 340, 180, 320, 70, "#ca8a04");
  });

  // ==========================
  // 6. ATMOSPHERIC FX (Order 5)
  // ==========================
  const layer5 = "Atmospheric FX";

  // Puff of Steam
  addElement(layer5, "Puff of Steam", 30, (ctx: any) => {
    ctx.fillStyle = "#e7e5e4aa";
    ctx.beginPath();
    ctx.arc(250, 400, 120, 0, Math.PI * 2);
    ctx.arc(750, 450, 140, 0, Math.PI * 2);
    ctx.fill();
  });

  // Floating Copper Gears
  addElement(layer5, "Floating Copper Gears", 25, (ctx: any) => {
    ctx.strokeStyle = "#b4530988";
    ctx.lineWidth = 8;
    const gears: [number, number][] = [
      [180, 220],
      [820, 250],
      [150, 750],
      [850, 780],
    ];
    gears.forEach(([gx, gy]) => {
      ctx.beginPath();
      ctx.arc(gx, gy, 40, 0, Math.PI * 2);
      ctx.stroke();
    });
  });

  // Brass Spark
  addElement(layer5, "Brass Spark", 20, (ctx: any) => {
    ctx.fillStyle = "#facc15";
    const sparks: [number, number][] = [
      [220, 350],
      [780, 380],
    ];
    sparks.forEach(([sx, sy]) => {
      ctx.fillRect(sx, sy, 25, 25);
    });
  });

  // None
  addElement(layer5, "None", 10, (_ctx: any) => {
    // empty
  });

  return generated;
}
