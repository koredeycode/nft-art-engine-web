import { useState, useEffect } from "react";
import { Play, CheckCircle2, AlertCircle, RefreshCw, Cpu } from "lucide-react";
import { api, type GenerationJob } from "@/lib/api";

interface GeneratorHubProps {
  projectId: string;
  onGenerationComplete: (jobId: string) => void;
}

export function GeneratorHub({ projectId, onGenerationComplete }: GeneratorHubProps) {
  const [totalEditions, setTotalEditions] = useState<number>(10);
  const [activeJob, setActiveJob] = useState<GenerationJob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Poll for job updates if running
  useEffect(() => {
    if (!activeJob || (activeJob.status !== "queued" && activeJob.status !== "running")) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const job = await api.get<GenerationJob>(`/generation/status/${activeJob.id}`);
        setActiveJob(job);
        if (job.status === "completed") {
          onGenerationComplete(job.id);
        }
      } catch {
        // ignore error
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeJob?.id, activeJob?.status]);

  // Handle start generation
  const handleStartGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post<{ jobId: string; status: string }>(
        `/generation/start/${projectId}`,
        { totalEditions: Number(totalEditions) },
      );

      const jobStatus = await api.get<GenerationJob>(`/generation/status/${res.jobId}`);
      setActiveJob(jobStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start generation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="studio-panel p-5 flex flex-col h-full justify-between">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">Generation Engine</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Ready
        </span>
      </div>

      <form onSubmit={handleStartGeneration} className="space-y-3 mb-4">
        <div>
          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
            Batch Edition Count
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max="10000"
              value={totalEditions}
              onChange={(e) => setTotalEditions(parseInt(e.target.value, 10) || 1)}
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || (activeJob?.status === "running")}
              className="px-4 py-2 sleek-button rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{loading ? "Queuing..." : "Generate Collection"}</span>
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 rounded-xl text-red-600 dark:text-red-300 text-xs flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Active Job Progress View */}
      {activeJob && (
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              {activeJob.status === "running" && <RefreshCw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-spin" />}
              {activeJob.status === "completed" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              {activeJob.status === "failed" && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
              Status: <strong className="capitalize text-slate-900 dark:text-white">{activeJob.status}</strong>
            </span>
            <span className="text-slate-500 font-mono text-[11px]">
              {activeJob.currentEdition} / {activeJob.totalEditions} ({activeJob.progress}%)
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${activeJob.progress}%` }}
            />
          </div>

          {activeJob.error && (
            <p className="text-[11px] text-red-600 dark:text-red-400 font-mono bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-200 dark:border-red-900/50">
              {activeJob.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
