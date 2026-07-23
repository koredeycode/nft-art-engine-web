import { type Element, type Layer, api } from "@/lib/api";
import {
  ChevronDown,
  ChevronUp,
  Eraser,
  Layers,
  RefreshCw,
  Shuffle,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const [isStackOpen, setIsStackOpen] = useState(true);

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

  const clearCanvas = () => {
    setSelectedTraits([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const removeTrait = (layerId: string) => {
    setSelectedTraits((prev) => prev.filter((t) => t.layerId !== layerId));
  };

  // When layers change (order or count), keep existing selected traits in the new layer order
  useEffect(() => {
    if (layers.length === 0) {
      setSelectedTraits([]);
      return;
    }

    setSelectedTraits((prev) => {
      if (prev.length === 0) {
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
      return newTraits;
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
      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Blank Canvas", canvas.width / 2, canvas.height / 2 - 10);
      ctx.font = "12px sans-serif";
      ctx.fillText("Select a trait element or click Randomize", canvas.width / 2, canvas.height / 2 + 15);
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
            if (item?.img) {
              ctx.globalCompositeOperation = (item.blendMode ||
                "source-over") as GlobalCompositeOperation;
              ctx.drawImage(item.img, 0, 0, canvas.width, canvas.height);
            }
          });
        }
      };
    });
  }, [selectedTraits]);

  return (
    <div className="studio-panel p-4 flex flex-col h-full items-center justify-between border-none select-none">
      {/* Top Stage Toolbar */}
      <div className="w-full flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs tracking-tight">
            Center Canvas Viewport
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            disabled={selectedTraits.length === 0}
            className="px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Clear canvas to blank"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Clear Canvas</span>
          </button>

          <button
            onClick={randomizeCombination}
            disabled={rendering || layers.length === 0}
            className="sleek-button px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs"
          >
            <Shuffle className={`w-3.5 h-3.5 ${rendering ? "animate-spin" : ""}`} />
            <span>Randomize Traits</span>
          </button>
        </div>
      </div>

      {/* Artboard Stage Center */}
      <div className="studio-canvas-stage w-full aspect-square max-w-[360px] p-3 flex flex-col items-center justify-center my-auto relative shadow-sm shrink-0">
        <div className="relative w-full h-full max-w-[320px] max-h-[320px] bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800 p-2 flex items-center justify-center overflow-hidden rounded-2xl">
          <canvas
            ref={canvasRef}
            width={512}
            height={512}
            className="w-full h-full object-contain rounded-xl"
          />

          {rendering && (
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xs flex items-center justify-center rounded-2xl">
              <RefreshCw className="w-7 h-7 text-indigo-600 dark:text-indigo-400 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Collapsible & Redesigned Active Composition Trait Stack */}
      <div className="w-full mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 shrink-0">
        {/* Toggle Header */}
        <div
          onClick={() => setIsStackOpen(!isStackOpen)}
          className="flex items-center justify-between cursor-pointer py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Active Trait Composition Stack</span>
            <span className="px-1.5 py-0.2 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-bold border border-indigo-200 dark:border-indigo-800">
              {selectedTraits.length}
            </span>
          </div>
          <button className="p-0.5 rounded text-slate-400">
            {isStackOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible Trait Cards Grid */}
        {isStackOpen && (
          <div className="mt-2 flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1">
            {selectedTraits.length === 0 ? (
              <span className="text-xs text-slate-400 italic py-1">Canvas is blank</span>
            ) : (
              selectedTraits.map((t) => {
                const cleanName = t.filename.replace(/^.*?_/, "").replace(/\.[^/.]+$/, "");
                return (
                  <div
                    key={t.layerId}
                    className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs flex items-center gap-2 max-w-[220px] transition-all hover:border-indigo-300 dark:hover:border-indigo-700"
                  >
                    {/* Thumbnail Preview */}
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                      <img
                        src={api.getElementImageUrl(t.elementId)}
                        alt={cleanName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold truncate">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold truncate">
                          {t.layerName}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[8px] text-slate-400 truncate">
                          {t.blendMode}
                        </span>
                      </div>
                      <h6 className="font-bold text-[11px] text-slate-800 dark:text-slate-200 truncate">
                        {cleanName}
                      </h6>
                    </div>

                    {/* Quick Remove Button */}
                    <button
                      onClick={() => removeTrait(t.layerId)}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors shrink-0"
                      title="Remove trait from canvas"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
