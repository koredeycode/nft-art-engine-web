import type { ElementFile, LayerConfig } from "./layer-loader.js";

export const DNA_DELIMITER = "-";

export function cleanDna(str: string): number {
  const withoutOptions = removeQueryStrings(str);
  return Number(withoutOptions.split(":").shift());
}

function removeQueryStrings(dna: string): string {
  return dna.replace(/(\?.*$)/, "");
}

export function filterDNAOptions(dna: string): string {
  const dnaItems = dna.split(DNA_DELIMITER);
  const filteredDNA = dnaItems.filter((element) => {
    const query = /(\?.*$)/;
    const querystring = query.exec(element);
    if (!querystring) return true;
    const params = new URLSearchParams(querystring[1]);
    return params.get("bypassDNA") === "true";
  });
  return filteredDNA.join(DNA_DELIMITER);
}

export function isDnaUnique(dnaList: Set<string>, dna: string): boolean {
  const filtered = filterDNAOptions(dna);
  return !dnaList.has(filtered);
}

export function createDna(layers: LayerConfig[]): string {
  const randNum: string[] = [];

  for (const layer of layers) {
    const totalWeight = layer.elements.reduce(
      (sum, el) => sum + el.weight,
      0,
    );
    let random = Math.floor(Math.random() * totalWeight);

    for (const element of layer.elements) {
      random -= element.weight;
      if (random < 0) {
        randNum.push(
          `${element.id}:${element.filename}${layer.bypassDNA ? "?bypassDNA=true" : ""}`,
        );
        break;
      }
    }
  }

  return randNum.join(DNA_DELIMITER);
}

export interface SelectedElement {
  name: string;
  blend: string;
  opacity: number;
  selectedElement: ElementFile;
}

export function constructLayerToDna(
  dna: string,
  layers: LayerConfig[],
): SelectedElement[] {
  const dnaParts = dna.split(DNA_DELIMITER);

  return layers.map((layer, index) => {
    const elementId = cleanDna(dnaParts[index] ?? "");
    const element = layer.elements.find((e) => e.id === elementId);

    return {
      name: layer.name,
      blend: layer.blend,
      opacity: layer.opacity,
      selectedElement: element ?? layer.elements[0] ?? {
        id: 0, name: "", filename: "", path: "", weight: 1,
      },
    };
  });
}
