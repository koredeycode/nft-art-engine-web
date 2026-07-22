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

export function generateClassroomDoodlesArt(outputDir: string): GeneratedElement[] {
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
    const filename = `chalk_${sanitizedLayer}_${sanitizedElement}_${weight}.png`;
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

  // Helper for drawing chalk stroke texture
  const drawChalkStroke = (ctx: any, drawPathFn: () => void, color: string, width = 12) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    drawPathFn();
    ctx.stroke();
  };

  // ==========================
  // 1. CHALKBOARD SURFACE (Order 0)
  // ==========================
  const layer0 = "Chalkboard Surface";

  // Classic Dark Green Slate
  addElement(layer0, "Classic Dark Green Slate", 30, (ctx: any) => {
    ctx.fillStyle = "#064e3b";
    ctx.fillRect(0, 0, width, height);

    // Chalk dust texture
    ctx.fillStyle = "#ffffff1a";
    for (let i = 0; i < 200; i++) {
      ctx.fillRect((i * 173) % width, (i * 283) % height, (i % 6) + 2, (i % 6) + 2);
    }
  });

  // Midnight Black Slate
  addElement(layer0, "Midnight Black Slate", 25, (ctx: any) => {
    ctx.fillStyle = "#18181b";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#ffffff15";
    for (let i = 0; i < 200; i++) {
      ctx.fillRect((i * 197) % width, (i * 313) % height, (i % 6) + 2, (i % 6) + 2);
    }
  });

  // Deep Purple Slate
  addElement(layer0, "Deep Purple Slate", 20, (ctx: any) => {
    ctx.fillStyle = "#3b0764";
    ctx.fillRect(0, 0, width, height);
  });

  // Vintage Navy Slate
  addElement(layer0, "Vintage Navy Slate", 15, (ctx: any) => {
    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(0, 0, width, height);
  });

  // ==========================
  // 2. CHALK CREATURE BASE (Order 1)
  // ==========================
  const layer1 = "Chalk Creature Base";

  // Space Rocket Doodle
  addElement(layer1, "Space Rocket Doodle", 30, (ctx: any) => {
    // Body Rocket Cone
    ctx.fillStyle = "#ffffffdd";
    ctx.beginPath();
    ctx.moveTo(500, 180);
    ctx.lineTo(650, 680);
    ctx.lineTo(350, 680);
    ctx.closePath();
    ctx.fill();

    drawChalkStroke(
      ctx,
      () => {
        ctx.beginPath();
        ctx.moveTo(500, 180);
        ctx.lineTo(650, 680);
        ctx.lineTo(350, 680);
        ctx.closePath();
      },
      "#38bdf8",
      12,
    );

    // Fins
    drawChalkStroke(
      ctx,
      () => {
        ctx.beginPath();
        ctx.moveTo(350, 600);
        ctx.lineTo(250, 720);
        ctx.lineTo(350, 680);
        ctx.moveTo(650, 600);
        ctx.lineTo(750, 720);
        ctx.lineTo(650, 680);
      },
      "#f472b6",
      12,
    );
  });

  // Alien Flying Saucer
  addElement(layer1, "Alien Flying Saucer", 25, (ctx: any) => {
    // Glass Dome
    ctx.fillStyle = "#38bdf866";
    ctx.beginPath();
    ctx.arc(500, 420, 180, Math.PI, 0);
    ctx.fill();
    drawChalkStroke(
      ctx,
      () => {
        ctx.beginPath();
        ctx.arc(500, 420, 180, Math.PI, 0);
      },
      "#7dd3fc",
      10,
    );

    // Saucer Disc
    ctx.fillStyle = "#ffffffdd";
    ctx.beginPath();
    ctx.ellipse(500, 460, 320, 90, 0, 0, Math.PI * 2);
    ctx.fill();

    drawChalkStroke(
      ctx,
      () => {
        ctx.beginPath();
        ctx.ellipse(500, 460, 320, 90, 0, 0, Math.PI * 2);
      },
      "#facc15",
      12,
    );
  });

  // Dino T-Rex Doodle
  addElement(layer1, "Dino T-Rex Doodle", 20, (ctx: any) => {
    ctx.fillStyle = "#4ade80dd";
    ctx.beginPath();
    ctx.arc(500, 350, 160, 0, Math.PI * 2);
    ctx.roundRect(360, 460, 280, 260, 40);
    ctx.fill();

    drawChalkStroke(
      ctx,
      () => {
        ctx.beginPath();
        ctx.arc(500, 350, 160, 0, Math.PI * 2);
        ctx.roundRect(360, 460, 280, 260, 40);
      },
      "#ffffff",
      12,
    );
  });

  // Doodle Robot
  addElement(layer1, "Doodle Robot", 15, (ctx: any) => {
    ctx.fillStyle = "#facc15dd";
    ctx.beginPath();
    ctx.roundRect(340, 220, 320, 240, 30);
    ctx.roundRect(360, 500, 280, 260, 30);
    ctx.fill();

    drawChalkStroke(
      ctx,
      () => {
        ctx.beginPath();
        ctx.roundRect(340, 220, 320, 240, 30);
        ctx.roundRect(360, 500, 280, 260, 30);
      },
      "#ffffff",
      12,
    );
  });

  // ==========================
  // 3. CHALK EXPRESSION (Order 2)
  // ==========================
  const layer2 = "Chalk Expression";

  // Starry Eyed
  addElement(layer2, "Starry Eyed", 30, (ctx: any) => {
    ctx.fillStyle = "#fde047";
    // Star 1
    ctx.beginPath();
    ctx.arc(420, 340, 25, 0, Math.PI * 2);
    ctx.arc(580, 340, 25, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    drawChalkStroke(
      ctx,
      () => {
        ctx.beginPath();
        ctx.arc(500, 390, 40, 0.2, Math.PI - 0.2);
      },
      "#ffffff",
      10,
    );
  });

  // Googly Eyes
  addElement(layer2, "Googly Eyes", 25, (ctx: any) => {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(430, 340, 35, 0, Math.PI * 2);
    ctx.arc(570, 340, 35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(440, 345, 14, 0, Math.PI * 2);
    ctx.arc(560, 345, 14, 0, Math.PI * 2);
    ctx.fill();
  });

  // Cool Glasses
  addElement(layer2, "Cool Glasses", 20, (ctx: any) => {
    ctx.fillStyle = "#f472b6";
    ctx.beginPath();
    ctx.roundRect(370, 310, 260, 60, 20);
    ctx.fill();

    drawChalkStroke(
      ctx,
      () => {
        ctx.beginPath();
        ctx.roundRect(370, 310, 260, 60, 20);
      },
      "#ffffff",
      8,
    );
  });

  // ==========================
  // 4. CHALK ACCESSORIES (Order 3)
  // ==========================
  const layer3 = "Chalk Accessories";

  // Space Helmet Bubble
  addElement(layer3, "Space Helmet Bubble", 30, (ctx: any) => {
    ctx.fillStyle = "#38bdf833";
    ctx.beginPath();
    ctx.arc(500, 340, 200, 0, Math.PI * 2);
    ctx.fill();

    drawChalkStroke(
      ctx,
      () => {
        ctx.beginPath();
        ctx.arc(500, 340, 200, 0, Math.PI * 2);
      },
      "#7dd3fc",
      12,
    );
  });

  // Party Cone
  addElement(layer3, "Party Cone", 25, (ctx: any) => {
    ctx.fillStyle = "#ec4899";
    ctx.beginPath();
    ctx.moveTo(440, 200);
    ctx.lineTo(560, 200);
    ctx.lineTo(500, 60);
    ctx.closePath();
    ctx.fill();

    drawChalkStroke(
      ctx,
      () => {
        ctx.beginPath();
        ctx.moveTo(440, 200);
        ctx.lineTo(560, 200);
        ctx.lineTo(500, 60);
        ctx.closePath();
      },
      "#ffffff",
      10,
    );
  });

  // Wizard Hat
  addElement(layer3, "Wizard Hat", 20, (ctx: any) => {
    ctx.fillStyle = "#a855f7";
    ctx.beginPath();
    ctx.moveTo(340, 220);
    ctx.lineTo(660, 220);
    ctx.lineTo(500, 40);
    ctx.closePath();
    ctx.fill();

    drawChalkStroke(
      ctx,
      () => {
        ctx.beginPath();
        ctx.moveTo(340, 220);
        ctx.lineTo(660, 220);
        ctx.lineTo(500, 40);
        ctx.closePath();
      },
      "#fde047",
      10,
    );
  });

  // ==========================
  // 5. CHALKBOARD MATH & STAR FX (Order 4)
  // ==========================
  const layer4 = "Chalkboard Math & Star FX";

  // Equations & Formulas
  addElement(layer4, "Equations & Formulas", 30, (ctx: any) => {
    ctx.fillStyle = "#ffffffdd";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText("E = mc²", 120, 200);
    ctx.fillText("a² + b² = c²", 720, 220);
    ctx.fillText("π ≈ 3.14159", 120, 800);
    ctx.fillText("f(x) = x³", 740, 800);
  });

  // Floating Chalk Stars
  addElement(layer4, "Floating Chalk Stars", 25, (ctx: any) => {
    const stars: [number, number][] = [
      [180, 180],
      [820, 200],
      [160, 750],
      [840, 780],
    ];
    stars.forEach(([sx, sy]) => {
      drawChalkStroke(
        ctx,
        () => {
          ctx.beginPath();
          ctx.moveTo(sx - 25, sy);
          ctx.lineTo(sx + 25, sy);
          ctx.moveTo(sx, sy - 25);
          ctx.lineTo(sx, sy + 25);
        },
        "#fde047",
        8,
      );
    });
  });

  // None
  addElement(layer4, "None", 10, (_ctx: any) => {
    // empty
  });

  return generated;
}
