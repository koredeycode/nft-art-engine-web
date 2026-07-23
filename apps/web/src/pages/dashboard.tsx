import { Navbar } from "@/components/Navbar";
import { type Project, api } from "@/lib/api";
import {
  ArrowRight,
  Boxes,
  Cpu,
  Globe,
  Layers,
  Layers3,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link, type LoaderFunctionArgs, redirect, useLoaderData, useNavigate, useRevalidator } from "react-router";

export async function loader(_args: LoaderFunctionArgs) {
  try {
    const projects = await api.get<Project[]>("/projects");
    return { projects };
  } catch {
    return redirect("/auth") as never;
  }
}

export function DashboardPage() {
  const { projects } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const revalidator = useRevalidator();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [networkFilter, setNetworkFilter] = useState<"all" | "eth" | "sol">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Project Form State
  const [name, setName] = useState("");
  const [network, setNetwork] = useState<"eth" | "sol">("eth");
  const [canvasWidth, setCanvasWidth] = useState(1000);
  const [canvasHeight, setCanvasHeight] = useState(1000);
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
      if (network !== "eth" || canvasWidth !== 1000 || description.trim()) {
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
    } catch {
      alert("Failed to delete project");
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNetwork = networkFilter === "all" || p.network === networkFilter;
    return matchesSearch && matchesNetwork;
  });

  const totalLayers = projects.reduce((acc, p) => acc + (p.layerCount || 0), 0);
  const totalElements = projects.reduce((acc, p) => acc + (p.elementCount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c0919] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Workspace Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#130f26] border border-slate-200 dark:border-slate-800 shadow-md relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                <img src="/logo.png" alt="Mintrix Logo" className="w-4 h-4 rounded object-cover" />
                <span>Mintrix Studio Workspace</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Generative NFT Studio
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
                Assemble layer trait stacks, set weighted rarity rules, preview DNA uniqueness live, and batch generate production assets with metadata for Ethereum & Solana.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="sleek-button px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shrink-0 shadow-sm uppercase tracking-wider whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Create Collection</span>
            </button>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <div className="p-4 bg-slate-50 dark:bg-[#0c0919] rounded-xl border border-slate-200 dark:border-slate-800/80">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Collections</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
                {projects.length}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0c0919] rounded-xl border border-slate-200 dark:border-slate-800/80">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Configured Layers</div>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 font-mono">
                {totalLayers}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0c0919] rounded-xl border border-slate-200 dark:border-slate-800/80 col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Uploaded Traits</div>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 font-mono">
                {totalElements}
              </div>
            </div>
          </div>
        </div>

        {/* Section Header & Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              Your Collections
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a collection to open the Layer Compositor & Trait Editor
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Network Filter Tabs */}
            <div className="flex p-1 bg-slate-200/80 dark:bg-[#110c26] rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <button
                onClick={() => setNetworkFilter("all")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  networkFilter === "all"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setNetworkFilter("eth")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  networkFilter === "eth"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Ethereum
              </button>
              <button
                onClick={() => setNetworkFilter("sol")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  networkFilter === "sol"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Solana
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collections..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#110c26] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#130f26] border border-dashed border-slate-300 dark:border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
              <Layers3 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Projects Found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-xs mx-auto mt-1 mb-5">
              {searchQuery
                ? "No collections match your filter criteria."
                : "Create your first NFT collection to get started with Mintrix."}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="sleek-button px-5 py-2.5 text-xs font-bold uppercase rounded-xl inline-flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Collection</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="p-6 rounded-2xl bg-white dark:bg-[#130f26] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between group hover:border-indigo-500 transition-all duration-200 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase flex items-center gap-1.5 border ${
                        project.network === "sol"
                          ? "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                          : "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                      }`}
                    >
                      {project.network === "sol" ? <Cpu className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                      <span>{project.network === "sol" ? "Solana Metaplex" : "Ethereum ERC-721"}</span>
                    </span>

                    <button
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{project.layerCount || 0} Layers</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Boxes className="w-3.5 h-3.5 text-purple-500" />
                      <span>{project.elementCount || 0} Traits</span>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 text-slate-500 group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4" />
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
          <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#130f26] border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Create NFT Collection
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Initialize a new generative collection project in Mintrix Studio
            </p>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 rounded-xl text-rose-700 dark:text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. CyberPunks 3000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0c0919] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Blockchain
                  </label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value as "eth" | "sol")}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#0c0919] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 text-xs font-medium focus:outline-none focus:border-indigo-500"
                  >
                    <option value="eth">Ethereum (ERC-721)</option>
                    <option value="sol">Solana (Metaplex)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Canvas Resolution
                  </label>
                  <select
                    value={canvasWidth}
                    onChange={(e) => {
                      const val = Number.parseInt(e.target.value, 10);
                      setCanvasWidth(val);
                      setCanvasHeight(val);
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#0c0919] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 text-xs font-mono focus:outline-none focus:border-indigo-500"
                  >
                    <option value="512">512 x 512 px</option>
                    <option value="1000">1000 x 1000 px</option>
                    <option value="2048">2048 x 2048 px</option>
                    <option value="4096">4096 x 4096 px</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of collection lore or trait concept..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0c0919] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 secondary-button rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !name.trim()}
                  className="flex-1 py-2.5 sleek-button text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-2 shadow-sm"
                >
                  {creating ? "Creating..." : "Initialize Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
