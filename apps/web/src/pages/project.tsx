import { useState, useEffect, useRef } from "react";
import { useLoaderData, useRevalidator, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { ArrowLeft, Play, RefreshCw, Grid } from "lucide-react";
import { api, type Project, type Layer, type GenerationJob } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { LayerTree } from "@/components/studio/LayerTree";
import { ElementManager } from "@/components/studio/ElementManager";
import { NFTCompositor } from "@/components/studio/NFTCompositor";
import { GalleryInspector } from "@/components/studio/GalleryInspector";

export async function loader({ params }: LoaderFunctionArgs) {
  const projectId = params.id as string;
  const [project, projectLayers, jobs] = await Promise.all([
    api.get<Project>(`/projects/${projectId}`),
    api.get<Layer[]>(`/layers/project/${projectId}`),
    api.get<GenerationJob[]>(`/generation/jobs/${projectId}`),
  ]);
  return { project, layers: projectLayers, jobs };
}

export function ProjectPage() {
  const { project, layers: initialLayers, jobs } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const revalidator = useRevalidator();

  const [layers, setLayers] = useState<Layer[]>(initialLayers);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(
    initialLayers.length > 0 ? initialLayers[0]!.id : null
  );

  // Active trait map (layerId -> elementId)
  const [activeTraitsMap, setActiveTraitsMap] = useState<Record<string, string>>({});
  const [selectedElementForPreview, setSelectedElementForPreview] = useState<{
    layerId: string;
    elementId: string;
  } | null>(null);

  // Top Nav Generation Engine State
  const [totalEditions, setTotalEditions] = useState<number>(10);
  const latestJob = jobs.length > 0 ? jobs[jobs.length - 1] : null;
  const [activeJob, setActiveJob] = useState<GenerationJob | null>(latestJob || null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Right Side-Over Output Gallery Panel State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Resizable Column Widths State
  const [leftWidth, setLeftWidth] = useState(260);
  const [rightWidth, setRightWidth] = useState(320);

  const isResizingLeft = useRef(false);
  const isResizingRight = useRef(false);

  useEffect(() => {
    setLayers(initialLayers);
    if (initialLayers.length > 0 && (!selectedLayerId || !initialLayers.some((l) => l.id === selectedLayerId))) {
      setSelectedLayerId(initialLayers[0]!.id);
    }
  }, [initialLayers]);

  // Poll active generation job if running
  useEffect(() => {
    if (!activeJob || (activeJob.status !== "queued" && activeJob.status !== "running")) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const job = await api.get<GenerationJob>(`/generation/status/${activeJob.id}`);
        setActiveJob(job);
        if (job.status === "completed") {
          setIsGalleryOpen(true);
          revalidator.revalidate();
        }
      } catch {
        // ignore
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeJob?.id, activeJob?.status]);

  // Handle Resizable Splitters
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft.current) {
        const newW = Math.max(180, Math.min(450, e.clientX));
        setLeftWidth(newW);
      } else if (isResizingRight.current) {
        const newW = Math.max(240, Math.min(500, window.innerWidth - e.clientX));
        setRightWidth(newW);
      }
    };

    const handleMouseUp = () => {
      isResizingLeft.current = false;
      isResizingRight.current = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startLeftResize = () => {
    isResizingLeft.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const startRightResize = () => {
    isResizingRight.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleStartGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenError(null);
    setGenerating(true);

    try {
      const res = await api.post<{ jobId: string; status: string }>(
        `/generation/start/${project.id}`,
        { totalEditions: Number(totalEditions) },
      );
      const jobStatus = await api.get<GenerationJob>(`/generation/status/${res.jobId}`);
      setActiveJob(jobStatus);
      setIsGalleryOpen(true);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null;

  const handleRefresh = () => {
    revalidator.revalidate();
  };

  const handleLayerAdded = (newLayer: Layer) => {
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const handleLayerDeleted = (deletedLayerId: string) => {
    setLayers((prev) => {
      const next = prev.filter((l) => l.id !== deletedLayerId);
      if (selectedLayerId === deletedLayerId) {
        setSelectedLayerId(next.length > 0 ? next[0]!.id : null);
      }
      return next;
    });
  };

  const handleSelectElementForPreview = (elementId: string) => {
    if (!selectedLayerId) return;
    setActiveTraitsMap((prev) => ({
      ...prev,
      [selectedLayerId]: elementId,
    }));
    setSelectedElementForPreview({
      layerId: selectedLayerId,
      elementId,
    });
  };

  const handleTraitsRandomized = (randomMap: Record<string, string>) => {
    setActiveTraitsMap(randomMap);
  };

  return (
    <div className="h-screen w-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Top Navbar with Generation Engine & Gallery Trigger */}
      <Navbar>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Back to Collections"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>

          <div className="hidden lg:flex items-center gap-2 border-r border-slate-200 dark:border-slate-800 pr-3">
            <span className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[140px]">{project.name}</span>
            <span className="text-[10px] font-mono text-slate-500">({project.canvasWidth}x{project.canvasHeight})</span>
          </div>

          {/* Top Nav Generation Engine Control */}
          <form onSubmit={handleStartGeneration} className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
              <span className="px-2 text-[10px] font-medium text-slate-500 hidden sm:inline">Editions:</span>
              <input
                type="number"
                min="1"
                max="10000"
                value={totalEditions}
                onChange={(e) => setTotalEditions(parseInt(e.target.value, 10) || 1)}
                className="w-14 px-1.5 py-0.5 bg-transparent font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-none text-center font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={generating || activeJob?.status === "running"}
              className="px-3 py-1.5 sleek-button text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>{generating ? "Starting..." : activeJob?.status === "running" ? `${activeJob.progress}%` : "Generate"}</span>
            </button>
          </form>

          {/* Generation Progress Indicator */}
          {activeJob && activeJob.status === "running" && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{activeJob.currentEdition}/{activeJob.totalEditions}</span>
            </div>
          )}

          {/* Right Output Gallery Slide-over Toggle Button */}
          <button
            onClick={() => setIsGalleryOpen(true)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Grid className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Outputs</span>
          </button>
        </div>
      </Navbar>

      {/* Main Studio - 3 Column Layout Side-by-Side (No Space, Confined to Device Screen, Resizable) */}
      <main className="flex-1 flex w-full h-[calc(100vh-56px)] overflow-hidden relative">
        {/* LEFT COLUMN: LayerTree (Width Adjustable) */}
        <div style={{ width: `${leftWidth}px` }} className="h-full shrink-0 flex flex-col min-w-[180px] max-w-[450px]">
          <LayerTree
            projectId={project.id}
            layers={layers}
            selectedLayerId={selectedLayerId}
            onSelectLayer={(id) => setSelectedLayerId(id)}
            onLayerAdded={handleLayerAdded}
            onLayerDeleted={handleLayerDeleted}
            onRefresh={handleRefresh}
          />
        </div>

        {/* LEFT RESIZER DIVIDER (No Space gap) */}
        <div
          onMouseDown={startLeftResize}
          className="w-1.5 h-full bg-slate-200 dark:bg-slate-800/80 hover:bg-indigo-500/80 cursor-col-resize shrink-0 transition-colors z-10 flex items-center justify-center group"
          title="Drag to resize Left panel"
        >
          <div className="w-0.5 h-8 bg-slate-400 dark:bg-slate-600 group-hover:bg-white rounded-full" />
        </div>

        {/* CENTER COLUMN: Prominent Artboard Canvas Viewport (Expands flex-1) */}
        <div className="flex-1 h-full min-w-0 flex flex-col bg-slate-200/50 dark:bg-slate-950/70 relative overflow-hidden">
          <NFTCompositor
            layers={layers}
            selectedElementForPreview={selectedElementForPreview}
            onTraitsRandomized={handleTraitsRandomized}
          />
        </div>

        {/* RIGHT RESIZER DIVIDER (No Space gap) */}
        <div
          onMouseDown={startRightResize}
          className="w-1.5 h-full bg-slate-200 dark:bg-slate-800/80 hover:bg-indigo-500/80 cursor-col-resize shrink-0 transition-colors z-10 flex items-center justify-center group"
          title="Drag to resize Right panel"
        >
          <div className="w-0.5 h-8 bg-slate-400 dark:bg-slate-600 group-hover:bg-white rounded-full" />
        </div>

        {/* RIGHT COLUMN: ElementManager Inspector (Width Adjustable) */}
        <div style={{ width: `${rightWidth}px` }} className="h-full shrink-0 flex flex-col min-w-[240px] max-w-[500px]">
          <ElementManager
            layer={selectedLayer}
            activeElementId={selectedLayerId ? activeTraitsMap[selectedLayerId] : null}
            onSelectElementForPreview={handleSelectElementForPreview}
            onRefresh={handleRefresh}
          />
        </div>
      </main>

      {/* Right Slide-over Side Panel Output Gallery Drawer */}
      <GalleryInspector
        jobId={activeJob?.id || null}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
}
