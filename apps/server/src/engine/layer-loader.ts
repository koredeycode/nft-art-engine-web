import fs from "node:fs";
import path from "node:path";

export interface ElementFile {
  id: number;
  name: string;
  filename: string;
  path: string;
  weight: number;
}

export interface LayerConfig {
  id: number;
  elements: ElementFile[];
  name: string;
  blend: string;
  opacity: number;
  bypassDNA: boolean;
}

export interface LayerOrderEntry {
  name: string;
  options?: {
    displayName?: string;
    blend?: string;
    opacity?: number;
    bypassDNA?: boolean;
  };
}

export function getRarityWeight(filename: string, delimiter: string): number {
  const withoutExtension = filename.slice(0, -4);
  const weight = Number(withoutExtension.split(delimiter).pop());
  return Number.isNaN(weight) ? 1 : weight;
}

export function cleanName(filename: string, delimiter: string): string {
  const withoutExtension = filename.slice(0, -4);
  return withoutExtension.split(delimiter).shift() ?? "";
}

export function getElements(dirPath: string, delimiter: string): ElementFile[] {
  const items = fs.readdirSync(dirPath).filter((item) => {
    return !/(^|\/)\.[^\/\.]/g.test(item);
  });

  return items.map((item, index) => {
    if (item.includes("-")) {
      throw new Error(`layer name cannot contain dashes, please fix: ${item}`);
    }
    return {
      id: index,
      name: cleanName(item, delimiter),
      filename: item,
      path: path.join(dirPath, item),
      weight: getRarityWeight(item, delimiter),
    };
  });
}

export function layersSetup(
  layersOrder: LayerOrderEntry[],
  layersBaseDir: string,
  delimiter: string,
): LayerConfig[] {
  return layersOrder.map((layerObj, index) => {
    const layerDir = path.join(layersBaseDir, layerObj.name);
    const elements = getElements(layerDir, delimiter);
    return {
      id: index,
      elements,
      name: layerObj.options?.displayName ?? layerObj.name,
      blend: layerObj.options?.blend ?? "source-over",
      opacity: layerObj.options?.opacity ?? 1,
      bypassDNA: layerObj.options?.bypassDNA ?? false,
    };
  });
}
