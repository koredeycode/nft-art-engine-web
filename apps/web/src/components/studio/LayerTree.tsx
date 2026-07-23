import { type Layer, api } from "@/lib/api";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Image as ImageIcon,
  Layers as LayersIcon,
  Plus,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const PRESET_LAYERS = ["Background", "Body", "Eyes", "Clothing", "Mouth", "Headwear", "Accessory"];
const ITEM_TYPE = "LAYER_CARD";

interface LayerTreeProps {
  projectId: string;
  layers: Layer[];
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string) => void;
  onLayerAdded: (newLayer: Layer) => void;
  onRefresh: () => void;
}

interface DraggableLayerItemProps {
  layer: Layer;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  moveLayer: (dragIndex: number, hoverIndex: number) => void;
  onReorderComplete: () => void;
}

function DraggableLayerItem({
  layer,
  index,
  isSelected,
  onSelect,
  moveLayer,
  onReorderComplete,
}: DraggableLayerItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [firstElementFilename, setFirstElementFilename] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    api
      .get<{ filename: string }[]>(`/layers/${layer.id}/elements`)
      .then((elements) => {
        if (isMounted && elements.length > 0 && elements[0]) {
          setFirstElementFilename(elements[0].filename);
        }
      })
      .catch(() => {
        // ignore preview fetch failure
      });
    return () => {
      isMounted = false;
    };
  }, [layer.id]);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      onReorderComplete();
    },
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover(item: { index: number }) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveLayer(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      onClick={onSelect}
      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
        isDragging ? "opacity-30 border-dashed border-indigo-500" : ""
      } ${
        isSelected
          ? "bg-indigo-50 dark:bg-slate-800 border-indigo-500 text-slate-900 dark:text-white shadow-xs"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700"
      }`}
    >
      <GripVertical className="w-4 h-4 text-slate-400 shrink-0 cursor-grab active:cursor-grabbing hover:text-indigo-500 transition-colors" />

      {/* Larger Layer Image Preview */}
      <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
        {firstElementFilename ? (
          <img
            src={`/api/uploads/${firstElementFilename}`}
            alt={layer.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageIcon className="w-5 h-5 text-slate-400 dark:text-slate-600" />
        )}
      </div>

      {/* Layer Name Only */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
          {layer.name}
        </h4>
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
          Order #{index + 1}
        </span>
      </div>
    </div>
  );
}

export function LayerTree({
  projectId,
  layers,
  selectedLayerId,
  onSelectLayer,
  onLayerAdded,
  onRefresh,
}: LayerTreeProps) {
  const [newLayerName, setNewLayerName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [localLayers, setLocalLayers] = useState<Layer[]>(layers);

  useEffect(() => {
    setLocalLayers(layers);
  }, [layers]);

  const createLayerWithName = async (nameToAdd: string) => {
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
        blendMode: "source-over",
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

  const moveLayer = (dragIndex: number, hoverIndex: number) => {
    const updated = [...localLayers];
    const [dragged] = updated.splice(dragIndex, 1);
    if (!dragged) return;
    updated.splice(hoverIndex, 0, dragged);
    setLocalLayers(updated);
  };

  const syncReorderBackend = async () => {
    const reorderPayload = localLayers.map((l, i) => ({ id: l.id, order: i }));
    try {
      await api.patch(`/layers/project/${projectId}/reorder`, {
        layers: reorderPayload,
      });
      onRefresh();
    } catch {
      setError("Failed to sync layer order");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="studio-panel h-full flex flex-col border-r border-slate-200 dark:border-slate-800 select-none bg-slate-50/50 dark:bg-slate-950/50">
        {/* Panel Header */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <LayersIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs tracking-tight truncate">
              Layers
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800/80 shrink-0">
              {localLayers.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAddSection(!showAddSection)}
            className="px-2 py-1 rounded text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors flex items-center gap-1 shrink-0"
            title="Toggle Add Layer panel"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
            {showAddSection ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {error && (
          <div className="m-2 p-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 rounded-xl text-red-600 dark:text-red-300 text-xs flex items-center gap-1.5 shrink-0">
            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="truncate">{error}</span>
          </div>
        )}

        {/* Hideable Add Layer Section */}
        {showAddSection && (
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shrink-0">
            <div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                Presets
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {PRESET_LAYERS.map((preset) => {
                  const exists = localLayers.some((l) => l.name.toLowerCase() === preset.toLowerCase());
                  return (
                    <button
                      key={preset}
                      type="button"
                      disabled={creating || exists}
                      onClick={() => createLayerWithName(preset)}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                        exists
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed"
                          : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400"
                      }`}
                    >
                      + {preset}
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleAddLayer} className="flex gap-2">
              <input
                type="text"
                value={newLayerName}
                onChange={(e) => {
                  setNewLayerName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="New layer name..."
                className="flex-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={creating}
                className="px-3 py-1.5 sleek-button rounded-lg text-xs font-semibold shrink-0"
              >
                {creating ? "Adding..." : "Add"}
              </button>
            </form>
          </div>
        )}

        {/* Layer List with react-dnd */}
        <div className="p-2 space-y-2 overflow-y-auto flex-1">
          {localLayers.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl m-2">
              <LayersIcon className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">No layers configured</p>
            </div>
          ) : (
            localLayers.map((layer, idx) => (
              <DraggableLayerItem
                key={layer.id}
                layer={layer}
                index={idx}
                isSelected={selectedLayerId === layer.id}
                onSelect={() => onSelectLayer(layer.id)}
                moveLayer={moveLayer}
                onReorderComplete={syncReorderBackend}
              />
            ))
          )}
        </div>
      </div>
    </DndProvider>
  );
}
