import { useEffect, useRef, useState } from "react";
import { Shuffle, Sparkles, RefreshCw, Layers } from "lucide-react";
import { type Layer, type Element, api } from "@/lib/api";

interface NFTCompositorProps {
  layers: Layer[];
  selectedElementForPreview?: { layerId: string; elementId: string } | null;
  onTraitsRandomized?: (map: Record<string, string>) => void;
}

interface SelectedTrait {
  layerId: string;
  layerName: string;
  blendMode: string;
  elementId: string;
  filename: string;
}

export function NFTCompositor({
  layers,
  selectedElementForPreview,
  onTraitsRandomized,
}: NFTCompositorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTraits, setSelectedTraits] = useState<SelectedTrait[]>([]);
  const [rendering, setRendering] = useState(false);

  // Fetch elements for each layer and pick random element or first element
  const randomizeCombination = async () => {
    setRendering(true);
    try {
      const traits: SelectedTrait[] = [];
      const map: Record<string, string> = {};

      for (const layer of layers) {
        const layerElements = await api.get<Element[]>(`/layers/${layer.id}/elements`);
        if (layerElements.length > 0) {
          // Weighted random selection
          const totalWeight = layerElements.reduce((acc, el) => acc + (el.weight || 1), 0);
          let random = Math.random() * totalWeight;
          let chosen = layerElements[0]!;

          for (const el of layerElements) {
            if (random < (el.weight || 1)) {
              chosen = el;
              break;
            }
            random -= el.weight || 1;
          }

          traits.push({
            layerId: layer.id,
            layerName: layer.name,
            blendMode: layer.blendMode || "source-over",
            elementId: chosen.id,
            filename: chosen.filename,
          });

          map[layer.id] = chosen.id;
        }
      }
      setSelectedTraits(traits);
      onTraitsRandomized?.(map);
    } catch {
      // ignore error
    } finally {
      setRendering(false);
    }
  };

  // When layers change (order or count), keep existing selected traits in the new layer order
  useEffect(() => {
    if (layers.length === 0) {
      setSelectedTraits([]);
      return;
    }

    // Re-align selectedTraits with the current layer order and blend modes
    setSelectedTraits((prev) => {
      if (prev.length === 0) {
        randomizeCombination();
        return prev;
      }
      const newTraits: SelectedTrait[] = [];
      for (const layer of layers) {
        const existing = prev.find((t) => t.layerId === layer.id);
        if (existing) {
          newTraits.push({
            ...existing,
            layerName: layer.name,
            blendMode: layer.blendMode || "source-over",
          });
        }
      }
      return newTraits.length > 0 ? newTraits : prev;
    });
  }, [layers]);

  // When a user selects a trait element in ElementManager, override that layer's active trait in real time!
  useEffect(() => {
    if (!selectedElementForPreview) return;
    const { layerId, elementId } = selectedElementForPreview;
    const targetLayer = layers.find((l) => l.id === layerId);
    if (!targetLayer) return;

    api.get<Element[]>(`/layers/${layerId}/elements`).then((elements) => {
      const match = elements.find((el) => el.id === elementId);
      if (!match) return;

      setSelectedTraits((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((t) => t.layerId === layerId);
        const newTrait: SelectedTrait = {
          layerId: targetLayer.id,
          layerName: targetLayer.name,
          blendMode: targetLayer.blendMode || "source-over",
          elementId: match.id,
          filename: match.filename,
        };

        if (idx !== -1) {
          updated[idx] = newTrait;
        } else {
          updated.push(newTrait);
        }
        return updated;
      });
    });
  }, [selectedElementForPreview]);

  // Draw composite images on canvas whenever selectedTraits changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (selectedTraits.length === 0) {
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#64748b";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Upload traits & click Randomize", canvas.width / 2, canvas.height / 2);
      return;
    }

    let loadedCount = 0;
    const images: { img: HTMLImageElement; blendMode: string }[] = [];

    selectedTraits.forEach((trait, i) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = api.getElementImageUrl(trait.elementId);

      img.onload = () => {
        loadedCount++;
        images[i] = { img, blendMode: trait.blendMode };

        if (loadedCount === selectedTraits.length) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          images.forEach((item) => {
            if (item && item.img) {
              ctx.globalCompositeOperation = (item.blendMode || "source-over") as GlobalCompositeOperation;
              ctx.drawImage(item.img, 0, 0, canvas.width, canvas.height);
            }
          });
        }
      };
    });
  }, [selectedTraits]);

  return (
    <div className="studio-panel p-4 flex flex-col h-full items-center justify-between border-none">
      {/* Top Stage Toolbar */}
      <div className="w-full flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs tracking-tight">
            Center Canvas Viewport
          </h3>
        </div>

        <button
          onClick={randomizeCombination}
          disabled={rendering || layers.length === 0}
          className="sleek-button px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1"
        >
          <Shuffle className={`w-3.5 h-3.5 ${rendering ? "animate-spin" : ""}`} />
          <span>Randomize Traits</span>
        </button>
      </div>

      {/* Figma / Canva Artboard Stage Center */}
      <div className="studio-canvas-stage w-full aspect-square max-w-[360px] p-3 flex flex-col items-center justify-center my-auto relative shadow-sm">
        <div className="relative w-full h-full max-w-[320px] max-h-[320px] bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800 p-2 flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={512}
            height={512}
            className="w-full h-full object-contain"
          />

          {rendering && (
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
              <RefreshCw className="w-7 h-7 text-indigo-600 dark:text-indigo-400 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Trait stack badges */}
      <div className="w-full mt-3 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="text-[10px] text-slate-500 font-semibold mb-1.5 uppercase tracking-wider flex items-center gap-1">
          <Layers className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
          Active Composition Trait Stack
        </div>
        <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
          {selectedTraits.length === 0 ? (
            <span className="text-xs text-slate-400 italic">No active traits</span>
          ) : (
            selectedTraits.map((t, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] text-slate-700 dark:text-slate-300 font-mono flex items-center gap-1"
              >
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{t.layerName}:</span>
                <span className="truncate max-w-[90px]">
                  {t.filename.replace(/^.*?_/, "").replace(/\.[^/.]+$/, "")}
                </span>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
