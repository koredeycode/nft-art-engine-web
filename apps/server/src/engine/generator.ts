import { constructLayerToDna, createDna, filterDNAOptions, isDnaUnique } from "./dna.js";
import type { SelectedElement } from "./dna.js";
import { HashLipsGiffer } from "./giffer.js";
import type { LayerOrderEntry } from "./layer-loader.js";
import { layersSetup } from "./layer-loader.js";
import { buildAttributes, buildMetadata } from "./metadata.js";
import type { Attribute, MetadataConfig } from "./metadata.js";
import {
  createRenderCanvas,
  drawBackground,
  drawElement,
  loadLayerImg,
  saveImage,
} from "./renderer.js";
import type { BackgroundConfig, GifConfig, LayerRenderObject, RenderConfig } from "./renderer.js";

export interface GenerationConfig {
  render: RenderConfig;
  background: BackgroundConfig;
  metadata: MetadataConfig;
  gif: GifConfig;
  layersBaseDir: string;
  outputDir: string;
  rarityDelimiter: string;
  dnaTolerance: number;
  shuffleOrder: boolean;
  layerConfigurations: {
    growEditionSizeTo: number;
    layersOrder: LayerOrderEntry[];
  }[];
}

export interface GenerationProgress {
  currentEdition: number;
  totalEditions: number;
  status: string;
}

export type ProgressCallback = (progress: GenerationProgress) => void;

function shuffleArray(array: number[]): number[] {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i] as number;
    arr[i] = arr[j] as number;
    arr[j] = temp;
  }
  return arr;
}

export async function generate(
  config: GenerationConfig,
  onProgress?: ProgressCallback,
): Promise<{
  metadataList: Record<string, unknown>[];
  dnaList: string[];
}> {
  const { canvas, ctx } = createRenderCanvas(config.render);
  const lastConfig = config.layerConfigurations[config.layerConfigurations.length - 1];
  if (!lastConfig) {
    throw new Error("No layer configurations provided");
  }
  const totalEditions = lastConfig.growEditionSizeTo;

  const startIndex = config.metadata.network === "sol" ? 0 : 1;
  let abstractedIndexes = Array.from(
    { length: totalEditions - startIndex + 1 },
    (_, i) => i + startIndex,
  );

  if (config.shuffleOrder) {
    abstractedIndexes = shuffleArray(abstractedIndexes);
  }

  const metadataList: Record<string, unknown>[] = [];
  const dnaList = new Set<string>();
  let failedCount = 0;

  for (const layerConfig of config.layerConfigurations) {
    const layers = layersSetup(
      layerConfig.layersOrder,
      config.layersBaseDir,
      config.rarityDelimiter,
    );
    let editionCount = 1;

    while (editionCount <= layerConfig.growEditionSizeTo) {
      const newDna = createDna(layers);

      if (isDnaUnique(dnaList, newDna)) {
        const selections = constructLayerToDna(newDna, layers);
        const loadedElements = selections.map((layer) => loadLayerImg(layer));
        const renderObjects: LayerRenderObject[] = await Promise.all(loadedElements);

        ctx.clearRect(0, 0, config.render.width, config.render.height);

        let hashlipsGiffer: HashLipsGiffer | null = null;
        if (config.gif.export) {
          hashlipsGiffer = new HashLipsGiffer(
            canvas,
            ctx,
            `${config.outputDir}/gifs/${abstractedIndexes[0]}.gif`,
            config.gif.repeat,
            config.gif.quality,
            config.gif.delay,
          );
          hashlipsGiffer.start();
        }

        if (config.background.generate) {
          drawBackground(ctx, config.background, config.render.width, config.render.height);
        }

        for (const renderObject of renderObjects) {
          drawElement(ctx, renderObject, config.render.width, config.render.height);
          if (hashlipsGiffer) {
            hashlipsGiffer.add();
          }
        }

        if (hashlipsGiffer) {
          hashlipsGiffer.stop();
        }

        const editionIndex = abstractedIndexes[0];
        if (editionIndex === undefined) {
          throw new Error("Unexpected: abstractedIndexes is empty");
        }

        saveImage(canvas, `${config.outputDir}/images/${editionIndex}.png`);

        const selectionsWithElement = selections.map((s) => ({
          name: s.name,
          selectedElement: { name: s.selectedElement.name },
        }));
        const attributes: Attribute[] = buildAttributes(selectionsWithElement);
        const meta = buildMetadata(newDna, editionIndex, attributes, config.metadata);
        metadataList.push(meta);

        const fs = await import("node:fs");
        fs.writeFileSync(
          `${config.outputDir}/json/${editionIndex}.json`,
          JSON.stringify(meta, null, 2),
        );

        dnaList.add(filterDNAOptions(newDna));
        editionCount++;
        abstractedIndexes.shift();

        onProgress?.({
          currentEdition: editionIndex,
          totalEditions,
          status: "running",
        });
      } else {
        failedCount++;
        if (failedCount >= config.dnaTolerance) {
          throw new Error(
            `Failed after ${failedCount} attempts. Need more layers or elements to grow to ${layerConfig.growEditionSizeTo} artworks.`,
          );
        }
      }
    }
  }

  const fs = await import("node:fs");
  fs.writeFileSync(
    `${config.outputDir}/json/_metadata.json`,
    JSON.stringify(metadataList, null, 2),
  );

  return {
    metadataList,
    dnaList: [...dnaList],
  };
}
