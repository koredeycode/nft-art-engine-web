import { CustomSelect } from "@/components/ui/CustomSelect";
import { type NFTMetadata, api } from "@/lib/api";
import {
  Archive,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
  Filter,
  Grid,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface GalleryInspectorProps {
  jobId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10 per page" },
  { value: 20, label: "20 per page" },
  { value: 50, label: "50 per page" },
  { value: 100, label: "100 per page" },
];

export function GalleryInspector({ jobId, isOpen, onClose }: GalleryInspectorProps) {
  const [editions, setEditions] = useState<number[]>([]);
  const [allMetadata, setAllMetadata] = useState<NFTMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState<number | null>(null);
  const [activeMetadata, setActiveMetadata] = useState<NFTMetadata | null>(null);
  const [viewTab, setViewTab] = useState<"attributes" | "json">("attributes");

  // Trait Filtering state
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedTraitsFilter, setSelectedTraitsFilter] = useState<Record<string, string>>({});

  // Pagination state
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const prevLengthRef = useRef<number>(0);

  const fetchEditions = async (jId: string, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [editionsData, metaData] = await Promise.all([
        api.get<number[]>(`/exports/${jId}/editions`),
        api.get<NFTMetadata[]>(`/exports/${jId}/metadata`).catch(() => []),
      ]);
      setEditions(editionsData);
      setAllMetadata(metaData);

      // Automatically navigate to latest page as new editions generate
      if (editionsData.length > prevLengthRef.current) {
        const lastPage = Math.max(1, Math.ceil(editionsData.length / pageSize));
        setCurrentPage(lastPage);
        prevLengthRef.current = editionsData.length;
      }
    } catch {
      setEditions([]);
      setAllMetadata([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId || !isOpen) {
      setEditions([]);
      setAllMetadata([]);
      setSelectedEdition(null);
      setActiveMetadata(null);
      setSelectedTraitsFilter({});
      setCurrentPage(1);
      prevLengthRef.current = 0;
      return;
    }

    fetchEditions(jobId);

    // Poll gallery every 2 seconds when open
    const interval = setInterval(() => {
      fetchEditions(jobId, true);
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, isOpen, pageSize]);

  // Build available traits dictionary from loaded metadata
  const availableTraitsMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    allMetadata.forEach((meta) => {
      meta.attributes?.forEach((attr) => {
        if (!attr.trait_type || !attr.value) return;
        const key = String(attr.trait_type);
        const val = String(attr.value);
        if (!map[key]) {
          map[key] = new Set();
        }
        map[key].add(val);
      });
    });

    const result: Record<string, string[]> = {};
    Object.keys(map).forEach((k) => {
      result[k] = Array.from(map[k]!).sort();
    });
    return result;
  }, [allMetadata]);

  // Compute filtered editions based on active trait filters
  const filteredEditions = useMemo(() => {
    const filterKeys = Object.keys(selectedTraitsFilter).filter(
      (k) => Boolean(selectedTraitsFilter[k]),
    );

    if (filterKeys.length === 0) return editions;
    if (allMetadata.length === 0) return editions;

    const matchingMeta = allMetadata.filter((meta) => {
      return filterKeys.every((key) => {
        const targetVal = selectedTraitsFilter[key];
        return meta.attributes?.some(
          (attr) =>
            String(attr.trait_type).toLowerCase() === key.toLowerCase() &&
            String(attr.value).toLowerCase() === String(targetVal).toLowerCase(),
        );
      });
    });

    const matchedSet = new Set(
      matchingMeta.map((m) =>
        typeof m.edition === "number" ? m.edition : Number.parseInt(String(m.edition), 10),
      ),
    );

    return editions.filter((ed) => matchedSet.has(ed));
  }, [editions, allMetadata, selectedTraitsFilter]);

  const activeFilterCount = Object.keys(selectedTraitsFilter).filter(
    (k) => Boolean(selectedTraitsFilter[k]),
  ).length;

  const handleFilterChange = (traitType: string, value: string) => {
    setSelectedTraitsFilter((prev) => {
      const updated = { ...prev };
      if (!value) {
        delete updated[traitType];
      } else {
        updated[traitType] = value;
      }
      return updated;
    });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedTraitsFilter({});
    setCurrentPage(1);
  };

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

  const totalPages = Math.max(1, Math.ceil(filteredEditions.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const endIndex = Math.min(filteredEditions.length, startIndex + pageSize);
  const visibleEditions = filteredEditions.slice(startIndex, endIndex);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 transition-opacity"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 w-full max-w-5xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col transition-transform duration-300 select-none">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
                Output Gallery Inspector
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {activeFilterCount > 0
                  ? `Showing ${filteredEditions.length} of ${editions.length} Artworks (Filtered)`
                  : `${editions.length} Generated Artworks • Page ${validPage} of ${totalPages}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Toggle Button */}
            {Object.keys(availableTraitsMap).length > 0 && (
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors shadow-xs ${
                  isFilterOpen || activeFilterCount > 0
                    ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300"
                }`}
              >
                <Filter className="w-3.5 h-3.5 text-indigo-500" />
                <span>Filter Traits</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}

            {jobId && editions.length > 0 && (
              <a
                href={`/api/exports/${jobId}/download`}
                download
                className="px-3 py-1.5 rounded-xl text-xs font-semibold sleek-button flex items-center gap-1.5 shadow-xs"
                title="Export entire collection as ZIP"
              >
                <Archive className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export Collection ZIP</span>
              </a>
            )}

            {jobId && (
              <button
                onClick={() => fetchEditions(jobId)}
                className="p-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-colors"
                title="Refresh Gallery"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""}`} />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Expandable Trait Filter Bar / Drawer */}
        {isFilterOpen && Object.keys(availableTraitsMap).length > 0 && (
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 space-y-2 shrink-0 animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Filter Collection by Traits
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-semibold text-red-600 dark:text-red-400 hover:underline"
                >
                  Clear All Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {Object.keys(availableTraitsMap).map((traitType) => {
                const options = [
                  { value: "", label: `All ${traitType}` },
                  ...availableTraitsMap[traitType]!.map((val) => ({
                    value: val,
                    label: val,
                  })),
                ];
                const activeVal = selectedTraitsFilter[traitType] || "";

                return (
                  <div key={traitType} className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 truncate block">
                      {traitType}
                    </label>
                    <CustomSelect
                      value={activeVal}
                      options={options}
                      onChange={(val) => handleFilterChange(traitType, val)}
                      className="w-full"
                    />
                  </div>
                );
              })}
            </div>

            {/* Active Filter Pills */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                {Object.keys(selectedTraitsFilter).map((key) => {
                  const val = selectedTraitsFilter[key];
                  if (!val) return null;
                  return (
                    <span
                      key={key}
                      className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-bold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5"
                    >
                      <span>
                        {key}: <strong>{val}</strong>
                      </span>
                      <button
                        onClick={() => handleFilterChange(key, "")}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {/* Main Gallery Grid Area */}
          <div className="flex-1 p-4 overflow-y-auto min-w-0">
            {!jobId ? (
              <div className="text-center py-24 text-slate-400">
                <Grid className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No Active Generation Run
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Click &quot;Generate&quot; in the top navbar to create collection editions.
                </p>
              </div>
            ) : loading && editions.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-xs font-mono">
                Loading generated collection gallery...
              </div>
            ) : filteredEditions.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  No generated artworks match the selected trait filters.
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold text-xs border border-indigo-200 dark:border-indigo-800"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div
                className={`grid gap-3 transition-all ${
                  selectedEdition !== null
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                }`}
              >
                {visibleEditions.map((edition) => {
                  const isSelected = selectedEdition === edition;
                  return (
                    <div
                      key={edition}
                      onClick={() => inspectEdition(edition)}
                      className={`group cursor-pointer rounded-2xl border overflow-hidden transition-all shadow-xs ${
                        isSelected
                          ? "border-2 border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/50 shadow-md scale-[1.02]"
                          : "bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md"
                      }`}
                    >
                      <div className="aspect-square bg-slate-100 dark:bg-slate-950 p-2 flex items-center justify-center relative">
                        <img
                          src={api.getOutputImageUrl(jobId, edition)}
                          alt={`NFT #${edition}`}
                          className="w-full h-full object-contain rounded-xl"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                          <Eye className="w-5 h-5 text-white drop-shadow-md" />
                        </div>
                      </div>
                      <div className="p-2 flex items-center justify-between text-xs">
                        <span className="font-extrabold font-mono text-slate-900 dark:text-slate-100">
                          #{edition}
                        </span>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-bold bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800/80">
                          PNG
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Detail Inspector Panel */}
          {jobId && selectedEdition !== null && activeMetadata && (
            <div className="w-80 sm:w-96 h-full p-4 overflow-y-auto bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 animate-in slide-in-from-right duration-200 shadow-xl z-10">
              <div className="space-y-4">
                {/* Header with Close Detail View button */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Artwork Inspector
                  </span>
                  <button
                    onClick={() => setSelectedEdition(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Close detail view"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* High-res Image Preview */}
                <div className="w-full aspect-square bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex items-center justify-center shadow-inner">
                  <img
                    src={api.getOutputImageUrl(jobId, selectedEdition)}
                    alt={`NFT #${selectedEdition}`}
                    className="max-w-full max-h-full object-contain rounded-xl shadow-md"
                  />
                </div>

                {/* NFT Info */}
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                      {activeMetadata.name}
                    </h4>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800">
                      #{selectedEdition}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {activeMetadata.description}
                  </p>
                  <div className="mt-2.5 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-500 truncate">
                    DNA:{" "}
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      {activeMetadata.dna}
                    </span>
                  </div>
                </div>

                {/* Attributes & JSON Tabs */}
                <div className="space-y-2">
                  <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
                    <button
                      onClick={() => setViewTab("attributes")}
                      className={`pb-1.5 mr-4 transition-colors ${
                        viewTab === "attributes"
                          ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
                          : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      Attributes ({activeMetadata.attributes?.length || 0})
                    </button>
                    <button
                      onClick={() => setViewTab("json")}
                      className={`pb-1.5 transition-colors ${
                        viewTab === "json"
                          ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
                          : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      JSON
                    </button>
                  </div>

                  {viewTab === "attributes" ? (
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {activeMetadata.attributes?.map((attr, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                        >
                          <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                            {attr.trait_type}
                          </div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                            {attr.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-mono text-emerald-400 max-h-48 overflow-y-auto">
                      {JSON.stringify(activeMetadata, null, 2)}
                    </pre>
                  )}
                </div>

                {/* Download Image Button */}
                <a
                  href={api.getOutputImageUrl(jobId, selectedEdition)}
                  download={`${selectedEdition}.png`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 sleek-button text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Artwork #{selectedEdition}</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer Pagination Toolbar */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 flex flex-wrap items-center justify-between gap-3 shrink-0 relative z-30">
          {/* Upward Dropdown for Page Size */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Per page:</span>
            <CustomSelect
              value={pageSize}
              options={PAGE_SIZE_OPTIONS}
              direction="up"
              onChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Page Navigation Controls */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={validPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 font-bold">
              {validPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={validPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
