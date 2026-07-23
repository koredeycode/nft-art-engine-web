import { Navbar } from "@/components/Navbar";
import { type Project, api } from "@/lib/api";
import { ArrowRight, Layers, Layers3, Plus, Search, Sparkles, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Link, useLoaderData, useNavigate, useRevalidator } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

export async function loader(_args: LoaderFunctionArgs) {
  const projects = await api.get<Project[]>("/projects");
  return { projects };
}

export function DashboardPage() {
  const { projects } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const revalidator = useRevalidator();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Project Form State
  const [name, setName] = useState("");
  const [network, setNetwork] = useState<"eth" | "sol">("eth");
  const [canvasWidth, setCanvasWidth] = useState(512);
  const [canvasHeight, setCanvasHeight] = useState(512);
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError(null);

    try {
      const created = await api.post<Project>("/projects", {
        name: name.trim(),
      });
      // Optionally update project config if detailed settings were entered
      if (network !== "eth" || canvasWidth !== 512 || description.trim()) {
        await api.patch(`/projects/${created.id}`, {
          network,
          canvasWidth,
          canvasHeight,
          description: description.trim() || undefined,
        });
      }
      setIsModalOpen(false);
      setName("");
      setDescription("");
      revalidator.revalidate();
      navigate(`/projects/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this project collection?")) return;
    try {
      await api.delete(`/projects/${projectId}`);
      revalidator.revalidate();
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalLayers = projects.reduce((acc, p) => acc + (p.layerCount || 0), 0);
  const totalElements = projects.reduce((acc, p) => acc + (p.elementCount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Header Hero Banner */}
        <div className="studio-panel p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Mintrix Studio Workspace
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Generative NFT Collections
              </h1>
              <p className="mt-1 text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-xl">
                Build layered artwork traits, configure rarity weighting, preview composite
                combinations live in the center stage, and generate production NFT metadata.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="sleek-button px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Collection</span>
            </button>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 font-medium">Total Collections</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                {projects.length}
              </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 font-medium">Configured Layers</div>
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 font-mono">
                {totalLayers}
              </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-500 font-medium">Uploaded Traits</div>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-0.5 font-mono">
                {totalElements}
              </div>
            </div>
          </div>
        </div>

        {/* Section Header & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Your Collections
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a project to open the Layer Studio & Compositor
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections..."
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="studio-panel p-12 text-center border-dashed">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Layers3 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No Projects Found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-xs mx-auto mt-1 mb-4">
              {searchQuery
                ? "No collections match your search."
                : "Create your first NFT collection to get started."}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 sleek-button text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              New Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="studio-panel p-5 flex flex-col justify-between group cursor-pointer hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono border ${
                        project.network === "sol"
                          ? "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                          : "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                      }`}
                    >
                      {project.network === "sol" ? "Solana" : "Ethereum"}
                    </span>
                    <button
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                    <span>{project.layerCount || 0} Layers</span>
                    <span>•</span>
                    <span>{project.elementCount || 0} Elements</span>
                  </div>

                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 text-slate-500 group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* New Project Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="studio-panel w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-0.5">
              Create Collection
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Initialize a new generative NFT collection project
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 rounded-xl text-red-600 dark:text-red-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. CyberPunks 3000"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Network
                  </label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value as "eth" | "sol")}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="eth">Ethereum (ETH)</option>
                    <option value="sol">Solana (SOL)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Canvas Resolution
                  </label>
                  <select
                    value={canvasWidth}
                    onChange={(e) => {
                      const val = Number.parseInt(e.target.value, 10);
                      setCanvasWidth(val);
                      setCanvasHeight(val);
                    }}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                  >
                    <option value="512">512 x 512 px</option>
                    <option value="1024">1024 x 1024 px</option>
                    <option value="2048">2048 x 2048 px</option>
                    <option value="4096">4096 x 4096 px</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Collection description..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 secondary-button rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !name.trim()}
                  className="flex-1 py-2 sleek-button text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
                >
                  {creating ? "Initializing..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
