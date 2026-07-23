import { type Element, type Layer, api } from "@/lib/api";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
  Image as ImageIcon,
  Sliders,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useEffect, useState } from "react";

const BLEND_MODES = [
  "source-over",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
];

interface ElementManagerProps {
  layer: Layer | null;
  layers?: Layer[];
  activeElementId?: string | null | undefined;
  onSelectElementForPreview?: (elementId: string) => void;
  onLayerDeleted?: (layerId: string) => void;
  onRefresh: () => void;
}

export function ElementManager({
  layer,
  layers = [],
  activeElementId,
  onSelectElementForPreview,
  onLayerDeleted,
  onRefresh,
}: ElementManagerProps) {
  const [elements, setElements] = useState<Element[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!layer) {
      setElements([]);
      return;
    }
    fetchElements(layer.id);
  }, [layer?.id]);

  const fetchElements = async (layerId: string) => {
    setLoading(true);
    try {
      const data = await api.get<Element[]>(`/layers/${layerId}/elements`);
      setElements(data);
    } catch {
      setElements([]);
    }
    setLoading(false);
  };

  const handleUploadFiles = async (files: FileList | File[]) => {
    if (!layer) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        await api.uploadElement(layer.id, file, 1);
      }
      await fetchElements(layer.id);
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to upload element file");
    } finally {
      setUploading(false);
    }
  };

  const handleWeightChange = async (elementId: string, weight: number) => {
    setElements((prev) => prev.map((el) => (el.id === elementId ? { ...el, weight } : el)));
    try {
      await api.patch(`/layers/elements/${elementId}/weight`, { weight });
      onRefresh();
    } catch {
      // ignore
    }
  };

  const handleDeleteElement = async (elementId: string) => {
    try {
      await api.delete(`/layers/elements/${elementId}`);
      setElements((prev) => prev.filter((el) => el.id !== elementId));
      onRefresh();
    } catch {
      alert("Failed to delete element");
    }
  };

  const handleBlendChange = async (blendMode: string) => {
    if (!layer) return;
    try {
      await api.patch(`/layers/${layer.id}`, { blendMode });
      onRefresh();
    } catch {
      alert("Failed to update blend mode");
    }
  };

  const handleOrderChange = async (targetOrderIndex: number) => {
    if (!layer || layers.length === 0) return;
    const currentIndex = layers.findIndex((l) => l.id === layer.id);
    if (currentIndex < 0 || currentIndex === targetOrderIndex) return;

    const newLayers = [...layers];
    const [moved] = newLayers.splice(currentIndex, 1);
    if (!moved) return;
    newLayers.splice(targetOrderIndex, 0, moved);

    const reorderPayload = newLayers.map((l, i) => ({ id: l.id, order: i }));
    try {
      await api.patch(`/layers/project/${layer.projectId}/reorder`, {
        layers: reorderPayload,
      });
      onRefresh();
    } catch {
      alert("Failed to reorder layer");
    }
  };

  const handleDeleteLayer = async () => {
    if (!layer) return;
    if (!confirm(`Are you sure you want to delete layer "${layer.name}" and all its elements?`)) {
      return;
    }
    try {
      await api.delete(`/layers/${layer.id}`);
      onLayerDeleted?.(layer.id);
      onRefresh();
    } catch {
      alert("Failed to delete layer");
    }
  };

  if (!layer) {
    return (
      <div className="studio-panel p-6 flex flex-col items-center justify-center h-full text-center border-r border-slate-200 dark:border-slate-800">
        <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
          No Layer Selected
        </h3>
        <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-1 max-w-xs">
          Click a layer in the list to open its configuration & trait elements.
        </p>
      </div>
    );
  }

  const totalWeight = elements.reduce((acc, el) => acc + (el.weight || 1), 0);
  const currentLayerIndex = layers.findIndex((l) => l.id === layer.id);

  return (
    <div className="studio-panel p-4 flex flex-col h-full border-r border-slate-200 dark:border-slate-800 select-none bg-white dark:bg-slate-900">
      {/* Header & Detail Configuration View */}
      <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-800 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate">
              {layer.name}
            </h3>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              {elements.length} elements • Total weight: {totalWeight}
            </span>
          </div>

          <button
            onClick={handleDeleteLayer}
            className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 border border-red-200 dark:border-red-800/80 transition-colors"
            title="Delete Layer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Layer Controls: Blend Mode & Layer Ordering Dropdowns */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium text-[11px]">
              Blend Mode
            </span>
            <select
              value={layer.blendMode || "source-over"}
              onChange={(e) => handleBlendChange(e.target.value)}
              className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
            >
              {BLEND_MODES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {layers.length > 1 && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-400 font-medium text-[11px]">
                Layer Position
              </span>
              <select
                value={currentLayerIndex >= 0 ? currentLayerIndex : 0}
                onChange={(e) => handleOrderChange(Number.parseInt(e.target.value, 10))}
                className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              >
                {layers.map((l, idx) => (
                  <option key={l.id} value={idx}>
                    #{idx + 1} ({l.name})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Upload Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files) handleUploadFiles(e.dataTransfer.files);
        }}
        className={`mb-3 p-3 border-2 border-dashed rounded-xl text-center transition-colors shrink-0 ${
          dragActive
            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40"
            : "border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-950/50"
        }`}
      >
        <UploadCloud className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
        <label className="cursor-pointer text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          <span>{uploading ? "Uploading..." : "Upload Traits / PNGs"}</span>
          <input
            type="file"
            multiple
            accept="image/*"
            disabled={uploading}
            onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
            className="hidden"
          />
        </label>
        <p className="text-[10px] text-slate-400 mt-0.5">Drag & drop files or click to browse</p>
      </div>

      {/* Elements Grid List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400 font-mono">Loading elements...</div>
        ) : elements.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <p className="text-slate-400 text-xs font-medium">No elements in this layer</p>
          </div>
        ) : (
          elements.map((el) => {
            const isSelectedForPreview = activeElementId === el.id;
            const weightPercent =
              totalWeight > 0 ? Math.round(((el.weight || 1) / totalWeight) * 100) : 0;

            return (
              <div
                key={el.id}
                className={`p-2.5 rounded-xl border transition-all space-y-2 ${
                  isSelectedForPreview
                    ? "bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500"
                    : "bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                    <img
                      src={`/api/uploads/${el.filename}`}
                      alt={el.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                      {el.filename.replace(/^.*?-/, "").replace(/\.png$/i, "")}
                    </h5>
                    <span className="text-[10px] font-mono text-slate-500">
                      Rarity: {weightPercent}% (wt: {el.weight})
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onSelectElementForPreview?.(el.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSelectedForPreview
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:text-indigo-600"
                      }`}
                      title="Preview on Canvas"
                    >
                      {isSelectedForPreview ? <Check className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDeleteElement(el.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                      title="Delete Element"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Weight Input Range */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                  <Sliders className="w-3 h-3 text-slate-400 shrink-0" />
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={el.weight || 1}
                    onChange={(e) => handleWeightChange(el.id, Number.parseInt(e.target.value, 10))}
                    className="flex-1 accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
                  />
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={el.weight || 1}
                    onChange={(e) =>
                      handleWeightChange(el.id, Math.max(1, Number.parseInt(e.target.value, 10) || 1))
                    }
                    className="w-10 px-1 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-[10px] font-mono text-center text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
