declare module "gif-encoder-2" {
  interface GifEncoderOptions {
    highWaterMark?: number;
  }

  class GifEncoder {
    constructor(width: number, height: number, options?: GifEncoderOptions);
    start(): void;
    addFrame(ctx: unknown): void;
    finish(): void;
    setQuality(quality: number): void;
    setRepeat(repeat: number): void;
    setDelay(delay: number): void;
    out: {
      getData(): Buffer;
    };
  }

  export default GifEncoder;
}
