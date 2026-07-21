import { Hono } from "hono";
import fs from "node:fs";
import path from "node:path";
import JSZip from "jszip";

export const exportsRouter = new Hono();

const BUILD_DIR = process.env.BUILD_DIR ?? "./data/build";

function getJobFilePath(jobId: string, subfolder: string, filename: string): string | null {
  const pathWithJob = path.join(BUILD_DIR, jobId, subfolder, filename);
  if (fs.existsSync(pathWithJob)) return pathWithJob;
  const pathDirect = path.join(BUILD_DIR, subfolder, filename);
  if (fs.existsSync(pathDirect)) return pathDirect;
  return null;
}

exportsRouter.get("/:jobId/editions", async (c) => {
  const jobId = c.req.param("jobId");
  const imgDir = path.join(BUILD_DIR, jobId, "images");
  if (!fs.existsSync(imgDir)) {
    return c.json([]);
  }

  const files = fs.readdirSync(imgDir).filter((f) => f.endsWith(".png"));
  const editions = files.map((f) => parseInt(path.basename(f, ".png"), 10)).filter((n) => !isNaN(n)).sort((a, b) => a - b);
  return c.json(editions);
});

exportsRouter.get("/:jobId/image/:edition", async (c) => {
  const jobId = c.req.param("jobId");
  const edition = c.req.param("edition");

  const filePath = getJobFilePath(jobId, "images", `${edition}.png`);
  if (!filePath) return c.json({ error: "not found" }, 404);

  const buffer = fs.readFileSync(filePath);
  return c.newResponse(buffer, {
    headers: { "Content-Type": "image/png" },
  });
});

exportsRouter.get("/:jobId/json/:edition", async (c) => {
  const jobId = c.req.param("jobId");
  const edition = c.req.param("edition");

  const filePath = getJobFilePath(jobId, "json", `${edition}.json`);
  if (!filePath) return c.json({ error: "not found" }, 404);

  const data = fs.readFileSync(filePath, "utf-8");
  return c.json(JSON.parse(data));
});

exportsRouter.get("/:jobId/metadata", async (c) => {
  const jobId = c.req.param("jobId");

  const filePath = getJobFilePath(jobId, "json", "_metadata.json");
  if (!filePath) return c.json({ error: "not found" }, 404);

  const data = fs.readFileSync(filePath, "utf-8");
  return c.json(JSON.parse(data));
});

exportsRouter.get("/:jobId/gif/:edition", async (c) => {
  const jobId = c.req.param("jobId");
  const edition = c.req.param("edition");

  const filePath = getJobFilePath(jobId, "gifs", `${edition}.gif`);
  if (!filePath) return c.json({ error: "not found" }, 404);

  const buffer = fs.readFileSync(filePath);
  return c.newResponse(buffer, {
    headers: { "Content-Type": "image/gif" },
  });
});

exportsRouter.get("/:jobId/download", async (c) => {
  const jobId = c.req.param("jobId");
  const jobDir = path.join(BUILD_DIR, jobId);

  const targetDir = fs.existsSync(jobDir) ? jobDir : BUILD_DIR;
  if (!fs.existsSync(targetDir)) {
    return c.json({ error: "No generated collection output found" }, 404);
  }

  const zip = new JSZip();

  // Add images folder
  const imagesDir = path.join(targetDir, "images");
  if (fs.existsSync(imagesDir)) {
    const imgFolder = zip.folder("images");
    for (const file of fs.readdirSync(imagesDir)) {
      const filePath = path.join(imagesDir, file);
      if (fs.statSync(filePath).isFile()) {
        imgFolder?.file(file, fs.readFileSync(filePath));
      }
    }
  }

  // Add json metadata folder
  const jsonDir = path.join(targetDir, "json");
  if (fs.existsSync(jsonDir)) {
    const jsonFolder = zip.folder("json");
    for (const file of fs.readdirSync(jsonDir)) {
      const filePath = path.join(jsonDir, file);
      if (fs.statSync(filePath).isFile()) {
        jsonFolder?.file(file, fs.readFileSync(filePath));
      }
    }
  }

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  return c.newResponse(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="nft-collection-${jobId}.zip"`,
    },
  });
});
