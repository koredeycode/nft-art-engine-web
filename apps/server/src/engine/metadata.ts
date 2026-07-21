import crypto from "node:crypto";

export interface Attribute {
  trait_type: string;
  value: string;
}

export interface LayerSelection {
  name: string;
  selectedElement: { name: string };
}

export interface MetadataConfig {
  namePrefix: string;
  description: string;
  baseUri: string;
  network: "eth" | "sol";
  solanaMetadata?: {
    symbol: string;
    seller_fee_basis_points: number;
    external_url: string;
    creators: { address: string; share: number }[];
  };
  extraMetadata: Record<string, unknown>;
}

export function sha1(input: string): string {
  return crypto.createHash("sha1").update(input).digest("hex");
}

export function buildAttributes(selections: LayerSelection[]): Attribute[] {
  return selections.map((s) => ({
    trait_type: s.name,
    value: s.selectedElement.name,
  }));
}

export function buildMetadata(
  dna: string,
  edition: number,
  attributes: Attribute[],
  config: MetadataConfig,
): Record<string, unknown> {
  const base: Record<string, unknown> = {
    name: `${config.namePrefix} #${edition}`,
    description: config.description,
    image: `${config.baseUri}/${edition}.png`,
    dna: sha1(dna),
    edition,
    date: Date.now(),
    ...config.extraMetadata,
    attributes,
    compiler: "HashLips Art Engine",
  };

  if (config.network === "sol" && config.solanaMetadata) {
    return {
      name: base.name,
      symbol: config.solanaMetadata.symbol,
      description: base.description,
      seller_fee_basis_points: config.solanaMetadata.seller_fee_basis_points,
      image: `${edition}.png`,
      external_url: config.solanaMetadata.external_url,
      edition: base.edition,
      ...config.extraMetadata,
      attributes: base.attributes,
      properties: {
        files: [{ uri: `${edition}.png`, type: "image/png" }],
        category: "image",
        creators: config.solanaMetadata.creators,
      },
    };
  }

  return base;
}
