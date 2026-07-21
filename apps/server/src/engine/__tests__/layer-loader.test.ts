import { describe, it, expect } from "vitest";
import { getRarityWeight, cleanName } from "../layer-loader.js";

describe("getRarityWeight", () => {
  it("extracts weight from filename with delimiter", () => {
    expect(getRarityWeight("Red#50.png", "#")).toBe(50);
  });

  it("defaults to 1 when no weight found", () => {
    expect(getRarityWeight("Red.png", "#")).toBe(1);
  });

  it("defaults to 1 when last segment is not a number", () => {
    expect(getRarityWeight("Red#50#extra.png", "#")).toBe(1);
  });
});

describe("cleanName", () => {
  it("extracts name before delimiter", () => {
    expect(cleanName("Red#50.png", "#")).toBe("Red");
  });

  it("handles filename without delimiter", () => {
    expect(cleanName("Red.png", "#")).toBe("Red");
  });
});
