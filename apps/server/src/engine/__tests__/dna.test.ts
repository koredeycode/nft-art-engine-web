import { describe, expect, it } from "vitest";
import {
  DNA_DELIMITER,
  cleanDna,
  constructLayerToDna,
  createDna,
  filterDNAOptions,
  isDnaUnique,
} from "../dna.js";
import type { LayerConfig } from "../layer-loader.js";

const mockLayers: LayerConfig[] = [
  {
    id: 0,
    name: "Background",
    blend: "source-over",
    opacity: 1,
    bypassDNA: false,
    elements: [
      {
        id: 0,
        name: "Red",
        filename: "Red#50.png",
        path: "/layers/Background/Red#50.png",
        weight: 50,
      },
      {
        id: 1,
        name: "Blue",
        filename: "Blue#50.png",
        path: "/layers/Background/Blue#50.png",
        weight: 50,
      },
    ],
  },
  {
    id: 1,
    name: "Eyes",
    blend: "source-over",
    opacity: 1,
    bypassDNA: false,
    elements: [
      {
        id: 0,
        name: "Open",
        filename: "Open#70.png",
        path: "/layers/Eyes/Open#70.png",
        weight: 70,
      },
      {
        id: 1,
        name: "Closed",
        filename: "Closed#30.png",
        path: "/layers/Eyes/Closed#30.png",
        weight: 30,
      },
    ],
  },
];

describe("cleanDna", () => {
  it("extracts element id from dna segment", () => {
    expect(cleanDna("0:Red#50.png")).toBe(0);
  });

  it("strips query strings", () => {
    expect(cleanDna("0:Red#50.png?bypassDNA=true")).toBe(0);
  });
});

describe("filterDNAOptions", () => {
  it("keeps segments without bypassDNA", () => {
    const dna = "0:Red#50.png-1:Open#70.png";
    expect(filterDNAOptions(dna)).toBe(dna);
  });

  it("keeps segments with bypassDNA=true (bypassDNA is truthy)", () => {
    const dna = "0:Red#50.png?bypassDNA=true-1:Open#70.png";
    expect(filterDNAOptions(dna)).toBe(dna);
  });

  it("removes segments with bypassDNA=false", () => {
    const dna = "0:Red#50.png?bypassDNA=false-1:Open#70.png";
    expect(filterDNAOptions(dna)).toBe("1:Open#70.png");
  });
});

describe("isDnaUnique", () => {
  it("returns true for new dna", () => {
    const set = new Set<string>(["existing-dna"]);
    expect(isDnaUnique(set, "new-dna")).toBe(true);
  });

  it("returns false for existing dna", () => {
    const set = new Set<string>(["existing-dna"]);
    expect(isDnaUnique(set, "existing-dna")).toBe(false);
  });
});

describe("createDna", () => {
  it("returns a string with DNA_DELIMITER separators", () => {
    const dna = createDna(mockLayers);
    const parts = dna.split(DNA_DELIMITER);
    expect(parts).toHaveLength(2);
  });

  it("selects valid element ids", () => {
    const dna = createDna(mockLayers);
    const parts = dna.split(DNA_DELIMITER);
    for (const part of parts) {
      const id = cleanDna(part);
      expect(id >= 0).toBe(true);
    }
  });

  it("appends bypassDNA query when layer bypassDNA is true", () => {
    const bypassLayer: LayerConfig = {
      id: 0,
      name: "Background",
      blend: "source-over",
      opacity: 1,
      bypassDNA: true,
      elements: [
        {
          id: 0,
          name: "Red",
          filename: "Red#50.png",
          path: "/layers/Background/Red#50.png",
          weight: 50,
        },
      ],
    };
    const layersWithBypass: LayerConfig[] = [bypassLayer, mockLayers[1]!];
    const dna = createDna(layersWithBypass);
    const firstSegment = dna.split(DNA_DELIMITER)[0];
    expect(firstSegment).toContain("?bypassDNA=true");
  });
});

describe("constructLayerToDna", () => {
  it("maps dna back to layer selections", () => {
    const dna = "0:Red#50.png-1:Closed#30.png";
    const selections = constructLayerToDna(dna, mockLayers);
    expect(selections).toHaveLength(2);
    expect(selections[0]?.selectedElement.name).toBe("Red");
    expect(selections[1]?.selectedElement.name).toBe("Closed");
  });
});
