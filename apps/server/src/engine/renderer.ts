import { createCanvas, loadImage } from "canvas";
import fs from "node:fs";
import type { Canvas, CanvasRenderingContext2D, Image } from "canvas";
import type { SelectedElement } from "./dna.js";
import type { ElementFile } from "./layer-loader.js";

export interface RenderConfig {
  width: number;
  height: number;
  smoothing: boolean;
}

export interface BackgroundConfig {
  generate: boolean;
  brightness: string;
  static: boolean;
  default: string;
}

export function createRenderCanvas(config: RenderConfig): {
  canvas: Canvas;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = createCanvas(config.width, config.height);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = config.smoothing;
  return { canvas, ctx };
}

function genColor(brightness: string): string {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 100%, ${brightness})`;
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  config: BackgroundConfig,
  width: number,
  height: number,
): void {
  ctx.fillStyle = config.static ? config.default : genColor(config.brightness);
  ctx.fillRect(0, 0, width, height);
}

export interface LayerRenderObject {
  layer: SelectedElement;
  loadedImage: Image;
}

export async function loadLayerImg(
  layer: SelectedElement,
): Promise<LayerRenderObject> {
  const image = await loadImage(layer.selectedElement.path);
  return { layer, loadedImage: image };
}

export function drawElement(
  ctx: CanvasRenderingContext2D,
  renderObject: LayerRenderObject,
  width: number,
  height: number,
): void {
  ctx.globalAlpha = renderObject.layer.opacity;
  (ctx as { globalCompositeOperation: string }).globalCompositeOperation =
    renderObject.layer.blend;
  ctx.drawImage(renderObject.loadedImage, 0, 0, width, height);
}

export function saveImage(
  canvas: Canvas,
  outputPath: string,
): void {
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);
}

export interface GifConfig {
  export: boolean;
  repeat: number;
  quality: number;
  delay: number;
}
