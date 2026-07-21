import { useLoaderData } from "react-router";
import { api, type Project } from "@/lib/api";

export async function loader() {
  const projects = await api.get<Project[]>("/projects");
  return { projects };
}

export function DashboardPage() {
  const { projects } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Projects</h3>
        {projects.length === 0 ? (
          <p className="text-gray-500">No projects yet.</p>
        ) : (
          <ul className="space-y-2">
            {projects.map((p) => (
              <li key={p.id}>
                <a
                  href={`/projects/${p.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
