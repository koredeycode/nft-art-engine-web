import { type NFTMetadata, api } from "@/lib/api";
import { Archive, ArrowLeft, Download, Eye, Grid, RefreshCw, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

interface GalleryInspectorProps {
  jobId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GalleryInspector({ jobId, isOpen, onClose }: GalleryInspectorProps) {
  const [editions, setEditions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState<number | null>(null);
  const [activeMetadata, setActiveMetadata] = useState<NFTMetadata | null>(null);
  const [viewTab, setViewTab] = useState<"attributes" | "json">("attributes");

  const fetchEditions = async (jId: string, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await api.get<number[]>(`/exports/${jId}/editions`);
      setEditions(data);
      // Auto-select first edition if none selected
      if (data.length > 0 && selectedEdition === null) {
        inspectEdition(data[0]!, jId);
      }
    } catch {
      setEditions([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId || !isOpen) {
      setEditions([]);
      setSelectedEdition(null);
      setActiveMetadata(null);
      return;
    }

    fetchEditions(jobId);

    // Auto-poll every 2 seconds when open
    const interval = setInterval(() => {
      fetchEditions(jobId, true);
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, isOpen]);

  const inspectEdition = async (edition: number, targetJobId = jobId) => {
    if (!targetJobId) return;
    setSelectedEdition(edition);
    try {
      const meta = await api.get<NFTMetadata>(`/exports/${targetJobId}/json/${edition}`);
      setActiveMetadata(meta);
    } catch {
      setActiveMetadata(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-xs z-50 transition-opacity"
      />

      {/* Right Slide-over Side Panel Drawer (Wider Width max-w-3xl for side-by-side inspection) */}
      <div className="fixed inset-y-0 right-0 w-full max-w-3xl sm:w-[680px] md:w-[720px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col transition-transform duration-300">
        {/* Drawer Header */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs tracking-tight">
                Output Gallery Inspector
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">
                {editions.length} Artworks Generated
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {jobId && editions.length > 0 && (
              <a
                href={`/api/exports/${jobId}/download`}
                download
                className="px-2 py-1 rounded text-[11px] font-semibold sleek-button flex items-center gap-1 shadow-xs"
                title="Export entire collection as ZIP"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Export Collection ZIP</span>
              </a>
            )}

            {jobId && (
              <button
                onClick={() => fetchEditions(jobId)}
                className="p-1 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                title="Refresh Gallery"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-600" : ""}`}
                />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body - Side-by-Side Master-Detail Layout */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left Master List: Grid of Generated NFT Thumbnails */}
          <div className="w-1/2 sm:w-[320px] p-3 overflow-y-auto border-r border-slate-200 dark:border-slate-800 shrink-0">
            {!jobId ? (
              <div className="text-center py-16 text-slate-400">
                <Grid className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No Active Generation Run
                </p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                  Click "Generate" in the top bar to generate NFT editions.
                </p>
              </div>
            ) : loading && editions.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Loading generated gallery...
              </div>
            ) : editions.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                No output images found yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {editions.map((edition) => {
                  const isSelected = selectedEdition === edition;
                  return (
                    <div
                      key={edition}
                      onClick={() => inspectEdition(edition)}
                      className={`group cursor-pointer studio-card overflow-hidden transition-all ${
                        isSelected
                          ? "border-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40"
                          : ""
                      }`}
                    >
                      <div className="aspect-square bg-slate-100 dark:bg-slate-950 p-1 flex items-center justify-center relative">
                        <img
                          src={api.getOutputImageUrl(jobId, edition)}
                          alt={`NFT #${edition}`}
                          className="w-full h-full object-contain rounded"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-slate-900/30 dark:bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-4 h-4 text-white drop-shadow-md" />
                        </div>
                      </div>
                      <div className="p-1 flex items-center justify-between text-[11px]">
                        <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                          #{edition}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">PNG</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Detail Inspector Pane: Rendered directly BESIDE the thumbnail grid (No popup modal!) */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50/40 dark:bg-slate-950/40 flex flex-col justify-between">
            {jobId && selectedEdition !== null && activeMetadata ? (
              <div className="space-y-4">
                {/* High-res Image Preview */}
                <div className="w-full aspect-square max-w-[260px] mx-auto bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 flex items-center justify-center shadow-xs">
                  <img
                    src={api.getOutputImageUrl(jobId, selectedEdition)}
                    alt={`NFT #${selectedEdition}`}
                    className="max-w-full max-h-full object-contain rounded shadow-sm"
                  />
                </div>

                {/* NFT Details */}
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                      {activeMetadata.name}
                    </h4>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      #{selectedEdition}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {activeMetadata.description}
                  </p>
                  <div className="mt-2 p-1.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-500 truncate">
                    DNA:{" "}
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      {activeMetadata.dna}
                    </span>
                  </div>
                </div>

                {/* Attribute breakdown / JSON Tabs */}
                <div>
                  <div className="flex border-b border-slate-200 dark:border-slate-800 mb-2 text-xs font-semibold">
                    <button
                      onClick={() => setViewTab("attributes")}
                      className={`pb-1 mr-3 ${
                        viewTab === "attributes"
                          ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
                          : "text-slate-400"
                      }`}
                    >
                      Attributes ({activeMetadata.attributes?.length || 0})
                    </button>
                    <button
                      onClick={() => setViewTab("json")}
                      className={`pb-1 ${
                        viewTab === "json"
                          ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
                          : "text-slate-400"
                      }`}
                    >
                      JSON
                    </button>
                  </div>

                  {viewTab === "attributes" ? (
                    <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                      {activeMetadata.attributes?.map((attr, idx) => (
                        <div
                          key={idx}
                          className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-[11px]"
                        >
                          <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                            {attr.trait_type}
                          </div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {attr.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <pre className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-[10px] font-mono text-emerald-600 dark:text-emerald-400 max-h-40 overflow-y-auto">
                      {JSON.stringify(activeMetadata, null, 2)}
                    </pre>
                  )}
                </div>

                {/* Download Edition Button */}
                <a
                  href={api.getOutputImageUrl(jobId, selectedEdition)}
                  download={`${selectedEdition}.png`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-1.5 sleek-button text-xs font-semibold rounded flex items-center justify-center gap-1 mt-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Image #{selectedEdition}
                </a>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400">
                <p className="text-xs font-medium">
                  Select an edition on the left to inspect metadata & attributes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
