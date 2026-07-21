import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Layers as LayersIcon, AlertCircle, Sparkles, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { type Layer, api } from "@/lib/api";

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

const PRESET_LAYERS = ["Background", "Body", "Eyes", "Clothing", "Mouth", "Headwear", "Accessory"];

interface LayerTreeProps {
  projectId: string;
  layers: Layer[];
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string) => void;
  onLayerAdded: (newLayer: Layer) => void;
  onLayerDeleted: (layerId: string) => void;
  onRefresh: () => void;
}

export function LayerTree({
  projectId,
  layers,
  selectedLayerId,
  onSelectLayer,
  onLayerAdded,
  onLayerDeleted,
  onRefresh,
}: LayerTreeProps) {
  const [newLayerName, setNewLayerName] = useState("");
  const [newBlendMode, setNewBlendMode] = useState("source-over");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const createLayerWithName = async (nameToAdd: string, blendModeToAdd = newBlendMode) => {
    const trimmed = nameToAdd.trim();
    if (!trimmed) {
      setError("Please enter a layer name");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const newLayer = await api.post<Layer>(`/layers/project/${projectId}`, {
        name: trimmed,
        blendMode: blendModeToAdd,
      });
      setNewLayerName("");
      onLayerAdded(newLayer);
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add layer");
    } finally {
      setCreating(false);
    }
  };

  const handleAddLayer = (e: React.FormEvent) => {
    e.preventDefault();
    createLayerWithName(newLayerName);
  };

  const handleMove = async (index: number, targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= layers.length || index === targetIndex) return;
    const newLayers = [...layers];
    const [moved] = newLayers.splice(index, 1);
    if (!moved) return;
    newLayers.splice(targetIndex, 0, moved);

    const reorderPayload = newLayers.map((l, i) => ({ id: l.id, order: i }));
    try {
      await api.patch(`/layers/project/${projectId}/reorder`, {
        layers: reorderPayload,
      });
      onRefresh();
    } catch (err) {
      setError("Failed to reorder layers");
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      handleMove(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleBlendChange = async (layerId: string, blendMode: string) => {
    try {
      await api.patch(`/layers/${layerId}`, { blendMode });
      onRefresh();
    } catch {
      // ignore
    }
  };

  const handleDeleteLayer = async (layerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this layer and all its elements?")) return;
    try {
      await api.delete(`/layers/${layerId}`);
      onLayerDeleted(layerId);
      onRefresh();
    } catch (err) {
      setError("Failed to delete layer");
    }
  };

  return (
    <div className="studio-panel h-full flex flex-col border-r border-slate-200 dark:border-slate-800 select-none">
      {/* Panel Header */}
      <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <LayersIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs tracking-tight truncate">Layers</h3>
          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800/80 shrink-0">
            {layers.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowAddSection(!showAddSection)}
          className="p-1 rounded text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors flex items-center gap-0.5 shrink-0"
          title="Toggle Add Layer panel"
        >
          <Plus className="w-3 h-3" />
          <span className="hidden sm:inline">Add</span>
          {showAddSection ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {error && (
        <div className="m-2 p-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 rounded text-red-600 dark:text-red-300 text-[11px] flex items-center gap-1.5 shrink-0">
          <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="truncate">{error}</span>
        </div>
      )}

      {/* Hideable Add Layer Section */}
      {showAddSection && (
        <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 space-y-2 shrink-0">
          <div>
            <div className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-400" />
              Presets
            </div>
            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
              {PRESET_LAYERS.map((preset) => {
                const exists = layers.some((l) => l.name.toLowerCase() === preset.toLowerCase());
                return (
                  <button
                    key={preset}
                    type="button"
                    disabled={creating || exists}
                    onClick={() => createLayerWithName(preset)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                      exists
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400"
                    }`}
                  >
                    + {preset}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleAddLayer} className="space-y-1.5">
            <input
              type="text"
              value={newLayerName}
              onChange={(e) => {
                setNewLayerName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Layer name..."
              className="w-full px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex items-center justify-between gap-1">
              <label className="text-[10px] text-slate-500 font-medium shrink-0">Blend:</label>
              <select
                value={newBlendMode}
                onChange={(e) => setNewBlendMode(e.target.value)}
                className="flex-1 min-w-0 px-1 py-0.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-[10px] text-slate-700 dark:text-slate-300 focus:outline-none font-mono truncate"
              >
                {BLEND_MODES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              onClick={handleAddLayer}
              disabled={creating}
              className="w-full py-1 sleek-button rounded text-xs font-semibold flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{creating ? "Adding..." : "Add Layer"}</span>
            </button>
          </form>
        </div>
      )}

      {/* Layer List - Optimized for Narrow Sidebars (Layer name prioritized!) */}
      <div className="p-1.5 space-y-1 overflow-y-auto flex-1">
        {layers.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded m-2">
            <LayersIcon className="w-5 h-5 text-slate-400 mx-auto mb-1" />
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">No layers yet</p>
          </div>
        ) : (
          layers.map((layer, idx) => {
            const isSelected = selectedLayerId === layer.id;
            const isDragging = draggedIndex === idx;
            const isDragOver = dragOverIndex === idx;

            return (
              <div
                key={layer.id}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onClick={() => onSelectLayer(layer.id)}
                className={`p-1.5 rounded border cursor-grab active:cursor-grabbing transition-all ${
                  isDragging ? "opacity-30 border-dashed border-indigo-500" : ""
                } ${
                  isDragOver ? "border-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40" : ""
                } ${
                  isSelected && !isDragging
                    ? "bg-indigo-50 dark:bg-slate-800 border-indigo-400 dark:border-indigo-500 text-slate-900 dark:text-white"
                    : "bg-slate-50/50 dark:bg-slate-950/50 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  {/* Grip + Layer Name (PRIORITIZED: flex-1 min-w-0 truncate!) */}
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <GripVertical className="w-3 h-3 text-slate-400 shrink-0 cursor-grab" />
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                      {layer.name}
                    </span>
                  </div>

                  {/* Compact Blend Dropdown & Action Controls (shrink-0) */}
                  <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={layer.blendMode || "source-over"}
                      onChange={(e) => handleBlendChange(layer.id, e.target.value)}
                      className="px-1 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-[9px] text-slate-500 dark:text-slate-400 focus:outline-none max-w-[55px] truncate font-mono"
                      title={`Blend mode: ${layer.blendMode || "source-over"}`}
                    >
                      {BLEND_MODES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleMove(idx, idx - 1)}
                      disabled={idx === 0}
                      className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20 rounded"
                      title="Move up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, idx + 1)}
                      disabled={idx === layers.length - 1}
                      className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20 rounded"
                      title="Move down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteLayer(layer.id, e)}
                      className="p-0.5 text-slate-400 hover:text-red-500 rounded"
                      title="Delete layer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
