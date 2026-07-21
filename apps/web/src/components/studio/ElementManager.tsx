import { useState, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, Trash2, Eye, Check } from "lucide-react";
import { type Layer, type Element, api } from "@/lib/api";

interface ElementManagerProps {
  layer: Layer | null;
  activeElementId?: string | null | undefined;
  onSelectElementForPreview?: (elementId: string) => void;
  onRefresh: () => void;
}

export function ElementManager({
  layer,
  activeElementId,
  onSelectElementForPreview,
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
    } flex: {
      setLoading(false);
    }
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
    setElements((prev) =>
      prev.map((el) => (el.id === elementId ? { ...el, weight } : el))
    );
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

  if (!layer) {
    return (
      <div className="studio-panel p-6 flex flex-col items-center justify-center h-full text-center border-r border-slate-200 dark:border-slate-800">
        <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-xs">No Layer Selected</h3>
        <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-1 max-w-xs">
          Select a layer from the panel on the left to upload & inspect trait elements.
        </p>
      </div>
    );
  }

  const totalWeight = elements.reduce((acc, el) => acc + (el.weight || 1), 0);

  return (
    <div className="studio-panel p-3 flex flex-col h-full border-r border-slate-200 dark:border-slate-800 select-none">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5 truncate">
            <span className="truncate">{layer.name}</span>
            <span className="text-[10px] text-slate-400 font-normal shrink-0">Traits</span>
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">PNG uploads & rarity weights</p>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-semibold border border-purple-200 dark:border-purple-800 shrink-0">
          {elements.length} Items
        </span>
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files?.length) {
            handleUploadFiles(e.dataTransfer.files);
          }
        }}
        className={`border border-dashed rounded-lg p-2.5 text-center transition-all cursor-pointer mb-3 shrink-0 ${
          dragActive
            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30"
            : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-slate-300 dark:hover:border-slate-700"
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/png,image/jpeg,image/svg+xml"
          onChange={(e) => {
            if (e.target.files?.length) handleUploadFiles(e.target.files);
          }}
          className="hidden"
          id="element-file-upload"
        />
        <label htmlFor="element-file-upload" className="cursor-pointer block">
          <UploadCloud className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {uploading ? "Uploading PNGs..." : "Drop PNG elements here"}
          </p>
        </label>
      </div>

      {/* Elements Grid - Clean Stacked Layout preventing overflow */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        {loading ? (
          <div className="text-center py-6 text-slate-400 text-xs">Loading elements...</div>
        ) : elements.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
            <p className="text-slate-400 text-xs">No elements in "{layer.name}".</p>
          </div>
        ) : (
          elements.map((el) => {
            const rarityPct = totalWeight > 0 ? ((el.weight / totalWeight) * 100).toFixed(1) : 0;
            const isActive = activeElementId === el.id;
            const cleanName = el.filename.replace(/^.*?_/, "").replace(/\.[^/.]+$/, "");

            return (
              <div
                key={el.id}
                className={`p-2 studio-card flex flex-col gap-1.5 transition-all ${
                  isActive ? "border-2 border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30" : ""
                }`}
              >
                {/* Header Row: Thumbnail + Title + Rarity + Actions */}
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-0.5 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={api.getElementImageUrl(el.id)}
                        alt={cleanName}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate" title={cleanName}>
                        {cleanName}
                      </span>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-semibold">
                        {rarityPct}% rarity
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onSelectElementForPreview?.(el.id)}
                      className={`p-1 rounded text-[10px] font-mono flex items-center gap-0.5 border transition-colors ${
                        isActive
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-indigo-600"
                      }`}
                      title="Set as active canvas preview trait"
                    >
                      {isActive ? <Check className="w-3 h-3 text-white" /> : <Eye className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => handleDeleteElement(el.id)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded"
                      title="Delete element"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Sub Row: Rarity Weight Slider */}
                <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="font-mono text-slate-400 shrink-0">W: {el.weight}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={el.weight}
                    onChange={(e) => handleWeightChange(el.id, parseInt(e.target.value, 10))}
                    className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-600"
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
