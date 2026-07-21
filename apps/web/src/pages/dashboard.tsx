import { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { api, type Project } from "@/lib/api";

export async function loader() {
  const projects = await api.get<Project[]>("/projects");
  return { projects };
}

export function DashboardPage() {
  const { projects } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const revalidator = useRevalidator();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    await api.post("/projects", { name: name.trim() });
    setName("");
    setCreating(false);
    revalidator.revalidate();
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">NFT Art Engine</h1>

      <form onSubmit={handleCreate} className="flex gap-2 mb-8">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name..."
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          type="submit"
          disabled={creating || !name.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create Project"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects yet. Create one above.</p>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <div
              key={p.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <span className="font-medium">{p.name}</span>
              <a
                href={`/projects/${p.id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                Open &rarr;
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
