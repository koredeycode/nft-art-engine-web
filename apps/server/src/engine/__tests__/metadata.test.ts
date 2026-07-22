import { describe, expect, it } from "vitest";
import { buildAttributes, buildMetadata, sha1 } from "../metadata.js";
import type { MetadataConfig } from "../metadata.js";

describe("sha1", () => {
  it("returns a hex string", () => {
    const hash = sha1("test");
    expect(hash).toHaveLength(40);
    expect(hash).toMatch(/^[0-9a-f]+$/);
  });
});

describe("buildAttributes", () => {
  it("builds trait list from selections", () => {
    const selections = [
      { name: "Background", selectedElement: { name: "Red" } },
      { name: "Eyes", selectedElement: { name: "Open" } },
    ];
    const attrs = buildAttributes(selections);
    expect(attrs).toEqual([
      { trait_type: "Background", value: "Red" },
      { trait_type: "Eyes", value: "Open" },
    ]);
  });
});

describe("buildMetadata", () => {
  const config: MetadataConfig = {
    namePrefix: "Test Collection",
    description: "A test collection",
    baseUri: "ipfs://test",
    network: "eth",
    extraMetadata: { custom: "value" },
  };

  it("builds eth metadata", () => {
    const meta = buildMetadata("dna123", 1, [], config);
    expect(meta.name).toBe("Test Collection #1");
    expect(meta.description).toBe("A test collection");
    expect(meta.image).toBe("ipfs://test/1.png");
    expect(meta.edition).toBe(1);
    expect(meta.dna).toHaveLength(40);
    expect(meta.custom).toBe("value");
    expect(meta.compiler).toBe("HashLips Art Engine");
  });

  it("builds solana metadata", () => {
    const solConfig: MetadataConfig = {
      ...config,
      network: "sol",
      solanaMetadata: {
        symbol: "TEST",
        seller_fee_basis_points: 500,
        external_url: "https://example.com",
        creators: [{ address: "abc123", share: 100 }],
      },
    };
    const meta = buildMetadata("dna456", 1, [], solConfig);
    expect(meta.image).toBe("1.png");
    expect(meta.symbol).toBe("TEST");
    expect(meta.seller_fee_basis_points).toBe(500);
    expect((meta as any).properties.files[0].uri).toBe("1.png");
  });
});
