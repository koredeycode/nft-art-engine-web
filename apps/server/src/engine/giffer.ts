import { writeFile } from "node:fs";
import type { Canvas, SKRSContext2D as CanvasRenderingContext2D } from "@napi-rs/canvas";
import GifEncoderModule from "gif-encoder-2";

type GifEncoder = GifEncoderModule;

export class HashLipsGiffer {
  private gifEncoder: GifEncoder;
  private canvas: Canvas;
  private ctx: CanvasRenderingContext2D;
  private fileName: string;

  constructor(
    canvas: Canvas,
    ctx: CanvasRenderingContext2D,
    fileName: string,
    repeat: number,
    quality: number,
    delay: number,
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.fileName = fileName;
    this.gifEncoder = new GifEncoderModule(canvas.width, canvas.height);
    this.gifEncoder.setQuality(quality);
    this.gifEncoder.setRepeat(repeat);
    this.gifEncoder.setDelay(delay);
  }

  start(): void {
    this.gifEncoder.start();
  }

  add(): void {
    this.gifEncoder.addFrame(this.ctx);
  }

  stop(): void {
    this.gifEncoder.finish();
    const buffer = this.gifEncoder.out.getData();
    writeFile(this.fileName, buffer, () => {});
  }
}
