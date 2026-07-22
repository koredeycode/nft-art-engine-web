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

export function generateCyberpunkArt(outputDir: string): GeneratedElement[] {
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
    const filename = `${sanitizedLayer}_${sanitizedElement}_${weight}.png`;
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

  // Helper for drawing crisp pixel grids
  const drawPixelRect = (ctx: any, x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  };

  // ==========================
  // 1. BACKGROUNDS (Order 0)
  // ==========================
  const layer0 = "Background";

  // Matrix Grid
  addElement(layer0, "Matrix Grid", 30, (ctx: any) => {
    ctx.fillStyle = "#050811";
    ctx.fillRect(0, 0, width, height);

    // Matrix lines
    ctx.fillStyle = "#00ff6622";
    for (let x = 0; x < width; x += 40) {
      for (let y = 0; y < height; y += 40) {
        if ((x + y) % 120 === 0) {
          ctx.fillRect(x, y, 20, 30);
        }
      }
    }

    // Grid at bottom
    ctx.strokeStyle = "#00ff6666";
    ctx.lineWidth = 4;
    for (let y = 600; y <= height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    for (let x = 0; x <= width; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 600);
      ctx.lineTo(x + (x - width / 2) * 0.8, height);
      ctx.stroke();
    }
  });

  // Synthwave Sun
  addElement(layer0, "Synthwave Sun", 25, (ctx: any) => {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#1a0033");
    grad.addColorStop(0.6, "#4a0072");
    grad.addColorStop(1, "#9d006b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Sun
    const sunGrad = ctx.createLinearGradient(0, 200, 0, 650);
    sunGrad.addColorStop(0, "#ffee00");
    sunGrad.addColorStop(1, "#ff0077");
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(500, 450, 220, 0, Math.PI * 2);
    ctx.fill();

    // Sun horizontal cuts
    ctx.fillStyle = "#4a0072";
    for (let y = 420; y < 650; y += 24) {
      const h = (y - 420) / 10 + 4;
      ctx.fillRect(250, y, 500, h);
    }
  });

  // Cyber City Night
  addElement(layer0, "Cyber City Night", 20, (ctx: any) => {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#0b0f19");
    grad.addColorStop(1, "#1e1b4b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Stars
    ctx.fillStyle = "#ffffffaa";
    for (let i = 0; i < 80; i++) {
      const sx = (i * 137) % width;
      const sy = (i * 293) % 450;
      ctx.fillRect(sx, sy, 4, 4);
    }

    // Buildings
    const buildings = [
      { x: 50, w: 140, h: 550, color: "#111827" },
      { x: 160, w: 180, h: 680, color: "#0f172a" },
      { x: 310, w: 220, h: 500, color: "#1e1035" },
      { x: 500, w: 160, h: 720, color: "#0b132b" },
      { x: 640, w: 200, h: 580, color: "#17153a" },
      { x: 810, w: 150, h: 640, color: "#0f172a" },
    ];

    buildings.forEach((b) => {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, height - b.h, b.w, b.h);

      // Windows
      ctx.fillStyle = b.x % 3 === 0 ? "#00f0ffaa" : "#ff0077aa";
      for (let wy = height - b.h + 30; wy < height - 50; wy += 40) {
        for (let wx = b.x + 20; wx < b.x + b.w - 20; wx += 30) {
          if ((wx + wy) % 7 !== 0) {
            ctx.fillRect(wx, wy, 12, 16);
          }
        }
      }
    });
  });

  // Deep Void
  addElement(layer0, "Deep Void", 15, (ctx: any) => {
    const grad = ctx.createRadialGradient(500, 500, 100, 500, 500, 700);
    grad.addColorStop(0, "#1e1b4b");
    grad.addColorStop(1, "#020617");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Glowing void particles
    for (let i = 0; i < 60; i++) {
      const px = (i * 97) % width;
      const py = (i * 223) % height;
      const size = (i % 3) * 3 + 3;
      ctx.fillStyle = i % 2 === 0 ? "#38bdf8" : "#a855f7";
      ctx.fillRect(px, py, size, size);
    }
  });

  // Holographic Dusk
  addElement(layer0, "Holographic Dusk", 10, (ctx: any) => {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#311042");
    grad.addColorStop(0.5, "#6b21a8");
    grad.addColorStop(1, "#0f172a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Holographic circles
    ctx.strokeStyle = "#ec489955";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(500, 500, 320, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#06b6d455";
    ctx.beginPath();
    ctx.arc(500, 500, 240, 0, Math.PI * 2);
    ctx.stroke();
  });

  // ==========================
  // 2. BASE BODY (Order 1)
  // ==========================
  const layer1 = "Base Body";

  const drawBaseHead = (ctx: any, mainColor: string, shadowColor: string, accentColor: string) => {
    // Shoulders / Chest
    drawPixelRect(ctx, 300, 700, 400, 300, shadowColor);
    drawPixelRect(ctx, 330, 680, 340, 320, mainColor);
    drawPixelRect(ctx, 420, 750, 160, 250, accentColor);

    // Neck
    drawPixelRect(ctx, 430, 560, 140, 140, shadowColor);
    drawPixelRect(ctx, 450, 570, 100, 120, mainColor);

    // Head / Face Box
    drawPixelRect(ctx, 320, 260, 360, 330, shadowColor);
    drawPixelRect(ctx, 340, 240, 320, 330, mainColor);

    // Ears / Cyber Nodes
    drawPixelRect(ctx, 290, 360, 50, 90, accentColor);
    drawPixelRect(ctx, 660, 360, 50, 90, accentColor);

    // Jawline detail
    drawPixelRect(ctx, 370, 530, 260, 40, shadowColor);
  };

  // Neon Pink Android
  addElement(layer1, "Neon Pink Android", 25, (ctx: any) => {
    drawBaseHead(ctx, "#ff2a85", "#990044", "#00f0ff");
  });

  // Cyber Cyan Bionic
  addElement(layer1, "Cyber Cyan Bionic", 25, (ctx: any) => {
    drawBaseHead(ctx, "#00f0ff", "#007799", "#ff0077");
  });

  // Shadow Chrome
  addElement(layer1, "Shadow Chrome", 20, (ctx: any) => {
    drawBaseHead(ctx, "#cbd5e1", "#475569", "#38bdf8");
  });

  // Emerald Matrix
  addElement(layer1, "Emerald Matrix", 15, (ctx: any) => {
    drawBaseHead(ctx, "#10b981", "#064e3b", "#a7f3d0");
  });

  // Solar Gold
  addElement(layer1, "Solar Gold", 15, (ctx: any) => {
    drawBaseHead(ctx, "#f59e0b", "#78350f", "#fef08a");
  });

  // ==========================
  // 3. EYES & VISORS (Order 2)
  // ==========================
  const layer2 = "Eyes & Visors";

  // VR Goggles
  addElement(layer2, "VR Goggles", 25, (ctx: any) => {
    // Strap
    drawPixelRect(ctx, 300, 350, 400, 30, "#1e293b");
    // Main VR Frame
    drawPixelRect(ctx, 330, 320, 340, 90, "#0f172a");
    // Lenses / Screen
    const grad = ctx.createLinearGradient(350, 330, 650, 400);
    grad.addColorStop(0, "#00f0ff");
    grad.addColorStop(1, "#ff0077");
    ctx.fillStyle = grad;
    ctx.fillRect(350, 330, 300, 70);
    // Reflection
    drawPixelRect(ctx, 370, 340, 80, 20, "#ffffffaa");
  });

  // Laser Visor
  addElement(layer2, "Laser Visor", 25, (ctx: any) => {
    drawPixelRect(ctx, 320, 350, 360, 40, "#ff0033");
    // Glow bloom
    ctx.fillStyle = "#ff003366";
    ctx.fillRect(300, 340, 400, 60);
    drawPixelRect(ctx, 340, 360, 320, 20, "#ffff00");
  });

  // Cyber Monocle
  addElement(layer2, "Cyber Monocle", 20, (ctx: any) => {
    // Left eye normal
    drawPixelRect(ctx, 390, 350, 50, 30, "#0f172a");
    drawPixelRect(ctx, 405, 355, 20, 20, "#38bdf8");

    // Right eye Monocle HUD
    ctx.fillStyle = "#00f0ff44";
    ctx.beginPath();
    ctx.arc(580, 365, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 6;
    ctx.stroke();

    // Target crosshair
    ctx.fillStyle = "#00f0ff";
    ctx.fillRect(575, 320, 10, 90);
    ctx.fillRect(535, 360, 90, 10);
  });

  // Matrix HUD Glasses
  addElement(layer2, "Matrix HUD Glasses", 15, (ctx: any) => {
    drawPixelRect(ctx, 350, 340, 130, 60, "#052e16");
    drawPixelRect(ctx, 520, 340, 130, 60, "#052e16");
    drawPixelRect(ctx, 480, 355, 40, 15, "#15803d");

    // Matrix digital code dots
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(370, 350, 10, 30);
    ctx.fillRect(410, 360, 10, 20);
    ctx.fillRect(540, 355, 10, 30);
    ctx.fillRect(580, 345, 10, 20);
  });

  // Bionic Optic
  addElement(layer2, "Bionic Optic", 10, (ctx: any) => {
    // Twin Glowing Camera Lenses
    drawPixelRect(ctx, 370, 335, 80, 70, "#1e293b");
    drawPixelRect(ctx, 550, 335, 80, 70, "#1e293b");

    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(410, 370, 25, 0, Math.PI * 2);
    ctx.arc(590, 370, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(405, 365, 10, 10);
    ctx.fillRect(585, 365, 10, 10);
  });

  // Neon Eyes
  addElement(layer2, "Neon Eyes", 5, (ctx: any) => {
    // Glowing Cyan Eyes
    drawPixelRect(ctx, 380, 350, 60, 35, "#00f0ff");
    drawPixelRect(ctx, 560, 350, 60, 35, "#00f0ff");

    // Inner bright pupil
    drawPixelRect(ctx, 395, 355, 30, 25, "#ffffff");
    drawPixelRect(ctx, 575, 355, 30, 25, "#ffffff");
  });

  // ==========================
  // 4. MOUTH & ACCESSORIES (Order 3)
  // ==========================
  const layer3 = "Mouth & Accessories";

  // Respirator Mask
  addElement(layer3, "Respirator Mask", 25, (ctx: any) => {
    drawPixelRect(ctx, 390, 460, 220, 110, "#0f172a");
    // Side canisters
    drawPixelRect(ctx, 350, 480, 50, 70, "#334155");
    drawPixelRect(ctx, 600, 480, 50, 70, "#334155");
    // Status light
    drawPixelRect(ctx, 480, 500, 40, 20, "#10b981");
  });

  // Cyber Mask
  addElement(layer3, "Cyber Mask", 25, (ctx: any) => {
    drawPixelRect(ctx, 400, 470, 200, 90, "#1e1b4b");
    // Vents
    ctx.fillStyle = "#00f0ff";
    ctx.fillRect(430, 490, 40, 10);
    ctx.fillRect(430, 515, 40, 10);
    ctx.fillRect(530, 490, 40, 10);
    ctx.fillRect(530, 515, 40, 10);
  });

  // Neon Smile
  addElement(layer3, "Neon Smile", 20, (ctx: any) => {
    // LED Smile Line
    ctx.fillStyle = "#ff0077";
    ctx.fillRect(420, 480, 160, 15);
    ctx.fillRect(400, 470, 30, 15);
    ctx.fillRect(570, 470, 30, 15);
    ctx.fillRect(440, 495, 120, 15);
  });

  // Gold Grill
  addElement(layer3, "Gold Grill", 15, (ctx: any) => {
    drawPixelRect(ctx, 430, 480, 140, 45, "#f59e0b");
    ctx.fillStyle = "#78350f";
    for (let x = 450; x < 570; x += 20) {
      ctx.fillRect(x, 480, 3, 45);
    }
  });

  // Bionic Jaw
  addElement(layer3, "Bionic Jaw", 10, (ctx: any) => {
    drawPixelRect(ctx, 380, 510, 240, 60, "#475569");
    drawPixelRect(ctx, 400, 525, 200, 30, "#0f172a");
    // Bolts
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(390, 530, 12, 12);
    ctx.fillRect(598, 530, 12, 12);
  });

  // Cyber Pipe
  addElement(layer3, "Cyber Pipe", 5, (ctx: any) => {
    // Small mouth line
    drawPixelRect(ctx, 450, 490, 60, 15, "#0f172a");
    // Pipe stem
    drawPixelRect(ctx, 500, 495, 100, 12, "#475569");
    // Glowing pipe tip
    drawPixelRect(ctx, 600, 485, 30, 30, "#ff0055");
    // Smoke pixels
    ctx.fillStyle = "#00f0ffaa";
    ctx.fillRect(630, 450, 20, 20);
    ctx.fillRect(650, 420, 30, 30);
  });

  // ==========================
  // 5. HEADWEAR (Order 4)
  // ==========================
  const layer4 = "Headwear";

  // Cyber Helmet
  addElement(layer4, "Cyber Helmet", 25, (ctx: any) => {
    drawPixelRect(ctx, 310, 140, 380, 160, "#0f172a");
    drawPixelRect(ctx, 330, 120, 340, 40, "#1e293b");
    // Neon Line
    drawPixelRect(ctx, 320, 230, 360, 20, "#00f0ff");
  });

  // Punk Mohawk
  addElement(layer4, "Punk Mohawk", 25, (ctx: any) => {
    const grad = ctx.createLinearGradient(0, 50, 0, 250);
    grad.addColorStop(0, "#ff0077");
    grad.addColorStop(1, "#9333ea");
    ctx.fillStyle = grad;

    // Spikes
    ctx.fillRect(470, 40, 60, 210);
    ctx.fillRect(450, 80, 100, 170);
    ctx.fillRect(430, 120, 140, 130);
  });

  // Neon Cap
  addElement(layer4, "Neon Cap", 20, (ctx: any) => {
    // Cap dome
    drawPixelRect(ctx, 330, 170, 340, 100, "#311042");
    // Cap visor/brim
    drawPixelRect(ctx, 280, 250, 440, 30, "#ff0077");
    // Badge
    drawPixelRect(ctx, 470, 190, 60, 40, "#00f0ff");
  });

  // Cyber Horns
  addElement(layer4, "Cyber Horns", 15, (ctx: any) => {
    // Left Horn
    drawPixelRect(ctx, 330, 120, 40, 130, "#00f0ff");
    drawPixelRect(ctx, 300, 70, 40, 80, "#00f0ff");
    drawPixelRect(ctx, 270, 30, 40, 60, "#00f0ff");

    // Right Horn
    drawPixelRect(ctx, 630, 120, 40, 130, "#00f0ff");
    drawPixelRect(ctx, 660, 70, 40, 80, "#00f0ff");
    drawPixelRect(ctx, 690, 30, 40, 60, "#00f0ff");
  });

  // Cyber Halo
  addElement(layer4, "Cyber Halo", 10, (ctx: any) => {
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.ellipse(500, 130, 180, 45, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#fef08a";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(500, 130, 180, 45, 0, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Bionic Antenna
  addElement(layer4, "Bionic Antenna", 5, (ctx: any) => {
    // Mount
    drawPixelRect(ctx, 630, 220, 50, 40, "#334155");
    // Pole
    drawPixelRect(ctx, 650, 80, 12, 140, "#64748b");
    // Blinking Tip
    drawPixelRect(ctx, 640, 60, 32, 32, "#ef4444");
  });

  // ==========================
  // 6. OVERLAYS & FX (Order 5)
  // ==========================
  const layer5 = "Overlays & FX";

  // Scanlines
  addElement(layer5, "Scanlines", 30, (ctx: any) => {
    ctx.fillStyle = "#00000033";
    for (let y = 0; y < height; y += 8) {
      ctx.fillRect(0, y, width, 4);
    }
  });

  // Glitch Matrix
  addElement(layer5, "Glitch Matrix", 25, (ctx: any) => {
    ctx.fillStyle = "#00f0ff44";
    ctx.fillRect(100, 200, 250, 15);
    ctx.fillRect(600, 450, 300, 20);

    ctx.fillStyle = "#ff007744";
    ctx.fillRect(200, 500, 400, 15);
    ctx.fillRect(50, 750, 350, 25);
  });

  // Holographic Shield
  addElement(layer5, "Holographic Shield", 20, (ctx: any) => {
    ctx.strokeStyle = "#00f0ff33";
    ctx.lineWidth = 3;
    const r = 40;
    for (let y = 0; y < height + r; y += r * 1.5) {
      for (let x = 0; x < width + r; x += r * 1.732) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const hx = x + r * Math.cos(angle);
          const hy = y + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  });

  // Cyber Sparkles
  addElement(layer5, "Cyber Sparkles", 15, (ctx: any) => {
    const sparkles = [
      { x: 200, y: 180, color: "#00f0ff" },
      { x: 780, y: 250, color: "#ff0077" },
      { x: 150, y: 650, color: "#ffee00" },
      { x: 820, y: 720, color: "#00f0ff" },
    ];
    sparkles.forEach((s) => {
      ctx.fillStyle = s.color;
      ctx.fillRect(s.x - 15, s.y - 3, 30, 6);
      ctx.fillRect(s.x - 3, s.y - 15, 6, 30);
      ctx.fillRect(s.x - 6, s.y - 6, 12, 12);
    });
  });

  // None (Empty Layer)
  addElement(layer5, "None", 10, (_ctx: any) => {
    // Transparent canvas
  });

  return generated;
}
