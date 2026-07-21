import { useLoaderData } from "react-router";
import { api, type Project, type GenerationJob } from "@/lib/api";

export async function loader() {
  const [projects, recentJobs] = await Promise.all([
    api.get<Project[]>("/projects"),
    api.get<GenerationJob[]>("/generation/jobs/recent").catch(() => []),
  ]);
  return { projects, recentJobs };
}

export function DashboardPage() {
  const { projects, recentJobs } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Projects</h3>
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
        <div>
          <h3 className="text-lg font-semibold mb-2">Recent Jobs</h3>
          {recentJobs.length === 0 ? (
            <p className="text-gray-500">No recent jobs.</p>
          ) : (
            <ul className="space-y-2">
              {recentJobs.map((job) => (
                <li key={job.id}>
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      job.status === "completed"
                        ? "bg-green-500"
                        : job.status === "running"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                    }`}
                  />
                  {job.id.slice(0, 8)} - {job.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
